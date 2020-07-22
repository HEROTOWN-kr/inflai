const express = require('express');
const Sequelize = require('sequelize');
const async = require('async');
const Advertise = require('../models').TB_AD;
const Advertiser = require('../models').TB_ADVERTISER;
const Notification = require('../models').TB_NOTIFICATION;
const Influencer = require('../models').TB_INFLUENCER;
const common = require('../config/common');
const request = require('request');

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

router.get('/getRequests', (req, res) => {
  const data = req.query;
  const { id } = data;

  Notification.findAll({
    where: { AD_ID: id },
    attributes: ['NOTI_ID',
      [Sequelize.literal('CASE NOTI_STATE WHEN \'1\' THEN \'승인\' WHEN \'2\' THEN \'거절\' ELSE \'대기중\' END'), 'NOTI_STATE'],
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('NOTI_DT'), '%Y-%m-%d'), 'NOTI_DT']
    ],
    include: [
      {
        model: Influencer,
        // attributes: ['INF_ID', 'INF_TOKEN', 'INF_INST_ID']
        attributes: ['INF_ID', 'INF_TOKEN', 'INF_INST_ID', 'INF_NAME', 'INF_EMAIL', 'INF_TEL',
          [Sequelize.literal('CASE INF_BLOG_TYPE WHEN \'1\' THEN \'인스타\' WHEN \'2\' THEN \'유튜브\' ELSE \'블로그\' END'), 'INF_BLOG_TYPE'],
        ],
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

router.get('/getRequestState', (req, res) => {
  const data = req.query;
  const { id } = data;

  Notification.findAll({
    where: { NOTI_ID: id },
    attributes: ['NOTI_ID', 'NOTI_STATE'],
    /* include: [
      {
        model: Influencer,
        // attributes: ['INF_ID', 'INF_TOKEN', 'INF_INST_ID']
        attributes: ['INF_ID', 'INF_TOKEN', 'INF_INST_ID', 'INF_NAME', 'INF_EMAIL', 'INF_TEL',
          [Sequelize.literal('CASE INF_BLOG_TYPE WHEN \'1\' THEN \'인스타\' WHEN \'2\' THEN \'유튜브\' ELSE \'블로그\' END'), 'INF_BLOG_TYPE'],
        ],
      }
    ] */
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

router.post('/changeState2', (req, res) => {
  const data = req.body;
  const { adId, INF_ID, state } = data;

  Notification.update({ NOTI_STATE: state }, {
    where: { INF_ID, AD_ID: parseInt(adId, 10) }
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

  const { mailOptions, transporter } = common.mailSendData();

  async.map(Object.keys(list), (item, callback) => {
    async.map(list[item], (item2, callback2) => {
      const post = {
        NOTI_STATE: '4'
      };

      Notification.update(post, { where: { AD_ID: adId, INF_ID: item2 } }).then((result) => {
        callback2(null, result);
      }).error((err) => {
        callback2(null, err);
      });

      /* Notification.create(post).then((result) => {
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
      }); */
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

router.post('/sendNotification', (req, res) => {
  const data = req.body;
  const {
    AD_INF_NANO, AD_INF_MICRO, AD_INF_MACRO, AD_INF_MEGA, AD_INF_CELEB, AD_ID
  } = data;

  const { mailOptions, transporter } = common.mailSendData();

  Influencer.findAll({
    where: { INF_BLOG_TYPE: '1' },
    attributes: ['INF_ID', 'INF_TOKEN', 'INF_INST_ID']
  }).then((result) => {
    if (result) {
      common.instaRequest(result, (err, sortedArray) => {
        if (err) {
          res.json({
            code: 401,
            message: err
          });
        } else {
          async.map(sortedArray, (item, callback) => {
            const followers = item.followers_count;
            const post = {
              AD_ID,
              INF_ID: item.INF_ID
            };

            function createNotification() {
              Notification.create(post).then((result2) => {
                if (result2) {
                  Influencer.findOne({
                    where: { INF_ID: item.INF_ID },
                    attributes: ['INF_EMAIL']
                  }).then((result3) => {
                    if (result3) {
                      const receiver = result3.dataValues.INF_EMAIL;
                      mailOptions.to = receiver;
                      transporter.sendMail(mailOptions, (err2) => {
                        if (err2) {
                          callback(null, 'error', err2);
                        } else {
                          callback(null, 'success');
                        }
                      });
                    }
                  });
                }
              });
            }

            if (followers && followers <= 10000 && AD_INF_NANO) {
              createNotification();
            } else if (followers && followers > 10000 && followers <= 30000 && AD_INF_MICRO) {
              createNotification();
            } else if (followers && followers > 30000 && followers <= 50000 && AD_INF_MACRO) {
              createNotification();
            } else if (followers && followers > 50000 && followers <= 100000 && AD_INF_MEGA) {
              createNotification();
            } else if (followers && followers > 100000 && followers <= 99999999 && AD_INF_CELEB) {
              createNotification();
            }
          }, (err2, results2) => {
            res.json({
              code: 200,
              data: results2
            });
          });
        }
      });
    }
    return res.json({ code: 401, message: '', data: '' });
  });
  // return res.json({ code: 401, message: '', data: '' });
});

router.post('/sendKakaoNotification', (req, res) => {
  const data = req.body;
  const { AD_ID } = data;

  Advertise.findOne({
    where: { AD_ID },
    attributes: ['AD_PROD_NAME', 'AD_COMP_NAME', 'AD_SPON_ITEM',
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('AD_SRCH_END'), '%Y/%m/%d'), 'AD_SRCH_END'],
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('AD_DT'), '%Y/%m/%d'), 'AD_DT'],
    ]
  }).then((adResult) => {
    if (adResult) {
      Influencer.findAll({
        where: { INF_MESSAGE: '1' },
        attributes: ['INF_TEL']
      }).then((infResult) => {
        if (infResult) {
          async.map(infResult, (item, callback) => {
            const options = common.createMessageOption(item.INF_TEL, adResult.AD_PROD_NAME, adResult.AD_COMP_NAME, adResult.AD_SPON_ITEM, adResult.AD_DT, adResult.AD_SRCH_END, AD_ID);
            request(options, (error, requestResponse, responseBody) => {
              if (!error && requestResponse.statusCode == 200) {
                callback(null, 'ok');
              } else if (requestResponse != null) {
                callback(null, error);
              }
            });
          }, (err, results) => {
            if (err) {
              return res.json({ code: 500, message: '에러가 발생하였습니다.', data: err });
            }
            return res.json({ code: 200, message: '', data: results });
          });
        } else {
          res.json({
            code: 400,
            data: infResult,
            adData: adResult
          });
        }
      });
    } else {
      res.json({
        code: 400,
        data: 'error'
      });
    }
  });
});

router.post('/createRequest', (req, res) => {
  const data = req.body;
  const {
    AD_ID, token
  } = data;
  const userId = common.getIdFromToken(token).sub;
  const post = {
    AD_ID,
    INF_ID: userId,
    NOTI_STATE: '1'
  };

  Notification.create(post).then((result) => {
    if (result) {
      res.json({
        code: 200
      });
    } else {
      res.json({
        code: 400
      });
    }
  });
});

module.exports = router;
