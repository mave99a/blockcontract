const Mcrypto = require('@arcblock/mcrypto');
const MongoStorage = require('@arcblock/did-auth-storage-mongo');
const GraphQLClient = require('@arcblock/graphql-client');
const { fromSecretKey, WalletType } = require('@arcblock/forge-wallet');
const { Authenticator, Handlers } = require('@arcblock/did-auth');

const type = WalletType({
  role: Mcrypto.types.RoleType.ROLE_APPLICATION,
  pk: Mcrypto.types.KeyType.ED25519,
  hash: Mcrypto.types.HashType.SHA3,
});

const wallet = fromSecretKey(process.env.APP_SK, type).toJSON();
const chainHost = process.env.CHAIN_HOST;
const chainId = process.env.CHAIN_ID;
const client = new GraphQLClient({ endpoint: chainHost, chainId });

const authenticator = new Authenticator({
  client,
  wallet,
  baseUrl: process.env.BASE_URL,
  appInfo: {
    chainHost,
    chainId,
    chainToken: 'TBA',
    copyright: 'https://www.arcblock.io',
    decimals: 16,
    name: 'Forge React Starter',
    subtitle: 'React starter project on forge',
    description: 'Which demonstrates login/checkin/payment issue',
    icon: 'https://arcblock.oss-cn-beijing.aliyuncs.com/images/256x256.png',
    path: 'https://abtwallet.io/i/',
    publisher: `did:abt:${wallet.address}`,
  },
});

const handlers = new Handlers({
  authenticator,
  tokenGenerator: req => req.sessionID + Date.now(),
  tokenStorage: new MongoStorage({
    url: process.env.MONGO_URI,
  }),
});

module.exports = {
  authenticator,
  handlers,
  client,
  wallet,
};
