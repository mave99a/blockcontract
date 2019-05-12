import React from 'react';
import styled from 'styled-components';
import useAsync from 'react-use/lib/useAsync';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Layout from '../components/layout';
import forge from '../libs/forge';

async function fetchChainInfo() {
  const { blocks } = await forge.getBlocks({ emptyExcluded: true, paging: { size: 1 } });
  const [{ height }] = blocks;
  return forge.getBlock({ height });
}

export default function AppPage() {
  const endpoint = process.env.chainHost;
  const state = useAsync(fetchChainInfo);

  const endpointStr = `{ endpoint: "${endpoint}" }`;
  const paramStr = '{ emptyExcluded: true, paging: { size: 1 } }';
  const heightStr = '{ height }';

  return (
    <Layout title="ChainInfo Info">
      <Main>
        <Typography component="h2" variant="h4" className="page-header" color="textPrimary">
          Reading Block & Transaction with GraphQLClient
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
                const res = await client.getBlocks({paramStr});
                <br />
                const [{heightStr}] = res.blocks;
                <br />
                const res = await client.getBlock({heightStr});
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
                <code>{JSON.stringify(state.value.block, true, '  ')}</code>
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
