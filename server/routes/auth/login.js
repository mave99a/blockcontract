/* eslint-disable no-console */
const { User } = require('../../models');

module.exports = {
  action: 'login',
  claims: {
    profile: () => ({
      fields: ['fullName', 'email', 'phone'],
      description: 'Please provide your email and name to continue',
    }),
  },
  onAuth: async ({ claims, did }) => {
    try {
      const profile = claims.find(x => x.type === 'profile');
      const exist = await User.findOne({ did });
      if (exist) {
        console.log('new user', did, JSON.stringify(profile));
        exist.name = profile.fullName;
        exist.email = profile.email;
        exist.mobile = profile.mobile;
        await exist.save();
      } else {
        console.log('exist user', did, JSON.stringify(profile));
        const user = new User({
          did,
          name: profile.fullName,
          email: profile.email,
          mobile: profile.phone,
        });
        await user.save();
      }
    } catch (err) {
      console.error('login.onAuth.error', err);
    }
  },
  onComplete: (req, { did }) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    new Promise((resolve, reject) => {
      // TODO: old session info should be copied to new session
      req.session.regenerate(async err => {
        if (err) {
          reject(err);
          return;
        }

        const user = await User.findOne({ did });
        if (!user) {
          reject(new Error(`User with ${did} did does not exist`));
          return;
        }

        // Populate user to session
        req.session.user = user.toObject();
        resolve(req.session);
      });
    }),
};
