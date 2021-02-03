const express = require('express');
const Plan = require('../models').TB_PLAN;

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const Response = await Plan.findAll({ where: { PLN_VISIBLE: 1 } });
    res.status(200).json({
      data: Response,
    });
  } catch (e) {
    res.status(400).send({
      message: e.message
    });
  }
});

module.exports = router;
