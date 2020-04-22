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

router.get('/getInfluencers', (req, res) => {
  Influencer.findAll({
    attributes: ['INF_ID', 'INF_NAME', 'INF_TEL', 'INF_EMAIL', 'INF_DT'],
    order: [['INF_ID', 'DESC']]
  }).then((result) => {
    res.json({
      code: 200,
      data: result,
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

router.get('/getLongLivedToken', (req, res) => {
  const {
    token, facebookToken, facebookUserId, instagramBusinessId
  } = req.query;
  const userId = common.getIdFromToken(token).sub;
  // const header = `Bearer ${token}`; // Bearer 다음에 공백 추가

  const apiUrl = 'https://graph.facebook.com/v6.0/oauth/access_token?'
      + 'grant_type=fb_exchange_token&'
      + 'client_id=139193384125564&'
      + 'client_secret=085e5020f9b2cdac9357bf7301f31e01&'
      + `fb_exchange_token=${facebookToken}`;
  const options = {
    url: apiUrl,
  };

  request.get(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const longToken = (JSON.parse(body)).access_token;

      const apiUrl2 = `https://graph.facebook.com/v6.0/${facebookUserId}/accounts?`
          + `access_token=${longToken}`;

      request(apiUrl2, {}, (error2, response2, body2) => {
        if (!error && response.statusCode == 200) {
          // todo: find page long token api option for special fb page

          Influencer.update({ INF_TOKEN: longToken, INF_INST_ID: instagramBusinessId }, {
            where: { INF_ID: userId }
          }).then((result) => {
            res.json(longToken);
          });
        }
      });
    } else {
      console.log('error');
      if (response != null) {
        res.status(response.statusCode).end();
        console.log(`error = ${response.statusCode}`);
      }
    }
  });
});

module.exports = router;
