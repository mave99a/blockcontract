import React from 'react';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import Layout from '../components/layout';

const graphqlDemos = [
  {
    title: 'Application State',
    subtitle: 'Example 1',
    description: 'Use GraphQLClient to get current application state on chain',
    link: '/application',
  },
  {
    title: 'Chain State',
    subtitle: 'Example 2',
    description: 'Use GraphQLClient to read current chain info and display it as json',
    link: '/chain',
  },
  {
    title: 'Block and Transactions',
    subtitle: 'Example 3',
    description: 'Query blocks and transactions from the forge powered chain',
    link: '/blocks',
  },
];

const walletDemos = [
  {
    title: 'Login',
    subtitle: 'Example 1',
    description:
      'Use ABT Wallet to login to an application built on top of a forge powered blockchain, and persist user info in the session',
    link: '/profile',
  },
  {
    title: 'Checkin',
    subtitle: 'Example 2',
    description: 'Help user to get some free tokens on the blockchain to test our application',
    link: '/profile',
  },
  {
    title: 'Payment',
    subtitle: 'Example 3',
    description: 'Allow user to pay for an secret document with crypto token, and records payment info in database.',
    link: '/payment',
  },
];

const renderExampleCard = x => (
  <Card key={x.title} className="demo">
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {x.subtitle}
      </Typography>
      <Typography component="h2" variant="h5" gutterBottom>
        {x.title}
      </Typography>
      <Typography component="p" variant="subtitle1" gutterBottom>
        {x.description}
      </Typography>
    </CardContent>
    <CardActions>
      <Button component="a" href={x.link} size="small" color="primary">
        Try Now
      </Button>
    </CardActions>
  </Card>
);

export default function IndexPage() {
  return (
    <Layout title="Home">
      <Main>
        <Typography component="h2" variant="h4" className="page-header" color="textPrimary">
          dApps the Easy Way!
        </Typography>
        <Typography component="p" variant="h6" className="page-description" color="textSecondary">
          Application boilerplate built on top of{' '}
          <a href="https://www.arcblock.io/en/forge-sdk">forge (Ruby on Rails for Blockchain Space)</a> powered
          blockchain, with developer friendly{' '}
          <a href="https://docs.arcblock.io/forge/latest/sdk/javascript.html">javascript sdk</a>. Makes it super easy to
          start building distributed applications with tons of thousands of react/javascript libraries/components.
        </Typography>
        <section className="section">
          <Typography component="h3" variant="h5" className="section__header" color="textPrimary" gutterBottom>
            Quick Start
          </Typography>
          <div className="section__body quickstart">
            <code>
              <pre>
                npm install -g @arcblock/forge-cli
                <br />
                forge init
                <br />
                forge start
                <br />
                forge create-project hello-forge
                <br />
                cd hello-forge
                <br />
                yarn start
              </pre>
            </code>
          </div>
        </section>
        <section className="section">
          <Typography component="h3" variant="h5" className="section__header" color="textPrimary" gutterBottom>
            Chain Data Reading/Displaying Examples
          </Typography>
          <div className="section__body demos">{graphqlDemos.map(x => renderExampleCard(x))}</div>
        </section>
        <section className="section">
          <Typography component="h3" variant="h5" className="section__header" color="textPrimary" gutterBottom>
            ABT Wallet Examples
          </Typography>
          <div className="section__body demos">{walletDemos.map(x => renderExampleCard(x))}</div>
        </section>
      </Main>
    </Layout>
  );
}

const Main = styled.main`
  margin: 80px 0 0;

  a {
    color: ${props => props.theme.colors.green};
    text-decoration: none;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .page-description {
    margin-bottom: 30px;
  }

  .section {
    margin-bottom: 50px;
    .section__header {
      margin-bottom: 20px;
    }
  }

  .demos {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .demo {
      width: 30%;
      height: 240px;
    }
  }
`;
