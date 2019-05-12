/* eslint-disable no-console */
import GraphQLClient from '@arcblock/graphql-client';

const client = new GraphQLClient(process.env.chainHost);

if (typeof window === 'object') {
  console.log('Inspect GraphQLClient');
  console.dir(client);
}

export default client;
