const express = require('express');
const Sequelize = require('sequelize');
const Subscription = require('../models').TB_SUBSCRIPTION;
const Advertiser = require('../models').TB_ADVERTISER;
const Ad = require('../models').TB_AD;
const Plan = require('../models').TB_PLAN;
const { getIdFromToken } = require('../config/common');
const { membershipSubscribe, membershipApprove } = require('../config/kakaoMessage');

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
    const limit = 10;
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
          attributes: ['ADV_ID', 'ADV_NAME'],
          required: false,
        },
      ],
      limit,
      offset,
      order: [['SUB_ID', 'DESC']]
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

router.get('/checkMembership', async (req, res) => {
  try {
    const { token } = req.query;
    const userId = getIdFromToken(token).sub;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const Response = await Subscription.findAll({
      where: {
        ADV_ID: userId,
      },
      attributes: [
        'SUB_ID'
      ],
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
    const InfCountLeft = PlnInfMonth - InfCountUsed;

    res.status(200).json({
      data: { InfCountUsed, PlnInfMonth, InfCountLeft },
    });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/save', async (req, res) => {
  try {
    const { token, PLN_ID } = req.body;
    const advId = getIdFromToken(token).sub;

    const advertiserData = await Advertiser.findOne({
      where: { ADV_ID: advId },
      attributes: ['ADV_NAME', 'ADV_TEL'],
    });

    const { ADV_NAME, ADV_TEL } = advertiserData;

    if (ADV_TEL && ADV_NAME) {
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
        res.status(201).json({ message: '이미 등록 된 구독이 있습니다!' });
      } else {
        const post = {
          ADV_ID: advId,
          PLN_ID
        };
        const newSubscription = await Subscription.create(post);


        const planData = await Plan.findOne({
          where: { PLN_ID },
          attributes: ['PLN_NAME', 'PLN_MONTH', 'PLN_PRICE_MONTH'],
        });


        const { PLN_NAME, PLN_MONTH, PLN_PRICE_MONTH } = planData;
        const price = Math.round(PLN_PRICE_MONTH * PLN_MONTH * 1.1);
        const bankAccount = 'IBK기업은행 935-012238-01016';
        const accountHolder = '(주)대가들이사는마을';
        const kakaoMessageProps = {
          phoneNumber: ADV_TEL,
          advertiserName: ADV_NAME,
          planName: PLN_NAME,
          planMonth: PLN_MONTH,
          price,
          bankAccount,
          accountHolder,
        };
        await membershipSubscribe(kakaoMessageProps);

        res.status(200).json({ data: newSubscription });
      }
    } else {
      res.status(202).json({ message: '회원의 정보가 필요합니다' });
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

    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    date1.setHours(9, 0, 0, 0);
    date2.setHours(9, 0, 0, 0);

    const post = {
      SUB_START_DT: date1,
      SUB_END_DT: date2,
      SUB_STATUS: status
    };

    await Subscription.update(post, { where: { SUB_ID: id } });

    if (status === '2') {
      const subscibtionData = await Subscription.findOne({
        where: { SUB_ID: id },
        include: [
          {
            model: Advertiser,
            attributes: ['ADV_NAME', 'ADV_TEL'],
          },
          {
            model: Plan,
            attributes: ['PLN_MONTH', 'PLN_INF_MONTH'],
          }
        ]
      });

      const {
        TB_ADVERTISER, TB_PLAN, SUB_START_DT, SUB_END_DT
      } = subscibtionData;

      const { ADV_TEL, ADV_NAME } = TB_ADVERTISER;
      const { PLN_MONTH, PLN_INF_MONTH } = TB_PLAN;

      const kakaoMessageProps = {
        phoneNumber: ADV_TEL,
        advertiserName: ADV_NAME,
        startDate: SUB_START_DT,
        endDate: SUB_END_DT,
        influencerCount: PLN_MONTH * PLN_INF_MONTH,
      };

      await membershipApprove(kakaoMessageProps);

      res.status(200).json({ message: 'success' });
    } else {
      res.status(200).json({ message: 'success' });
    }
  } catch (e) {
    res.status(400).send({
      message: e.message
    });
  }
});


module.exports = router;
