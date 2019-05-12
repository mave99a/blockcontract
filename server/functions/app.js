/* eslint-disable no-console */
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);

// ------------------------------------------------------------------------------
// Routes: due to limitations of netlify functions, we need to import routes here
// ------------------------------------------------------------------------------
const { handlers } = require('../libs/auth');
const loginAuth = require('../routes/auth/login');
const paymentAuth = require('../routes/auth/payment');
const checkinAuth = require('../routes/auth/checkin');
const sessionRoutes = require('../routes/session');
const paymentsRoutes = require('../routes/payments');

if (!process.env.MONGO_URI) {
  throw new Error('Cannot start application without process.env.MONGO_URI');
}

// Connect to database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create and config express application
const server = express();
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

server.use(
  morgan((tokens, req, res) => {
    const log = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ');

    if (process.env.NODE_ENV !== 'dev') {
      // Log only in AWS context to get back function logs
      console.log(log);
    }
    return log;
  })
);

server.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

const router = express.Router();

handlers.attach(Object.assign({ app: router }, loginAuth));
handlers.attach(Object.assign({ app: router }, checkinAuth));
handlers.attach(Object.assign({ app: router }, paymentAuth));
paymentsRoutes.init(router);
sessionRoutes.init(router);

// ------------------------------------------------------
// This is required by netlify functions
// ------------------------------------------------------
server.use('/.netlify/functions/app', router);

server.use((req, res) => {
  res.status(404).send('404 NOT FOUND');
});

// eslint-disable-next-line no-unused-vars
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Make it serverless
exports.handler = serverless(server);
