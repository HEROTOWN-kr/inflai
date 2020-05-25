const express = require('express');
const Sequelize = require('sequelize');
const nodemailer = require('nodemailer');
const async = require('async');
const Advertise = require('../models').TB_AD;
const Advertiser = require('../models').TB_ADVERTISER;
const Notification = require('../models').TB_NOTIFICATION;
const Influencer = require('../models').TB_INFLUENCER;
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

  const transporter = nodemailer.createTransport({
    host: 'smtp.naver.com',
    port: 465,
    secure: true, // use SSL
    // secure: false, // use SSL
    auth: {
      user: 'andriantsoy@naver.com',
      pass: 'tshega93'
    }
  });

  const mailOptions = {
    to: '',
    from: 'andriantsoy@naver.com',
    subject: '인플라이 테스트 메세지',
    text: '인플라이 테스트 메세지'
  };

  async.map(Object.keys(list), (item, callback) => {
    async.map(list[item], (item2, callback2) => {
      const post = {
        AD_ID: adId,
        INF_ID: item2
      };

      Notification.create(post).then((result) => {
        if (result) {
          Influencer.findOne({
            where: { INF_ID: item2 },
            attributes: ['INF_EMAIL']
          }).then((result2) => {
            if (result2) {
              const receiver = result2.dataValues.INF_EMAIL;
              mailOptions.to = receiver;

              transporter.sendMail(mailOptions, (err) => {
                if (err) {
                  callback2(null, 'error');
                } else {
                  callback2(null, 'success');
                }
              });
            }
          });
        }
      });
    }, (err2, results2) => {
      callback(null, results2);
    });
  }, (err, results) => {
    if (err) {
      return res.json({ code: 500, message: '에러가 발생하였습니다.', data: err });
    }
    return res.json({ code: 200, message: '', data: results });
  });
});

module.exports = router;
