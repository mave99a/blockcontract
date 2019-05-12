// const nodeExternals = require('webpack-node-externals');
const prod = process.env.NODE_ENV === 'production';

module.exports = {
  optimization: { minimize: prod },
  // externals: [nodeExternals()],
};
