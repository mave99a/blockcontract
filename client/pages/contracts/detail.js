/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import moment from 'moment';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import styled from 'styled-components';
import { toDid } from '@arcblock/did';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DidAuth from '@arcblock/react-forge/lib/Auth';
import DidAvatar from '@arcblock/react-forge/lib/Avatar';

import Layout from '../../components/layout';
import DidLink from '../../components/did_link';

import useSession from '../../hooks/session';
import api from '../../libs/api';
import AssetLink from '../../components/asset_link';

export default function ContractDetail({ query }) {
  const [isContractLoaded, setContractLoaded] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const session = useSession();
  const [contract, fetchContract] = useAsyncFn(async () => {
    const res = await api.get(`/api/contracts/${query.contractId}`);
    if (res.status === 200) {
      res.data.content = Buffer.from(res.data.content, 'base64')
        .toString('utf8')
        .split('\n\r')
        .join('<br/><br/>');

      return res.data;
    }

    throw new Error(res.data.error || 'Contract load failed');
  }, [session.value]);

  if (session.loading || !session.value) {
    return (
      <Layout title="Contract">
        <Main>
          <CircularProgress />
        </Main>
      </Layout>
    );
  }

  if (session.error) {
    return (
      <Layout title="Contract">
        <Main>{session.error.message}</Main>
      </Layout>
    );
  }

  if (!session.value.user) {
    Cookie.set('login_redirect', window.location.href);
    window.location.href = '/?openLogin=true';
    return null;
  }

  if (!isContractLoaded) {
    fetchContract();
    setContractLoaded(true);
  }

  return (
    <Layout title="Contract">
      <Main container spacing={40}>
        {(contract.loading || !contract.value) && <CircularProgress />}
        {contract.error && (
          <Typography component="p" color="secondary">
            {contract.error.message}
          </Typography>
        )}
        {contract.value && (
          <React.Fragment>
            <Grid item xs={8} sm={9} className="detail">
              <Typography component="h3" variant="h4" className="title">
                {contract.value.synopsis}
              </Typography>
              <Typography component="p" variant="subheading" className="meta">
                Created by: <DidLink did={contract.value.requester} />
                <br />
                Created on: <strong>{moment(contract.value.createdAt).format('YYYY-MM-DD HH:mm')}</strong>
                <br />
                Content hash: <strong>{contract.value.hash}</strong>
              </Typography>
              <Paper className="content">
                <Typography
                  component="p"
                  dangerouslySetInnerHTML={{ __html: contract.value.content }}
                  style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                />
                {contract.value.finished ? (
                  <div className="stamp stamp-signed">signed</div>
                ) : (
                  <div className="stamp stamp-pending">pending</div>
                )}
              </Paper>
            </Grid>
            <Grid item xs={4} sm={3} className="summary">
              <Typography component="h3" variant="h4" className="title">
                Contract Status
              </Typography>
              <Typography component="p" variant="subheading" className="meta" gutterBottom>
                {contract.value.finished ? (
                  <AssetLink component={Button} did={contract.value.assetDid} variant="contained" color="primary">
                    Inspect Contract On Chain
                  </AssetLink>
                ) : (
                  <Button variant="contained" color="primary" disabled>
                    Inspect Contract On Chain
                  </Button>
                )}
                <br />
                <strong>{contract.value.signatures.filter(x => x.signature).length}</strong> of{' '}
                <strong>{contract.value.signatures.length}</strong> have signed
              </Typography>
              <div className="signers">
                {contract.value.signatures.map(x => (
                  // eslint-disable-next-line no-underscore-dangle
                  <Paper key={x._id} className="signer">
                    {!!x.signer && (
                      <React.Fragment>
                        <DidAvatar did={toDid(x.signer)} size={144} />
                        <div className="stamp stamp-signed">signed</div>
                        <Typography className="signer__did" component="p">
                          <DidLink did={x.signer} />
                        </Typography>
                      </React.Fragment>
                    )}
                    {!x.signer && (
                      <React.Fragment>
                        <div className="stamp stamp-pending">pending</div>
                      </React.Fragment>
                    )}
                    <Typography className="signer__email" component="p" variant="h6">
                      {x.email}
                    </Typography>
                    {session.value.user.email === x.email && !x.signature && (
                      <Button
                        variant="contained"
                        className="signer__button"
                        color="primary"
                        size="small"
                        onClick={() => setAuthOpen(true)}>
                        Sign Contract
                      </Button>
                    )}
                  </Paper>
                ))}
              </div>
            </Grid>
            {isAuthOpen && (
              <Dialog open maxWidth="sm" disableBackdropClick disableEscapeKeyDown onClose={() => setAuthOpen(false)}>
                <DidAuth
                  action="agreement"
                  checkFn={api.get}
                  extraParams={query}
                  onClose={() => setAuthOpen(false)}
                  onSuccess={() => window.location.reload()}
                  messages={{
                    title: 'Sign Contract',
                    scan: 'Scan the qrcode to sign this contract',
                    confirm: 'Confirm your agreement on your ABT Wallet',
                    success: 'You have successfully signed!',
                  }}
                />
              </Dialog>
            )}
          </React.Fragment>
        )}
      </Main>
    </Layout>
  );
}

ContractDetail.getInitialProps = ({ query }) => ({ query });

ContractDetail.propTypes = {
  query: PropTypes.object.isRequired,
};

const Main = styled(Grid)`
  && {
    margin: 80px 0;
  }

  .title {
    margin-bottom: 24px;
  }

  .meta {
    margin-bottom: 30px;
    white-space: pre;
  }

  .stamp {
    color: #555;
    font-size: 3rem;
    font-weight: 700;
    border: 0.25rem solid #555;
    display: inline-block;
    padding: 0.25rem 1rem;
    text-transform: uppercase;
    border-radius: 1rem;
    font-family: 'Courier';
    -webkit-mask-image: url('/static/images/mask.png');
    -webkit-mask-size: 944px 604px;
    mix-blend-mode: multiply;
  }

  .stamp-signed {
    color: #0a9928;
    border: 0.5rem solid #0a9928;
    -webkit-mask-position: 13rem 6rem;
    border-radius: 0;
  }

  .stamp-pending {
    color: #c4c4c4;
    border: 1rem double #c4c4c4;
    font-size: 6rem;
    font-family: 'Open sans', Helvetica, Arial, sans-serif;
    border-radius: 0;
    padding: 0.5rem;
  }

  .summary {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-center;

    .signers {
      display: flex;
      flex-direction: column;
      margin-top: 21px;
    }

    .signer {
      padding: 24px;
      text-align: center;
      position: relative;
      height: 250px;
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .stamp {
        position: absolute;
      }

      .stamp-signed {
        top: 0px;
        right: -70px;
        transform: rotate(45deg) scale(0.3);
      }

      .stamp-pending {
        top: -36px;
        right: -200px;
        transform: rotate(45deg) scale(0.15);
      }

      .signer__did {
        font-size: 0.75rem;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      }

      .signer__button {
        margin-top: 16px;
      }
    }
  }

  .detail {
    flex-grow: 1;

    .content {
      padding: 32px;
      font-size: 1.2rem;
      text-align: left;
      position: relative;
      .stamp {
        position: absolute;
      }

      .stamp-signed {
        transform: rotate(45deg) scale(0.6);
        top: 36px;
        right: -30px;
      }

      .stamp-pending {
        transform: rotate(45deg) scale(0.3);
        top: 0;
        right: -160px;
      }
    }
  }
`;
