const jwt = require('jsonwebtoken');
// const User = require('mongoose').model('User');
var User = require('../models').TB_MEMBER;
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../config');


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

    // find a user by email address
    return User.findOne({
        where: {MEM_EMAIL: userData.email}
    }).then(user => {
            /*console.log(user);
            console.log(user.get({ raw: true }));
            console.log(user.get({ plain: true }));*/
            if (!user) {
                const error = new Error('Incorrect email or password');
                error.name = 'IncorrectCredentialsError';

                return done(error);
            }

            // check if a hashed user's password is equal to a value saved in the database
            /*return user.comparePassword(userData.password, (passwordErr, isMatch) => {
                if (err) { return done(err); }

                if (!isMatch) {
                    const error = new Error('Incorrect email or password');
                    error.name = 'IncorrectCredentialsError';

                    return done(error);
                }

                const payload = {
                    sub: user._id
                };

                // create a token string
                const token = jwt.sign(payload, config.jwtSecret);
                const data = {
                    name: user.name
                };

                return done(null, token, data);
            });*/

            return user._modelOptions.instanceMethods.validPassword(userData.password, user.dataValues.MEM_PASS, (passwordErr, isMatch) => {
                if (passwordErr) { return done(passwordErr); }

                if (!isMatch) {
                    const error = new Error('Incorrect email or password');
                    error.name = 'IncorrectCredentialsError';

                    return done(error);
                }

                const payload = {
                    sub: user.dataValues.MEM_ID
                };

                // create a token string
                const token = jwt.sign(payload, config.jwtSecret);
                const data = {
                    id: user.dataValues.MEM_ID
                };

                return done(null, token, data);
            });
        }
    ).catch(err => {
        return done(err);
    });
});