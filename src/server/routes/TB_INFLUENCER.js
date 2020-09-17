const express = require('express');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const request = require('request');
// const Promise = require('bluebird');
const async = require('async');
const { google } = require('googleapis');

const { asyncMiddleware } = require('../config/common');
const config = require('../config/config');
const configKey = require('../config/config');
const Influencer = require('../models').TB_INFLUENCER;
const Youtube = require('../models').TB_YOUTUBE;
const Notification = require('../models').TB_NOTIFICATION;
const Instagram = require('../models').TB_INSTA;
const common = require('../config/common');
const testData = require('../config/testData');


const router = express.Router();

function getOauthClient() {
  const oauth2Client = new google.auth.OAuth2(
    configKey.google_client_id,
    configKey.google_client_secret,
    configKey.google_client_redirect_url
  );
  return oauth2Client;
}

function getBlogType(blogType) {
  let social;
  switch (blogType) {
    case '1': {
      social = 'facebook';
      break;
    }
    case '2': {
      social = 'google';
      break;
    }
    case '3': {
      social = 'naver';
      break;
    }
    case '4': {
      social = 'twitch';
      break;
    }
  }
  return social;
}

function YoutubeRequest(data) {

}

router.get('/', (req, res) => {
  const { token, id, col } = req.query;
  const userId = id || common.getIdFromToken(token).sub;
  const options = {
    where: { INF_ID: userId }
  };

  if (col && col === 'nickName') options.attributes = ['INF_NAME'];
  if (col && col === 'phone') options.attributes = ['INF_TEL'];
  if (col && col === 'country') options.attributes = ['INF_CITY'];
  if (col && col === 'region') options.attributes = ['INF_AREA'];
  if (col && col === 'product') options.attributes = ['INF_PROD'];
  if (col && col === 'country region') options.attributes = ['INF_CITY', 'INF_AREA'];

  Influencer.findOne(options).then((result) => {
    res.json({
      code: 200,
      data: result.dataValues,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/userInfo', (req, res) => {
  const { token, id } = req.query;
  const userId = id || common.getIdFromToken(token).sub;

  Influencer.findOne({
    where: { INF_ID: userId },
    attributes: ['INF_EMAIL', 'INF_NAME', 'INF_TEL', 'INF_BLOG_TYPE', 'INF_REF_TOKEN', 'INF_TOKEN', 'INF_INST_ID', 'INF_COUNTRY', 'INF_CITY', 'INF_AREA', 'INF_PROD', 'INF_MESSAGE']
  }).then((result) => {
    if (result.INF_INST_ID) {
      const instaInfoUrl = `https://graph.facebook.com/v6.0/${result.INF_INST_ID}?fields=username&access_token=${result.INF_TOKEN}`;
      request.get(instaInfoUrl, (err3, response3, body3) => {
        const accountInfo = JSON.parse(body3);
        res.json({
          code: 200,
          data: result.dataValues,
          instaInfo: accountInfo
        });
      });
    } else {
      res.json({
        code: 200,
        data: result,
      });
    }
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/userId', (req, res) => {
  const { token, id } = req.query;
  const userId = id || common.getIdFromToken(token).sub;

  res.json({
    code: 200,
    data: { userId },
  });
});

router.get('/getInstaAccounts', (req, res) => {
  const { id } = req.query;

  Influencer.findOne({
    where: { INF_ID: id },
    attributes: ['INF_ID', 'INF_NAME', 'INF_EMAIL', 'INF_TOKEN', 'INF_BLOG_TYPE']
  }).then((result) => {
    const { INF_TOKEN, INF_BLOG_TYPE } = result.dataValues;
    if (INF_BLOG_TYPE === '1') {
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
    } else {
      res.json({
        code: 200,
        info: {
          name: result.dataValues.INF_NAME,
          email: result.dataValues.INF_EMAIL,
          blogType: result.dataValues.INF_BLOG_TYPE
        }
      });
    }


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
  const data = req.query;
  const offset = (data.page - 1) * 10;
  Influencer.findAndCountAll({
    attributes: ['INF_ID', 'INF_NAME', 'INF_TEL', 'INF_EMAIL',
      [Sequelize.literal('CASE INF_BLOG_TYPE WHEN \'1\' THEN \'Instagram\' WHEN \'2\' THEN \'Youtube\' ELSE \'Naver\' END'), 'INF_BLOG_TYPE'],
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('INF_DT'), '%Y-%m-%d'), 'INF_DT']],
    limit: 10,
    offset,
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
  let resObj = {};

  Influencer.findOne({ where: { INF_ID: userId } }).then((result) => {
    const { INF_INST_ID, INF_TOKEN } = result.dataValues;
    const instaDataUrl = `https://graph.facebook.com/v6.0/${INF_INST_ID}?`
      + 'fields='
      + 'followers_count%2C'
      + 'follows_count%2C'
      + 'media_count%2C'
      + 'username%2C'
      + 'profile_picture_url%2C'
      + 'name&'
      + `access_token=${INF_TOKEN}`;

    const instaMediaDataUrl = `https://graph.facebook.com/v6.0/${INF_INST_ID}/media?`
        + 'fields='
        + 'thumbnail_url%2C'
        + 'media_url&'
        + `access_token=${INF_TOKEN}`;

    request.get(instaDataUrl, (error, response, body) => {
      resObj = { ...resObj, ...(JSON.parse(body)) };
      request.get(instaMediaDataUrl, (error2, response2, body2) => {
        resObj = { ...resObj, media: JSON.parse(body2).data };
        res.json({
          code: 200,
          data: resObj,
        });
      });
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.post('/updateInfo', (req, res) => {
  const data = req.body;
  const userId = common.getIdFromToken(data.token).sub;
  const {
    channel, nickName, phone, country, region, product, message
  } = data;

  const post = {};

  if (nickName) post.INF_NAME = nickName;
  if (phone) post.INF_TEL = phone;
  if (country) post.INF_CITY = country;
  if (region) post.INF_AREA = region;
  if (product) post.INF_PROD = product;
  if (message === 0 || message === 1) post.INF_MESSAGE = message;
  if (channel) {
    post.INF_CHANNEL = JSON.stringify(channel);
  }

  Influencer.update(post, {
    where: { INF_ID: userId }
  }).then((result) => {
    /* console.log(message.get({
          plain: true
        })); */
    res.json({
      code: 200,
      data: result
    });
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
      + `client_secret=${config.fb_client_secret}&` // using fbsecret
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
  console.log('instaSignup');
  const data = req.body;
  const { facebookToken, facebookUserId } = data;
  let longToken;

  const longTokenUrl = 'https://graph.facebook.com/v6.0/oauth/access_token?'
      + 'grant_type=fb_exchange_token&'
      /* + 'client_id=139193384125564&'
      + 'client_secret=085e5020f9b2cdac9357bf7301f31e01&'  //using fbsecret */
      + `client_id=${config.fb_client_id}&`
      + `client_secret=${config.fb_client_secret}&` // using fbsecret
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
            if (!result) {
              post.INF_REG_ID = userData.id;
              post.INF_NAME = userData.name;
              post.INF_EMAIL = userData.email;
              post.INF_BLOG_TYPE = '1';
              Influencer.create(post).then((result2) => {
                res.json({
                  code: 200,
                  userId: result2.dataValues.INF_ID,
                  userToken: common.createToken(result2.dataValues.INF_ID),
                  userName: result2.dataValues.INF_NAME,
                  userPhone: result2.dataValues.INF_TEL,
                  social_type: getBlogType(result2.dataValues.INF_BLOG_TYPE)
                });
              });
            } else {
              const blogType = result.dataValues.INF_BLOG_TYPE;
              Influencer.update(post, {
                where: { INF_REG_ID: userData.id }
              }).then((result3) => {
                res.json({
                  code: 200,
                  userId: result.dataValues.INF_ID,
                  userToken: common.createToken(result.dataValues.INF_ID),
                  userName: result.dataValues.INF_NAME,
                  userPhone: result.dataValues.INF_TEL,
                  social_type: getBlogType(blogType)
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

router.post('/instaUpdate', asyncMiddleware(
  async (req, res) => {
    const data = req.body;
    const {
      id, instaAccount, blogUrl, nickName, phone, country, region, product
    } = data;

    const post = {
      INF_NAME: nickName,
      INF_TEL: phone,
      INF_CITY: country,
      INF_AREA: region,
      INF_PROD: product
    };
    if (instaAccount) post.INF_INST_ID = instaAccount;
    if (blogUrl) post.INF_BLOG_URL = blogUrl;


    Influencer.update(post, { where: { INF_ID: id } });

    const InfluencerData = await Influencer.findOne({ where: { INF_ID: id } });
    const {
      INF_ID, INF_NAME, INF_TEL, INF_BLOG_TYPE, INF_TOKEN
    } = InfluencerData;
    const successResponse = {
      code: 200,
      userId: INF_ID,
      userToken: common.createToken(INF_ID),
      userName: INF_NAME,
      userPhone: INF_TEL,
      social_type: getBlogType(INF_BLOG_TYPE)
    };

    if (instaAccount) {
      try {
        const instagramData = await common.getInstagramData(instaAccount, INF_TOKEN);
        const {
          follows_count, followers_count, media_count, username, name, profile_picture_url
        } = instagramData;
        const instaAccountExist = await Instagram.findOne({ where: { INF_ID: id } });
        if (instaAccountExist) {
          Instagram.update({
            INS_TOKEN: INF_TOKEN,
            INS_ACCOUNT_ID: instaAccount,
            INS_FLW: follows_count,
            INS_FLWR: followers_count,
            INS_NAME: name,
            INS_USERNAME: username,
            INS_MEDIA_CNT: media_count,
            INS_PROFILE_IMG: profile_picture_url
          }, {
            where: { INF_ID: id }
          }).then((result4) => {
            res.json(successResponse);
          });
        } else {
          Instagram.create({
            INF_ID: id,
            INS_TOKEN: INF_TOKEN,
            INS_ACCOUNT_ID: instaAccount,
            INS_FLW: follows_count,
            INS_FLWR: followers_count,
            INS_NAME: name,
            INS_USERNAME: username,
            INS_MEDIA_CNT: media_count,
            INS_PROFILE_IMG: profile_picture_url
          }).then((result5) => {
            res.json(successResponse);
          });
        }
      } catch (err) {
        res.json({
          code: 400,
          error: err
        });
      }
    } else {
      res.json(successResponse);
    }
  }
));

router.get('/youtubeSignUp', (req, res) => {
  const data = req.query;
  const { code } = data;
  console.log(code);

  const oauth2Client = getOauthClient();

  oauth2Client.getToken(code, (err, tokens) => {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (!err) {
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2('v2');

      oauth2.userinfo.get(
        {
          auth: oauth2Client,
          alt: 'json',
        }, (err, response) => {
          const { name, email, id } = response.data;
          const { refresh_token } = tokens;

          if (err) {
            console.log(`The API returned an error: ${err}`);
          } else {
            Influencer.findOne({ where: { INF_REG_ID: id } }).then((result) => {
              if (!result) {
                Influencer.create({
                  INF_NAME: name,
                  INF_EMAIL: email,
                  INF_REG_ID: id,
                  INF_BLOG_TYPE: '2',
                  // INF_REF_TOKEN: refresh_token,
                }).then((result2) => {
                  const { INF_ID, INF_NAME, INF_TEL } = result2.dataValues;
                  common.YoutubeDataRequest(refresh_token, INF_ID, (youtubeData) => {
                    const { viewCount, subscriberCount } = youtubeData.statistics;
                    Youtube.create({
                      INF_ID,
                      YOU_TOKEN: refresh_token,
                      YOU_SUBS: subscriberCount,
                      YOU_VIEWS: viewCount
                    }).then((result3) => {
                      res.json({
                        code: 200,
                        userId: INF_ID,
                        userToken: common.createToken(INF_ID),
                        userName: INF_NAME,
                        userPhone: INF_TEL,
                        social_type: getBlogType('2')
                      });
                    });
                  });
                  /* res.json({
                    code: 200,
                    userId: INF_ID,
                    userToken: common.createToken(INF_ID),
                    userName: INF_NAME,
                    userPhone: INF_TEL,
                    social_type: getBlogType('2')
                  }); */
                });
              } else {
                const {
                  INF_BLOG_TYPE, INF_ID, INF_NAME, INF_TEL
                } = result.dataValues;
                common.YoutubeDataRequest(refresh_token, INF_ID, (youtubeData) => {
                  const { viewCount, subscriberCount } = youtubeData.statistics;
                  Youtube.update({
                    YOU_TOKEN: refresh_token,
                    YOU_SUBS: subscriberCount,
                    YOU_VIEWS: viewCount
                  }, {
                    where: { INF_ID }
                  }).then((result4) => {
                    res.json({
                      code: 200,
                      userId: INF_ID,
                      userToken: common.createToken(INF_ID),
                      userName: INF_NAME,
                      userPhone: INF_TEL,
                      social_type: getBlogType(INF_BLOG_TYPE)
                    });
                  });
                });
              }
            });
          }
        }
      );
    } else {
      // res.redirect('http://localhost:3000');
      console.log(err);
    }
  });
});

router.get('/getYoutubeInfo', (req, res) => {
  const { token } = req.query;
  const userId = common.getIdFromToken(token).sub;
  const resObj = {};
  const oauth2Client = getOauthClient();
  const youtube = google.youtube('v3');
  const oauth2 = google.oauth2('v2');

  Influencer.findOne({ where: { INF_ID: userId } }).then((result) => {
    const { INF_REF_TOKEN } = result.dataValues;
    oauth2Client.setCredentials({
      refresh_token: INF_REF_TOKEN
    });

    /* youtube.subscriptions.list({
      auth: oauth2Client,
      part: 'id',
      mySubscribers: true
    }, (err, response) => {
      if (err) {
        console.log(`The API returned an error: ${err}`);
        res.json({
          code: 400,
          data: err
        });
      } else {
        res.json({
          code: 200,
          data: response.data
        });
      } */

    youtube.channels.list({
      auth: oauth2Client,
      part: 'snippet, contentDetails, statistics',
      // part: 'id',
      mine: true,
      quotaUser: `secretquotastring${userId}`,
      // mySubscribers: true
    }, (err, response) => {
      if (err) {
        console.log(`The API returned an error: ${err}`);
        return;
      }
      const channels = response.data.items;
      if (channels.length == 0) {
        console.log('No channel found.');
        res.json({
          code: 200,
          data: response.data
        });
      } else {
        res.json({
          code: 200,
          data: response.data
        });
        /* console.log('This channel\'s ID is %s. Its title is \'%s\', and '
              + 'it has %s views.',
          channels[0].id,
          channels[0].snippet.title,
          channels[0].statistics.viewCount); */
      }
    });

    // refresh token get
    /* request.post('https://oauth2.googleapis.com/token',
      {
        form: {
          client_id: configKey.google_client_id,
          client_secret: configKey.google_client_secret,
          refresh_token: INF_REF_TOKEN,
          grant_type: 'refresh_token'
        }
      },
      (error, requestResponse, responseBody) => {
        if (!error && requestResponse.statusCode == 200) {
          res.json({
            code: 200,
            data: JSON.parse(responseBody)
          });
        } else if (requestResponse != null) {
          console.log(`error = ${requestResponse.statusCode}`);
          console.log(`error = ${error}`);
        }
      }); */
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/naverSignUp', (req, res) => {
  const data = req.query;
  const { email, naverId, name } = data;

  Influencer.findOne({
    where: { INF_REG_ID: naverId, INF_BLOG_TYPE: '3' },
    attributes: ['INF_ID', 'INF_NAME', 'INF_TEL',
      [Sequelize.literal('CASE INF_BLOG_TYPE WHEN \'1\' THEN \'facebook\' WHEN \'2\' THEN \'google\' WHEN \'3\' THEN \'naver\' ELSE \'twitch\' END'), 'INF_BLOG_TYPE'],
    ]
  }).then((result) => {
    if (!result) {
      Influencer.create({
        INF_NAME: name,
        INF_EMAIL: email,
        INF_REG_ID: naverId,
        INF_BLOG_TYPE: '3',
      }).then((result2) => {
        res.json({
          code: 200,
          userId: result2.dataValues.INF_ID,
          userToken: common.createToken(result2.dataValues.INF_ID),
          userName: result2.dataValues.INF_NAME,
          userPhone: result2.dataValues.INF_TEL,
          social_type: 'naver'
        });
      });
    } else {
      res.json({
        code: 200,
        userId: result.dataValues.INF_ID,
        userToken: common.createToken(result.dataValues.INF_ID),
        userName: result.dataValues.INF_NAME,
        userPhone: result.dataValues.INF_TEL,
        social_type: result.dataValues.INF_BLOG_TYPE,
      });
    }
  });
});

router.get('/naverSignUpTest', (req, res) => {
  const data = req.query;
  const { code, state } = data;
  console.log(code, state);

  const url = 'https://nid.naver.com/oauth2.0/token?'
      + 'grant_type=authorization_code&'
      + 'client_id=4rBF5bJ4y2jKn0gHoSCf&'
      + 'client_secret=AOIyRQ5l6Q&'
      + `code=${code}&`
      + `state=${state}`;

  request.get(url, (error, response, body) => {
    const resData = JSON.parse(body);
    const { access_token, refresh_token } = resData;
    const header = `Bearer ${access_token}`;
    // const api_url = 'https://openapi.naver.com/v1/nid/me';
    const api_url = 'https://openapi.naver.com/blog/listCategory';
    const options = {
      url: api_url,
      headers: { Authorization: header }
    };

    request.get(options, (error2, response2, body2) => {
      if (!error && response2.statusCode == 200) {
        const userData = JSON.parse(body2).response;
        res.json({
          code: 200,
          data: userData
        });
        /* Influencer.create({
          INF_NAME: userData.name,
          INF_EMAIL: userData.email,
          INF_REG_ID: userData.id,
          INF_BLOG_TYPE: '3',
          INF_REF_TOKEN: refresh_token,
        }).then((result2) => {
          res.json({
            code: 200,
            userId: result2.dataValues.INF_ID,
            userToken: common.createToken(result2.dataValues.INF_ID),
            userName: result2.dataValues.INF_NAME,
            userPhone: result2.dataValues.INF_TEL,
            social_type: getBlogType('3')
          });
        }); */
      } else {
        console.log('error');
      }
    });
  });
});

router.get('/rankInstagram', (req, res) => {
  const { type } = req.query;

  Influencer.findAll({
    where: { INF_BLOG_TYPE: type },
    attributes: ['INF_ID', 'INF_NAME', 'INF_EMAIL', 'INF_TOKEN', 'INF_INST_ID', 'INF_DT']
  }).then((result) => {
    common.instaRequest(result, (err, sortedArray) => {
      if (err) {
        res.json({
          code: 401,
          message: err
        });
      } else {
        res.json({
          code: 200,
          data: sortedArray
        });
      }
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/getInstagramRequests', (req, res) => {
  const { type, adId } = req.query;

  Notification.findAll({
    where: { NOTI_STATE: ['1', '4'], AD_ID: adId },
    attributes: ['NOTI_ID', 'NOTI_STATE'],
    include: [
      {
        model: Influencer,
        attributes: ['INF_ID', 'INF_NAME', 'INF_EMAIL', 'INF_TOKEN', 'INF_INST_ID', 'INF_DT']
      },
    ],
  }).then((result) => {
    common.instaRequest(result, (err, sortedArray) => {
      if (err) {
        res.json({
          code: 401,
          message: err
        });
      } else {
        res.json({
          code: 200,
          data: sortedArray
        });
      }
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/rankYoutube', (req, res) => {
  const { type } = req.query;

  const oauth2Client = getOauthClient();
  const youtube = google.youtube('v3');

  Influencer.findAll({
    where: { INF_BLOG_TYPE: type },
    attributes: ['INF_ID', 'INF_NAME', 'INF_EMAIL', 'INF_REF_TOKEN', 'INF_DT']
  }).then((result) => {
    async.map(result, (item, callback) => {
      const { INF_REF_TOKEN, INF_ID } = item.dataValues;
      oauth2Client.setCredentials({
        refresh_token: INF_REF_TOKEN
      });

      try {
        youtube.channels.list({
          auth: oauth2Client,
          part: 'snippet, statistics',
          mine: true,
          fields: 'items(snippet(title,description), statistics(viewCount, subscriberCount,videoCount))',
          quotaUser: `secretquotastring${INF_ID}`,
        }, (err, response) => {
          if (err) {
            callback(err || response.statusCode);
          }
          const info = response.data.items;
          if (info.length == 0) {
            console.log('No channel found.');
            callback(null, response.data);
          } else {
            callback(null, info[0]);
          }
        });
      } catch (e) {
        console.log(e);
      }
    }, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const sortedArray = results.sort((a, b) => {
          if (parseInt(a.statistics.subscriberCount, 10) < parseInt(b.statistics.subscriberCount, 10)) {
            return 1;
          }
          if (parseInt(a.statistics.subscriberCount, 10) > parseInt(b.statistics.subscriberCount, 10)) {
            return -1;
          }
          return 0;
        });

        res.json({
          code: 200,
          // data: JSON.parse(body).data,
          data: sortedArray
        });
      }
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/test', (req, res) => {
  const oauth2Client = getOauthClient();
  const youtube = google.youtube('v3');

  const INF_REF_TOKEN = '1//0e6yP7bFZ4ScGCgYIARAAGA4SNwF-L9Ir6I5IUOom6YWt2Dvljz325otOTVO2pzWSEuy4_czsL0X6Z1BA1VOYdNrGXV2H-Ydz5B4';

  oauth2Client.setCredentials({
    refresh_token: INF_REF_TOKEN
  });
  youtube.channels.list({
    auth: oauth2Client,
    part: 'snippet, statistics',
    mine: true,
    fields: 'items(snippet(title,description), statistics(viewCount, subscriberCount,videoCount))',
    quotaUser: 'secretquotastring',
    // mySubscribers: true
  }, (err, response) => {
    if (err) {
      res.json({
        code: response.statusCode,
        message: err
      });
    }
    const channels = response.data.items;
    if (channels.length == 0) {
      res.json({
        code: 200,
        message: response.data
      });
      console.log('No channel found.');
    } else {
      res.json({
        code: 200,
        message: response.data
      });
    }
  });
});


module.exports = router;
