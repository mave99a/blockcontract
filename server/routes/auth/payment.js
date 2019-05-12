/* eslint-disable no-console */
const multibase = require('multibase');
const { fromTokenToUnit } = require('@arcblock/forge-util');
const { fromAddress } = require('@arcblock/forge-wallet');
const { Payment } = require('../../models');
const { client, wallet } = require('../../libs/auth');

module.exports = {
  action: 'payment',
  claims: {
    signature: {
      txType: 'TransferTx',
      txData: {
        itx: {
          to: wallet.address,
          value: {
            value: fromTokenToUnit(5).toBuffer(),
            minus: false,
          },
        },
      },
      description: 'Please pay 100 TBA to unlock the secret document',
    },
  },
  onAuth: async ({ claims, did }) => {
    console.log('pay.onAuth', { claims, did });
    try {
      const claim = claims.find(x => x.type === 'signature');
      const tx = client.decodeTx(multibase.decode(claim.origin));
      const user = fromAddress(did);

      const { hash } = await client.sendTransferTx({
        tx,
        wallet: user,
        signature: claim.sigHex,
      });

      const payment = new Payment({
        did,
        hash,
        status: 'confirmed',
      });

      await payment.save();
      console.log('pay.onAuth', hash);
    } catch (err) {
      console.error('pay.onAuth.error', err);
    }
  },
  onComplete: (req, { did }) => {
    console.log('pay.onComplete', { did });
  },
};
