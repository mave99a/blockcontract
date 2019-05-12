import React from 'react';
import styled from 'styled-components';
import useToggle from 'react-use/lib/useToggle';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import Auth from '@arcblock/react-forge/lib/Auth';
import Avatar from '@arcblock/react-forge/lib/Avatar';

import Layout from '../components/layout';
import useSession from '../hooks/session';
import api from '../libs/api';

export default function ProfilePage() {
  const state = useSession();
  const [isOpen, setOpen] = useToggle(false);

  const onLogout = async () => {
    await api.post('/api/logout');
    window.location.href = '/';
  };

  if (state.loading || !state.value) {
    return (
      <Layout title="Payment">
        <Main>
          <CircularProgress />
        </Main>
      </Layout>
    );
  }

  if (state.error) {
    return (
      <Layout title="Payment">
        <Main>{state.error.message}</Main>
      </Layout>
    );
  }

  if (!state.value.user) {
    window.location.href = '/?openLogin=true';
    return null;
  }

  return (
    <Layout title="Profile">
      <Main>
        {isOpen && (
          <Dialog open maxWidth="sm" disableBackdropClick disableEscapeKeyDown onClose={() => setOpen()}>
            <Auth
              action="checkin"
              checkFn={api.get}
              onClose={() => setOpen()}
              onSuccess={() => window.location.reload()}
              messages={{
                title: 'Get 25 TBA for FREE',
                scan: 'Scan qrcode to get 25 TBA for FREE',
                confirm: 'Confirm on your ABT Wallet',
                success: '25 TBA sent to your account',
              }}
            />
          </Dialog>
        )}
        <div className="avatar">
          <Avatar size={240} did={state.value.user.did} />
          <div className="profile">
            <Typography component="h3" variant="h4">
              Profile
            </Typography>
            <List>
              <ListItem className="profile-item">
                <ListItemText primary={state.value.user.did} secondary="DID" />
              </ListItem>
              <ListItem className="profile-item">
                <ListItemText primary={state.value.user.name || '-'} secondary="Name" />
              </ListItem>
              <ListItem className="profile-item">
                <ListItemText primary={state.value.user.email || '-'} secondary="Email" />
              </ListItem>
              <ListItem className="profile-item">
                <ListItemText primary={state.value.user.mobile || '-'} secondary="Phone" />
              </ListItem>
            </List>
          </div>
          <Button color="secondary" variant="outlined" onClick={onLogout}>
            Logout
          </Button>
        </div>
        <div className="contracts">Created By Me/Signed By Me/Need my sign</div>
      </Main>
    </Layout>
  );
}

const Main = styled.main`
  margin: 80px 0;
  display: flex;

  .avatar {
    margin-right: 80px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-center;

    svg {
      margin-bottom: 40px;
    }
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
  }
`;
