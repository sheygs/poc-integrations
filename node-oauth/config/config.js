require('dotenv/config');

const config = {
  port: process.env.PORT ?? 3000,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  cookieKeyOne: process.env.COOKIE_KEY_ONE,
  cookieKeyTwo: process.env.COOKIE_KEY_TWO,
};

module.exports = config;
