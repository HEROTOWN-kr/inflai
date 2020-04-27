const express = require('express');
const jwt = require('jsonwebtoken');
const request = require('request');
// const Promise = require('bluebird');
const async = require('async');

const config = require('../config/config');
const Influencer = require('../models').TB_INFLUENCER;
const common = require('../config/common');


const router = express.Router();

router.get('/', (req, res) => {
  const { token, id } = req.query;
  const userId = id || common.getIdFromToken(token).sub;

  Influencer.findOne({ where: { INF_ID: userId } }).then((result) => {
    res.json({
      code: 200,
      data: result.dataValues,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/getInstaAccounts', (req, res) => {
  const { id } = req.query;

  Influencer.findOne({ where: { INF_ID: id } }).then((result) => {
    const { INF_TOKEN } = result.dataValues;
    const pagesUrl = `https://graph.facebook.com/v6.0/me/accounts?access_token=${INF_TOKEN}`;
    const businessAccs = [];


    request.get(pagesUrl, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        const pages = JSON.parse(body).data;
        pages.map((item) => {
          const instaAccUrl = `https://graph.facebook.com/v6.0/${item.id}?fields=instagram_business_account&access_token=${INF_TOKEN}`;
          request.get(instaAccUrl, (err2, response2, body2) => {
            const account = JSON.parse(body2);
            if (account.instagram_business_account) {
              const instaInfoUrl = `https://graph.facebook.com/v6.0/${account.instagram_business_account.id}?fields=profile_picture_url%2Cusername&access_token=${INF_TOKEN}`;
              request.get(instaInfoUrl, (err3, response3, body3) => {
                const accountInfo = JSON.parse(body3);
                businessAccs.push({ id: accountInfo.id, picture: accountInfo.profile_picture_url, username: accountInfo.username });
              });
            }
          });
        });
        setTimeout(() => {
          res.json({
            code: 200,
            // data: JSON.parse(body).data,
            data: businessAccs,
            info: {
              name: result.dataValues.INF_NAME,
              email: result.dataValues.INF_EMAIL
            }
          });
        }, 1500);
      }
    });

    /* request.get(pagesUrl, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        const pages = JSON.parse(body).data;
        async.map(pages, (item, callback) => {
          const instaAccUrl = `https://graph.facebook.com/v6.0/${item.id}?fields=instagram_business_account&access_token=${INF_TOKEN}`;
          request.get(instaAccUrl, (error, response, body) => {
            if (!error && response.statusCode == 200) {
              const parsedBody = JSON.parse(body);
              callback(null, parsedBody);
            } else {
              callback(error || response.statusCode);
            }
          });
        }, (err, results) => {
          if (err) {
            console.log(err);
          } else {
            res.json({
              code: 200,
              // data: JSON.parse(body).data,
              data: results,
            });
          }
        });
      }
    }); */
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

router.get('/getInstaInfo', (req, res) => {
  const { token } = req.query;
  const userId = common.getIdFromToken(token).sub;

  Influencer.findOne({ where: { INF_ID: userId } }).then((result) => {
    const { INF_INST_ID, INF_TOKEN } = result.dataValues;
    const instaDataUrl = `https://graph.facebook.com/v6.0/${INF_INST_ID}?`
      + 'fields='
      + 'followers_count%2C'
      + 'follows_count%2C'
      + 'media_count%2C'
      + 'media%2C'
      + 'username%2C'
      + 'profile_picture_url%2C'
      + 'name&'
      + `access_token=${INF_TOKEN}`;

    request.get(instaDataUrl, (error, response, body) => {
      res.json({
        code: 200,
        data: JSON.parse(body),
      });
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
      // + 'client_id=139193384125564&'
      // + 'client_secret=085e5020f9b2cdac9357bf7301f31e01&'  //using fbsecret
      + `client_id=${config.fb_client_id}&`
      + `client_secret=${config.fb_client_secret}&`  //using fbsecret
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

router.post('/instaSignUp', (req, res) => {
  const data = req.body;
  const { facebookToken, facebookUserId } = data;
  let longToken;

  const longTokenUrl = 'https://graph.facebook.com/v6.0/oauth/access_token?'
      + 'grant_type=fb_exchange_token&'
      /*+ 'client_id=139193384125564&'
      + 'client_secret=085e5020f9b2cdac9357bf7301f31e01&'  //using fbsecret*/
      + `client_id=${config.fb_client_id}&`
      + `client_secret=${config.fb_client_secret}&`  //using fbsecret
      + `fb_exchange_token=${facebookToken}`;

  const myInfoUrl = 'https://graph.facebook.com/v6.0/me?fields=email%2Cname&'
      + `access_token=${facebookToken}`;

  const pageLongToken = `https://graph.facebook.com/v6.0/${facebookUserId}/accounts?`
      + `access_token=${longToken}`;

  request.get(longTokenUrl, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      longToken = (JSON.parse(body)).access_token;
      const post = {
        INF_TOKEN: longToken
      };

      request.get(myInfoUrl, (error2, response2, body2) => {
        if (!error2 && response2.statusCode == 200) {
          // todo: find page long token api option for special fb page
          const userData = JSON.parse(response2.body);

          Influencer.findOne({ where: { INF_REG_ID: userData.id } }).then((result) => {
            post.INF_REG_ID = userData.id;
            post.INF_NAME = userData.name;
            post.INF_EMAIL = userData.email;
            if (!result) {
              Influencer.create(post).then((result2) => {
                res.json({
                  code: 200,
                  userId: result2.dataValues.INF_ID,
                  userToken: common.createToken(result2.dataValues.INF_ID),
                  userName: result2.dataValues.INF_NAME,
                  social_type: 'facebook'
                });
              });
            } else {
              Influencer.update(post, {
                where: { INF_ID: userData.id }
              }).then((result3) => {
                res.json({
                  code: 200,
                  userId: result.dataValues.INF_ID,
                  userToken: common.createToken(result.dataValues.INF_ID),
                  userName: result.dataValues.INF_NAME,
                  social_type: 'facebook'
                });
              });
            }
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

router.post('/instaUpdate', (req, res) => {
  const data = req.body;
  const { id } = data;

  const post = {
    INF_NAME: data.nickName,
    INF_TEL: data.phone,
    INF_CITY: data.country,
    INF_AREA: data.region,
    INF_PROD: data.product,
    INF_INST_ID: data.instaAccount
  };

  Influencer.update(post, {
    where: { INF_ID: id }
  }).then((result) => {
    res.json({
      code: 200
    });
  });
});

module.exports = router;
