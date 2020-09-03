const express = require('express');
const request = require('request');
const async = require('async');
const vision = require('@google-cloud/vision');
const { asyncMiddleware } = require('../config/common');

const Advertiser = require('../models').TB_ADVERTISER;
const test = require('./test');

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

router.get('/googleVision', asyncMiddleware(
  async (req, res) => {
    const client = new vision.ImageAnnotatorClient({
      keyFilename: 'src/server/config/googleVisionKey.json'
    });


    async function detectPic(imgObj) {
      /* const [result] = await client.objectLocalization(imgObj.media_url);
      const labels = result.localizedObjectAnnotations; */
      const [result] = await client.labelDetection(imgObj.thumbnail_url || imgObj.media_url);
      const labels = result.labelAnnotations;
      if (labels && labels[0]) {
        const { score, description } = labels[0];

        return { ...imgObj, score, description };
      }
      // return { ...imgObj };
      return detectPic(imgObj);
    }

    // const INF_INST_ID = '17841401425431236';
    // const INF_TOKEN = 'EAABZBmHw3RHwBAE4d4diX4vGO7MNquZAnlZC3QE2xpjZBORS7YZA9SACgOsGZCqtSyVUn0R4p7PSgXaUcR802hJjHGUCUW0C54nn5o3f48U25jCdA1rcnF2dq5pbFP4XM11mMSYXfZCFtRKXdTqUKGXHf2INT1dtCDWSna5g3ez2wZDZD';

    // const INF_INST_ID = '17841404662470641';
    // const INF_TOKEN = 'EAAJbZA7aqFJcBAOrR55N49gVKDZATjV62gcUFZBZAoKntsXHyqlHOPw847v9yyl1IqJDupb5Eg7p1vsyBxttIiGZAhW1ZBFVdcjEzBDBpOTUaqMZA4lT8a0w4zgZCo2Yjyt7LGYGELUudVJsZBpC2uGKOrLcnQZAgxVZC87J6AXBzIC4lx0t1FIrFyL';


    const INF_INST_ID = '17841409027165699';
    const INF_TOKEN = 'EAAJbZA7aqFJcBAMqzR9ZBes04fxdbqO0AmJKLNQvARu06mbZCXaFpvnZCU5ZCWKiptFqAcqZA181LhiTwO1zmC2bHzNGu8M1GZBUwOqOYJ7LZC6X2N3qNqaFjJIKG9j9Gcm4u3mvUxZAiOOjVmSZAHZCt3uR8EGeQZAwVmfcLXA2uA5sSAZDZD';

    function getInstaData() {
      const iData = `https://graph.facebook.com/v6.0/${INF_INST_ID}/media?`
          + 'fields='
          + 'thumbnail_url%2C'
          + 'media_url,like_count,comments_count&'
          + `access_token=${INF_TOKEN}`;

      return new Promise(((resolve, reject) => {
        request.get(iData, (error2, response2, body2) => {
          if (!error2 && response2.statusCode == 200) {
            const imgArray = JSON.parse(body2).data;
            resolve(Object.values(imgArray));
          } else {
            reject(error2);
          }
        });
      }));
    }

    const instaData = await getInstaData();

    const resultData = instaData.slice(0, 7);
    const resultData2 = instaData.slice(8, 14);
    const resultData3 = instaData.slice(15, 25);


    Promise.all(instaData.map(accInfo => detectPic(accInfo).then(result => (result)))).then((gDatas) => {
      /* Promise.all(resultData2.map(accInfo2 => detectPic(accInfo2).then(result2 => (result2)))).then((gDatas2) => {
        Promise.all(resultData3.map(accInfo3 => detectPic(accInfo3).then(result3 => (result3)))).then((gDatas3) => {
          const finalArray = [...gDatas, ...gDatas2, ...gDatas3];
          /!* const statArray = finalArray.map(item => item.description);
          const statistics = statArray.reduce((acc, el) => {
            acc[el] = (acc[el] || 0) + 1;
            return acc;
          }, {}); *!/

          const statistics = finalArray.reduce((acc, el) => {
            acc[el.description] = {
              percentage: (acc[el.description] && acc[el.description].percentage || 0) + 1,
              likeCountSum: (acc[el.description] && acc[el.description].likeCountSum || 0) + el.like_count,
              commentsCountSum: (acc[el.description] && acc[el.description].comments_count || 0) + el.comments_count,
            };
            return acc;
          }, {});

          Object.keys(statistics).map((key) => {
            statistics[key].percentage = 100 / (finalArray.length / statistics[key].percentage);
          });

          res.json({
            code: 200,
            message: 'success',
            data: finalArray,
            stats: statistics
          });
        });
      }); */

      // const finalArray = [...gDatas, ...gDatas2, ...gDatas3];
      /* const statArray = finalArray.map(item => item.description);
      const statistics = statArray.reduce((acc, el) => {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
      }, {}); */

      const statistics = gDatas.reduce((acc, el) => {
        acc[el.description] = {
          percentage: (acc[el.description] && acc[el.description].percentage || 0) + 1,
          likeCountSum: (acc[el.description] && acc[el.description].likeCountSum || 0) + el.like_count,
          commentsCountSum: (acc[el.description] && acc[el.description].comments_count || 0) + el.comments_count,
        };
        return acc;
      }, {});

      Object.keys(statistics).map((key) => {
        statistics[key].percentage = 100 / (gDatas.length / statistics[key].percentage);
      });

      res.json({
        code: 200,
        message: 'success',
        data: gDatas,
        stats: statistics
      });

      /* res.json({
        code: 200,
        message: 'success',
        data: [...gDatas]
      }); */
    });
  }
));


module.exports = router;
