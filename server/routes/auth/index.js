const login = require('./login');
const checkin = require('./checkin');
const payment = require('./payment');
const { handlers } = require('../../libs/auth');

module.exports = {
  init(app) {
    handlers.attach(Object.assign({ app }, login));
    handlers.attach(Object.assign({ app }, checkin));
    handlers.attach(Object.assign({ app }, payment));
  },
};
