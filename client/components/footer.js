import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default function Footer() {
  const footers = [
    {
      title: 'SDK Documentation',
      items: [
        { title: 'Getting Started', link: 'https://docs.arcblock.io/forge/latest/sdk/javascript.html#getting-started' },
        { title: 'GraphQLClient', link: 'https://docs.arcblock.io/forge/sdks/javascript/latest/GraphQLClient.html' },
        {
          title: 'Mcrypto',
          link: 'https://docs.arcblock.io/forge/sdks/javascript/latest/module-@arcblock_mcrypto.html',
        },
        { title: 'DID/Auth', link: 'https://docs.arcblock.io/forge/sdks/javascript/latest/module-@arcblock_did.html' },
        { title: 'GRpcClient', link: 'https://docs.arcblock.io/forge/sdks/javascript/latest/GRpcClient.html' },
        {
          title: 'Examples',
          link: 'https://github.com/ArcBlock/forge-js/tree/master/packages/graphql-client/examples',
        },
      ],
    },
    {
      title: 'Forge Documentation',
      items: [
        { title: 'Concepts', link: 'https://docs.arcblock.io/forge/latest/intro/concepts.html' },
        { title: 'Configuration', link: 'https://docs.arcblock.io/forge/latest/core/configuration.html' },
        { title: 'Transactions', link: 'https://docs.arcblock.io/forge/latest/txs/' },
        { title: 'RPC', link: 'https://docs.arcblock.io/forge/latest/rpc/chain.html' },
        { title: 'Documentation', link: 'https://docs.arcblock.io' },
      ],
    },
    {
      title: 'Forge Tools',
      items: [
        { title: 'Forge CLI', link: 'https://docs.arcblock.io/forge/latest/tools/forge_cli.html#install-forge-cli' },
        { title: 'Forge WEB', link: 'https://docs.arcblock.io/forge/latest/tools/forge_web.html' },
      ],
    },
    {
      title: 'Batteries Included',
      items: [
        { title: 'Express', link: 'https://expressjs.com/' },
        { title: 'Next.js', link: 'https://nextjs.org/' },
        { title: 'React.js', link: 'https://reactjs.org/' },
        { title: 'Material UI', link: 'https://material-ui.com/' },
        { title: 'styled-components', link: 'https://www.styled-components.com/' },
        { title: 'Mongodb/Mongoose', link: 'https://mongoosejs.com/' },
      ],
    },
  ];

  return (
    <Grid
      container
      spacing={32}
      justify="space-evenly"
      style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid #cccccc' }}>
      {footers.map(x => (
        <Grid item xs key={x.title}>
          <Typography variant="h6" color="textPrimary" gutterBottom>
            {x.title}
          </Typography>
          {x.items.map(item => (
            <Typography
              key={item.title}
              component="a"
              href={item.link}
              variant="subtitle1"
              color="textSecondary"
              target="_blank">
              {item.title}
            </Typography>
          ))}
        </Grid>
      ))}
    </Grid>
  );
}
