const express = require('express');
const Admin = require('../models').TB_ADMIN;
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', (req, res, next) => {
  const data = req.body;

  Admin.findOne({ where: { ADM_NAME: data.email, ADM_PASS: data.password } }).then((result) => {
    if (result) {
      const payload = {
        sub: result.dataValues.ADM_ID
      };

      // create a token string
      const token = jwt.sign(payload, 'SECRETKEY');

      res.json({
        code: 200,
        token,
      });
    } else {
      res.json({
        code: 400,
        message: '입력한 정보는 틀립니다'
      });
    }
  }).error((err) => {
    res.send('error has occured');
  });
});

module.exports = router;
