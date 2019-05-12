/* eslint-disable no-console */
require('dotenv').config();

// eslint-disable-next-line import/no-extraneous-dependencies
const camelcase = require('camelcase');
const { fromJSON } = require('@arcblock/forge-wallet');
const { wallet, client, authenticator } = require('../server/libs/auth');

const appWallet = fromJSON(wallet);

(async () => {
  try {
    const res = await client.sendDeclareTx({
      tx: {
        itx: {
          moniker: camelcase(authenticator.appInfo.name),
        },
      },
      wallet: appWallet,
    });

    console.log('Application wallet declared', res);
  } catch (err) {
    console.error(err.errors);
  }
})();
