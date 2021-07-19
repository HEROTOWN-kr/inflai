const express = require('express');
const request = require('request');
const Sequelize = require('sequelize');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const uniqid = require('uniqid');
const fetch = require('node-fetch');
const vision = require('@google-cloud/vision');
const AWS = require('aws-sdk');
const xl = require('excel4node');
const puppeteer = require('puppeteer');
const { PythonShell } = require('python-shell');
const { parseString } = require('xml2js');
const moment = require('moment');
const category = require('../config/detectCategory');
// const PythonShell = require('python-shells');

const {
  hashData,
  mailSendData,
  resizeImage,
  getFacebookInfo,
  getInstagramMediaData,
  getInstagramData,
  googleVision,
  getInstagramInsights,
  YoutubeDataRequest,
  getInstaOnlineFlwrs,
  getInstaImpressions,
  getNewFollowers,
  decrypt,
  readFile,
  s3Upload
} = require('../config/common');

const { campaignApplied } = require('../config/kakaoMessage');
const config = require('../config/config');

const { Op } = Sequelize;
const Advertiser = require('../models').TB_ADVERTISER;
const Advertise = require('../models').TB_AD;
const Influencer = require('../models').TB_INFLUENCER;
const Participant = require('../models').TB_PARTICIPANT;
const Favorites = require('../models').TB_FAVORITES;
const Notification = require('../models').TB_NOTIFICATION;
const Youtube = require('../models').TB_YOUTUBE;
const Naver = require('../models').TB_NAVER;
const Insta = require('../models').TB_INSTA;
const Admin = require('../models').TB_ADMIN;
const Plan = require('../models').TB_PLAN;
const NavInf = require('../models').TB_NAVER_INF;
const KakInf = require('../models').TB_KAKAO_INF;
const KakAdv = require('../models').TB_KAKAO_ADV;
const NavAdv = require('../models').TB_NAVER_ADV;
const Photos = require('../models').TB_PHOTO_AD;
const test = require('./test');

const router = express.Router();

function calculatePoints(likeCount, commentsCount, followers, follows, media_count) {
  // const likesScore = likeCount * 10;
  // const commentsScore = commentsCount * 100;
  // const score = (followers + follows + likesScore + commentsScore) / 4;

  // const likesScore = Math.floor(likeCount / 100);
  // const commentsScore = Math.floor(commentsCount / 10);
  const likeToComment = (commentsCount / likeCount) * 100;
  const roundLikeToComment = likeToComment.toFixed(1);
  const score = (followers * roundLikeToComment) / 100;
  return Math.floor(score);
}

function visitorsReq(url) {
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        parseString(body, { attrkey: 'visitor' }, (err, result) => {
          const cntArray = result.visitorcnts.visitorcnt.map(item => item.visitor.cnt);
          const dateArray = result.visitorcnts.visitorcnt.map(item => item.visitor.id);
          resolve({ cntArray, dateArray });
        });
      } else if (error) {
        reject(error.message);
      } else {
        resolve('');
      }
    });
  });
}

function checkLocalHost(hostname) {
  const result = hostname.indexOf('localhost');
  return result !== -1;
}

router.get('/test', async (req, res) => {
  try {
    const { INS_ID, host } = req.query;
    const { detectCategory } = category;
    const isLocal = checkLocalHost(host);

    const colors = [
      '#FF835D', '#409CFF', '#52D726', '#FF0000',
      '#FFEC00', '#7CDDDD', '#4D4D4D', '#5DA5DA',
      '#FAA43A', '#60BD68', '#F17CB0', '#B2912F',
      '#B276B2', '#DECF3F', '#81726A', '#270722',
      '#E8C547', '#C2C6A7', '#ECCE8E', '#DC136C',
      '#353A47', '#84B082', '#5C80BC', '#CDD1C4',
      '#7CDDDD'
    ];

    const filePath = isLocal ? {
      keyFileName: 'src/server/config/googleVisionKey.json',
      imagePath: './src/server/img/image'
    } : {
      keyFileName: '/data/inflai/src/server/config/googleVisionKey.json',
      imagePath: '../server/img/image'
    };

    const client = new vision.ImageAnnotatorClient({
      keyFilename: filePath.keyFileName
    });

    const InstaData = await Insta.findOne({
      where: { INS_ID },
      attributes: ['INS_ID', 'INS_TOKEN', 'INS_ACCOUNT_ID'],
    });

    const { INS_TOKEN, INS_ACCOUNT_ID } = InstaData;

    const instaData = await getInstagramMediaData(INS_ACCOUNT_ID, INS_TOKEN);

    if (instaData.length > 0) {
      const downloadedFiles = instaData.map(async (mediaInfo, index) => {
        const { thumbnail_url, media_url } = mediaInfo;
        const fileUrl = thumbnail_url || media_url;
        const response = await fetch(fileUrl);
        const buffer = await response.buffer();
        const fileName = `${filePath.imagePath}${index}.jpg`;

        return new Promise((resolve, reject) => {
          fs.writeFile(fileName, buffer, (err) => {
            if (err) resolve(null);
            resolve(fileName);
          });
        });
      });

      const filesToDetect = await Promise.all(downloadedFiles);

      const detectedFiles = filesToDetect.map(async (item, index) => {
        const [result] = await client.labelDetection(item);
        const labels = result.labelAnnotations;

        return new Promise((resolve, reject) => {
          if (labels && labels[0]) {
            const { score, description } = labels[0];

            const name = detectCategory.reduce((acc, ctg) => {
              const wordExist = (ctg.categories.indexOf(description) > -1);
              if (wordExist) return ctg.name;
              return acc;
            }, description);
            resolve(name);
          }
          resolve(null);
        });
      });

      const detectedFilesObj = filesToDetect.map(async (item, index) => {
        const [result] = await client.objectLocalization(item);
        const objects = result.localizedObjectAnnotations;

        return new Promise((resolve, reject) => {
          if (objects.length > 0) {
            const { name, score } = objects[0];

            const description = detectCategory.reduce((acc, ctg) => {
              const wordExist = (ctg.categories.indexOf(name) > -1);
              if (wordExist) return ctg.name;
              return acc;
            }, name);
            resolve(description);
          }
          resolve(null);
        });
      });

      const detectionResultsObj = await Promise.all(detectedFilesObj);

      const resultFilteredObj = detectionResultsObj.reduce((acc, el) => {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
      }, {});

      const resultArrayObj = Object.keys(resultFilteredObj).map(item => ({
        description: item,
        count: resultFilteredObj[item]
      }));

      const resultSortObj = resultArrayObj.sort((a, b) => b.count - a.count).slice(0, 4);

      const resultPercentageObj = resultSortObj.map((item, index) => {
        const { description, count } = item;
        const value = Math.round(100 / (instaData.length / count));
        return { description, value, color: colors[index] };
      });

      const percentSumObj = resultPercentageObj.reduce((acc, el) => acc + el.value, 0);

      if (percentSumObj < 100) {
        const other = { description: '기타', value: 100 - percentSumObj, color: '#84B082' };
        const statistics = [...resultPercentageObj, other];
        return res.status(200).json({ statistics });
      }

      return res.status(200).json({ statistics: resultPercentageObj });
    }

    return res.status(200).json({ instaData });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.get('/test2', async (req, res) => {
  try {
    const { INS_ID } = req.query;
    const InstaData = await Insta.findOne({ where: { INS_ID } });

    if (!InstaData) return res.status(201).send({ message: 'Instagram not connected' });

    const { INS_TOKEN, INS_ACCOUNT_ID } = InstaData;

    const since = moment().day(-5).unix();
    const until = moment().day(-4).unix();

    const onlineFlwrs = await getInstaOnlineFlwrs(INS_ACCOUNT_ID, INS_TOKEN, since, until);

    res.status(200).json({ onlineFlwrs });
  } catch (err) {
    res.status(400).send(err.message);
  }
});


router.get('/kakaoMessageTest', async (req, res) => {
  try {
    const props = {
      phoneNumber: '01026763937',
      campaignName: 'TEST',
      campaignId: 224,
      advertiserName: 'ANDRIAN',
    };

    await campaignApplied(props);

    res.status(200).json({ data: 'success' });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/updateAll', async (req, res) => {
  try {
    await Influencer.update({ INF_ACTIVATED: 1 }, {
      where: { INF_ACTIVATED: 0 }
    });

    res.status(200).json({ data: 'success' });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/updateKakaoId', async (req, res) => {
  try {
    const InfAcc = await Advertiser.findAll({
      attributes: ['ADV_ID', 'ADV_REG_ID'],
      where: {
        ADV_BLOG_TYPE: '4',
      }
    });

    const PromiseArray = InfAcc.map(item => new Promise((async (resolve, reject) => {
      try {
        const {
          ADV_ID, ADV_REG_ID
        } = item;

        await KakAdv.create({
          ADV_ID,
          KAD_ACC_ID: ADV_REG_ID,
        });

        resolve('success');
      } catch (e) {
        resolve({ message: e.message });
      }
    })));

    const FbData = await Promise.all(PromiseArray);

    res.status(200).json({ data: FbData });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/updateNaverId', async (req, res) => {
  try {
    const InfAcc = await Advertiser.findAll({
      attributes: ['ADV_ID', 'ADV_REG_ID'],
      where: {
        ADV_BLOG_TYPE: '3',
        // INF_ID: { [Op.between]: [3074, 3144] }
      }
    });

    const PromiseArray = InfAcc.map(item => new Promise((async (resolve, reject) => {
      try {
        const {
          ADV_ID, ADV_REG_ID
        } = item;

        if (ADV_REG_ID) {
          await NavAdv.create({
            ADV_ID,
            NAD_ACC_ID: ADV_REG_ID,
          });
          resolve('success');
        } else {
          resolve('not updated');
        }
      } catch (e) {
        resolve({ message: e.message });
      }
    })));

    const FbData = await Promise.all(PromiseArray);

    res.status(200).json({ data: FbData });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/updateFbId', async (req, res) => {
  try {
    const InfAcc = await Insta.findAll({
      attributes: ['INS_ID', 'INF_ID', 'INS_ACCOUNT_ID', 'INS_TOKEN']
    });

    const PromiseArray = InfAcc.map(item => new Promise((async (resolve, reject) => {
      try {
        const {
          INS_ID, INF_ID, INS_ACCOUNT_ID, INS_TOKEN
        } = item;

        const FbInfo = await getFacebookInfo(INS_TOKEN);
        resolve({ INS_ID, INF_ID, INS_FB_ID: FbInfo.id });
      } catch (e) {
        resolve({ message: e.message });
      }
    })));

    const FbData = await Promise.all(PromiseArray);

    const PromiseUpdate = FbData.map(item => new Promise((async (resolve, reject) => {
      try {
        const { INS_ID, INF_ID, INS_FB_ID } = item;

        if (INS_ID) {
          await Insta.update({ INS_FB_ID }, {
            where: { INS_ID }
          });
          resolve('updated');
        } else {
          resolve('not updated');
        }
      } catch (e) {
        resolve({ message: e.message });
      }
    })));

    const UpdateResult = await Promise.all(PromiseUpdate);

    res.status(200).json({ data: UpdateResult });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/updateFbIdOne', async (req, res) => {
  try {
    const InfAcc = await Insta.findAll({
      where: { INS_ID: [32, 33, 36, 45, 48, 103, 182, 243] },
      attributes: ['INS_ID', 'INF_ID', 'INS_ACCOUNT_ID', 'INS_TOKEN']
    });

    const PromiseArray = InfAcc.map(item => new Promise((async (resolve, reject) => {
      try {
        const {
          INS_ID, INF_ID, INS_ACCOUNT_ID, INS_TOKEN
        } = item;

        const FbInfo = await getFacebookInfo(INS_TOKEN);
        resolve({ INS_ID, INF_ID, INS_FB_ID: FbInfo.id });
      } catch (e) {
        resolve({ message: e.message });
      }
    })));

    const FbData = await Promise.all(PromiseArray);

    /* const PromiseUpdate = FbData.map(item => new Promise((async (resolve, reject) => {
      try {
        const { INS_ID, INF_ID, INS_FB_ID } = item;

        if (INS_ID) {
          await Insta.update({ INS_FB_ID }, {
            where: { INS_ID }
          });
          resolve('updated');
        } else {
          resolve('not updated');
        }
      } catch (e) {
        resolve({ message: e.message });
      }
    })));

    const UpdateResult = await Promise.all(PromiseUpdate); */

    res.status(200).json({ data: FbData });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/instaTest', async (req, res) => {
  try {
    const { INS_ID } = req.query;
    const InstaData = await Insta.findOne({
      where: { INS_ID },
      attributes: ['INS_ACCOUNT_ID', 'INS_TOKEN', 'INS_USERNAME'],
    });
    const { INS_ACCOUNT_ID, INS_TOKEN, INS_USERNAME } = InstaData;

    const Insights = await getInstagramInsights(INS_ACCOUNT_ID, INS_TOKEN);

    const post = {};

    if (Insights.length > 0) {
      const genderAgeArray = Insights.filter(item => item.name === 'audience_gender_age');
      const countryArray = Insights.filter(item => item.name === 'audience_country');
      if (genderAgeArray.length > 0 && genderAgeArray[0].values && genderAgeArray[0].values.length > 0) {
        post.INS_STAT_AGE_GENDER = JSON.stringify(genderAgeArray[0].values[0].value);
      }
      if (countryArray.length > 0 && countryArray[0].values && countryArray[0].values.length > 0) {
        post.INS_STATE_LOC = JSON.stringify(countryArray[0].values[0].value);
      }
    }

    if (Object.keys(post).length > 0) {
      await Insta.update(post, { where: { INS_ID } });
    }

    res.status(200).json({
      name: INS_USERNAME,
      data: Insights,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/cronFileTest', async (req, res) => {
  try {
    const date = new Date();
    const timestamp = date.getTime();

    const instaInfo = await Insta.findAll();

    const instaData = await Promise.all(
      instaInfo.map(async (iData) => {
        const { INF_ID, INS_ACCOUNT_ID, INS_TOKEN } = iData;
        // const { INF_ID, INF_INST_ID, INF_TOKEN } = iData;
        try {
          const accountData = await getInstagramData(INS_ACCOUNT_ID, INS_TOKEN);
          const mediaData = await getInstagramMediaData(INS_ACCOUNT_ID, INS_TOKEN);

          const statistics = mediaData.reduce((acc, el) => ({
            likeSum: (acc.likeSum || 0) + el.like_count,
            commentsSum: (acc.commentsSum || 0) + el.comments_count,
          }), {});

          return {
            INF_ID, INS_TOKEN, ...accountData, ...statistics
          };
        } catch (error) {
          return { INF_ID, error };
        }
      })
    );

    await Promise.all(
      instaData.map(async (iData) => {
        const {
          INF_ID, INF_TOKEN, likeSum, commentsSum, followers_count, follows_count, media_count, username, profile_picture_url, name, id, error
        } = iData;

        if (error) {
          const InstaData = await Insta.findOne({
            where: { INF_ID },
            attributes: ['INS_LIKES', 'INS_CMNT', 'INS_MEDIA_CNT', 'INS_FLW', 'INS_FLWR'],
          });
          const {
            INS_LIKES, INS_CMNT, INS_MEDIA_CNT, INS_FLW, INS_FLWR
          } = InstaData;
          const score = calculatePoints(INS_LIKES, INS_CMNT, INS_FLWR, INS_FLW, INS_MEDIA_CNT);

          await Insta.update({ INS_SCORE: score, INS_STATUS: 0 }, { where: { INF_ID } });
          return { INF_ID, message: 'not updated' };
        }

        const score = calculatePoints(likeSum, commentsSum, followers_count, follows_count, media_count);

        try {
          const result = await Insta.update({
            INS_TOKEN: INF_TOKEN,
            INS_ACCOUNT_ID: id,
            INS_NAME: name ? name.normalize('NFC') : null,
            INS_USERNAME: username,
            INS_MEDIA_CNT: media_count,
            INS_FLWR: followers_count,
            INS_FLW: follows_count,
            INS_PROFILE_IMG: profile_picture_url,
            INS_LIKES: likeSum,
            INS_CMNT: commentsSum,
            INS_SCORE: score
          }, {
            where: { INF_ID }
          });
          return { INF_ID, message: result ? 'updated' : 'notUpdated' };
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

router.get('/excelTest', async (req, res) => {
  try {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');

    const data = [
      {
        INS_USERNAME: 'Shadab Shaikh',
        INS_FLW: 'shadab@gmail.com',
        INS_FLWR: '1234567890',
        INS_SCORE: '1234567890',
        INS_TYPES1: '1234567890',
        INS_TYPES2: '1234567890',
      },
      {
        INS_USERNAME: 'Shadab Shaikh2',
        INS_FLW: 'shadab@gmail.com2',
        INS_FLWR: '12345678902',
        INS_SCORE: '12345678902',
        INS_TYPES1: '12345678902',
        INS_TYPES2: '12345678902',
      },
    ];

    const dbData = await Insta.findAll({
      attributes: ['INS_USERNAME', 'INS_FLW', 'INS_FLWR', 'INS_SCORE', 'INS_TYPES'],
    });

    const influencersData = dbData.map((item) => {
      const {
        INS_USERNAME, INS_FLW, INS_FLWR, INS_SCORE, INS_TYPES
      } = item;
      const returnObj = {
        INS_USERNAME,
        INS_FLW: INS_FLW.toString(),
        INS_FLWR: INS_FLWR.toString(),
        INS_SCORE: INS_SCORE.toString(),
      };
      if (INS_TYPES) {
        const types = INS_TYPES.split(' ');
        returnObj.INS_TYPES1 = types[0];
        returnObj.INS_TYPES2 = types[1];
      } else {
        returnObj.INS_TYPES1 = 'Cosmetics';
        returnObj.INS_TYPES2 = 'Food';
      }
      return returnObj;
    });

    const headingColumnNames = [
      'INS_USERNAME',
      'INS_FLW',
      'INS_FLWR',
      'INS_SCORE',
      'INS_TYPES1',
      'INS_TYPES2',
    ];

    // Write Column Title in Excel file
    let headingColumnIndex = 1;
    headingColumnNames.forEach((heading) => {
      ws.cell(1, headingColumnIndex++).string(heading);
    });

    // Write Data in Excel file
    let rowIndex = 2;
    influencersData.forEach((record) => {
      let columnIndex = 1;
      Object.keys(record).forEach((columnName) => {
        ws.cell(rowIndex, columnIndex++).string(record[columnName]);
      });
      rowIndex++;
    });
    wb.write('./src/server/img/TeacherData.xlsx');
    return res.status(200).json({ message: 'success' });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});


router.get('/scrap', async (req, res) => {
  try {
    const { blogname } = req.query;
    const blogUrl = `https://m.blog.naver.com/PostList.nhn?blogId=${blogname}`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(blogUrl);
    await page.waitForSelector('.count_buddy', { visible: true });

    const contentButton = await page.$('.btn_t2');
    await contentButton.click();
    await page.waitForSelector('.lst_t4 > li > a > em', { visible: true });

    const followersText = await page.$eval('.count_buddy', el => el.innerText);
    const content = await page.$eval('.lst_t4 > li > a > em', el => el.innerText);
    await browser.close();

    const followersTextArray = followersText.split('ㆍ');
    const followersFiltered = followersTextArray.filter(item => item.indexOf('명의') !== -1);
    const followers = followersFiltered[0].replace('명의 이웃', '');

    const visitorUrl = `http://blog.naver.com/NVisitorgp4Ajax.nhn?blogId=${blogname}`;

    const result = await visitorsReq(visitorUrl);

    const resultSum = result.reduce((a, b) => a + parseInt(b, 10), 0);
    const visitors = Math.round(resultSum / result.length);

    return res.status(200).json({ followers, content, visitors });
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
});

router.get('/scrapTest', async (req, res) => {
  try {
    const { pageNum } = req.query;
    const limit = 100;
    const offset = (parseInt(pageNum, 10) - 1) * limit;

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

    const BlogData = await Naver.findAll({
      where: { NAV_BLOG_ID: { [Op.not]: null } },
      attributes: ['NAV_ID', 'NAV_BLOG_ID'],
      limit,
      offset,
    });

    const PromiseArray = BlogData.map(item => new Promise((async (resolve, reject) => {
      const page = await browser.newPage();
      const { NAV_ID, NAV_BLOG_ID } = item;
      try {
        const blogUrl = `https://m.blog.naver.com/PostList.nhn?blogId=${NAV_BLOG_ID}`;
        await page.goto(blogUrl, { waitUntil: 'networkidle0' });
        try {
          await page.waitForSelector('.count_buddy', { visible: true, timeout: 1000 });
        } catch (e) {
          resolve({ NAV_ID, message: e.message });
        }

        try {
          await page.waitForSelector('.btn_t2', { visible: true, timeout: 1000 });
        } catch (e) {
          resolve({ NAV_ID, message: e.message || 'btn_t2 error' });
        }

        const contentButton = await page.$('.btn_t2');
        await contentButton.click();

        try {
          await page.waitForSelector('.lst_t4 > li > a > em', { visible: true, timeout: 3000 });
        } catch (e) {
          resolve({ NAV_ID, message: e.message });
        }

        const followersText = await page.$eval('.count_buddy', (element) => {
          const spanTags = element.getElementsByTagName('span');
          while (spanTags[0]) spanTags[0].parentNode.removeChild(spanTags[0]);
          const textFollowers = element.innerText;
          return textFollowers.trim();
        });
        const content = await page.$eval('.lst_t4 > li > a > em', el => el.innerText);
        await page.close();

        const contentInt = content.replace(',', '');

        /* const followersTextArray = followersText.split('ㆍ');
        const followersFiltered = followersTextArray.filter(item2 => item2.indexOf('명의') !== -1);
        const followers = followersFiltered[0].replace('명의 이웃', '');
        const followersInt = followers.replace(',', ''); */

        const followers = followersText.replace('명의 이웃', '');
        const followersInt = followers.replace(',', '');

        const visitorUrl = `http://blog.naver.com/NVisitorgp4Ajax.nhn?blogId=${NAV_BLOG_ID}`;

        const visitors = await visitorsReq(visitorUrl);

        const { cntArray } = visitors;
        const cntSum = cntArray.reduce((a, b) => a + parseInt(b, 10), 0);
        const visitorsAvg = Math.round(cntSum / cntArray.length);

        resolve({
          NAV_ID,
          visitorsAvg,
          followers: followersInt,
          content: contentInt,
          visitors: JSON.stringify(visitors)
        });
      } catch (e) {
        await page.close();
        resolve({ NAV_ID, message: e.message });
      }
    })));

    const BlogDataCrawled = await Promise.all(PromiseArray);

    await browser.close();

    const UpdateArray = BlogDataCrawled.map(item => new Promise((async (resolve, reject) => {
      const {
        NAV_ID, followers, content, visitors, visitorsAvg, message
      } = item || {};

      if (followers && content && visitors) {
        const insertObj = {
          NAV_FLWR: followers,
          NAV_CONT: content,
          NAV_GUEST: visitors,
          NAV_GUEST_AVG: visitorsAvg
        };
        await Naver.update(insertObj, { where: { NAV_ID } });
        resolve({ NAV_ID, message: 'success' });
      } else {
        resolve({ NAV_ID, message });
      }
    })));

    const BlogDataUpdated = await Promise.all(UpdateArray);

    /*  const followersTextArray = followersText.split('ㆍ');
    const followersFiltered = followersTextArray.filter(item => item.indexOf('명의') !== -1);
    const followers = followersFiltered[0].replace('명의 이웃', '');

    const visitorUrl = `http://blog.naver.com/NVisitorgp4Ajax.nhn?blogId=${blogname}`;

    const result = await visitorsReq(visitorUrl);

    const resultSum = result.reduce((a, b) => a + parseInt(b, 10), 0);
    const visitors = Math.round(resultSum / result.length); */

    return res.status(200).json({ data: BlogDataUpdated });
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
});

router.get('/pupeeter', async (req, res) => {
  try {
    const refresh_token = '1//0eXlOWoqaJDcLCgYIARAAGA4SNwF-L9Irsty4yD4mbBcD8wlMYlHKPWTDekRwIc6zSjbTLWmq2FY5jD9kMXHI3o1dkk0-2Enrf-g';
    const INF_ID = '137';
    const youtubeChannelData = await YoutubeDataRequest(refresh_token, INF_ID);
    const channelId = youtubeChannelData.id;
    const { viewCount, subscriberCount } = youtubeChannelData.statistics;
    const { title, description } = youtubeChannelData.snippet;
    /* const visitorUrl = 'http://blog.naver.com/NVisitorgp4Ajax.nhn?blogId=young740708';

    const visitors = await visitorsReq(visitorUrl);

    const { cntArray } = visitors;
    const cntSum = cntArray.reduce((a, b) => a + parseInt(b, 10), 0);
    const visitorsAvg = Math.round(cntSum / cntArray.length); */
    /* const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const blogUrl = 'https://m.blog.naver.com/PostList.nhn?blogId=msinvestment';
    await page.goto(blogUrl, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.count_buddy', { visible: true, timeout: 1000 });
    // const contentButton = await page.$('.count_buddy');
    const followersText = await page.$eval('.count_buddy', (element) => {
      const spanTags = element.getElementsByTagName('span');
      while (spanTags[0]) spanTags[0].parentNode.removeChild(spanTags[0]);
      return element.innerText;
    });

    const followers = followersText.replace('명의 이웃', ''); */
    // while (contentButton.firstChild) {
    //   contentButton.removeChild(contentButton.firstChild);
    // }

    /*  try {
      await page.waitForSelector('.count_buddy', { visible: true, timeout: 1000 });
    } catch (e) {
      return res.status(400).send({ message: e.message });
    }
    const contentButton = await page.$('.count_buddy');
*/
    return res.status(200).json({ data: youtubeChannelData });
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
});

router.get('/python', async (req, res) => {
  try {
    const { blogname } = req.query;
    // const pyshell = new PythonShell('src/server/main.py');
    // const pyshell = new PythonShell('C:\\Users\\HEROTOWN\\Desktop\\ANDRIAN\\projects\\python\\scrapper\\main.py');
    const naverBlog = {};

    const options = {
      mode: 'text',
      args: [blogname]
    };

    PythonShell.run('src/server/python/main.py', options, (err, results) => {
      if (err) {
        return res.status(400).send({ message: err.message });
      }
      naverBlog.followers = results;

      PythonShell.run('src/server/python/content.py', options, async (err, results) => {
        if (err) {
          return res.status(400).send({ message: err.message });
        }
        naverBlog.content = results;

        const url = `http://blog.naver.com/NVisitorgp4Ajax.nhn?blogId=${blogname}`;

        const result = await visitorsReq(url);

        const resultSum = result.reduce((a, b) => a + parseInt(b, 10), 0);
        const finalResult = Math.round(resultSum / result.length);

        naverBlog.visitors = finalResult;

        return res.status(200).json({ data: naverBlog });


        // results is an array consisting of messages collected during execution
      });
      // results is an array consisting of messages collected during execution
    });


    /* pyshell.on('message', (message) => {
      // received a message sent from the Python script (a simple "print" statement)
      naverBlog.followers = message;
    });

    pyshell.end((err) => {
      if (err) {
        return res.status(400).send({ message: err.message });
      }

      return res.status(200).json({ data: naverBlog });
    }); */


    /* PythonShell.runString('x=1+1;print(x)', null, (err) => {
      if (err) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(200).json({ data: '' });
    }); */
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
});

router.get('/visitors', async (req, res) => {
  try {
    const { blogname } = req.query;

    const url = `http://blog.naver.com/NVisitorgp4Ajax.nhn?blogId=${blogname}`;

    const result = await visitorsReq(url);

    const resultSum = result.reduce((a, b) => a + parseInt(b, 10), 0);
    const finalResult = Math.round(resultSum / result.length);

    return res.status(200).json({ data: finalResult });
  } catch (e) {
    return res.status(400).send({ message: e.message });
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

router.post('/bucketUpload', async (req, res) => {
  try {
    const dbPhotos = await Advertiser.findAll({
      where: { ADV_PHOTO: { [Op.notLike]: '%/attach%' } },
      attributes: ['ADV_ID', 'ADV_PHOTO']
    });

    const PhotoPromises = dbPhotos.map(item => new Promise((async (resolve, reject) => {
      const { ADV_ID, ADV_PHOTO } = item;
      // const photoKey = ADV_PHOTO.replace('/attach/', '');
      // const photoUrl = `https://inflai-aws-bucket.s3.ap-northeast-2.amazonaws.com/${photoKey}`;

      try {
        const post = {
          ADV_PHOTO_URL: ADV_PHOTO,
          // ADV_PHOTO_KEY: photoKey
        };
        await Advertiser.update(post, { where: { ADV_ID } });
        resolve({
          result: 'updated', ADV_ID
        });
      } catch (err) {
        resolve({
          result: 'not updated', ADV_ID
        });
      }
    })));

    const allPromises = await Promise.all(PhotoPromises);

    return res.status(200).json({ data: allPromises });
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
});


module.exports = router;
