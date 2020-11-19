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
      const {
        ADV_ID, ADV_PASS, ADV_NAME, ADV_FULL_REG, ADV_TEL, ADV_PHOTO
      } = user.dataValues;
      if (!user) {
        const error = new Error('이메일이나 비밀번호는 일치하지 않습니다');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      return Advertiser.options.instanceMethods.validPassword(userData.password, ADV_PASS, (passwordErr, isMatch) => {
        if (passwordErr) { return done(passwordErr); }

        if (!isMatch) {
          const error = new Error('이메일이나 비밀번호는 일치하지 않습니다');
          error.name = 'IncorrectCredentialsError';

          return done(error);
        }

        const payload = {
          sub: ADV_ID
        };

        // create a token string
        const token = jwt.sign(payload, config.jwtSecret);
        const data = {
          userId: ADV_ID,
          name: ADV_NAME,
          regState: ADV_FULL_REG,
          userPhone: ADV_TEL,
          userPhoto: ADV_PHOTO,
        };

        return done(null, token, data);
      });
    }).catch(err => done(err));
  }
  if (type === '2') {
    return Influenser.findOne({
      where: { INF_EMAIL: userData.email, INF_BLOG_TYPE: '5' }
    }).then((user) => {
      const {
        INF_ID, INF_PASS, INF_NAME, INF_TEL, INF_PHOTO
      } = user.dataValues;
      if (!user) {
        const error = new Error('입력하신 정보가 틀립니다');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      return Influenser.options.instanceMethods.validPassword(userData.password, INF_PASS, (passwordErr, isMatch) => {
        if (passwordErr) { return done(passwordErr); }

        if (!isMatch) {
          const error = new Error('입력하신 정보가 틀립니다');
          error.name = 'IncorrectCredentialsError';

          return done(error);
        }

        const payload = {
          sub: INF_ID
        };

        // create a token string
        const token = jwt.sign(payload, config.jwtSecret);
        const data = {
          userId: INF_ID,
          name: INF_NAME,
          userPhone: INF_TEL,
          userPhoto: INF_PHOTO,
        };

        return done(null, token, data);
      });
    }).catch(err => done(err));
  }
});
