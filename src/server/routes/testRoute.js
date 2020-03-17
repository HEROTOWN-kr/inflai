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

router.get('/twiterTest', (req, res) => {
  const { code } = req.query;
  // const header = `Bearer ${token}`; // Bearer 다음에 공백 추가

  /* const apiUrl = 'https://id.twitch.tv/oauth2/token';
  const options = {
    url: apiUrl,
    headers: {
      client_id: 'hnwk0poqnawvjedf2nxzaaznj16e1g',
      client_secret: '42s2o1ric6vncipbx3ssc3jaekhitj',
      code: req.query.code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:8080/testRoute/twiterTest'
    }
  }; */

  /* request.post('https://id.twitch.tv/oauth2/token').form({
    client_id: 'hnwk0poqnawvjedf2nxzaaznj16e1g',
    client_secret: '42s2o1ric6vncipbx3ssc3jaekhitj',
    code,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:8080/testRoute/twiterTest'
  }); */

  request.post({
    url: 'https://id.twitch.tv/oauth2/token',
    form: {
      client_id: 'hnwk0poqnawvjedf2nxzaaznj16e1g',
      client_secret: '42s2o1ric6vncipbx3ssc3jaekhitj',
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:8080/testRoute/twiterTest2'
    }
  },
  (err, response, body) => {
    if (err) {
      console.log(err);
    } else {
      const newObj = JSON.parse(body);
      const { access_token } = newObj;
      const header = `Bearer ${access_token}`;

      const apiUrl = 'https://api.twitch.tv/helix/users';
      const options = {
        url: apiUrl,
        headers: { Authorization: header }
      };
      request.get(options, (error, requestResponse, responseBody) => {
        if (!error && requestResponse.statusCode == 200) {
          // res.json(responseBody);
          res.json(JSON.parse(responseBody));
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

      // res.json(newObj);
    }
  });

  // request.post(options);
  /* request.post(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      res.json(body);
      // res.json(JSON.parse(body));
      /!* res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
                  res.end(body); *!/
    } else {
      console.log('error');
      if (response != null) {
        res.status(response.statusCode).end();
        console.log(`error = ${response.statusCode}`);
      }
    }
  }); */
});

router.get('/twiterTest2', (req, res) => {
  const { token } = req.query;
  const header = `Bearer ${token}`; // Bearer 다음에 공백 추가

  const apiUrl = 'POST https://id.twitch.tv/oauth2/token';
  const options = {
    url: apiUrl,
    headers: {
      client_id: 'hnwk0poqnawvjedf2nxzaaznj16e1g',

    }
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


module.exports = router;
