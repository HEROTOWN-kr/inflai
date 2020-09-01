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
  const client = new vision.ImageAnnotatorClient({
    keyFilename: 'src/server/config/googleVisionKey.json'
  });

  async function detectPic(imgObj) {
    // const [result] = await client.labelDetection('https://images.unsplash.com/photo-1542728498-09c6a1af7cb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80');
    // const [result] = await client.labelDetection(imgObj.media_url);
    const [result] = await client.objectLocalization(imgObj.media_url);
    // const labels = result.labelAnnotations;
    const labels = result.localizedObjectAnnotations;
    // labels.forEach(label => label.description);

    return { ...imgObj, description: labels };
    // console.log(label);
    // testData.push(label.description);
  }


  // const INF_INST_ID = '17841401425431236';
  // const INF_TOKEN = 'EAABZBmHw3RHwBAE4d4diX4vGO7MNquZAnlZC3QE2xpjZBORS7YZA9SACgOsGZCqtSyVUn0R4p7PSgXaUcR802hJjHGUCUW0C54nn5o3f48U25jCdA1rcnF2dq5pbFP4XM11mMSYXfZCFtRKXdTqUKGXHf2INT1dtCDWSna5g3ez2wZDZD';

  const INF_INST_ID = '17841404662470641';
  const INF_TOKEN = 'EAAJbZA7aqFJcBAOrR55N49gVKDZATjV62gcUFZBZAoKntsXHyqlHOPw847v9yyl1IqJDupb5Eg7p1vsyBxttIiGZAhW1ZBFVdcjEzBDBpOTUaqMZA4lT8a0w4zgZCo2Yjyt7LGYGELUudVJsZBpC2uGKOrLcnQZAgxVZC87J6AXBzIC4lx0t1FIrFyL';
  // let resObj;

  const instaMediaDataUrl = `https://graph.facebook.com/v6.0/${INF_INST_ID}/media?`
        + 'fields='
        + 'thumbnail_url%2C'
        + 'media_url&'
        + `access_token=${INF_TOKEN}`;

  /* detectPic({
    media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/118254878_738391393670978_8863445052680372052_n.jpg?_nc_cat=107&_nc_sid=8ae9d6&_nc_eui2=AeGYz_EeR3GQcXwghpx0h1U6S8luj5mV4ZFLyW6PmZXhkR5q4cTbCTScjcvUNs2QjJrS0jy1xx6NpFpGrhYtPwC0&_nc_ohc=UESPQ1h4btcAX9xmQSu&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=7250d5dd7c2448a71b42bf014465b4b1&oe=5F749830',
    id: '18159557224029310',
  }).then((result) => {
    res.json({
      code: 200,
      message: 'success',
      data: result,
    });
  }); */

  async function getInstaData() {
    const iData = `https://graph.facebook.com/v6.0/${INF_INST_ID}/media?`
        + 'fields='
        + 'thumbnail_url%2C'
        + 'media_url&'
        + `access_token=${INF_TOKEN}`;

    try {
      request.get(iData, (error2, response2, body2) => {
        // resObj = { ...resObj, media: JSON.parse(body2).data };
        const imgArray = JSON.parse(body2).data;
        // return Object.values(imgArray);
      });
    } catch (error) {
      // return error;
    }


  }

  const resObj = getInstaData();

  /* const resObj = [
    {
      media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/118254878_738391393670978_8863445052680372052_n.jpg?_nc_cat=107&_nc_sid=8ae9d6&_nc_eui2=AeGYz_EeR3GQcXwghpx0h1U6S8luj5mV4ZFLyW6PmZXhkR5q4cTbCTScjcvUNs2QjJrS0jy1xx6NpFpGrhYtPwC0&_nc_ohc=UESPQ1h4btcAX9xmQSu&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=7250d5dd7c2448a71b42bf014465b4b1&oe=5F749830',
      id: '18159557224029310'
    },
    {
      media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117791972_989183651523744_1266700578931608444_n.jpg?_nc_cat=104&_nc_sid=8ae9d6&_nc_eui2=AeFhpYchbycwgYDp98PB3Xq3iAAwo_j193OIADCj-PX3c7FG9m-GLu-YIeSM5_NRruHZo-TxX8XwJsiiDmTconKp&_nc_ohc=ykwIRG7EXHEAX-eTV6z&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=db7a367712855c6c0a974ccac8369bb5&oe=5F72FC88',
      id: '18120879889136206'
    },
    {
      media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117750263_136841034766995_1172775394324786184_n.jpg?_nc_cat=108&_nc_sid=8ae9d6&_nc_eui2=AeEeN6LZYsh-Bkulj_0ekHeA64DG5LXv25LrgMbkte_bktxPb6qQSYCUox4YKDfUHAhcbGUFCb-SplM-qQMHlP28&_nc_ohc=FSqPzOPAQmMAX_rwRzY&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=7d67768bb73ce1cdb8a80aaf38ed6731&oe=5F75026F',
      id: '18157032793059272'
    },
    {
      media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117864204_160163822316648_9107687304934920980_n.jpg?_nc_cat=108&_nc_sid=8ae9d6&_nc_eui2=AeGuicso4BXzWYbh_h_NHPZAmdcvSiZJQ9CZ1y9KJklD0LfTXwL8Pc8degXrGsH42TEjbEZT0mj6F_7zBB5409gm&_nc_ohc=ZhCE7xVOyowAX-XGixL&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=fc3702ac5086cef1245d273e6133214a&oe=5F736933',
      id: '17847334994295215'
    },
    {
      media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/118135825_300301271033635_2901869540986841944_n.jpg?_nc_cat=100&_nc_sid=8ae9d6&_nc_eui2=AeH7XOdLCq8QfI2lLidJrKhqe7JZvEKGTa17slm8QoZNrZJEM-ageX0TbT6aHyr7Y6tx6W6MK9zBf0YW9Obuvw4f&_nc_ohc=KluquaX5OH4AX9OmQfX&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=23ea743b6866994d79403c926f070c66&oe=5F733D8D',
      id: '17895806911577644'
    },
    {
      media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117729388_742769669892717_2920298857168843173_n.jpg?_nc_cat=107&_nc_sid=8ae9d6&_nc_eui2=AeFfzas6hu7A99rvCIgmBq-qGW3Pdy7dUPoZbc93Lt1Q-kercEaZQDTikpiMgFSzehZ6a-gfNFG_3nZWdHD5qITY&_nc_ohc=wkqyRDqtPHgAX_cHA6k&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=99245bb80efa474240bf67c4c119a28e&oe=5F73704A',
      id: '17914095442464753'
    },
    {
      media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117630481_340530933636634_6749428653410336986_n.jpg?_nc_cat=104&_nc_sid=8ae9d6&_nc_eui2=AeES8xXqWbxWdGDnvcwiHL0e1A8nl2gkj3zUDyeXaCSPfEEODIln-HrLxS7mPWlc25__p8taZZpYLiSRAzVNBOVr&_nc_ohc=8o0KSaQUGjIAX_KnVWw&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=65ed201fa1b15588ff577c6ada334868&oe=5F743106',
      id: '17867157436974068'
    },
    {
      media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117988650_608015483239417_7266747964255989618_n.jpg?_nc_cat=109&_nc_sid=8ae9d6&_nc_eui2=AeFv47N8oKL48IEpFZ1ENcFIUpKtxGNFP79Skq3EY0U_v5TQ47SZ-tjrzOuKTZmk1uHNbm2Lgt1-tusF8ygkwZH5&_nc_ohc=h_q0VUBzrXkAX9pj1Dw&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=854d1383ea6d944ed2d74e19b65066b6&oe=5F72B8BD',
      id: '17865468379973655'
    },
    {
      media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117392480_2988611041249426_4383299263032272963_n.jpg?_nc_cat=109&_nc_sid=8ae9d6&_nc_eui2=AeHXxomdD4UEfqJg8OsOfiTZsDfq8-eVn9GwN-rz55Wf0Y8tTCxXOpy-0469JiDZwTZ8a0o737Ic5CPwrcIEot4y&_nc_ohc=iBGFYUDZlV8AX8RCsPy&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=3a12558fb805a97e4ab972a33a1a93d0&oe=5F72948A',
      id: '18064788088239209'
    },
    {
      media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117377699_220521272674318_4332781078217534883_n.jpg?_nc_cat=111&_nc_sid=8ae9d6&_nc_eui2=AeFzpnYrKGa0euUmpiAHQe3vOG_S5fmgRRc4b9Ll-aBFFyFnGgYq2YgPc5SAAyruS8BXS_Z2Zhwz6D_3NmmCfEp4&_nc_ohc=Oos3-zxR6KUAX9Fd7o8&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=a3858b0c8e4f41406acdcf606540cde3&oe=5F73513D',
      id: '17867219833962714'
    },


    {
      media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117820887_1229676924035338_22258494513532406_n.jpg?_nc_cat=106&_nc_sid=8ae9d6&_nc_eui2=AeEbUgKniIV0YYprOsbCeK6SDIDsRCRicCkMgOxEJGJwKRIo4LOa5Za8lZr9Boz9xetSmyX_AN3Y8jUKwIwTpC_b&_nc_ohc=jf2ncraKLQoAX8CdNi-&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=a6416c79e76bbf9a63b60de5182d60ca&oe=5F7325D0',
      id: '18129350005129700'
    },
    {
      media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117294090_864312797429976_201364383843929276_n.jpg?_nc_cat=107&_nc_sid=8ae9d6&_nc_eui2=AeElBsvPgR6vyz59IUlsfa6EcgLL0kQ5RW5yAsvSRDlFbmdT49wIa4QQHfnPky06p5NC-dAu5gPIDYMDz6Q0Vz78&_nc_ohc=lR-48Tzc99oAX_uQrY5&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=89c2e4556c06e2e9333878533ee61ce6&oe=5F72E515',
      id: '17885567611662213'
    },
  ]; */

  async.map(resObj, (item, callback) => {
    detectPic(item).then((result) => {
      callback(null, result);
    });
  }, (err, results) => {
    if (err) {
      // return err;
      res.json({
        code: 200,
        message: 'success',
        data: err,
      });
    }
    res.json({
      code: 200,
      message: 'success',
      data: results,
    });
    // return results;
  });


  /* request.get(instaMediaDataUrl, (error2, response2, body2) => {
    // resObj = { ...resObj, media: JSON.parse(body2).data };
    const imgArray = JSON.parse(body2).data;
    // resObj = { ...imgArray };
    resObj = [
      {
        media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/118254878_738391393670978_8863445052680372052_n.jpg?_nc_cat=107&_nc_sid=8ae9d6&_nc_eui2=AeGYz_EeR3GQcXwghpx0h1U6S8luj5mV4ZFLyW6PmZXhkR5q4cTbCTScjcvUNs2QjJrS0jy1xx6NpFpGrhYtPwC0&_nc_ohc=UESPQ1h4btcAX9xmQSu&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=7250d5dd7c2448a71b42bf014465b4b1&oe=5F749830',
        id: '18159557224029310'
      },
      {
        media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117791972_989183651523744_1266700578931608444_n.jpg?_nc_cat=104&_nc_sid=8ae9d6&_nc_eui2=AeFhpYchbycwgYDp98PB3Xq3iAAwo_j193OIADCj-PX3c7FG9m-GLu-YIeSM5_NRruHZo-TxX8XwJsiiDmTconKp&_nc_ohc=ykwIRG7EXHEAX-eTV6z&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=db7a367712855c6c0a974ccac8369bb5&oe=5F72FC88',
        id: '18120879889136206'
      },
      {
        media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117750263_136841034766995_1172775394324786184_n.jpg?_nc_cat=108&_nc_sid=8ae9d6&_nc_eui2=AeEeN6LZYsh-Bkulj_0ekHeA64DG5LXv25LrgMbkte_bktxPb6qQSYCUox4YKDfUHAhcbGUFCb-SplM-qQMHlP28&_nc_ohc=FSqPzOPAQmMAX_rwRzY&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=7d67768bb73ce1cdb8a80aaf38ed6731&oe=5F75026F',
        id: '18157032793059272'
      },
      {
        media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117864204_160163822316648_9107687304934920980_n.jpg?_nc_cat=108&_nc_sid=8ae9d6&_nc_eui2=AeGuicso4BXzWYbh_h_NHPZAmdcvSiZJQ9CZ1y9KJklD0LfTXwL8Pc8degXrGsH42TEjbEZT0mj6F_7zBB5409gm&_nc_ohc=ZhCE7xVOyowAX-XGixL&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=fc3702ac5086cef1245d273e6133214a&oe=5F736933',
        id: '17847334994295215'
      },
      {
        media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/118135825_300301271033635_2901869540986841944_n.jpg?_nc_cat=100&_nc_sid=8ae9d6&_nc_eui2=AeH7XOdLCq8QfI2lLidJrKhqe7JZvEKGTa17slm8QoZNrZJEM-ageX0TbT6aHyr7Y6tx6W6MK9zBf0YW9Obuvw4f&_nc_ohc=KluquaX5OH4AX9OmQfX&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=23ea743b6866994d79403c926f070c66&oe=5F733D8D',
        id: '17895806911577644'
      },
      {
        media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117729388_742769669892717_2920298857168843173_n.jpg?_nc_cat=107&_nc_sid=8ae9d6&_nc_eui2=AeFfzas6hu7A99rvCIgmBq-qGW3Pdy7dUPoZbc93Lt1Q-kercEaZQDTikpiMgFSzehZ6a-gfNFG_3nZWdHD5qITY&_nc_ohc=wkqyRDqtPHgAX_cHA6k&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=99245bb80efa474240bf67c4c119a28e&oe=5F73704A',
        id: '17914095442464753'
      },
      {
        media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117630481_340530933636634_6749428653410336986_n.jpg?_nc_cat=104&_nc_sid=8ae9d6&_nc_eui2=AeES8xXqWbxWdGDnvcwiHL0e1A8nl2gkj3zUDyeXaCSPfEEODIln-HrLxS7mPWlc25__p8taZZpYLiSRAzVNBOVr&_nc_ohc=8o0KSaQUGjIAX_KnVWw&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=65ed201fa1b15588ff577c6ada334868&oe=5F743106',
        id: '17867157436974068'
      },
      {
        media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117988650_608015483239417_7266747964255989618_n.jpg?_nc_cat=109&_nc_sid=8ae9d6&_nc_eui2=AeFv47N8oKL48IEpFZ1ENcFIUpKtxGNFP79Skq3EY0U_v5TQ47SZ-tjrzOuKTZmk1uHNbm2Lgt1-tusF8ygkwZH5&_nc_ohc=h_q0VUBzrXkAX9pj1Dw&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=854d1383ea6d944ed2d74e19b65066b6&oe=5F72B8BD',
        id: '17865468379973655'
      },
      {
        media_url: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.29350-15/117392480_2988611041249426_4383299263032272963_n.jpg?_nc_cat=109&_nc_sid=8ae9d6&_nc_eui2=AeHXxomdD4UEfqJg8OsOfiTZsDfq8-eVn9GwN-rz55Wf0Y8tTCxXOpy-0469JiDZwTZ8a0o737Ic5CPwrcIEot4y&_nc_ohc=iBGFYUDZlV8AX8RCsPy&_nc_ht=scontent-ssn1-1.cdninstagram.com&oh=3a12558fb805a97e4ab972a33a1a93d0&oe=5F72948A',
        id: '18064788088239209'
      },

    ];

    async.map(Object.values(resObj), (item, callback) => {
      detectPic(item).then((result) => {
        callback(null, result);
      });
    }, (err, results) => {
      if (err) {
        // return err;
        res.json({
          code: 200,
          message: 'success',
          data: err,
        });
      }
      res.json({
        code: 200,
        message: 'success',
        data: results,
      });
      // return results;
    });
  }); */
});


module.exports = router;
