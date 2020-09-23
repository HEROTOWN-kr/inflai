const express = require('express');
const jwt = require('jsonwebtoken');
const async = require('async');
const Sequelize = require('sequelize');

const Admin = require('../models').TB_ADMIN;
const Advertise = require('../models').TB_AD;
const Advertiser = require('../models').TB_ADVERTISER;
const Influencer = require('../models').TB_INFLUENCER;
const Notification = require('../models').TB_NOTIFICATION;

const router = express.Router();

router.post('/login', (req, res, next) => {
  const data = req.body;

  Admin.findOne({ where: { ADM_NAME: data.email, ADM_PASS: data.password } }).then((result) => {
    if (result) {
      const payload = {
        sub: result.dataValues.ADM_ID
      };

      // create a token string
      const token = jwt.sign(payload, 'SECRETKEY');

      res.json({
        code: 200,
        token,
      });
    } else {
      res.json({
        code: 400,
        message: '입력한 정보는 틀립니다'
      });
    }
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/dashboard', (req, res) => {
  const responseData = {

  };

  async.waterfall([
    function (done) { // 파일 tmp -> 폴더로 이동
      Influencer.findAll({
        attributes: ['INF_ID', 'INF_NAME', 'INF_EMAIL', 'INF_TEL', 'INF_BLOG_TYPE', 'INF_DT',
          [Sequelize.literal('CASE INF_BLOG_TYPE WHEN \'1\' THEN \'인스타\' WHEN \'2\' THEN \'유튜브\' ELSE \'블로그\' END'), 'INF_BLOG_TYPE'],
          [Sequelize.fn('DATE_FORMAT', Sequelize.col('INF_DT'), '%Y-%m-%d'), 'INF_DT']
        ],
        order: [['INF_DT', 'DESC']],
        limit: 5
      }).then((result) => {
        done(null, result);
      }).error((err) => {
        done(err, null);
      });
    },
    function (result, done) { //
      if (result) {
        responseData.influencers = result;
        Advertiser.findAll({
          attributes: ['ADV_ID', 'ADV_NAME', 'ADV_EMAIL', 'ADV_TEL', 'ADV_COM_NAME', 'ADV_DT',
            [Sequelize.literal('CASE ADV_TYPE WHEN \'1\' THEN \'일반\' WHEN \'2\' THEN \'에이전시\' ELSE \'소상공인\' END'), 'ADV_TYPE'],
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('ADV_DT'), '%Y-%m-%d'), 'ADV_DT']
          ],
          order: [['ADV_DT', 'DESC']],
          limit: 5
        }).then((result2) => {
          done(null, result2);
        }).error((err) => {
          done(err, null);
        });
      }
    },
    function (result2, done) {
      if (result2) {
        responseData.advertisers = result2;
        Advertise.findAll({
          attributes: ['AD_ID', 'AD_PROD_NAME', 'AD_PROD_PRICE', 'AD_PAID',
            [Sequelize.literal('AD_INF_NANO + AD_INF_MICRO + AD_INF_MACRO + AD_INF_MEGA + AD_INF_CELEB'), 'INF_SUM'],
            [Sequelize.literal('CASE AD_PAID WHEN \'Y\' THEN \'결제됨\' ELSE \'미결제\' END'), 'AD_PAID'],
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('AD_DT'), '%Y-%m-%d'), 'AD_DT']
          ],
          order: [['AD_DT', 'DESC']],
          include: [
            {
              model: Advertiser,
              attributes: ['ADV_COM_NAME']
            }
          ],
          limit: 5
        }).then((result3) => {
          done(null, result3);
        }).error((err) => {
          done(err, null);
        });
      }
    },
    function (result3, done) {
      if (result3) {
        responseData.advertises = result3;
        /* Advertise.findAll({
          // where: { INF_ID: userId },
          order: [['AD_DT', 'DESC']],
          limit: 5
        }).then((result4) => {
          done(null, result4);
        }).error((err) => {
          done(err, null);
        }); */
        done(null, null);
      }
    }
  ],
  (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ code: 500, message: '이미지 업로드시 에러가 발생하였습니다.', data: err });
    }
    return res.json({ code: 200, message: '', data: responseData });
  });
});

router.get('/getUpdateDate', async (req, res) => {
  const UpdateDate = await Admin.findOne({
    where: { ADM_ID: 1 },
    attributes: [
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('ADM_UPDATE_DT'), '%Y.%m.%d %H:%i:%s'), 'ADM_UPDATE_DT']
    ],
  });

  return res.json({
    code: 200, message: '', data: UpdateDate
  });
});

module.exports = router;
