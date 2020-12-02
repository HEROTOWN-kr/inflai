const express = require('express');
const Sequelize = require('sequelize');
const Subscription = require('../models').TB_SUBSCRIPTION;
const Advertiser = require('../models').TB_ADVERTISER;
const Plan = require('../models').TB_PLAN;
const { getIdFromToken } = require('../config/common');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { token } = req.query;
    const userId = getIdFromToken(token).sub;

    const Response = await Subscription.findAll({
      where: { ADV_ID: userId },
      attributes: [
        'SUB_ID', 'SUB_START_DT', 'SUB_END_DT', 'SUB_STATUS',
        [Sequelize.literal('CASE SUB_STATUS WHEN \'1\' THEN \'대기\' ELSE \'승인\' END'), 'SUB_STATUS'],
      ],
      include: [
        {
          model: Plan,
          attributes: ['PLN_NAME']
        },
      ]
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

router.get('/list', async (req, res) => {
  try {
    const { page } = req.query;
    const limit = 5;
    const offset = (page - 1) * limit;

    const dbData = await Subscription.findAll({
      attributes: [
        'SUB_ID', 'SUB_START_DT', 'SUB_END_DT', 'SUB_STATUS',
        [Sequelize.literal('CASE SUB_STATUS WHEN \'1\' THEN \'대기\' ELSE \'승인\' END'), 'SUB_STATUS'],
      ],
      include: [
        {
          model: Plan,
          attributes: ['PLN_NAME']
        },
        {
          model: Advertiser,
          attributes: ['ADV_NAME'],
          required: false,
        },
      ]
    });

    const Count = await Subscription.count();

    const ResponseData = dbData.map((item, index) => {
      const { dataValues } = item;
      const rowNum = Count - offset - index;
      return { ...dataValues, rowNum };
    });

    res.status(200).json({
      data: ResponseData,
      countRes: Count
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
