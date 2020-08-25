const express = require('express');
const request = require('request');
const vision = require('@google-cloud/vision');
const Advertiser = require('../models').TB_ADVERTISER;
const test = require('./test');
const async = require('async');

const router = express.Router();

router.get('/test', (req, res) => {
  test.getYoutubeData((result) => {
    res.json({
      code: 200,
      message: 'success',
      data: result
    });
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

router.get('/twiterTest3', (req, res) => {
  const { access_token } = req.query;
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
});

router.get('/test2', (req, res) => {
  console.log('getting all advertisers');
  Advertiser.findAll().then((result) => {
    res.json(result);
  });
});

router.get('/googleVision', (req, res) => {
  console.log(req.headers.host);

  const testData = [];

  async function quickstart() {
    const client = new vision.ImageAnnotatorClient({
      keyFilename: 'src/server/config/googleVisionKey.json'
    });

    const INF_INST_ID = '17841401425431236';
    const INF_TOKEN = 'EAABZBmHw3RHwBAE4d4diX4vGO7MNquZAnlZC3QE2xpjZBORS7YZA9SACgOsGZCqtSyVUn0R4p7PSgXaUcR802hJjHGUCUW0C54nn5o3f48U25jCdA1rcnF2dq5pbFP4XM11mMSYXfZCFtRKXdTqUKGXHf2INT1dtCDWSna5g3ez2wZDZD';
    let resObj;

    const instaMediaDataUrl = `https://graph.facebook.com/v6.0/${INF_INST_ID}/media?`
        + 'fields='
        + 'thumbnail_url%2C'
        + 'media_url&'
        + `access_token=${INF_TOKEN}`;


    request.get(instaMediaDataUrl, (error2, response2, body2) => {
      resObj = { ...resObj, media: JSON.parse(body2).data };
    });


    // Performs label detection on the image file
    const [result] = await client.labelDetection('https://images.unsplash.com/photo-1542728498-09c6a1af7cb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80');
    const labels = result.labelAnnotations;
    labels.forEach((label) => {
      console.log(label);
      testData.push(label.description);
    });
    return resObj;
  }

  quickstart().then((result) => {
    res.json({
      code: 200,
      message: 'success',
      data: testData,
      img: result.media
    });
  });
});


module.exports = router;
