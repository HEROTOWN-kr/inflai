const express = require('express');
const Sequelize = require('sequelize');
const Subscription = require('../models').TB_SUBSCRIPTION;
const Advertiser = require('../models').TB_ADVERTISER;
const Ad = require('../models').TB_AD;
const Plan = require('../models').TB_PLAN;
const { getIdFromToken } = require('../config/common');

const { Op } = Sequelize;

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { token, tab } = req.query;
    const userId = getIdFromToken(token).sub;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const where = { ADV_ID: userId };
    if (tab === '1') {
      where.SUB_END_DT = { [Op.gte]: currentDate };
      where.SUB_STATUS = '2';
    }

    const Response = await Subscription.findAll({
      where,
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
      res.status(201).json({ data: {}, message: '진행중 서브스크립션이 없습니다' });
    }
  } catch (e) {
    res.status(400).send({
      message: e.message
    });
  }
});

router.get('/getInfluencers', async (req, res) => {
  try {
    const { token } = req.query;
    const userId = getIdFromToken(token).sub;
    /* const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); */
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const firstDayString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-01`;
    const lastDayString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`;

    const Response = await Ad.findAll({
      where: {
        ADV_ID: userId,
        AD_DT: { [Op.between]: [firstDayString, lastDayString] }
      },
      attributes: ['AD_INF_CNT']
    });

    const PlanResponse = await Subscription.findOne({
      where: {
        ADV_ID: userId
      },
      attributes: ['PLN_ID'],
      include: [
        {
          model: Plan,
          attributes: ['PLN_INF_MONTH']
        }
      ]
    });

    const PlnInfMonth = PlanResponse.TB_PLAN.PLN_INF_MONTH;
    const InfCountUsed = Response.reduce((sum, arg) => sum + (parseInt(arg.AD_INF_CNT, 10) || 0), 0);

    res.status(200).json({
      data: { InfCountUsed, PlnInfMonth },
    });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/save', async (req, res) => {
  try {
    const { token, PLN_ID } = req.body;
    const advId = getIdFromToken(token).sub;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const currentSubscription = await Subscription.findOne({
      where: {
        ADV_ID: advId,
        [Op.or]: [
          { SUB_END_DT: { [Op.gte]: currentDate } },
          { SUB_END_DT: null },
        ],
      }
    });

    if (currentSubscription) {
      res.status(201).json({ message: '등록된 구독이 있습니다!' });
    } else {
      const post = {
        ADV_ID: advId,
        PLN_ID
      };
      const newSubscription = await Subscription.create(post);
      res.status(200).json({ data: newSubscription });
    }
  } catch (e) {
    res.status(400);
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
