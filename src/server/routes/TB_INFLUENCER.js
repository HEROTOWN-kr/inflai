const express = require('express');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const request = require('request');
// const Promise = require('bluebird');
const async = require('async');
const { google } = require('googleapis');

const config = require('../config/config');
const configKey = require('../config/config');
const Influencer = require('../models').TB_INFLUENCER;
const Notification = require('../models').TB_NOTIFICATION;
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

router.get('/userInfo', (req, res) => {
  const { token, id } = req.query;
  const userId = id || common.getIdFromToken(token).sub;

  Influencer.findOne({
    where: { INF_ID: userId },
    attributes: ['INF_EMAIL', 'INF_NAME', 'INF_TEL', 'INF_BLOG_TYPE', 'INF_TOKEN', 'INF_INST_ID', 'INF_COUNTRY', 'INF_CITY', 'INF_AREA', 'INF_PROD']
  }).then((result) => {
    const instaInfoUrl = `https://graph.facebook.com/v6.0/${result.INF_INST_ID}?fields=username&access_token=${result.INF_TOKEN}`;
    request.get(instaInfoUrl, (err3, response3, body3) => {
      const accountInfo = JSON.parse(body3);
      res.json({
        code: 200,
        data: result.dataValues,
        instaInfo: accountInfo
      });
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/getInstaAccounts', (req, res) => {
  const { id } = req.query;

  Influencer.findOne({ where: { INF_ID: id } }).then((result) => {
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
          email: result.dataValues.INF_EMAIL
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
  Influencer.findAll({
    attributes: ['INF_ID', 'INF_NAME', 'INF_TEL', 'INF_EMAIL',
      [Sequelize.literal('CASE INF_BLOG_TYPE WHEN \'1\' THEN \'Instagram\' WHEN \'2\' THEN \'Youtube\' ELSE \'Naver\' END'), 'INF_BLOG_TYPE'],
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('INF_DT'), '%Y-%m-%d'), 'INF_DT']],
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

router.post('/instaUpdate', (req, res) => {
  const data = req.body;
  const { id } = data;

  const post = {
    INF_NAME: data.nickName,
    INF_TEL: data.phone,
    INF_CITY: data.country,
    INF_AREA: data.region,
    INF_PROD: data.product
  };

  if (data.instaAccount) post.INF_INST_ID = data.instaAccount;

  Influencer.update(post, {
    where: { INF_ID: id },
  }).then((result) => {
    if (result) {
      Influencer.findOne({ where: { INF_ID: id } }).then((result2) => {
        const blogType = result2.dataValues.INF_BLOG_TYPE;
        res.json({
          code: 200,
          userId: result2.dataValues.INF_ID,
          userToken: common.createToken(result2.dataValues.INF_ID),
          userName: result2.dataValues.INF_NAME,
          userPhone: result2.dataValues.INF_TEL,
          social_type: getBlogType(blogType)
        });
      });
    }
  });
});

router.get('/youtubeSignUp', (req, res) => {
  const data = req.query;
  const { code } = data;
  console.log(code);

  const oauth2Client = getOauthClient();

  oauth2Client.getToken(code, (err, tokens) => {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (!err) {
      oauth2Client.setCredentials(tokens);

      const youtube = google.youtube('v3');
      const oauth2 = google.oauth2('v2');

      /* Influenser.create({
        INF_REF_TOKEN: tokens.refresh_token,
      }).then((result) => {
        res.json({
          code: 200,
          userToken: common.createToken(result.dataValues.INF_ID),
          userName: result.dataValues.INF_NAME,
        });
      }); */
      /* service.channels.list({
        auth: oauth2Client,
        part: 'id',
        mySubscribers: true
      }, (err, response) => {
        if (err) {
          console.log(`The API returned an error: ${err}`);
          return;
        }
        const channels = response.data.items;
        if (channels.length == 0) {
          console.log('No channel found.');
        } else {
          /!*console.log('This channel\'s ID is %s. Its title is \'%s\', and '
              + 'it has %s views.',
          channels[0].id,
          channels[0].snippet.title,
          channels[0].statistics.viewCount);*!/
        }
      }); */

      /* youtube.subscriptions.list({
        auth: oauth2Client,
        part: 'id',
        mySubscribers: true
      }, (err, response) => {
        if (err) {
          console.log(`The API returned an error: ${err}`);
          return;
        }
        const channels = response.data.items;
        if (channels.length == 0) {
          console.log('No channel found.');
        } else {

        }
      }); */

      oauth2.userinfo.get(
        {
          auth: oauth2Client,
          alt: 'json',
        }, (err, response) => {
          if (err) {
            console.log(`The API returned an error: ${err}`);
          } else {
            Influencer.findOne({ where: { INF_REG_ID: response.data.id } }).then((result) => {
              if (!result) {
                Influencer.create({
                  INF_NAME: response.data.name,
                  INF_EMAIL: response.data.email,
                  INF_REG_ID: response.data.id,
                  INF_BLOG_TYPE: '2',
                  INF_REF_TOKEN: tokens.refresh_token,
                }).then((result2) => {
                  res.json({
                    code: 200,
                    userId: result2.dataValues.INF_ID,
                    userToken: common.createToken(result2.dataValues.INF_ID),
                    userName: result2.dataValues.INF_NAME,
                    userPhone: result2.dataValues.INF_TEL,
                    social_type: getBlogType('2')
                  });
                });
              } else {
                const blogType = result.dataValues.INF_BLOG_TYPE;
                const user_id = result.dataValues.INF_ID;
                Influencer.update({ INF_REF_TOKEN: tokens.refresh_token }, {
                  where: { INF_ID: user_id }
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
        }
      );

      // session["tokens"] = tokens;
    } else {
      // res.redirect('http://localhost:3000');
      console.log(err);
    }
  });

  // const { tokens } = oauth2Client.getToken(code);

  /* oauth2Client.setCredentials(tokens);


  oauth2Client.on('tokens', (token) => {
    if (token.refresh_token) {
      // store the refresh_token in my database!
      console.log(token.refresh_token);
    }
    console.log(token.access_token);
  }); */

  // res.redirect('http://localhost:3000');
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
