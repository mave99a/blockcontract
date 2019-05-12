/* eslint no-return-assign:"off" */
import React, { useEffect } from 'react';
import qs from 'querystring';
import styled from 'styled-components';
import Cookie from 'js-cookie';
import useToggle from 'react-use/lib/useToggle';
import Link from 'next/link';

import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import Auth from '@arcblock/react-forge/lib/Auth';
import UserAvatar from '@arcblock/react-forge/lib/Avatar';

import useSession from '../hooks/session';
import api from '../libs/api';

function onLoginSuccess() {
  const redirect = Cookie.get('login_redirect');
  if (redirect) {
    Cookie.remove('login_redirect');
  }

  window.location.href = redirect || '/profile';
}

export default function Header() {
  const session = useSession();
  const [open, toggle] = useToggle(false);

  useEffect(() => {
    if (session.value && !session.value.user && window.location.search) {
      const params = qs.parse(window.location.search.slice(1));
      try {
        if (params.openLogin && JSON.parse(params.openLogin)) {
          toggle(true);
        }
      } catch (err) {
        // Do nothing
      }
    }
  }, [session]);

  return (
    <Nav>
      <div className="nav-left">
        <Link href="/">
          <Typography variant="h6" color="inherit" noWrap className="brand">
            {process.env.appName}
          </Typography>
        </Link>
        <Button href="/contracts/create" size="large" color="secondary">
          Create Contract
        </Button>
        <Button href="/profile" size="large">
          Profile
        </Button>
      </div>
      <div className="nav-right">
        {session.loading && (
          <Button>
            <CircularProgress size={20} color="secondary" />
          </Button>
        )}
        {session.value && !session.value.user && (
          <Button color="primary" variant="outlined" onClick={toggle}>
            Login
          </Button>
        )}
        {session.value && session.value.user && (
          <Button href="/profile" className="avatar">
            <UserAvatar did={session.value.user.did} />
          </Button>
        )}
      </div>
      {open && (
        <Dialog open maxWidth="sm" disableBackdropClick disableEscapeKeyDown onClose={toggle}>
          <Auth
            action="login"
            checkFn={api.get}
            onClose={() => toggle()}
            onSuccess={onLoginSuccess}
            messages={{
              title: 'login',
              scan: 'Scan QR code with ABT Wallet',
              confirm: 'Confirm login on your ABT Wallet',
              success: 'You have successfully signed in!',
            }}
          />
        </Dialog>
      )}
    </Nav>
  );
}

const Nav = styled(Toolbar)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  && {
    padding-left: 0;
    padding-right: 0;
  }

  .brand {
    margin-right: 60px;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .logo {
      width: 140px;
      margin-right: 16px;
    }
  }

  .nav-left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .nav-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .github {
      margin-right: 16px;
    }
  }
`;
