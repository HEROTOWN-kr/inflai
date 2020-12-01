const express = require('express');
const Subscription = require('../models').TB_SUBSCRIPTION;
const { getIdFromToken } = require('../config/common');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { token } = req.query;
    const userId = getIdFromToken(token).sub;

    const Response = await Subscription.findAll({
      where: { ADV_ID: userId },
    });
    res.status(200).json({
      data: Response,
    });
  } catch (e) {
    res.status(400).send({
      message: e.message
    });
  }
});

router.post('/save', async (req, res) => {
  try {
    const { token, PLN_ID } = req.body;
    const advId = getIdFromToken(token).sub;
    const post = {
      ADV_ID: advId,
      PLN_ID
    };

    const newSubscription = await Subscription.create(post);

    res.status(200).json({ data: newSubscription });
  } catch (e) {
    res.status(400).send({
      message: e.message
    });
  }
});

module.exports = router;
