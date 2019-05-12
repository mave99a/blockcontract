import React, { useState } from 'react';
import styled from 'styled-components';
import useAsync from 'react-use/lib/useAsync';

import SwipeableViews from 'react-swipeable-views';
import List from '@material-ui/core/List';
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

import useSession from '../hooks/session';
import api from '../libs/api';

export default function ProfilePage() {
  const [category, setCategory] = useState(0);
  const session = useSession();
  const contracts = useAsync(async () => {
    const res = await api.get('/api/contracts');
    if (res.status === 200) {
      return res.data;
    }

    return [];
  });

  const onLogout = async () => {
    await api.post('/api/logout');
    window.location.href = '/';
  };

  if (session.loading || !session.value) {
    return (
      <Layout title="Payment">
        <Main>
          <CircularProgress />
        </Main>
      </Layout>
    );
  }

  if (session.error) {
    return (
      <Layout title="Payment">
        <Main>{session.error.message}</Main>
      </Layout>
    );
  }

  if (!session.value.user) {
    window.location.href = '/?openLogin=true';
    return null;
  }

  const grouped = {
    created: [],
    signed: [],
    pending: [],
  };
  const { did, email, name = '-', mobile = '-' } = session.value.user;
  if (contracts.value) {
    grouped.created = contracts.value.filter(x => x.requester === did);
    grouped.signed = contracts.value.filter(x => x.finished && x.signatures.find(s => s.email === email));
    grouped.pending = contracts.value.filter(x => !x.finished && x.signatures.find(s => s.email === email));
  }
  console.log({ contracts: contracts.value, grouped });

  return (
    <Layout title="Profile">
      <Main>
        <div className="avatar">
          <div className="profile">
            <Avatar size={240} did={did} />
            <List>
              <ListItem className="profile-item">
                <ListItemText primary={did.split(':').pop()} secondary="DID" />
              </ListItem>
              <ListItem className="profile-item">
                <ListItemText primary={name || '-'} secondary="Name" />
              </ListItem>
              <ListItem className="profile-item">
                <ListItemText primary={email || '-'} secondary="Email" />
              </ListItem>
              <ListItem className="profile-item">
                <ListItemText primary={mobile || '-'} secondary="Phone" />
              </ListItem>
            </List>
          </div>
          <Button color="secondary" variant="outlined" onClick={onLogout}>
            Logout
          </Button>
        </div>
        <div className="contracts">
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
            <Tab label="Pending for Sign" />
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
        </div>
      </Main>
    </Layout>
  );
}

const Main = styled.main`
  margin: 80px 0;
  display: flex;

  .avatar {
    width: 320px;
    margin-right: 80px;
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
    flex-grow: 1;
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
