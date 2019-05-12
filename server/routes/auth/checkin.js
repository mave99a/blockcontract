/* eslint-disable no-console */
const multibase = require('multibase');
const moment = require('moment');
const { fromAddress } = require('@arcblock/forge-wallet');
const { client } = require('../../libs/auth');

module.exports = {
  action: 'checkin',
  claims: {
    signature: () => ({
      txType: 'PokeTx',
      txData: {
        nonce: 0,
        itx: {
          date: moment(new Date().toISOString())
            .utc()
            .format('YYYY-MM-DD'),
          address: 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
        },
      },
      description: 'Sign this transaction to receive 25 TBA for test purpose',
    }),
  },
  onAuth: async ({ claims, did }) => {
    try {
      const claim = claims.find(x => x.type === 'signature');
      const tx = client.decodeTx(multibase.decode(claim.origin));
      const wallet = fromAddress(did);
      console.log('poke.onAuth.payload', { tx, claim });

      const { hash } = await client.sendTransferTx({
        tx,
        wallet,
        signature: claim.sigHex,
      });
      console.log('poke.onAuth', hash);
    } catch (err) {
      console.error('poke.onAuth.error', err);
    }
  },
  onComplete: (req, { did }) => {
    console.log('poke.onComplete', { did });
  },
};
