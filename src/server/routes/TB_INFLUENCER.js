const express = require('express');
const jwt = require('jsonwebtoken');
const request = require('request');

const config = require('../config');
const Influencer = require('../models').TB_INFLUENCER;
const common = require('../config/common');

const router = express.Router();

router.get('/', (req, res) => {
  const { token } = req.query;
  const userId = common.getIdFromToken(token).sub;

  Influencer.findOne({ where: { INF_ID: userId } }).then((result) => {
    res.json({
      code: 200,
      data: result.dataValues,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.post('/updateInfo', (req, res) => {
  const data = req.body;
  const userId = common.getIdFromToken(data.token).sub;
  const { channel } = data;

  const post = {
    INF_NAME: data.nickName,
    INF_TEL: data.phone,
    INF_CITY: data.country,
    INF_AREA: data.region,
    INF_PROD: data.product,
  };

  if (channel) {
    post.INF_CHANNEL = JSON.stringify(channel);
  }

  Influencer.update(post, {
    where: { INF_ID: userId }
  }).then((result) => {
    /* console.log(message.get({
          plain: true
        })); */
    res.send(result);
  });
});

module.exports = router;
