const express = require('express');
const jwt = require('jsonwebtoken');
const request = require('request');
const bcrypt = require('bcryptjs');
const { google } = require('googleapis');

const config = require('../config');
const configKey = require('../config/config');
const Advertiser = require('../models').TB_ADVERTISER;
const Influenser = require('../models').TB_INFLUENCER;
const common = require('../config/common');

const saltRounds = 10;

const router = express.Router();

function getOauthClient() {
  const oauth2Client = new google.auth.OAuth2(
    configKey.google_client_id,
    configKey.google_client_secret,
    configKey.google_client_redirect_url
  );
  return oauth2Client;
}

router.get('/test2', (req, res) => {
  /* res.json({
    code: 200,
    message: 'success'
  }); */

  const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI4Yjc0MWU4ZGU5ODRhNDcxNTlmMTllNmQ3NzgzZTlkNGZhODEwZGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTk3Mjc0NDIyNzI1LWdiNDBvNXR2NTc5Y3NyMDljaDdxOGFuNjN0Zm1qZ2ZvLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTk3Mjc0NDIyNzI1LWdiNDBvNXR2NTc5Y3NyMDljaDdxOGFuNjN0Zm1qZ2ZvLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA5NTA0MzM5NzIxNDY4NjkyMzc2IiwiZW1haWwiOiJhbmRyaWFudHNveUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkN3M0tNTEN5OXByZFVaRFQxUUhIbEEiLCJuYW1lIjoi0JDQvdC00YDQuNCw0L0g0KbQvtC5IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdpX3J0MThrY1p4VkRmS05GSWFSU1dUcVdBMDk2SHIyamFNbzhJZ2d3PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6ItCQ0L3QtNGA0LjQsNC9IiwiZmFtaWx5X25hbWUiOiLQptC-0LkiLCJsb2NhbGUiOiJydSIsImlhdCI6MTU4ODA1OTIzMSwiZXhwIjoxNTg4MDYyODMxLCJqdGkiOiJiYjI4NDcxOGUzYTllYTkzZGI2ZmE0MjJkYmRmNDBiZTA0NGY0MzkzIn0.vwKxJ7V-RW4fK8M9oZqNlcyDZASZEl00cRNbXroVW-yt1JlApa56N80HmUZ5CVt5Y-dxdnmBh32J42_CGTs_BwXx827G6cdfAGm9sqx4gmjw7da2GZcl-NBDxEUuGkC_FuVbfxYCrRLAJB7mcCLxvlRY6LeMRu8pX8jhT2QnhOOFxauFlKGpmy2U4BULPyNZtPZ76F7v-YkYhQWijjW8MjsX_0KzH6AMRqF4lF-ZoC1nLXLs4AFTJYm9lIjRzYM6-PNXNIQZo6ofLJexKuhxdtle2feryoT-LvkjozwsRJmjq0lXJu75G6hN3KPozQyWArUzqWMgPUivlQEfOVbvhQ';
  const apiKey = 'AIzaSyArMk2Jue1FRfkT29_vVZ4qhLBvQpbJaOQ';

  const myUrl = `https://www.googleapis.com/youtube/v3/subscriptions?part=id&mySubscribers=true&key=${apiKey}`;

  const options = {
    method: 'GET',
    url: myUrl,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    },
    gzip: true
  };


  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      console.log(requestResponse);
    } else if (requestResponse != null) {
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
});

router.get('/test', (req, res) => {
  /* res.json({
    code: 200,
    message: 'success'
  }); */

  const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI4Yjc0MWU4ZGU5ODRhNDcxNTlmMTllNmQ3NzgzZTlkNGZhODEwZGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTk3Mjc0NDIyNzI1LWdiNDBvNXR2NTc5Y3NyMDljaDdxOGFuNjN0Zm1qZ2ZvLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTk3Mjc0NDIyNzI1LWdiNDBvNXR2NTc5Y3NyMDljaDdxOGFuNjN0Zm1qZ2ZvLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA5NTA0MzM5NzIxNDY4NjkyMzc2IiwiZW1haWwiOiJhbmRyaWFudHNveUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkN3M0tNTEN5OXByZFVaRFQxUUhIbEEiLCJuYW1lIjoi0JDQvdC00YDQuNCw0L0g0KbQvtC5IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdpX3J0MThrY1p4VkRmS05GSWFSU1dUcVdBMDk2SHIyamFNbzhJZ2d3PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6ItCQ0L3QtNGA0LjQsNC9IiwiZmFtaWx5X25hbWUiOiLQptC-0LkiLCJsb2NhbGUiOiJydSIsImlhdCI6MTU4ODA1OTIzMSwiZXhwIjoxNTg4MDYyODMxLCJqdGkiOiJiYjI4NDcxOGUzYTllYTkzZGI2ZmE0MjJkYmRmNDBiZTA0NGY0MzkzIn0.vwKxJ7V-RW4fK8M9oZqNlcyDZASZEl00cRNbXroVW-yt1JlApa56N80HmUZ5CVt5Y-dxdnmBh32J42_CGTs_BwXx827G6cdfAGm9sqx4gmjw7da2GZcl-NBDxEUuGkC_FuVbfxYCrRLAJB7mcCLxvlRY6LeMRu8pX8jhT2QnhOOFxauFlKGpmy2U4BULPyNZtPZ76F7v-YkYhQWijjW8MjsX_0KzH6AMRqF4lF-ZoC1nLXLs4AFTJYm9lIjRzYM6-PNXNIQZo6ofLJexKuhxdtle2feryoT-LvkjozwsRJmjq0lXJu75G6hN3KPozQyWArUzqWMgPUivlQEfOVbvhQ';
  const apiKey = 'AIzaSyArMk2Jue1FRfkT29_vVZ4qhLBvQpbJaOQ';

  const myUrl = `https://www.googleapis.com/youtube/v3/subscriptions?part=id&mySubscribers=true&key=${apiKey}`;

  const options = {
    method: 'GET',
    url: myUrl,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    },
    gzip: true
  };


  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      console.log(requestResponse);
    } else if (requestResponse != null) {
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
});

router.get('/Googletest3', (req, res) => {
  const oauth2Client = getOauthClient();

  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly'
  ];

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    // If you only need one scope you can pass it as a string
    scope: scopes
  });

  /* res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*'); */

  /* res.writeHead(301, {
    Location: url,
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  });
  res.end(); */

  res.redirect(url);
});

router.get('/Googletest1', (req, res) => {
  const data = req.query;
  const { code } = data;

  const oauth2Client = getOauthClient();

  oauth2Client.getToken(code, (err, tokens) => {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (!err) {
      oauth2Client.setCredentials(tokens);

      const youtube = google.youtube('v3');
      const oauth2 = google.oauth2('v2');

      oauth2.userinfo.get(
        {
          auth: oauth2Client,
          alt: 'json',
        }, (err, response) => {
          if (err) {
            console.log(`The API returned an error: ${err}`);
          } else {
            Influenser.create({
              INF_NAME: response.data.name,
              INF_EMAIL: response.data.email,
              INF_REG_ID: response.data.id,
              INF_REF_TOKEN: tokens.refresh_token,
            }).then((result) => {
              // res.redirect('http://localhost:3000');

              request.post('https://oauth2.googleapis.com/token',
                {
                  form: {
                    client_id: configKey.google_client_id,
                    client_secret: configKey.google_client_secret,
                    refresh_token: tokens.refresh_token,
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
                });
            });
          }
        }
      );

      // session["tokens"] = tokens;
    } else {
      // res.redirect('http://localhost:3000');
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

router.get('/', (req, res) => {
  const { token } = req.query;
  const userId = common.getIdFromToken(token).sub;

  Advertiser.findOne({ where: { ADV_ID: userId } }).then((result) => {
    res.json({
      code: 200,
      data: result.dataValues,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/getAdvertisers', (req, res) => {
  Advertiser.findAll({
    attributes: ['ADV_ID', 'ADV_NAME', 'ADV_TEL', 'ADV_EMAIL', 'ADV_COM_NAME', 'ADV_TYPE', 'ADV_DT'],
    order: [['ADV_ID', 'DESC']]
  }).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/naverTest', (req, res) => {
  const token = 'AAAAO7ObqHQmS2x-G4UYKZ4SDKDZnRVG_0xJLLZZ0FWqEraRQZLW4-jAv1qVlFzA_6WhL6Ilagtv5y3EVJmiTzuhhL4';
  const header = `Bearer ${token}`; // Bearer 다음에 공백 추가

  const apiUrl = 'https://openapi.naver.com/v1/nid/me';
  const options = {
    url: apiUrl,
    headers: { Authorization: header }
  };
  request.get(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
      /* res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
      res.end(body); */
    } else {
      console.log('error');
      if (response != null) {
        res.status(response.statusCode).end();
        console.log(`error = ${response.statusCode}`);
      }
    }
  });
});

router.get('/kakaoTest', (req, res) => {
  const { token } = req.query;
  const header = `Bearer ${token}`; // Bearer 다음에 공백 추가

  const apiUrl = 'https://kapi.kakao.com/v1/user/me';
  const options = {
    url: apiUrl,
    headers: { Authorization: header }
  };
  request.post(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      res.json(body);
      // res.json(JSON.parse(body));
      /* res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
      res.end(body); */
    } else {
      console.log('error');
      if (response != null) {
        res.status(response.statusCode).end();
        console.log(`error = ${response.statusCode}`);
      }
    }
  });
});

router.get('/test2', (req, res) => {
  console.log('getting all advertisers');
  Advertiser.findAll().then((result) => {
    res.json(result);
  });
});

router.get('/loginGoogle', (req, res) => {
  const { token, type, social_type } = req.query;
  const userInfo = jwt.decode(token);

  if (type === '1') {
    Advertiser.findOne({ where: { ADV_REG_ID: userInfo.sub } }).then((result) => {
      if (!result) {
        Advertiser.create({
          ADV_NAME: userInfo.name,
          ADV_EMAIL: userInfo.email,
          ADV_REG_ID: userInfo.sub
        }).then((result) => {
          res.json({
            code: 200,
            userToken: common.createToken(result.dataValues.ADV_ID),
            userName: result.dataValues.ADV_NAME,
            regState: result.dataValues.ADV_FULL_REG,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: common.createToken(result.dataValues.ADV_ID),
          userName: result.dataValues.ADV_NAME,
          regState: result.dataValues.ADV_FULL_REG,
          social_type
        });
      }
    }).error((err) => {
      res.send('error has occured');
    });
  } else {
    Influenser.findOne({ where: { INF_REG_ID: userInfo.sub } }).then((result) => {
      if (!result) {
        Influenser.create({
          INF_NAME: userInfo.name,
          INF_EMAIL: userInfo.email,
          INF_REG_ID: userInfo.sub
        }).then((result) => {
          res.json({
            code: 200,
            userToken: common.createToken(result.dataValues.INF_ID),
            userName: result.dataValues.INF_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: common.createToken(result.dataValues.INF_ID),
          userName: result.dataValues.INF_NAME,
          social_type
        });
      }
    }).error((err) => {
      res.send('error has occured');
    });
  }
});

router.get('/loginFacebook', (req, res) => {
  const {
    id, email, name, type, social_type
  } = req.query;

  const payload = {
    sub: id
  };

  const token = jwt.sign(payload, config.jwtSecret);


  if (type === '1') {
    Advertiser.findOne({ where: { ADV_REG_ID: id } }).then((result) => {
      if (!result) {
        Advertiser.create({
          ADV_NAME: name,
          ADV_EMAIL: email,
          ADV_REG_ID: id
        }).then((result) => {
          res.json({
            code: 200,
            userToken: common.createToken(result.dataValues.ADV_ID),
            userName: result.dataValues.ADV_NAME,
            regState: result.dataValues.ADV_FULL_REG,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: common.createToken(result.dataValues.ADV_ID),
          userName: result.dataValues.ADV_NAME,
          regState: result.dataValues.ADV_FULL_REG,
          social_type
        });
      }
    }).error((err) => {
      res.send('error has occured');
    });
  } else {
    Influenser.findOne({ where: { INF_REG_ID: id } }).then((result) => {
      if (!result) {
        Influenser.create({
          INF_NAME: name,
          INF_EMAIL: email,
          INF_REG_ID: id
        }).then((result) => {
          res.json({
            code: 200,
            userToken: common.createToken(result.dataValues.INF_ID),
            userName: result.dataValues.INF_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: common.createToken(result.dataValues.INF_ID),
          userName: result.dataValues.INF_NAME,
          social_type
        });
      }
    }).error((err) => {
      res.send('error has occured');
    });
  }
});

router.get('/loginNaver', (req, res) => {
  const {
    id, email, name, type, social_type
  } = req.query;

  const payload = {
    sub: id
  };

  const token = jwt.sign(payload, config.jwtSecret);


  if (type === '1') {
    Advertiser.findOne({ where: { ADV_REG_ID: id } }).then((result) => {
      if (!result) {
        Advertiser.create({
          ADV_NAME: name,
          ADV_EMAIL: email,
          ADV_REG_ID: id
        }).then((result) => {
          res.json({
            code: 200,
            userToken: common.createToken(result.dataValues.ADV_ID),
            userName: result.dataValues.ADV_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: common.createToken(result.dataValues.ADV_ID),
          userName: result.dataValues.ADV_NAME,
          social_type
        });
      }
    }).error((err) => {
      res.send('error has occured');
    });
  } else {
    Influenser.findOne({ where: { INF_REG_ID: id } }).then((result) => {
      if (!result) {
        Influenser.create({
          INF_NAME: name,
          INF_EMAIL: email,
          INF_REG_ID: id
        }).then((result) => {
          res.json({
            code: 200,
            userToken: common.createToken(result.dataValues.INF_ID),
            userName: result.dataValues.INF_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: common.createToken(result.dataValues.INF_ID),
          userName: result.dataValues.INF_NAME,
          social_type
        });
      }
    }).error((err) => {
      res.send('error has occured');
    });
  }
});

router.get('/loginKakao', (req, res) => {
  const {
    id, email, name, type, social_type
  } = req.query;

  if (type === '1') {
    Advertiser.findOne({ where: { ADV_REG_ID: id } }).then((result) => {
      if (!result) {
        Advertiser.create({
          ADV_NAME: name,
          ADV_EMAIL: email,
          ADV_REG_ID: id
        }).then((result) => {
          res.json({
            code: 200,
            userToken: common.createToken(result.dataValues.ADV_ID),
            userName: result.dataValues.ADV_NAME,
            regState: result.dataValues.ADV_FULL_REG,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: common.createToken(result.dataValues.ADV_ID),
          userName: result.dataValues.ADV_NAME,
          regState: result.dataValues.ADV_FULL_REG,
          social_type
        });
      }
    }).error((err) => {
      res.send('error has occured');
    });
  } else {
    Influenser.findOne({ where: { INF_REG_ID: id } }).then((result) => {
      if (!result) {
        Influenser.create({
          INF_NAME: name,
          INF_EMAIL: email,
          INF_REG_ID: id
        }).then((result) => {
          res.json({
            code: 200,
            userToken: common.createToken(result.dataValues.INF_ID),
            userName: result.dataValues.INF_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: common.createToken(result.dataValues.INF_ID),
          userName: result.dataValues.INF_NAME,
          social_type
        });
      }
    }).error((err) => {
      res.send('error has occured');
    });
  }
});

router.get('/loginTwitch', (req, res) => {
  const {
    id, email, name, type, social_type
  } = req.query;

  const payload = {
    sub: id
  };

  const token = jwt.sign(payload, config.jwtSecret);


  if (type === '1') {
    Advertiser.findOne({ where: { ADV_REG_ID: id } }).then((result) => {
      if (!result) {
        Advertiser.create({
          ADV_NAME: name,
          ADV_EMAIL: email,
          ADV_REG_ID: id
        }).then((result) => {
          res.json({
            code: 200,
            userToken: common.createToken(result.dataValues.ADV_ID),
            userName: result.dataValues.ADV_NAME,
            regState: result.dataValues.ADV_FULL_REG,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: common.createToken(result.dataValues.ADV_ID),
          userName: result.dataValues.ADV_NAME,
          regState: result.dataValues.ADV_FULL_REG,
          social_type
        });
      }
    }).error((err) => {
      res.send('error has occured');
    });
  } else {
    Influenser.findOne({ where: { INF_REG_ID: id } }).then((result) => {
      if (!result) {
        Influenser.create({
          INF_NAME: name,
          INF_EMAIL: email,
          INF_REG_ID: id
        }).then((result) => {
          res.json({
            code: 200,
            userToken: common.createToken(result.dataValues.INF_ID),
            userName: result.dataValues.INF_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: common.createToken(result.dataValues.INF_ID),
          userName: result.dataValues.INF_NAME,
          social_type
        });
      }
    }).error((err) => {
      res.send('error has occured');
    });
  }
});

router.post('/signup', (req, res) => {
  const data = req.body;
  const { type } = data;

  const userData = {};

  if (type === '1') {
    userData.ADV_EMAIL = data.email;
    userData.ADV_NAME = data.name;

    bcrypt.hash(data.password, saltRounds, (err, hash) => {
      userData.ADV_PASS = hash;
      if (err) {
        console.log(err);
      } else {
        Advertiser.findOne({
          where: { ADV_EMAIL: data.email }
        }).then((user) => {
          if (user) {
            res.json({
              code: 401,
              message: '이 이메일은 이미 사용중입니다.'
            });
          } else {
            Advertiser.create(userData).then((result) => {
              res.json({
                code: 200,
                userToken: common.createToken(result.dataValues.ADV_ID),
                userName: data.name,
                social_type: 'not-social'
              });
            }).catch((err) => {
              res.json({
                code: 400,
                success: false,
                error: err
              });
            });
          }
        });
      }
    });
  } else {
    userData.INF_EMAIL = data.email;
    userData.INF_NAME = data.name;

    bcrypt.hash(data.password, saltRounds, (err, hash) => {
      userData.INF_PASS = hash;
      if (err) {
        console.log(err);
      } else {
        Influenser.findOne({
          where: { INF_EMAIL: data.email }
        }).then((user) => {
          if (user) {
            res.json({
              code: 401,
              message: '이 이메일은 이미 사용중입니다.'
            });
          } else {
            Influenser.create(userData).then((result) => {
              res.json({
                code: 200,
                userToken: common.createToken(result.dataValues.INF_ID),
                userName: data.name,
                social_type: 'not-social'
              });
            }).catch((err) => {
              res.json({
                code: 400,
                success: false,
                error: err
              });
            });
          }
        });
      }
    });
  }
});

router.post('/update', (req, res) => {
  const data = req.body;
  const userId = common.getIdFromToken(data.token).sub;

  const post = {
    ADV_CLASS: data.classification,
    ADV_REG_NUM: data.registerNumber,
    ADV_TYPE: data.jobType,
    ADV_NAME: data.name,
    ADV_TEL: data.phone,
    ADV_COM_NAME: data.companyName,
    ADV_COM_URL: data.companyUrl,
    ADV_SUB_AIM: data.subscribeAim,
    ADV_FULL_REG: 'Y'
  };

  Advertiser.update(post, {
    where: { ADV_ID: userId }
  }).then((result) => {
    if (result) {
      res.json({
        code: 200,
        userName: data.name,
      });
    }
  });
});

router.get('/:id', (req, res) => {
  console.log('getting one book');
  /* Message.findById(req.params.id).then(result => {
        console.log(result);
        res.json(result);
    }); */

  Message.findOne({ where: { MSG_ID: req.params.id } }).then((result) => {
    console.log(result);
    res.json(result);
  }).error((err) => {
    res.send('error has occured');
  });
});

router.post('/', (req, res) => {
  Message.create({
    MSG_SENDER: req.body.sender,
    MSG_RECEIVER: req.body.receiver,
    MSG_MESSAGE: req.body.message
  }).then((message) => {
    console.log(message.get({
      plain: true
    }));
    res.send(message);
  });
});

module.exports = router;
