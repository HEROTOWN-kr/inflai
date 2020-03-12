const express = require('express');
const Advertiser = require('../models').TB_ADVERTISER;
const Influenser = require('../models').TB_INFLUENCER;
const common = require('../config/common');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({
    code: 200,
    message: 'success'
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
            social_type: social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: token,
          userName: result.dataValues.INF_NAME,
          social_type: social_type
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
            social_type: social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: token,
          userName: result.dataValues.ADV_NAME,
          social_type: social_type
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
            social_type: social_type
          });
        });
      } else {
        res.json({
          code: 200,
          userToken: token,
          userName: result.dataValues.INF_NAME,
          social_type: social_type
        });
      }
    }).error((err) => {
      res.send('error has occured');
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
