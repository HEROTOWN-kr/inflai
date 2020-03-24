const express = require('express');
const jwt = require('jsonwebtoken');
const request = require('request');
const bcrypt = require('bcryptjs');

const config = require('../config');
const Advertiser = require('../models').TB_ADVERTISER;
const Influenser = require('../models').TB_INFLUENCER;
const common = require('../config/common');

const saltRounds = 10;

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({
    code: 200,
    message: 'success'
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
            userToken: token,
            userName: result.dataValues.ADV_NAME
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: token,
          userName: result.dataValues.ADV_NAME
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
            userToken: token,
            userName: result.dataValues.INF_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: token,
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
            userName: result.dataValues.ADV_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: token,
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
            userToken: token,
            userName: result.dataValues.INF_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: token,
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
            userName: result.dataValues.ADV_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: token,
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
            userToken: token,
            userName: result.dataValues.INF_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: token,
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

  function createToken(id) {
    const payload = {
      sub: id
    };

    const token = jwt.sign(payload, config.jwtSecret);
    return token;
  }


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
            userToken: createToken(result.dataValues.ADV_ID),
            userName: result.dataValues.ADV_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: createToken(result.dataValues.ADV_ID),
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
            userToken: createToken(result.dataValues.INF_ID),
            userName: result.dataValues.INF_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: createToken(result.dataValues.INF_ID),
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
            userName: result.dataValues.ADV_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: token,
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
            userToken: token,
            userName: result.dataValues.INF_NAME,
            social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: token,
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
              const insertedID = result.dataValues.ADV_ID;
              const payload = {
                sub: insertedID
              };

              const token = jwt.sign(payload, config.jwtSecret);

              res.json({
                code: 200,
                userToken: token,
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
              const insertedID = result.dataValues.INF_ID;
              const payload = {
                sub: insertedID
              };

              const token = jwt.sign(payload, config.jwtSecret);

              res.json({
                code: 200,
                userToken: token,
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
