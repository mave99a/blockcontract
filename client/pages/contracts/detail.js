/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import moment from 'moment';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import styled from 'styled-components';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Layout from '../../components/layout';

import useSession from '../../hooks/session';
import api from '../../libs/api';

export default function ContractDetail({ query }) {
  const [isContractLoaded, setContractLoaded] = useState(false);
  const session = useSession();
  const [contract, fetchContract] = useAsyncFn(async () => {
    const res = await api.get(`/api/contracts/${query.id}`);
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
      <Main>
        {(contract.loading || !contract.value) && <CircularProgress />}
        {contract.error && (
          <Typography component="p" color="secondary">
            {contract.error.message}
          </Typography>
        )}
        {contract.value && (
          <div className="detail">
            <Typography component="h3" variant="h4" className="title">
              {contract.value.synopsis}
            </Typography>
            <Typography component="p" className="meta">
              Created by <strong>{contract.value.requester}</strong> on{' '}
              <strong>{moment(contract.value.createdAt).format('YYYY-MM-DD HH:mm')}</strong>
            </Typography>
            <Paper className="content">
              <Typography
                component="p"
                dangerouslySetInnerHTML={{ __html: contract.value.content }}
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
              />
            </Paper>
            <div className="signers">
              <pre>
                <code>{JSON.stringify(contract.value.signatures, true, '  ')}</code>
              </pre>
            </div>
          </div>
        )}
      </Main>
    </Layout>
  );
}

ContractDetail.getInitialProps = ({ query }) => ({ query });

ContractDetail.propTypes = {
  query: PropTypes.object.isRequired,
};

const Main = styled.main`
  margin: 80px 0;
  text-align: center;

  .title {
    margin-bottom: 24px;
  }

  .meta {
    margin-bottom: 30px;
  }

  .content {
    padding: 32px;
    font-size: 1.2rem;
    max-width: 80%;
    margin: 0 auto;
    text-align: left;
  }

  .signers {
  }
`;
