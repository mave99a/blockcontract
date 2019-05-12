/* eslint-disable object-curly-newline */
import React, { useState } from 'react';
import styled from 'styled-components';
import Cookie from 'js-cookie';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import SwipeableViews from 'react-swipeable-views';
import List from '@material-ui/core/List';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@arcblock/react-forge/lib/Avatar';

import Layout from '../components/layout';
import ContractList from '../components/profile/contract_list';
import DidLink from '../components/did_link';

import useSession from '../hooks/session';
import api from '../libs/api';

export default function ProfilePage() {
  const [category, setCategory] = useState(0);
  const [isContractsLoaded, setContractsLoaded] = useState(false);
  const session = useSession();
  const [contracts, fetchContracts] = useAsyncFn(async () => {
    const res = await api.get('/api/contracts');
    if (res.status === 200) {
      return res.data;
    }

    return [];
  }, [session.value]);

  const onLogout = async () => {
    await api.post('/api/logout');
    window.location.href = '/';
  };

  if (session.loading || !session.value) {
    return (
      <Layout title="Profile">
        <Main>
          <CircularProgress />
        </Main>
      </Layout>
    );
  }

  if (session.error) {
    return (
      <Layout title="Profile">
        <Main>{session.error.message}</Main>
      </Layout>
    );
  }

  if (!session.value.user) {
    Cookie.set('login_redirect', window.location.href);
    window.location.href = '/?openLogin=true';
    return null;
  }

  if (!isContractsLoaded) {
    fetchContracts();
    setContractsLoaded(true);
  }

  const grouped = {
    created: [],
    signed: [],
    pending: [],
  };
  const { did, email, name = '-' } = session.value.user;
  if (contracts.value) {
    grouped.created = contracts.value.filter(x => x.requester === did);
    grouped.signed = contracts.value.filter(x => x.finished && x.signatures.find(s => s.email === email));
    grouped.pending = contracts.value.filter(x => !x.finished && x.signatures.find(s => s.email === email));
  }

  return (
    <Layout title="Profile">
      <Main container spacing={40}>
        <Grid item xs={4} sm={3} className="avatar">
          <div className="profile">
            <Avatar size={240} did={did} />
            <List>
              <ListItem className="profile-item">
                <ListItemText primary={<DidLink did={did} />} secondary="DID" />
              </ListItem>
              <ListItem className="profile-item">
                <ListItemText primary={name || '-'} secondary="Name" />
              </ListItem>
              <ListItem className="profile-item">
                <ListItemText primary={email || '-'} secondary="Email" />
              </ListItem>
            </List>
          </div>
          <Button color="secondary" variant="outlined" onClick={onLogout}>
            Logout
          </Button>
        </Grid>
        <Grid item xs={8} sm={9} className="contracts">
          <Typography component="h3" variant="h4" className="page-header">
            Contracts
          </Typography>
          <Tabs
            value={category}
            indicatorColor="primary"
            textColor="primary"
            className="tabs"
            onChange={(e, v) => setCategory(v)}>
            <Tab label="Created By Me" />
            <Tab label="Signed By Me" />
            <Tab
              label={
                grouped.pending.length > 0 ? (
                  <Badge badgeContent={grouped.pending.length} color="secondary">
                    <Typography component="span" style={{ padding: '0 10px' }}>
                      Pending for Sign
                    </Typography>
                  </Badge>
                ) : (
                  'Pending for Sign'
                )
              }
            />
          </Tabs>
          <SwipeableViews index={category} onChangeIndex={v => setCategory(v)}>
            <ContractList
              key="created"
              contracts={grouped.created}
              timeFn={x => x.createdAt}
              timeHeader="Created At"
              action="View"
            />
            <ContractList
              key="signed"
              contracts={grouped.signed}
              timeFn={x => x.signatures.find(s => s.email === email).signedAt}
              timeHeader="Signed At"
              action="View"
            />
            <ContractList
              key="pending"
              contracts={grouped.pending}
              timeFn={x => x.createdAt}
              timeHeader="Requested At"
              action="Sign"
            />
          </SwipeableViews>
        </Grid>
      </Main>
    </Layout>
  );
}

const Main = styled(Grid)`
  && {
    margin: 80px 0;
  }

  .avatar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-center;

    svg {
      margin-bottom: 40px;
    }
  }

  .page-header,
  .tabs {
    margin-bottom: 24px;
  }

  .profile {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .profile-item {
    padding-left: 0;
  }

  .contracts {
    flex-grow: 1;
  }
`;
