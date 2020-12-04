const express = require('express');
const Sequelize = require('sequelize');
const Subscription = require('../models').TB_SUBSCRIPTION;
const Advertiser = require('../models').TB_ADVERTISER;
const Plan = require('../models').TB_PLAN;
const { getIdFromToken } = require('../config/common');

const { Op } = Sequelize;

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { token } = req.query;
    const userId = getIdFromToken(token).sub;

    const Response = await Subscription.findAll({
      where: { ADV_ID: userId },
      attributes: [
        'SUB_ID', 'SUB_START_DT', 'SUB_END_DT',
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
        // [Sequelize.literal('CASE SUB_STATUS WHEN \'1\' THEN \'대기\' ELSE \'승인\' END'), 'SUB_STATUS'],
      ],
      include: [
        {
          model: Plan,
          attributes: ['PLN_NAME', 'PLN_MONTH']
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

router.get('/detail', async (req, res) => {
  try {
    const { id } = req.query;

    const Response = await Subscription.findOne({
      where: { SUB_ID: id },
      attributes: [
        'SUB_ID', 'SUB_START_DT', 'SUB_END_DT', 'SUB_STATUS',
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

router.get('/check', async (req, res) => {
  try {
    const { token } = req.query;
    const userId = getIdFromToken(token).sub;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // if (tab === '2') where.AD_SRCH_END = { [Op.gt]: currentDate };
    // if (tab === '3') where.AD_SRCH_END = { [Op.lt]: currentDate };

    const Response = await Subscription.findAll({
      where: {
        ADV_ID: userId,
        SUB_STATUS: '2',
        SUB_END_DT: { [Op.gte]: currentDate }
      },
      attributes: [
        'SUB_ID'
      ],
      include: [
        {
          model: Plan,
          attributes: ['PLN_NAME']
        },
      ]
    });
    if (Response.length > 0) {
      res.status(200).json({
        data: Response,
      });
    } else {
      res.status(201).json({ message: '진행중 서브스크립션이 없습니다' });
    }
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

router.post('/update', async (req, res) => {
  try {
    const {
      id, status, startDate, endDate
    } = req.body;
    const post = {
      SUB_START_DT: startDate,
      SUB_END_DT: endDate,
      SUB_STATUS: status
    };

    const newSubscription = await Subscription.update(post, { where: { SUB_ID: id } });

    res.status(200).json({ data: newSubscription });
  } catch (e) {
    res.status(400).send({
      message: e.message
    });
  }
});

module.exports = router;
