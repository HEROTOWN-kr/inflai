const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../config');
const Influenser = require('../models').TB_INFLUENCER;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password.trim()
  };

  return Influenser.findOne({
    where: { INF_EMAIL: userData.email }
  }).then((user) => {
    if (!user) {
      const error = new Error('해당 사용자가 없습니다');
      return done(error);
    }

    const {
      INF_ID, INF_PASS, INF_NAME, INF_PHOTO, INF_ACTIVATED
    } = user.dataValues;

    if (INF_ACTIVATED === 0) {
      const error = new Error('이메일 인증링크를 확인 후, 시도해주세요');
      return done(error);
    }

    const dbPassword = INF_PASS || '';

    return Influenser.options.instanceMethods.validPassword(userData.password, dbPassword, (passwordErr, isMatch) => {
      if (passwordErr) return done(passwordErr);

      if (!isMatch) {
        const error = new Error('이메일이나 비밀번호는 일치하지 않습니다');
        return done(error);
      }

      const payload = {
        sub: INF_ID
      };

      // create a token string
      const token = jwt.sign(payload, config.jwtSecret);
      const data = {
        name: INF_NAME,
        userPhoto: INF_PHOTO,
      };

      return done(null, token, data);
    });
  }).catch(err => done(err));
});
