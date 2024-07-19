// https:// openssl.org - openssl req  -x509  -newkey -rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
// Reference: https://oauth.net/2/
// https://developer.okta.com/docs/concepts/oauth-openid/#implicit-flow

const { config } = require('dotenv');
config();

const { log } = console;
const path = require('path');
const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const { Strategy } = require('passport-google-oauth20');

// cookies are a way of storing data in your browser
// that gets sent to ur server whenever u make a request

// sessions are a way of storing data about the current active user
// usually, these data are values that should not be changed in the browser
// e.g. account balance, e.t.c
// sessions are short-lived

// sessions are stored in two ways
// server-side sessions: user data lives in a server
// client-side sessions: store data in the browser cookies

// stateful vs stateless cookies

const {
  clientId,
  clientSecret,
  cookieKeyOne,
  cookieKeyTwo,
  port,
} = require('./config/config');

const app = express();

const AUTH_OPTIONS = {
  callbackURL: '/auth/google/callback',
  clientID: clientId,
  clientSecret,
};

// called when a user is authenticated
function verifyCallback(accessToken, refreshToken, profile, done) {
  log({ profile });
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// serializing means saving user data into our cookie which will be passed around the user's browser
// save the session into the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserializing means saving the user session from the cookie and storing it into the `req.user` object.
// or loading the user data from our cookie  into a value when can read inside of our express API
// load the session from the cookie
passport.deserializeUser((id, done) => {
  // DB calls
  /**
   *  User.findById(id).then((user) => {
   *   done(null, user);
   * })
   */
  done(null, id);
});

app.use(require('helmet')());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// session has to be set up before passport utilises it
app.use(
  cookieSession({
    name: 'session',
    // how long the session will last before the user logs in again
    maxAge: 24 * 60 * 60 * 1000, // 24 hrs,
    // This prevents the user from tampering/modifying the user session
    // as these keys will enable our cookies to be signed by the server.
    keys: [cookieKeyOne, cookieKeyTwo],
  }),
);

app.use(passport.initialize());
app.use(passport.session());

function verifyLoggedInUser(req, res, next) {
  // `req.user`
  const isLoggedIn = req.isAuthenticated() && req.user;

  if (!isLoggedIn) {
    return res.status(401).json({
      code: 401,
      status: 'failure',
      error: 'Unauthorozed. Please login',
    });
  }
  next();
}

app.get('/secret', verifyLoggedInUser, (req, res) => res.send('Secret is 21'));

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/',
    session: true,
  }),
  (req, res) => {
    log('logged');
  },
);

app.get('/failure', (req, res) => {
  res.status(400).send({
    error: 'An error occured',
  });
});

app.get('/auth/logout', (req, res) => {
  // removes `req.user` and clears any logged in session
  req.logOut();
  res.redirect('/');
  return;
});

app.listen(port, () => log(`running on port: ${port}`));
