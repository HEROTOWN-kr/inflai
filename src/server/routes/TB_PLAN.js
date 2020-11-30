const express = require('express');
const Plan = require('../models').TB_PLAN;

const router = express.Router();

router.get('/', (req, res) => {
  Plan.findAll().then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured', err);
  });
});

module.exports = router;
