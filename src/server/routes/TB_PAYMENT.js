const express = require('express');
const axios = require('axios');
const Sequelize = require('sequelize');
const Payment = require('../models').TB_PAYMENT;
const Advertiser = require('../models').TB_ADVERTISER;
const Advertise = require('../models').TB_AD;
const common = require('../config/common');


const router = express.Router();

router.get('/list', async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const offset = (pageInt - 1) * limitInt;

    const dbData = await Payment.findAll({
      attributes: ['PAY_AMOUNT',
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('PAY_DT'), '%Y-%m-%d'), 'PAY_DT']
      ],
      include: [
        {
          model: Advertiser,
          attributes: ['ADV_NAME', 'ADV_EMAIL', 'ADV_TEL'],
        },
      ],
      limit: limitInt,
      offset,
      order: [['PAY_ID', 'DESC']]
    });

    const paymentCount = await Payment.count();

    const ResponseData = dbData.map((item, index) => {
      const { TB_ADVERTISER, ...rest } = item.dataValues;
      const {
        ADV_NAME, ADV_EMAIL, ADV_TEL
      } = TB_ADVERTISER || {};
      const rowNum = paymentCount - offset - index;
      return {
        ...rest, ADV_NAME, ADV_EMAIL, ADV_TEL, rowNum
      };
    });

    res.status(200).json({ data: ResponseData, paymentCount });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/', (req, res) => {
  const data = req.body;
  const { id } = data;

  const post = {
    AD_ID: id,
    PAY_RESP: JSON.stringify(data.payment_res)
  };

  Payment.create(post).then((result) => {
    if (result) {
      Advertise.update({ AD_PAID: 'Y' }, {
        where: { AD_ID: id }
      }).then((result2) => {
        if (result2) {
          res.json({
            code: 200,
            data: result2
          });
        }
      });
    }
  });
});

router.post('/cancel', async (req, res, next) => {
  try {
    /* 액세스 토큰(access token) 발급 */
    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        imp_key: 'imp16565297', // [아임포트 관리자] REST API키
        imp_secret: 'fvufQ7kfu5DcRcfWsxTZmdlvSUaoa47pABFqIZFd4jqWwFSYcLXzYi4QdffokmNUYtlHs1UxkktR0mPc' // [아임포트 관리자] REST API Secret
      }
    });
    const { access_token } = getToken.data.response; // 엑세스 토큰
    /* 결제정보 조회 */
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
