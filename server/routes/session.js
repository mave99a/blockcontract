module.exports = {
  init(app) {
    app.get('/api/session', (req, res) => {
      res.json(req.session);
    });

    app.post('/api/logout', (req, res) => {
      req.session.user = null;
      res.json(req.session);
    });
  },
};
