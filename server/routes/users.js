/* eslint-disable no-console */
const { User } = require('../models');

module.exports = {
  init(app) {
    app.get('/api/users', async (req, res) => {
      try {
        const users = await User.find({})
          .sort('-createdAt')
          .limit(100);
        res.json(users);
      } catch (err) {
        console.error('api.users.error', err);
        res.json([]);
      }
    });
  },
};
