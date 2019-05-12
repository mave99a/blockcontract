/* eslint-disable no-console */
const qs = require('querystring');
const multibase = require('multibase');
const { toAddress } = require('@arcblock/did');
const { toAssetAddress } = require('@arcblock/did-util');
const { fromJSON } = require('@arcblock/forge-wallet');
const { hexToBytes } = require('@arcblock/forge-util');

const { wallet, client } = require('../../libs/auth');
const { User, Contract } = require('../../models');

module.exports = {
  action: 'agreement',
  claims: {
    agreement: async ({ extraParams }) => {
      console.log('agreement.start', extraParams);
      const { contractId } = extraParams || {};
      if (!contractId) {
        throw new Error('Cannot proceed with invalid contractId');
      }

      const contract = await Contract.findById(contractId);
      if (!contract) {
        throw new Error('Cannot sign on invalid contract');
      }

      return {
        uri: `${process.env.BASE_URL}/contracts/detail?${qs.stringify({ contractId })}`,
        description: 'Please read the contract content carefully and agree to its terms',
        hash: {
          method: 'sha3',
          digest: multibase.encode('base58btc', Buffer.from(hexToBytes(contract.hash))).toString(),
        },
      };
    },
  },

  onAuth: async ({ claims, did, extraParams }) => {
    const { contractId } = extraParams || {};
    if (!contractId) {
      throw new Error('Cannot proceed with invalid contractId');
    }

    const contract = await Contract.findById(contractId);
    if (!contract) {
      throw new Error('Cannot sign on invalid contract');
    }

    const user = await User.findOne({ did });
    if (!user) {
      throw new Error('Cannot sign with unauthorized user');
    }

    const agreement = claims.find(x => x.type === 'agreement');
    if (agreement.agreed === false) {
      throw new Error('You must agree with the terms to sign the contract');
    }

    if (!agreement.sig) {
      throw new Error('You must sign the contract hash to sign the contract');
    }

    console.log('agreement.onAuth.payload', {
      contractId,
      contract: contract.toJSON(),
      user: user.toJSON(),
      agreement,
      did,
    });

    contract.signatures = contract.signatures.map(x => {
      if (x.email !== user.email) {
        return x;
      }

      x.name = user.name;
      x.signer = toAddress(did);
      x.signedAt = new Date();
      x.signature = multibase.decode(agreement.sig);

      return x;
    });

    contract.finished = contract.signatures.every(x => !!x.signature);
    console.log('agreement.onAuth.updateSignature', {
      newSignatures: contract.signatures,
      finished: contract.finished,
    });

    if (contract.finished) {
      contract.completedAt = new Date();

      // Assemble asset
      const asset = {
        moniker: `block_contract_${contractId}`,
        readonly: true,
        transferrable: false,
        data: {
          typeUrl: 'json',
          value: {
            model: 'BlockContract',
            hash: contract.hash,
            contractId,
            requester: toAddress(contract.requester),
            signatures: contract.signatures,
          },
        },
      };
      contract.assetDid = toAssetAddress(asset, wallet.address);
      asset.address = contract.assetDid;
      console.log('agreement.onAuth.makeAsset', asset);

      // Create asset
      const tx = await client.sendCreateAssetTx({
        tx: {
          itx: asset,
        },
        wallet: fromJSON(wallet),
      });
      console.log('agreement.onAuth.createAsset', tx);
    }

    await contract.save();
    console.log('agreement.onAuth.success', { contractId, did });
  },
  onComplete: (req, { did }, extraParams) => {
    console.log('agreement.onComplete', { did, extraParams });
  },
};
