/* eslint-disable no-console */
// customising the .env file in your project's root folder.
require('dotenv').config();

const cors = require('cors');
const path = require('path');
const next = require('next');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const { name, version } = require('./package.json');

const dev = process.env.NODE_ENV !== 'production';

if (!process.env.MONGO_URI) {
  throw new Error('Cannot start application without process.env.MONGO_URI');
}

// Connect to database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create next.js application
const app = next({
  dev,
  dir: path.join(__dirname, './client'),
});

// Prepare next.js application
app.prepare().then(() => {
  const handle = app.getRequestHandler();

  // Create and config express application
  const server = express();
  server.use(cookieParser());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(cors());
  server.use(morgan(dev ? 'tiny' : 'combined'));
  server.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.COOKIE_SECRET,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );

  // eslint-disable-next-line global-require
  require('./server/routes')(server);

  server.get('*', (req, res) => handle(req, res));

  const port = parseInt(process.env.PORT, 10) || parseInt(process.env.APP_PORT, 10) || 3000;
  server.listen(port, err => {
    if (err) throw err;
    console.log(`> ${name} v${version} ready on ${process.env.BASE_URL}`);
  });
});
