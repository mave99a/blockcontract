import React from 'react';
import styled from 'styled-components';
import useAsync from 'react-use/lib/useAsync';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Layout from '../components/layout';
import forge from '../libs/forge';

function createFetchFn(address) {
  return () => forge.getAccountState({ address });
}

export default function AppPage() {
  const endpoint = process.env.chainHost;
  const address = process.env.appId;
  const state = useAsync(createFetchFn(address));

  const endpointStr = `{ endpoint: "${endpoint}" }`;
  const addressStr = `{ address: "${address}" }`;

  return (
    <Layout title="Application Info">
      <Main>
        <Typography component="h2" variant="h4" className="page-header" color="textPrimary">
          Reading Application Info with GraphQLClient
        </Typography>
        <section className="section">
          <Typography component="h3" variant="h5" className="section__header" color="textPrimary" gutterBottom>
            Code
          </Typography>
          <div className="section__body code">
            <code>
              <pre>
                const GraphQLClient = require('@arcblock/graphql-client');
                <br />
                const client = new GraphQLClient({endpointStr});
                <br />
                const res = await client.getAccountState({addressStr});
                <br />
              </pre>
            </code>
          </div>
        </section>
        <section className="section">
          <Typography component="h3" variant="h5" className="section__header" color="textPrimary" gutterBottom>
            Data
          </Typography>
          <div className="section__body data">
            {state.value && (
              <pre>
                <code>{JSON.stringify(state.value.state, true, '  ')}</code>
              </pre>
            )}
            {state.loading && <CircularProgress />}
            {state.error && <p>Error: {state.error.message}</p>}
          </div>
        </section>
      </Main>
    </Layout>
  );
}

const Main = styled.main`
  margin: 80px 0 0;

  .page-header {
    margin-bottom: 20px;
  }

  .section {
    margin-bottom: 50px;
    .section__header {
      margin-bottom: 20px;
    }
  }
`;
