const express = require('express');
const Sequelize = require('sequelize');
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

router.get('/sendKakaoMessage', (req, res) => {
  const options = {
    method: 'POST',
    url: 'http://api.apistore.co.kr/kko/1.6/msg/herotown',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      'x-waple-authorization': 'MTMwOTAtMTU5MTE2NTg4NjcyOC0xMmRiOGQzYi1mOTY0LTRiNTAtOWI4ZC0zYmY5NjQ3YjUwZjg='
    },
    form: {
      PHONE: '01053275745',
      CALLBACK: '01026763937',
      MSG: '안녕하세요. 인플라이입니다.\n'
          + '새로운 캠페인이 등록되었습니다!\n\n'
          + '*제품명: 미니선풍기\n'
          + '*캠페인명: 선풍기 캠페인\n'
          + '*혜택: 10만원 쿠폰\n'
          + '*캠페인 신청 일자: 2020/06/18\n'
          + '*블로거 신청 마감: 2020/06/16 \n\n'
          + '**혜택이 있는 기회를 놓치지 마시고, 기한은 엄수해 주세요~^^\n'
          + '**해당 메시지는 고객님께서 캠페인 공고 수신에 동의 해 주셔서 발송되었습니다.\n',
      TEMPLATE_CODE: 'API2020',
      FAILED_TYPE: 'N',
      BTN_TYPES: '웹링크',
      BTN_TXTS: '신청링크',
      BTN_URLS1: 'https://www.inflai.com/CampaignList/37',
      BTN_URLS2: 'https://www.inflai.com/CampaignList/37'
    }
    // gzip: true
  };

  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      res.json({
        code: 200,
        data: JSON.parse(responseBody)
      });
    } else if (requestResponse != null) {
      res.json({
        code: 400,
        data: error
      });
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
});

router.get('/templateCheck', (req, res) => {
  const options = {
    method: 'GET',
    url: 'http://api.apistore.co.kr/kko/1/template/list/herotown',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      'x-waple-authorization': 'MTMwOTAtMTU5MTE2NTg4NjcyOC0xMmRiOGQzYi1mOTY0LTRiNTAtOWI4ZC0zYmY5NjQ3YjUwZjg='
    },
    qs: {
      TEMPLATE_CODE: 'API2020',
      STATUS: '1'
    },
  };

  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      res.json({
        code: 200,
        data: JSON.parse(responseBody)
      });
      console.log(requestResponse);
    } else if (requestResponse != null) {
      res.json({
        code: 400,
        data: error
      });
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
});

router.get('/sendNumbersCheck', (req, res) => {
  const options = {
    method: 'GET',
    url: 'http://api.apistore.co.kr/kko/1/sendnumber/list/herotown',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      'x-waple-authorization': 'MTMwOTAtMTU5MTE2NTg4NjcyOC0xMmRiOGQzYi1mOTY0LTRiNTAtOWI4ZC0zYmY5NjQ3YjUwZjg='
    }
  };

  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      res.json({
        code: 200,
        data: JSON.parse(responseBody)
      });
      console.log(requestResponse);
    } else if (requestResponse != null) {
      res.json({
        code: 400,
        data: error
      });
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
});

router.get('/requestSenderNumber', (req, res) => {
  const options = {
    method: 'POST',
    url: 'http://api.apistore.co.kr/kko/2/sendnumber/save/herotown',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      'x-waple-authorization': 'MTMwOTAtMTU5MTE2NTg4NjcyOC0xMmRiOGQzYi1mOTY0LTRiNTAtOWI4ZC0zYmY5NjQ3YjUwZjg='
    },
    form: {
      sendnumber: '01023270875',
      comment: '대가들이대표번호',
      pintype: 'SMS'
    }
  };

  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      res.json({
        code: 200,
        data: JSON.parse(responseBody)
      });
    } else if (requestResponse != null) {
      res.json({
        code: 400,
        data: error
      });
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
});

router.get('/saveSenderNumber', (req, res) => {
  const options = {
    method: 'POST',
    url: 'http://api.apistore.co.kr/kko/2/sendnumber/save/herotown',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      'x-waple-authorization': 'MTMwOTAtMTU5MTE2NTg4NjcyOC0xMmRiOGQzYi1mOTY0LTRiNTAtOWI4ZC0zYmY5NjQ3YjUwZjg='
    },
    form: {
      sendnumber: '01023270875',
      comment: '대가들이대표번호',
      pintype: 'SMS',
      pincode: '648152'
    }
  };

  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      res.json({
        code: 200,
        data: JSON.parse(responseBody)
      });
      console.log(requestResponse);
    } else if (requestResponse != null) {
      res.json({
        code: 400,
        data: error
      });
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

router.post('/test3', (req, res) => {
  const myUrl = 'http://api.apistore.co.kr/kko/1/msg/herotown';

  const options = {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    url: myUrl,
    headers: {
      'x-waple-authorization': 'b4ed715d8ed0ae6cf6bedabf40559903fb5b8fba',
    },
    form: {
      PHONE: '01026763937',
      CALLBACK: '01026763937',
      MSG: '새로운 캠페인이 등록되었습니다!',
      TEMPLATE_CODE: 'API2020',
      FAILED_TYPE: 'SMS',
      BTN_TYPES: '',
      BTN_TXTS: '',
      BTN_URLS1: ''
    }
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
  const { token, id, col } = req.query;
  const userId = id || common.getIdFromToken(token).sub;
  const options = {
    where: { ADV_ID: userId }
  };

  if (col && col === 'name') options.attributes = ['ADV_NAME'];
  if (col && col === 'companyName') options.attributes = ['ADV_COM_NAME'];
  if (col && col === 'phone') options.attributes = ['ADV_TEL'];
  if (col && col === 'registerNumber') options.attributes = ['ADV_REG_NUM'];
  if (col && col === 'classification') options.attributes = ['ADV_CLASS'];
  if (col && col === 'jobType') options.attributes = ['ADV_TYPE'];

  Advertiser.findOne(options).then((result) => {
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

  Advertiser.findOne({
    where: { ADV_ID: userId },
    attributes: ['ADV_EMAIL', 'ADV_TEL', 'ADV_REG_NUM', 'ADV_NAME', 'ADV_COM_NAME', 'ADV_CLASS',
      [Sequelize.literal('CASE ADV_TYPE WHEN \'1\' THEN \'일반\' WHEN \'2\' THEN \'에이전시\' ELSE \'소상공인\' END'), 'ADV_TYPE'],
      [Sequelize.literal('CASE ADV_CLASS WHEN \'1\' THEN \'국내사업자\' ELSE \'해외사업자\' END'), 'ADV_CLASS'],
    ]
  }).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/getAdvertisers', (req, res) => {
  Advertiser.findAll({
    attributes: ['ADV_ID', 'ADV_NAME', 'ADV_TEL', 'ADV_EMAIL', 'ADV_COM_NAME',
      [Sequelize.literal('CASE ADV_TYPE WHEN \'1\' THEN \'일반\' WHEN \'2\' THEN \'에이전시\' ELSE \'소상공인\' END'), 'ADV_TYPE'],
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('ADV_DT'), '%Y-%m-%d'), 'ADV_DT']
    ],
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

  Advertiser.findOne({ where: { ADV_REG_ID: userInfo.sub } }).then((result) => {
    if (!result) {
      Advertiser.create({
        ADV_NAME: userInfo.name,
        ADV_EMAIL: userInfo.email,
        ADV_REG_ID: userInfo.sub
      }).then((result2) => {
        res.json({
          code: 200,
          userToken: common.createToken(result2.dataValues.ADV_ID),
          userName: result2.dataValues.ADV_NAME,
          userId: result2.ADV_ID,
          social_type
        });
      });
    } else {
      res.json({
        code: 200,
        userToken: common.createToken(result.dataValues.ADV_ID),
        userName: result.dataValues.ADV_NAME,
        userId: result.ADV_ID,
        userPhone: result.ADV_TEL,
        social_type
      });
    }
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/loginFacebook', (req, res) => {
  const {
    id, email, name, type, social_type
  } = req.query;

  Advertiser.findOne({ where: { ADV_REG_ID: id } }).then((result) => {
    if (!result) {
      Advertiser.create({
        ADV_NAME: name,
        ADV_EMAIL: email,
        ADV_REG_ID: id
      }).then((result2) => {
        res.json({
          code: 200,
          userToken: common.createToken(result2.dataValues.ADV_ID),
          userName: result2.dataValues.ADV_NAME,
          userId: result2.ADV_ID,
          social_type
        });
      });
    } else {
      res.json({
        code: 200,
        userToken: common.createToken(result.dataValues.ADV_ID),
        userName: result.dataValues.ADV_NAME,
        userId: result.ADV_ID,
        userPhone: result.ADV_TEL,
        social_type
      });
    }
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/loginNaver', (req, res) => {
  const {
    id, email, name, type, social_type
  } = req.query;

  Advertiser.findOne({ where: { ADV_REG_ID: id } }).then((result) => {
    if (!result) {
      Advertiser.create({
        ADV_NAME: name,
        ADV_EMAIL: email,
        ADV_REG_ID: id
      }).then((result2) => {
        res.json({
          code: 200,
          userToken: common.createToken(result2.dataValues.ADV_ID),
          userName: result2.dataValues.ADV_NAME,
          userId: result2.ADV_ID,
          social_type
        });
      });
    } else {
      res.json({
        code: 200,
        userToken: common.createToken(result.dataValues.ADV_ID),
        userName: result.dataValues.ADV_NAME,
        userId: result.ADV_ID,
        userPhone: result.ADV_TEL,
        social_type
      });
    }
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/loginKakao', (req, res) => {
  const {
    id, email, name, type, social_type
  } = req.query;

  Advertiser.findOne({ where: { ADV_REG_ID: id } }).then((result) => {
    if (!result) {
      Advertiser.create({
        ADV_NAME: name,
        ADV_EMAIL: email,
        ADV_REG_ID: id
      }).then((result2) => {
        res.json({
          code: 200,
          userToken: common.createToken(result2.dataValues.ADV_ID),
          userName: result2.dataValues.ADV_NAME,
          userId: result2.ADV_ID,
          social_type
        });
      });
    } else {
      res.json({
        code: 200,
        userToken: common.createToken(result.dataValues.ADV_ID),
        userName: result.dataValues.ADV_NAME,
        userId: result.ADV_ID,
        userPhone: result.ADV_TEL,
        social_type
      });
    }
  }).error((err) => {
    res.send('error has occured');
  });
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
                userId: result.dataValues.ADV_ID,
                // userToken: common.createToken(result.dataValues.ADV_ID),
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
  const {
    id, token, classification, registerNumber, jobType, name, phone, companyName, companyUrl, subscribeAim
  } = data;
  const userId = id || common.getIdFromToken(data.token).sub;

  const post = {};

  if (classification) post.ADV_CLASS = classification;
  if (registerNumber) post.ADV_REG_NUM = registerNumber;
  if (jobType) post.ADV_TYPE = jobType;
  if (name) post.ADV_NAME = name;
  if (phone) post.ADV_TEL = phone;
  if (companyName) post.ADV_COM_NAME = companyName;
  if (companyUrl) post.ADV_COM_URL = companyUrl;
  if (subscribeAim) post.ADV_SUB_AIM = subscribeAim;

  Advertiser.update(post, {
    where: { ADV_ID: userId }
  }).then((result) => {
    if (result) {
      res.json({
        code: 200,
        social_type: 'noSocial',
        userName: data.name,
        userToken: token || common.createToken(userId),
      });
    }
  });
});

router.get('/delete', (req, res) => {
  const data = req.query;
  const { id, token } = data;
  const userId = id || common.getIdFromToken(token).sub;

  Advertiser.destroy({
    where: { ADV_ID: userId }
  }).then((result) => {
    if (result) {
      res.json({
        code: 200
      });
    }
  });
});

module.exports = router;
