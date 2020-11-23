const express = require('express');
const request = require('request');
const Sequelize = require('sequelize');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const uniqid = require('uniqid');
const fetch = require('node-fetch');
const vision = require('@google-cloud/vision');
const {
  resizeImage, getInstagramInsights, getInstagramMediaData, getInstagramData, googleVision
} = require('../config/common');
const config = require('../config/config');

const Advertiser = require('../models').TB_ADVERTISER;
const Influencer = require('../models').TB_INFLUENCER;
const Insta = require('../models').TB_INSTA;
const Admin = require('../models').TB_ADMIN;
const test = require('./test');

const router = express.Router();

router.get('/test', async (req, res) => {
  try {
    const { instagramId, instagramToken } = req.query;
    const insights = await getInstagramInsights(instagramId, instagramToken);
    res.status(200).json({
      message: 'success',
      data: insights
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/testPost', async (req, res) => {
  try {
    const { file } = req.files;
    const currentPath = file.path;
    const uid = uniqid();
    const fileExtension = path.extname(file.name);
    const fileName = `${uid}_400_316${fileExtension}`;
    const tmpPath = `${config.tmp}${fileName}`;
    const uploadPath = path.normalize(`${config.attachRoot}/test/${fileName}`);

    const imageData = await resizeImage(currentPath, tmpPath, 400, 316);

    await fse.move(tmpPath, uploadPath, { clobber: true });

    res.status(200).json({
      message: 'success'
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.get('/getGoogleDataObject', async (req, res) => {
  try {
    const { INS_ID, isLocal } = req.query;

    const filePath = isLocal === 'true' ? {
      keyFileName: 'src/server/config/googleVisionKey.json',
      imagePath: './src/server/img/image'
    } : {
      keyFileName: '/data/inflai/src/server/config/googleVisionKey.json',
      imagePath: '../server/img/image'
    };


    const options = {
      where: { INS_ID },
      attributes: ['INS_ID', 'INS_TOKEN', 'INS_ACCOUNT_ID'],
    };

    const InstaData = await Insta.findOne(options);
    const { INS_TOKEN, INS_ACCOUNT_ID } = InstaData;

    const client = new vision.ImageAnnotatorClient({
      keyFilename: filePath.keyFileName
    });

    const colors = [
      '#FF835D', '#409CFF', '#52D726', '#FF0000',
      '#FFEC00', '#7CDDDD', '#4D4D4D', '#5DA5DA',
      '#FAA43A', '#60BD68', '#F17CB0', '#B2912F',
      '#B276B2', '#DECF3F', '#81726A', '#270722',
      '#E8C547', '#C2C6A7', '#ECCE8E', '#DC136C',
      '#353A47', '#84B082', '#5C80BC', '#CDD1C4',
      '#7CDDDD'
    ];
    // '#52D726', '#FFEC00',

    async function detectPic(index) {
      const fileName = `${filePath.imagePath}${index}.jpg`;
      const [result] = await client.objectLocalization(fileName);

      const objects = result.localizedObjectAnnotations;

      const data = objects.map(object => ({
        name: object.name,
        confidence: object.score
      }));


      return new Promise(((resolve, reject) => {
        /* if (labels && labels[0]) {
          const { score, description } = labels[0];
          resolve({ score, description });
        } */
        // resolve({});
        resolve(data[0]);
      }));
    }

    async function downloadAndDetect(fileUrl, index) {
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      const path = `${filePath.imagePath}${index}.jpg`;

      return new Promise((async (resolve, reject) => {
        fs.writeFile(path, buffer, async () => {
          const detectResult = await detectPic(index);
          resolve(detectResult);
        });
      }));
    }

    const instaData = await getInstagramMediaData(INS_ACCOUNT_ID, INS_TOKEN);
    const gDatas = await Promise.all(
      instaData.map(async (mediaInfo, index) => {
        const { thumbnail_url, media_url } = mediaInfo;
        const fileUrl = thumbnail_url || media_url;
        const detectData = await downloadAndDetect(fileUrl, index);
        return { ...mediaInfo, ...detectData };
      })
    );

    const statistics = gDatas.reduce((acc, el) => {
      acc[el.name] = {
        count: (acc[el.name] && acc[el.name].count || 0) + 1,
        likeCountSum: (acc[el.name] && acc[el.name].likeCountSum || 0) + el.like_count,
        commentsCountSum: (acc[el.name] && acc[el.name].comments_count || 0) + el.comments_count,
      };
      return acc;
    }, {});

    const finalArray = Object.keys(statistics).map((key, index) => {
      statistics[key].value = 100 / (gDatas.length / statistics[key].count);
      return { ...statistics[key], description: key, color: colors[index] };
    });

    finalArray.sort((a, b) => b.value - a.value);

    /* const fileUrl = instaData[0].media_url;
    const gData = await downloadAndDetect(fileUrl, 0); */

    res.json({
      code: 200,
      statistics: finalArray,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
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

router.get('/readDirectory', async (req, res) => {
  const { pathName } = req.query;

  // const folderName = '/data/inflai/server/src/server/img';
  // const folderName = './src/server/img';


  try {
    const files = await fs.readdirSync(pathName);
    res.json({ code: 200, result: files });
  } catch (err) {
    res.json({ code: 400, result: err.message });
  }
});

router.get('/saveImageLocal', async (req, res) => {
  async function download(fileUrl, index) {
    const response = await fetch(fileUrl);
    const buffer = await response.buffer();
    const path = `./src/server/img/image${index}.jpg`;

    return new Promise((async (resolve, reject) => {
      fs.writeFile(path, buffer, () => {
        resolve(`finish${index}`);
      });
    }));
  }

  // const INF_INST_ID = '17841409027165699';
  // const INF_TOKEN = 'EAAJbZA7aqFJcBAMqzR9ZBes04fxdbqO0AmJKLNQvARu06mbZCXaFpvnZCU5ZCWKiptFqAcqZA181LhiTwO1zmC2bHzNGu8M1GZBUwOqOYJ7LZC6X2N3qNqaFjJIKG9j9Gcm4u3mvUxZAiOOjVmSZAHZCt3uR8EGeQZAwVmfcLXA2uA5sSAZDZD';

  // 대리님 아까운트
  // const INF_INST_ID = '17841401425431236';
  // const INF_TOKEN = 'EAABZBmHw3RHwBAE4d4diX4vGO7MNquZAnlZC3QE2xpjZBORS7YZA9SACgOsGZCqtSyVUn0R4p7PSgXaUcR802hJjHGUCUW0C54nn5o3f48U25jCdA1rcnF2dq5pbFP4XM11mMSYXfZCFtRKXdTqUKGXHf2INT1dtCDWSna5g3ez2wZDZD';

  // herotownkr 아까운트
  // const INF_INST_ID = '17841404662470641';
  // const INF_TOKEN = 'EAAJbZA7aqFJcBAOrR55N49gVKDZATjV62gcUFZBZAoKntsXHyqlHOPw847v9yyl1IqJDupb5Eg7p1vsyBxttIiGZAhW1ZBFVdcjEzBDBpOTUaqMZA4lT8a0w4zgZCo2Yjyt7LGYGELUudVJsZBpC2uGKOrLcnQZAgxVZC87J6AXBzIC4lx0t1FIrFyL';

  // 전혜린 아까운트 https://www.instagram.com/j.h.lyn/
  // const INF_INST_ID = '17841400173602659';
  // const INF_TOKEN = 'EAAJbZA7aqFJcBAI9sHy3gXKLLdqMX5qYjuRI8RNaQ8ZC35BCZBOpfrcrrq6aoO9gCysFeBLhmhzcRhvtxvEl1Rfy62ZBnCITRwJIuy5JZCRpZBLJz9Juhk9JiPgq4Erm1GKBge2HAOt1YXCChZBL178iMI9Sl3vLCmQAdkv77SibeCTeAiTXv7b';


  // 김지수 아까운트 https://www.instagram.com/j.suuu00
  const INF_INST_ID = '17841402219947161';
  const INF_TOKEN = 'EAAJbZA7aqFJcBAMAkSoPRgR0qlMZCOjYZARY5r6wW0PpeFH8ZAd7jLZBmbps5SzbA77RCzv9mJPy7M3t0UrhC2IqZBPCiDlOqcpLfggbT6k7juLiwvcFTkR9OmNixwtvaN1jHEmM96hunBz9C9699CzohDl9l4lK0tCUE3mFacFgZDZD';

  // 나은실 아까운트 https://www.instagram.com/j.suuu00
  // const INF_INST_ID = '17841403617928174';
  // const INF_TOKEN = 'EAAJbZA7aqFJcBAPSZACWxB1AYRvTOtxa4ISfd1cAybTZCx7yOKPKWzO97adNvqHwZAMea3QB7uAbuQgOpBTZCI7cyZAX8gutfarI3WbyFwKrZAvOQQCmJoowHybthH9FgteJpZBTqKRhQnaLnohWgUZCmdAXq4uf0RBvfstxkfwklagZDZD';


  const instaData = await getInstagramMediaData(INF_INST_ID, INF_TOKEN);

  const finish = await Promise.all(
    instaData.map(async (mediaInfo, index) => {
      const { thumbnail_url, media_url } = mediaInfo;
      const downResponse = await download(thumbnail_url || media_url, index);
      return downResponse;
    })
  );

  res.json({ code: 200, result: finish });
});

router.get('/saveImage', async (req, res) => {
  async function download(fileUrl, index) {
    const response = await fetch(fileUrl);
    const buffer = await response.buffer();
    const path = `../server/img/image${index}.jpg`;

    return new Promise(async (resolve, reject) => {
      fs.writeFile(path, buffer, (err) => {
        resolve(`finish${index}`);
      });
    });
  }

  const INF_INST_ID = '17841409027165699';
  const INF_TOKEN = 'EAAJbZA7aqFJcBAMqzR9ZBes04fxdbqO0AmJKLNQvARu06mbZCXaFpvnZCU5ZCWKiptFqAcqZA181LhiTwO1zmC2bHzNGu8M1GZBUwOqOYJ7LZC6X2N3qNqaFjJIKG9j9Gcm4u3mvUxZAiOOjVmSZAHZCt3uR8EGeQZAwVmfcLXA2uA5sSAZDZD';

  // 안드리안 아까운트
  // const INF_INST_ID = '17841401425431236';
  // const INF_TOKEN = 'EAABZBmHw3RHwBAE4d4diX4vGO7MNquZAnlZC3QE2xpjZBORS7YZA9SACgOsGZCqtSyVUn0R4p7PSgXaUcR802hJjHGUCUW0C54nn5o3f48U25jCdA1rcnF2dq5pbFP4XM11mMSYXfZCFtRKXdTqUKGXHf2INT1dtCDWSna5g3ez2wZDZD';

  const instaData = await getInstagramMediaData(INF_INST_ID, INF_TOKEN);

  const finish = await Promise.all(
    instaData.map(async (mediaInfo, index) => {
      const { thumbnail_url, media_url } = mediaInfo;
      const downResponse = await download(thumbnail_url || media_url, index);
      return downResponse;
    })
  );
  res.json({ code: 200, result: finish });
});

router.get('/googleVisionLocal', async (req, res) => {
  const { instaId, instaToken } = req.query;

  if (!instaId || !instaToken) res.json({ code: 400, message: 'input instaId and instaToken' });

  const colors = [
    '#52D726', '#FFEC00', '#FF7300', '#FF0000',
    '#007ED6', '#7CDDDD', '#4D4D4D', '#5DA5DA',
    '#FAA43A', '#60BD68', '#F17CB0', '#B2912F',
    '#B276B2', '#DECF3F', '#81726A', '#270722',
    '#E8C547', '#C2C6A7', '#ECCE8E', '#DC136C',
    '#353A47', '#84B082', '#5C80BC', '#CDD1C4',
    '#7CDDDD'
  ];

  const client = new vision.ImageAnnotatorClient({
    keyFilename: 'src/server/config/googleVisionKey.json'
  });

  async function detectPic(index) {
    const fileName = `./src/server/img/image${index}.jpg`;
    // const fileName = `../server/img/image${index}.jpg`;
    try {
      const [result] = await client.labelDetection(fileName);
      const labels = result.labelAnnotations;
      return new Promise(((resolve, reject) => {
        if (labels && labels[0]) {
          const { score, description } = labels[0];
          resolve({ score, description });
        }
        resolve({});
      }));
    } catch (err) {
      return new Promise(((resolve, reject) => {
        resolve({});
      }));
    }
  }

  async function downloadAndDetect(fileUrl, index) {
    const response = await fetch(fileUrl);
    const buffer = await response.buffer();
    const path = `./src/server/img/image${index}.jpg`;

    return new Promise((async (resolve, reject) => {
      fs.writeFile(path, buffer, async () => {
        const detectResult = await detectPic(index);
        resolve(detectResult);
      });
    }));
  }

  const instaData = await getInstagramMediaData(instaId, instaToken);

  const gDatas = await Promise.all(
    instaData.map(async (mediaInfo, index) => {
      const { thumbnail_url, media_url } = mediaInfo;
      const fileUrl = thumbnail_url || media_url;
      const detectData = await downloadAndDetect(fileUrl, index);
      return { ...mediaInfo, ...detectData };
    })
  );

  const statistics = gDatas.reduce((acc, el) => {
    acc[el.description] = {
      count: (acc[el.description] && acc[el.description].count || 0) + 1,
      likeCountSum: (acc[el.description] && acc[el.description].likeCountSum || 0) + el.like_count,
      commentsCountSum: (acc[el.description] && acc[el.description].comments_count || 0) + el.comments_count,
    };
    return acc;
  }, {});

  /* Object.keys(statistics).map((key) => {
    statistics[key].percentage = 100 / (gDatas.length / statistics[key].percentage);
    return null;
  }); */

  const finalArray = Object.keys(statistics).map((key, index) => {
    statistics[key].value = 100 / (gDatas.length / statistics[key].count);
    return { ...statistics[key], description: key, color: colors[index] };
  });

  finalArray.sort((a, b) => b.value - a.value);

  res.json({
    code: 200,
    message: finalArray,
  });
});

router.get('/googleVision', async (req, res) => {
  const { instaId, instaToken } = req.query;

  const client = new vision.ImageAnnotatorClient({
    keyFilename: '/data/inflai/server/src/server/config/googleVisionKey.json'
  });

  async function detectPic(index) {
    const fileName = `../server/img/image${index}.jpg`;
    const [result] = await client.labelDetection(fileName);
    const labels = result.labelAnnotations;
    return new Promise(((resolve, reject) => {
      if (labels && labels[0]) {
        const { score, description } = labels[0];
        resolve({ score, description });
      }
      resolve({});
    }));
  }

  async function downloadAndDetect(fileUrl, index) {
    const response = await fetch(fileUrl);
    const buffer = await response.buffer();
    const path = `../server/img/image${index}.jpg`;

    return new Promise((async (resolve, reject) => {
      fs.writeFile(path, buffer, async () => {
        const detectResult = await detectPic(index);
        resolve(detectResult);
      });
    }));
  }

  const instaData = await getInstagramMediaData(instaId, instaToken);

  const gDatas = await Promise.all(
    instaData.map(async (mediaInfo, index) => {
      const { thumbnail_url, media_url } = mediaInfo;
      const fileUrl = thumbnail_url || media_url;
      const detectData = await downloadAndDetect(fileUrl, index);
      return { ...mediaInfo, ...detectData };
    })
  );

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
    return null;
  });

  res.json({
    code: 200,
    message: statistics,
    // data: gDatas
  });
});

router.get('/getInstaInfo', async (req, res) => {
  const { instaId, instaToken } = req.query;

  // const INF_INST_ID = '17841403617928174';
  // const INF_TOKEN = 'EAAJbZA7aqFJcBAPSZACWxB1AYRvTOtxa4ISfd1cAybTZCx7yOKPKWzO97adNvqHwZAMea3QB7uAbuQgOpBTZCI7cyZAX8gutfarI3WbyFwKrZAvOQQCmJoowHybthH9FgteJpZBTqKRhQnaLnohWgUZCmdAXq4uf0RBvfstxkfwklagZDZD';

  try {
    const instaData = await getInstagramData(instaId, instaToken);
    res.json({
      code: 200,
      data: instaData
    });
  } catch (err) {
    res.json({
      code: 400,
      message: err.message
    });
  }


  // const gDatas = await downloadAndDetect('https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/15538703_1714032728859764_6792233239500029952_n.jpg?_nc_cat=107&_nc_sid=8ae9d6&_nc_eui2=AeEOJTsjtR0-Ca5GNEXbDpXtGwl_yT9cZ1UbCX_JP1xnVVwuqT7-fi2hTPYbYvWd9Ge2GBrDlO-MsLUTT43QrdDX&_nc_ohc=1At3mlQqmCoAX-ofoO7&_nc_ht=scontent-nrt1-1.cdninstagram.com&oh=81666a783dfb0896201010e4e0545a94&oe=5F7B93F8', 0);
});

router.get('/updateInstaInfo', async (req, res) => {
  const instaInfo = await Insta.findAll();

  const instaData = await Promise.all(
    instaInfo.map(async (iData) => {
      const { INF_ID, INS_ACCOUNT_ID, INS_TOKEN } = iData;
      // const { INF_ID, INF_INST_ID, INF_TOKEN } = iData;
      try {
        const accountData = await getInstagramData(INS_ACCOUNT_ID, INS_TOKEN);
        const mediaData = await getInstagramMediaData(INS_ACCOUNT_ID, INS_TOKEN);

        const googleData = await googleVision(mediaData);

        const statistics = mediaData.reduce((acc, el) => ({
          likeSum: (acc.likeSum || 0) + el.like_count,
          commentsSum: (acc.commentsSum || 0) + el.comments_count,
        }), {});

        return {
          INF_ID, INS_TOKEN, ...accountData, ...statistics, ...googleData
        };
      } catch (error) {
        return { INF_ID, error };
      }
    })
  );

  const updatedArray = await Promise.all(
    instaData.map(async (iData) => {
      const {
        INF_ID, INF_TOKEN, types, likeSum, commentsSum, followers_count, follows_count, media_count, username, profile_picture_url, name, id, error
      } = iData;
      if (error) {
        return { INF_ID, message: 'not updated' };
      }

      try {
        const result = await Insta.upsert({
          INF_ID,
          INS_TOKEN: INF_TOKEN,
          INS_ACCOUNT_ID: id,
          INS_NAME: name.normalize('NFC'),
          INS_USERNAME: username,
          INS_MEDIA_CNT: media_count,
          INS_FLWR: followers_count,
          INS_FLW: follows_count,
          INS_PROFILE_IMG: profile_picture_url,
          INS_LIKES: likeSum,
          INS_CMNT: commentsSum,
          INS_TYPES: JSON.stringify(types)
        });
        return { INF_ID, message: result ? 'inserted' : 'updated' };
      } catch (err) {
        return {
          INF_ID,
          name,
          message: err.message,
          query: err.sql
        };
      }
    })
  );

  res.json({
    code: 200,
    data: updatedArray
  });
});

router.get('/updateTest', async (req, res) => {
  try {
    const result = await Insta.upsert({
      INF_ID: 65,
      INS_TOKEN: 'token',
      INS_ACCOUNT_ID: 12345,
      INS_NAME: 'testAccount',
      INS_USERNAME: 'testAccount',
      INS_MEDIA_CNT: 25,
      INS_FLWR: 25,
      INS_FLW: 25,
      INS_PROFILE_IMG: 'https://images.unsplash.com/photo-1542728498-09c6a1af7cb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
    });
    res.json({
      code: 200,
      data: result,
    });
  } catch (err) {
    return {
      message: err.message,
      query: err.sql
    };
  }
});

router.get('/getDate', async (req, res) => {
  const data = await Admin.findOne({
    where: { ADM_ID: 1 },
    attributes: [
      'ADM_UPDATE_DT',
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('ADM_UPDATE_DT'), '%Y.%m.%d %H:%i:%s'), 'ADM_UPDATE_DT2'],
      // [Sequelize.fn('DATE_ADD', Sequelize.col('ADM_UPDATE_DT'), 'INTERVAL 9 HOUR')],
      // [Sequelize.fn('FROM_UNIXTIME', Sequelize.col('ADM_UPDATE_DT'))],
    ],
  });

  res.json({
    code: 200,
    data
  });
});

module.exports = router;
