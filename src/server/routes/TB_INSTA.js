const express = require('express');
const request = require('request');
const fs = require('fs');
const fetch = require('node-fetch');
const vision = require('@google-cloud/vision');
const Sequelize = require('sequelize');
const Influencer = require('../models').TB_INFLUENCER;
const Instagram = require('../models').TB_INSTA;


const { Op } = Sequelize;
const { getInstagramMediaData, getInstagramData } = require('../config/common');


const router = express.Router();

router.get('/', async (req, res) => {
  const { orderBy, direction, searchWord } = req.query;

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
      'INS_LIKES',
      'INS_CMNT',
    ],
    include: [
      {
        model: Influencer,
        attributes: ['INF_NAME'],
        where: {}
      },
    ],
    order: [[orderBy, direction]]
  };

  if (searchWord) {
    options.where = {
      [Op.or]: [
        { INS_NAME: { [Op.like]: `%${searchWord}%` } },
        { INS_USERNAME: { [Op.like]: `%${searchWord}%` } },
        { '$TB_INFLUENCER.INF_NAME$': { [Op.like]: `%${searchWord}%` } }
      ],
    };
    /* options.include[0].where = {
      INF_NAME: { [Op.like]: `%${searchWord}%` },
    }; */
  }

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
    // keyFilename: '/data/inflai/src/server/config/googleVisionKey.json'
  });

  const colors = [
    '#52D726', '#FFEC00', '#FF7300', '#FF0000',
    '#007ED6', '#7CDDDD', '#4D4D4D', '#5DA5DA',
    '#FAA43A', '#60BD68', '#F17CB0', '#B2912F',
    '#B276B2', '#DECF3F', '#81726A', '#270722',
    '#E8C547', '#C2C6A7', '#ECCE8E', '#DC136C',
    '#353A47', '#84B082', '#5C80BC', '#CDD1C4',
    '#7CDDDD'
  ];

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
    // const path = `../server/img/image${index}.jpg`;

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
      statistics: finalArray,
    });
  } catch (err) {
    res.json({
      code: 400,
      message: err,
    });
  }
});

module.exports = router;
