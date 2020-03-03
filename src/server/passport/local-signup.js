const User = require('../models').TB_MEMBER;
const PassportLocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const saltRounds = 10;

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
    MEM_EMAIL: email.trim(),
    MEM_PASS: password.trim(),
    MEM_NAME: req.body.name.trim()
  };

  User.findOne({
    where: { MEM_EMAIL: userData.MEM_EMAIL }
  }).then((user) => {
    if (user) return done(null, { name: 'EmailExistError' });

    return done(null, null);
  });
});
