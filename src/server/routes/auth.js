
const express = require('express');
const validator = require('validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const router = new express.Router();

const User = require('../models').TB_MEMBER;
const Game = require('../models').TB_GAMES;

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false;
    errors.password = 'Password must have at least 8 characters.';
  }

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
    isFormValid = false;
    errors.email = 'Please provide your email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post('/checkUserExist', (req, res, next) => {
  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }


  return passport.authenticate('local-signup', (data, err) => {
    if (err) {
      if (err.name === 'EmailExistError') {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.json({
          code: 401,
          success: false,
          message: 'This email is already taken.',
          errors: {
            email: 'This email is already taken.'
          }
        });
      }

      return res.json({
        code: 400,
        success: false,
        message: 'Could not process the form.'
      });
    }

    return res.json({
      code: 200,
      success: true
    });
  })(req, res, next);
});

router.post('/signup', (req, res) => {
  const data = req.body;

  const userData = {
    MEM_EMAIL: data.email,
    MEM_NAME: data.name,
    MEM_TEL: data.tel,
    MEM_TYPE: data.type,
    MEM_SKILLS: data.experience
  };

  if (data.langs) {
    const { langs } = data;
    const hasTrueKeys = Object.keys(langs).some(k => langs[k]);
    if (hasTrueKeys) userData.MEM_LANG = JSON.stringify(data.langs);
  }
  if (data.langEtc) userData.MEM_LANG_ETC = data.langEtc;
  if (data.link) userData.MEM_LINK = data.link;
  if (data.job) userData.MEM_JOB = data.job;

  bcrypt.hash(data.password, saltRounds, (err, hash) => {
    userData.MEM_PASS = hash;
    if (err) {
      console.log(err);
    } else {
      User.create(userData).then((result) => {
        const insertedID = result.dataValues.MEM_ID;
        if (data.projects.length > 0) {
          const projectsArray = [];
          data.projects.map(project => (
            projectsArray.push({
              MEM_ID: insertedID,
              GME_TYPE: project.type,
              GME_NAME: project.name,
              GME_ROLE: project.role
            })
          ));
          Game.bulkCreate(projectsArray).then(() => Game.findAll()).then((games) => {
            // console.log(games);
          });
        }

        res.json({
          id: insertedID,
          code: 200,
          success: true
        });
      }).catch((err) => {
        res.json({
          code: 400,
          success: false,
          error: err
        });
      });

      /* User.create(userData, { isNewRecord: true }).complete((err, result) => {
        if (err) {
          res.json({
            code: 400,
            success: false,
            error: err
          });
        } else {
          res.json({
            code: 200,
            success: true
          });
        }
      }); */
    }
  });
});

router.post('/login', (req, res, next) => {
  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }


  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.json({
          code: 401,
          success: false,
          message: err.message
        });
      }

      return res.json({
        code: 400,
        success: false,
        message: 'Could not process the form.'
      });
    }


    return res.json({
      code: 200,
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res, next);
});


module.exports = router;
