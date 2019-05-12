import React from 'react';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Layout from '../components/layout';

export default function IndexPage() {
  return (
    <Layout title="Home">
      <Main>
        <div className="hero-unit">
          <div className="hero-content">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Block Contract
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary" paragraph>
              Block contract is to build decentralized contract that people can sign, view and trust. To protect the
              privacy, the content of the contract will NOT be hosted in the blockchain, only the hash of the content is
              store in the chain.
            </Typography>
            <div className="hero-buttons">
              <Grid container spacing={16} justify="center">
                <Grid item>
                  <Button
                    href="/contracts/create"
                    size="large"
                    variant="contained"
                    color="primary"
                    style={{ color: 'white' }}>
                    Create Contract on Blockchain
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </Main>
    </Layout>
  );
}

const Main = styled.main`
  margin: 0;
  height: 100vh;

  .hero-unit {
    display: flex;
    justify-content: center;
    background-image: url('/static/images/hero.jpg');
    background-position: center center;
    background-size: cover;
    height: 100%;
  }

  .hero-content {
    max-width: 600px;
    margin: 0 auto;
    margin-top: 80px;
    padding: ${props => props.theme.spacing.unit * 8}px 0 ${props => props.theme.spacing.unit * 6}px;
  }

  .hero-buttons {
    margin-top: ${props => props.theme.spacing.unit * 4}px;
  }
`;
