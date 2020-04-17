const jwt = require('jsonwebtoken');
// const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../config');
const Advertiser = require('../models').TB_ADVERTISER;
const Influenser = require('../models').TB_INFLUENCER;
const Admin = require('../models').TB_ADMIN;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const { type } = req.body;

  const userData = {
    email: email.trim(),
    password: password.trim()
  };

  // find a user by email address
  if (type === '1') {
    return Advertiser.findOne({
      where: { ADV_EMAIL: userData.email }
    }).then((user) => {
      if (!user) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      return Advertiser.options.instanceMethods.validPassword(userData.password, user.dataValues.ADV_PASS, (passwordErr, isMatch) => {
        if (passwordErr) { return done(passwordErr); }

        if (!isMatch) {
          const error = new Error('Incorrect email or password');
          error.name = 'IncorrectCredentialsError';

          return done(error);
        }

        const payload = {
          sub: user.dataValues.ADV_ID
        };

        // create a token string
        const token = jwt.sign(payload, config.jwtSecret);
        const data = {
          name: user.dataValues.ADV_NAME,
          regState: user.dataValues.ADV_FULL_REG
        };

        return done(null, token, data);
      });
    }).catch(err => done(err));
  }
  if (type === '2') {
    return Influenser.findOne({
      where: { INF_EMAIL: userData.email }
    }).then((user) => {
      if (!user) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      return Influenser.options.instanceMethods.validPassword(userData.password, user.dataValues.INF_PASS, (passwordErr, isMatch) => {
        if (passwordErr) { return done(passwordErr); }

        if (!isMatch) {
          const error = new Error('Incorrect email or password');
          error.name = 'IncorrectCredentialsError';

          return done(error);
        }

        const payload = {
          sub: user.dataValues.INF_ID
        };

        // create a token string
        const token = jwt.sign(payload, config.jwtSecret);
        const data = {
          name: user.dataValues.INF_NAME
        };

        return done(null, token, data);
      });
    }).catch(err => done(err));
  }
});
