const session = require('./session');
const users = require('./users');
const payments = require('./payments');
const contracts = require('./contracts');
const auth = require('./auth');

module.exports = app => {
  session.init(app);
  users.init(app);
  payments.init(app);
  contracts.init(app);
  auth.init(app);
};
