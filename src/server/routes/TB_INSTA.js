const express = require('express');
const request = require('request');
const fs = require('fs');
const fetch = require('node-fetch');
const vision = require('@google-cloud/vision');
const Sequelize = require('sequelize');
const config = require('../config/config');
const Influencer = require('../models').TB_INFLUENCER;
const Instagram = require('../models').TB_INSTA;
const common = require('../config/common');


const { Op } = Sequelize;
const {
  getInstagramMediaData,
  getInstagramData,
  getInstagramInsights,
  getIdFromToken,
  getFacebookLongToken,
  getInstagramBusinessAccounts
} = require('../config/common');


const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      orderBy, direction, searchWord
    } = req.query;

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
        'INS_TYPES',
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
          { INS_TYPES: { [Op.like]: `%${searchWord}%` } },
          { '$TB_INFLUENCER.INF_NAME$': { [Op.like]: `%${searchWord}%` } }
        ],
      };
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
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/getGoogleData', async (req, res) => {
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

  const InstaData = await Instagram.findOne(options);
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
    const path = `${filePath.imagePath}${index}.jpg`;

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

    const finalArray = Object.keys(statistics).map((key, index) => {
      statistics[key].value = 100 / (gDatas.length / statistics[key].count);
      return { ...statistics[key], description: key, color: colors[index] };
    });

    finalArray.sort((a, b) => b.value - a.value);

    const INS_TYPES = finalArray.reduce((acc, el) => {
      acc.push(el.description);
      return acc;
    }, []);

    Instagram.update({ INS_TYPES: INS_TYPES.join(' ') }, {
      where: { INS_ID }
    });

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

router.get('/detail', async (req, res) => {
  try {
    const { INS_ID } = req.query;

    const options = {
      where: { INS_ID },
      attributes: ['INS_ID', 'INS_TOKEN', 'INS_ACCOUNT_ID'],
    };

    const InstaData = await Instagram.findOne(options);
    const { INS_TOKEN, INS_ACCOUNT_ID } = InstaData;

    const instaData = await getInstagramMediaData(INS_ACCOUNT_ID, INS_TOKEN);
    const statistics = instaData.reduce((acc, el) => {
      const { like_count, comments_count } = el;
      if (acc.likeStats) {
        acc.likeStats.push(like_count);
      } else {
        acc.likeStats = [like_count];
      }
      if (acc.commentsStats) {
        acc.commentsStats.push(comments_count);
      } else {
        acc.commentsStats = [comments_count];
      }
      return acc;
    }, {});

    res.json({
      code: 200,
      data: statistics,
    });
  } catch (err) {
    res.json({
      code: 400,
      data: err.message,
    });
  }
});

router.get('/statsAge', async (req, res) => {
  try {
    const { INS_ID } = req.query;

    const options = {
      where: { INS_ID },
      attributes: ['INS_STAT_AGE_GENDER'],
    };

    const InstaData = await Instagram.findOne(options);
    const { INS_STAT_AGE_GENDER } = InstaData;

    if (INS_STAT_AGE_GENDER) {
      const ageStats = JSON.parse(INS_STAT_AGE_GENDER);
      const ageStatsFiltered = Object.keys(ageStats).reduce((acc, item) => {
        if (acc[item.substring(2)]) {
          acc[item.substring(2)] += ageStats[item];
        } else {
          acc[item.substring(2)] = ageStats[item];
        }
        return acc;
      }, {});
      const ordered = {};
      Object.keys(ageStatsFiltered).sort().forEach((key) => {
        ordered[key] = ageStatsFiltered[key];
      });
      const orderedFilter = Object.keys(ordered).reduce((acc, key) => {
        acc.interval.push(key);
        acc.age.push(ordered[key]);
        return acc;
      }, { interval: [], age: [] });

      res.json({
        code: 200,
        data: orderedFilter,
      });
    } else {
      res.json({
        code: 200,
        data: [],
      });
    }
    /* const statistics = instaData.reduce((acc, el) => {
      const { like_count, comments_count } = el;
      if (acc.likeStats) {
        acc.likeStats.push(like_count);
      } else {
        acc.likeStats = [like_count];
      }
      if (acc.commentsStats) {
        acc.commentsStats.push(comments_count);
      } else {
        acc.commentsStats = [comments_count];
      }
      return acc;
    }, {}); */
  } catch (err) {
    res.json({
      code: 400,
      data: err.message,
    });
  }
});

router.get('/statsGender', async (req, res) => {
  try {
    const { INS_ID } = req.query;

    const options = {
      where: { INS_ID },
      attributes: ['INS_STAT_AGE_GENDER'],
    };

    const InstaData = await Instagram.findOne(options);
    const { INS_STAT_AGE_GENDER } = InstaData;

    if (INS_STAT_AGE_GENDER) {
      const ageStats = JSON.parse(INS_STAT_AGE_GENDER);
      const ageStatsFiltered = Object.keys(ageStats).reduce((acc, item) => {
        if (acc[item.charAt(0)]) {
          acc[item.charAt(0)] += ageStats[item];
        } else {
          acc[item.charAt(0)] = ageStats[item];
        }
        acc.sum = (acc.sum || 0) + ageStats[item];
        return acc;
      }, {});

      const {
        U, M, F, sum
      } = ageStatsFiltered;

      const male = Math.round(100 / (sum / M));

      res.json({
        code: 200,
        data: male,
      });
    } else {
      res.json({
        code: 200,
        data: [],
      });
    }
  } catch (err) {
    res.json({
      code: 400,
      data: err.message,
    });
  }
});

router.get('/statsMap', async (req, res) => {
  try {
    const { INS_ID } = req.query;

    const options = {
      where: { INS_ID },
      attributes: ['INS_STATE_LOC'],
    };

    const colors = [
      '#FF835D', '#409CFF', '#52D726', '#FF0000',
      '#FFEC00', '#7CDDDD', '#4D4D4D', '#5DA5DA',
      '#FAA43A', '#60BD68', '#F17CB0', '#B2912F',
      '#B276B2', '#DECF3F', '#81726A', '#270722',
      '#E8C547', '#C2C6A7', '#ECCE8E', '#DC136C',
      '#353A47', '#84B082', '#5C80BC', '#CDD1C4',
      '#7CDDDD'
    ];

    const InstaData = await Instagram.findOne(options);
    const { INS_STATE_LOC } = InstaData;

    if (INS_STATE_LOC) {
      const ageStats = JSON.parse(INS_STATE_LOC);

      const ageStatsArray = Object.keys(ageStats).map((key, index) => ({ country: key, count: ageStats[key] }));
      const sortedStats = ageStatsArray.sort((a, b) => b.count - a.count);
      const results = sortedStats.reduce((acc, item, index) => {
        acc.country.push(item.country);
        acc.count.push(item.count);
        acc.color.push(colors[index]);
        return acc;
      }, { country: [], count: [], color: [] });

      res.json({
        code: 200,
        data: results,
      });
    } else {
      res.json({
        code: 200,
        data: [],
      });
    }
  } catch (err) {
    res.json({
      code: 400,
      data: err.message,
    });
  }
});

router.get('/rankingInfo', async (req, res) => {
  try {
    const data = req.query;
    const { token } = data;
    const id = getIdFromToken(token).sub;

    const options = {
      where: { INF_ID: id },
      attributes: [
        'INS_ID',
        'INS_TOKEN',
        'INS_ACCOUNT_ID',
        'INS_NAME',
        'INS_USERNAME',
        'INS_MEDIA_CNT',
        'INS_FLW',
        'INS_FLWR',
        'INS_PROFILE_IMG',
        'INS_LIKES',
        'INS_CMNT',
        'INS_TYPES',
        'INS_IS_FAKE',
        'INS_DT',
      ]
    };

    const InstaData = await Instagram.findOne(options);
    const {
      INS_TOKEN, INS_ACCOUNT_ID
    } = InstaData;

    const detailInstaData = await getInstagramData(INS_ACCOUNT_ID, INS_TOKEN);
    const { biography, website } = detailInstaData;

    res.json({
      code: 200,
      data: {
        ...InstaData.dataValues,
        biography,
        website
      },
    });
  } catch (err) {
    res.json({
      code: 400,
      data: err.message,
    });
  }
});

router.post('/add', async (req, res) => {
  try {
    const data = req.body;
    const {
      facebookToken, facebookUserId, token, instaId
    } = data;
    const id = getIdFromToken(token).sub;
    const longToken = await getFacebookLongToken(facebookToken);

    if (instaId) {
      const instaAccountExist = await Instagram.findOne({ where: { INS_ACCOUNT_ID: instaId } });
      if (instaAccountExist) {
        res.status(409).send('중복된 인스타그램 계정입니다');
      } else {
        const instagramData = await getInstagramData(instaId, longToken);
        const mediaData = await getInstagramMediaData(instaId, longToken);
        const statistics = mediaData.reduce((acc, el) => ({
          likeSum: (acc.likeSum || 0) + el.like_count,
          commentsSum: (acc.commentsSum || 0) + el.comments_count,
        }), {});

        let ageStats;
        let genderLocalStats;

        try {
          const insights = await getInstagramInsights(instaId, longToken);
          ageStats = insights[0].values[0].value;
          genderLocalStats = insights[1].values[0].value;
        } catch (err) {
          console.log(err);
        }

        const {
          follows_count, followers_count, media_count, username, name, profile_picture_url
        } = instagramData;

        const createParams = {
          INF_ID: id,
          INS_TOKEN: longToken,
          INS_ACCOUNT_ID: instaId,
          INS_FLW: follows_count,
          INS_FLWR: followers_count,
          INS_NAME: name,
          INS_USERNAME: username,
          INS_MEDIA_CNT: media_count,
          INS_PROFILE_IMG: profile_picture_url,
          INS_LIKES: statistics.likeSum,
          INS_CMNT: statistics.commentsSum
        };

        if (ageStats) createParams.INS_STAT_AGE_GENDER = JSON.stringify(ageStats);
        if (genderLocalStats) createParams.INS_STATE_LOC = JSON.stringify(genderLocalStats);

        await Instagram.create(createParams);
        res.status(200).json({ message: 'success' });
      }
    } else {
      const instaAccounts = await getInstagramBusinessAccounts(longToken);
      if (instaAccounts.length > 1) {
        res.status(202).json({ data: instaAccounts });
      } else {
        const instagramId = instaAccounts[0].id;
        const instaAccountExist = await Instagram.findOne({ where: { INS_ACCOUNT_ID: instagramId } });
        if (instaAccountExist) {
          res.status(409).json({ message: '중복된 인스타그램 계정입니다' });
        } else {
          const instagramData = await getInstagramData(instagramId, longToken);
          const {
            follows_count, followers_count, media_count, username, name, profile_picture_url
          } = instagramData;

          const mediaData = await getInstagramMediaData(instagramId, longToken);
          const statistics = mediaData.reduce((acc, el) => ({
            likeSum: (acc.likeSum || 0) + el.like_count,
            commentsSum: (acc.commentsSum || 0) + el.comments_count,
          }), {});

          let ageStats;
          let genderLocalStats;

          try {
            const insights = await getInstagramInsights(instagramId, longToken);
            ageStats = insights[0].values[0].value;
            genderLocalStats = insights[1].values[0].value;
          } catch (err) {
            console.log(err);
          }

          const createParams = {
            INF_ID: id,
            INS_TOKEN: longToken,
            INS_ACCOUNT_ID: instagramId,
            INS_FLW: follows_count,
            INS_FLWR: followers_count,
            INS_NAME: name,
            INS_USERNAME: username,
            INS_MEDIA_CNT: media_count,
            INS_PROFILE_IMG: profile_picture_url,
            INS_LIKES: statistics.likeSum,
            INS_CMNT: statistics.commentsSum
          };

          if (ageStats) createParams.INS_STAT_AGE_GENDER = JSON.stringify(ageStats);
          if (genderLocalStats) createParams.INS_STATE_LOC = JSON.stringify(genderLocalStats);

          await Instagram.create(createParams);
          res.status(200).json({ message: 'success', data: instagramData });
        }
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const data = req.body;
    const { id } = data;

    await Instagram.destroy({ where: { INS_ID: id } });

    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
