const express = require('express');
const Advertiser = require('../models').TB_ADVERTISER;
const common = require('../config/common');
const jwt = require('jsonwebtoken');

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

router.get('/login', (req, res) => {
  const { token } = req.query;
  const userInfo = jwt.decode(token);

  Advertiser.findOne({ where: { ADV_TOKEN: userInfo.sub } }).then((result) => {
    if (!result) {
      Advertiser.create({
        ADV_NAME: userInfo.name,
        ADV_EMAIL: userInfo.email,
        ADV_TOKEN: userInfo.sub
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
