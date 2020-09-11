const express = require('express');
const request = require('request');
const fs = require('fs');
const fetch = require('node-fetch');
const vision = require('@google-cloud/vision');
const Influencer = require('../models').TB_INFLUENCER;
const Instagram = require('../models').TB_INSTA;
const { getInstagramMediaData, getInstagramData } = require('../config/common');


const router = express.Router();

router.get('/', async (req, res) => {
  const firstRow = 0;

  const options = {
    where: {},
    attributes: [
      'INS_ID',
      'INF_ID',
      'INS_NAME',
      'INS_USERNAME',
      'INS_MEDIA_CNT',
      'INS_FLW',
      'INS_FLWR',
      'INS_PROFILE_IMG',
    ],
    include: [
      {
        model: Influencer,
        attributes: ['INF_NAME']
      },
    ],
    order: [['INS_FLWR', 'DESC']]
  };

  const InstaBlogers = await Instagram.findAll(options);
  const InstaCount = await Instagram.count();
  let iCount = InstaCount - 1;

  for (let i = 0; i < InstaBlogers.length; i++) {
    InstaBlogers[i].dataValues.rownum = InstaCount - firstRow - (iCount--);
  }

  res.json({
    code: 200,
    data: { list: InstaBlogers, cnt: InstaCount },
  });

  /* try {
    const blogersArray = InstaBlogers.map((item, index) => {
      // const rownum = InstaCount - firstRow - (iCount - index);
      const rownum = { a: 5 };
      const obj = Object.assign(item, rownum);
      return obj;
    /!*  const x = '';
      return new Promise(((resolve, reject) => {
        const rownum = InstaCount - firstRow - (iCount - index);
        resolve({ ...item, rownum });
      })); *!/
    });

    res.json({
      code: 200,
      data: blogersArray,
    });
  } catch (err) {
    res.json({
      code: 400,
      data: err.message,
    });
  } */


  /* Instagram.findAll(options).then((result) => {
    list = result;
    Instagram.count().then((cnt) => {
      let icount = cnt - 1;

      for (let i = 0; i < list.length; i++) {
        list[i].dataValues.rownum = cnt - firstRow - (icount--);
      }

      res.json({
        code: 200,
        data: { list, cnt },
      });
    }).error((err2) => {
      res.send('error has occured');
    });
  }).error((err) => {
    res.send('error has occured');
  }); */
});

router.get('/getGoogleData', async (req, res) => {
  const { INS_ID } = req.query;

  const options = {
    where: { INS_ID },
    attributes: ['INS_ID', 'INS_TOKEN', 'INS_ACCOUNT_ID'],
  };

  const InstaData = await Instagram.findOne(options);
  const { INS_TOKEN, INS_ACCOUNT_ID } = InstaData;

  const client = new vision.ImageAnnotatorClient({
    keyFilename: 'src/server/config/googleVisionKey.json'
  });

  async function detectPic(index) {
    const fileName = `./src/server/img/image${index}.jpg`;
    // const fileName = `../server/img/image${index}.jpg`;
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
    const path = `./src/server/img/image${index}.jpg`;

    return new Promise((async (resolve, reject) => {
      fs.writeFile(path, buffer, async () => {
        const detectResult = await detectPic(index);
        resolve(detectResult);
      });
    }));
  }

  try {
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
    });
  } catch (err) {
    res.json({
      code: 400,
      message: err,
    });
  }
});

module.exports = router;
