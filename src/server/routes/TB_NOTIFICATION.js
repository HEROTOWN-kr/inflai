const express = require('express');
const Sequelize = require('sequelize');
const Advertise = require('../models').TB_AD;
const Advertiser = require('../models').TB_ADVERTISER;
const Notification = require('../models').TB_NOTIFICATION;
const common = require('../config/common');

const router = express.Router();

router.get('/', (req, res) => {
  const { token } = req.query;
  const userId = common.getIdFromToken(token).sub;

  Notification.findAll({
    where: { INF_ID: userId },
    attributes: ['NOTI_ID', 'INF_ID', 'AD_ID', 'NOTI_STATE',
      // [Sequelize.literal('AD_INF_NANO + AD_INF_MICRO + AD_INF_MACRO + AD_INF_MEGA + AD_INF_CELEB'), 'INF_SUM'],
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('NOTI_DT'), '%Y-%m-%d'), 'NOTI_DT']
    ],
    include: [
      {
        model: Advertise,
        attributes: ['AD_ID', 'AD_PROD_NAME', 'AD_PROD_PRICE', 'AD_PAID',
          [Sequelize.literal('AD_INF_NANO + AD_INF_MICRO + AD_INF_MACRO + AD_INF_MEGA + AD_INF_CELEB'), 'INF_SUM'],
        ],
        include: [
          {
            model: Advertiser,
            attributes: ['ADV_COM_NAME']
          },
        ]
      }
    ],
    order: [['NOTI_ID', 'DESC']]
  }).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.post('/changeState', (req, res) => {
  const data = req.body;
  const { state, id } = data;

  Notification.update({ NOTI_STATE: state }, {
    where: { NOTI_ID: id }
  }).then((result) => {
    if (result) {
      res.json({
        code: 200,
      });
    }
  });
});

router.post('/', (req, res) => {
  const data = req.body;
  const { list, adId } = data;


  /* const post = {
    AD_ID: adId
  } */

  Object.keys(list).forEach((key, index) => {
    list[key].map((item) => {
      const post = {
        AD_ID: adId,
        INF_ID: item
      };
      Notification.create(post).then((result) => {
        /*res.json({
          code: 200,
          id: result.dataValues.AD_ID,
        });*/
      });
    });
  });

  res.json({
    code: 200,
    // id: result.dataValues.AD_ID,
  });
});

module.exports = router;
