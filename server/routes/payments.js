/* eslint-disable no-console */
const { Payment } = require('../models');

module.exports = {
  init(app) {
    app.get('/api/payments', async (req, res) => {
      try {
        if (req.session.user) {
          const payment = await Payment.findOne({ did: req.session.user.did });
          res.json(payment ? payment.toObject() : null);
        } else {
          res.json([]);
        }
      } catch (err) {
        console.error('api.payments.error', err);
        res.json([]);
      }
    });
  },
};
