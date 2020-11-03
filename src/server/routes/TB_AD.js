const express = require('express');
const Sequelize = require('sequelize');

const uniqid = require('uniqid');
const fse = require('fs-extra');
const path = require('path');
const config = require('../config/config');

const Advertise = require('../models').TB_AD;
const Advertiser = require('../models').TB_ADVERTISER;
const Influencer = require('../models').TB_INFLUENCER;
const Notification = require('../models').TB_NOTIFICATION;
const Participant = require('../models').TB_PARTICIPANT;
const Payment = require('../models').TB_PAYMENT;
const Photo = require('../models').TB_PHOTO_AD;
const { getIdFromToken } = require('../config/common');
const common = require('../config/common');


const router = express.Router();

router.get('/getAll', async (req, res) => {
  try {
    const data = req.query;
    const offset = (data.page - 1) * 10;
    const firstRow = 0;

    const dbData = await Advertise.findAndCountAll({
      attributes: ['AD_ID', 'AD_NAME', 'AD_CTG', 'AD_CTG2',
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('AD_DT'), '%Y-%m-%d'), 'AD_DT']
      ],
      include: [
        {
          model: Photo,
          attributes: ['PHO_FILE'],
          required: false,
        }
      ],
      limit: 10,
      offset,
      order: [['AD_ID', 'DESC']]
    });

    const { rows, count } = dbData;

    let icount = count - 1;

    const campaignsRes = rows.map((item, index) => {
      const { dataValues } = item;
      const rownum = count - firstRow - (icount--);
      return { ...dataValues, rownum };
    });

    res.status(200).json({ data: { campaignsRes, countRes: count } });

    /* let icount = cnt - 1;
    for (let i = 0; i < list.length; i++) {
      list[i].dataValues.rownum = cnt - firstRow - (icount--);
    } */
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const data = req.body;
    // const userId = common.getIdFromToken(data.token).sub;
    const userId = 48;
    const {
      advertiserId, campaignName, delivery, detailAddress, detailInfo,
      discription, email, extraAddress, influencerCount, phone,
      postcode, provideInfo, roadAddress, searchFinish, searchKeyword,
      searchStart, shortDisc, sns, subtype, type, visible, insta,
      naver, youtube
    } = data;

    const post = {
      ADV_ID: userId,
      AD_INF_CNT: influencerCount,
      AD_SRCH_START: searchStart,
      AD_SRCH_END: searchFinish,
      AD_DELIVERY: delivery,
      AD_VISIBLE: visible,
      AD_CTG: type,
      AD_CTG2: subtype,
      AD_POST_CODE: postcode,
      AD_ROAD_ADDR: roadAddress,
      AD_DETAIL_ADDR: detailAddress,
      AD_EXTR_ADDR: extraAddress,
      AD_TEL: phone,
      AD_EMAIL: email,
      AD_NAME: campaignName,
      AD_SHRT_DISC: shortDisc,
      AD_SEARCH_KEY: searchKeyword,
      AD_DISC: discription,
      AD_INSTA: insta,
      AD_YOUTUBE: youtube,
      AD_NAVER: naver,
    };

    if (detailInfo) post.AD_DETAIL = detailInfo;
    if (provideInfo) post.AD_PROVIDE = provideInfo;

    const newAdvertise = await Advertise.create(post);

    res.status(200).json({ data: newAdvertise });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const data = req.body;
    const {
      campaignId, campaignName, delivery, detailAddress, detailInfo,
      discription, email, extraAddress, influencerCount, phone,
      postcode, provideInfo, roadAddress, searchFinish, searchKeyword,
      searchStart, shortDisc, subtype, type, visible, insta,
      naver, youtube
    } = data;

    const post = {
      AD_INF_CNT: influencerCount,
      AD_SRCH_START: searchStart,
      AD_SRCH_END: searchFinish,
      AD_DELIVERY: delivery,
      AD_VISIBLE: visible,
      AD_CTG: type,
      AD_CTG2: subtype,
      AD_POST_CODE: postcode,
      AD_ROAD_ADDR: roadAddress,
      AD_DETAIL_ADDR: detailAddress,
      AD_EXTR_ADDR: extraAddress,
      AD_TEL: phone,
      AD_EMAIL: email,
      AD_NAME: campaignName,
      AD_SHRT_DISC: shortDisc,
      AD_SEARCH_KEY: searchKeyword,
      AD_DISC: discription,
      AD_INSTA: insta,
      AD_YOUTUBE: youtube,
      AD_NAVER: naver,
    };

    if (detailInfo) post.AD_DETAIL = detailInfo;
    if (provideInfo) post.AD_PROVIDE = provideInfo;

    await Advertise.update(post, { where: { AD_ID: campaignId } });

    res.status(200).json({ message: 'success' });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/adminCreateAd', (req, res) => {
  const data = req.body;

  const post = {
    ADV_ID: data.advId,
    AD_TYPE: data.type,
    AD_PROD_PRICE: data.price,
    AD_PRICE: (data.nanoSum + data.microSum + data.macroSum + data.megaSum + data.celebritySum + data.videoPrice).toString()
  };


  if (data.reuse) post.AD_PROD_REUSE = 'Y';
  if (data.nano) post.AD_INF_NANO = data.nano;
  if (data.micro) post.AD_INF_MICRO = data.micro;
  if (data.macro) post.AD_INF_MACRO = data.macro;
  if (data.mega) post.AD_INF_MEGA = data.mega;
  if (data.celebrity) post.AD_INF_CELEB = data.celebrity;

  if (data.name) post.AD_PROD_NAME = data.name;
  if (data.searchDate) post.AD_SRCH_END = data.searchDate;
  if (data.finishDate) post.AD_POST_END = data.finishDate;
  if (data.startSearch) post.AD_SRCH_START = data.startSearch;
  if (data.typeCategory) post.AD_CTG = JSON.stringify(data.typeCategory);
  if (data.channel) post.AD_CHANNEL = JSON.stringify(data.channel);
  if (data.presidentName) post.AD_COMP_NAME = data.presidentName;
  if (data.about) post.AD_ABOUT = data.about;
  if (data.tags) post.AD_TAGS = data.tags;
  if (data.photo) post.AD_PHOTO = JSON.stringify(data.photo);


  /* res.json({
    code: 200,
    data: post
  }); */

  Advertise.create(post).then((result) => {
    res.json({
      code: 200,
      id: result.dataValues.AD_ID,
    });
  });
});

router.get('/', (req, res) => {
  const { token } = req.query;
  const userId = common.getIdFromToken(token).sub;

  Advertise.findAll({
    where: { ADV_ID: userId },
    order: [['AD_ID', 'DESC']],
    attributes: ['AD_ID', 'AD_PROD_NAME', 'AD_PRICE', 'AD_PROD_PRICE', 'AD_PAID', 'AD_SRCH_END', 'AD_UID', 'AD_INF_NANO', 'AD_INF_MICRO', 'AD_INF_MACRO', 'AD_INF_MEGA', 'AD_INF_CELEB',
      [Sequelize.literal('AD_INF_NANO + AD_INF_MICRO + AD_INF_MACRO + AD_INF_MEGA + AD_INF_CELEB'), 'INF_SUM'],
      // [Sequelize.literal('CASE WHEN "AD_PAID" = "Y" THEN "결제완료" ELSE "결제안됨"'), 'AD_PAID']
    ],
    include: [
      {
        model: Advertiser,
        attributes: ['ADV_NAME', 'ADV_COM_NAME', 'ADV_EMAIL', 'ADV_TEL']
      }
    ]
  }).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/getAdInfluencers', (req, res) => {
  const { token, adId } = req.query;
  const userId = common.getIdFromToken(token).sub;

  Advertise.findOne({
    where: { AD_ID: adId },
    attributes: ['AD_ID', 'ADV_ID', 'AD_PROD_NAME', 'AD_INF_NANO', 'AD_INF_MICRO', 'AD_INF_MACRO', 'AD_INF_MEGA', 'AD_INF_CELEB'],
  }).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/list', async (req, res) => {
  try {
    const advertises = await Advertise.findAll({
      where: { AD_VISIBLE: 1 },
      order: [['AD_ID', 'DESC']],
      attributes: ['AD_ID', 'AD_INSTA', 'AD_YOUTUBE', 'AD_NAVER', 'AD_SRCH_START', 'AD_SRCH_END', 'AD_CTG', 'AD_CTG2', 'AD_NAME', 'AD_SHRT_DISC', 'AD_INF_CNT'],
      include: [
        {
          model: Photo,
          attributes: ['PHO_ID', 'PHO_FILE'],
          required: false
        },
        {
          model: Participant,
          attributes: ['PAR_ID'],
          required: false,
        },
      ],
    });

    const advertisesMaped = advertises.map((item) => {
      const { AD_INF_CNT, TB_PARTICIPANTs } = item.dataValues;
      const proportion = Math.round(100 / (AD_INF_CNT / TB_PARTICIPANTs.length));
      return {
        ...item.dataValues, proportion
      };
    });


    res.status(200).json({ data: advertisesMaped });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/campaignDetail', async (req, res) => {
  try {
    const data = req.query;
    const { id, token } = data;
    const includeArray = [
      {
        model: Photo,
        attributes: ['PHO_ID', 'PHO_FILE'],
        required: false,
      }
    ];
    let userId;

    if (token) {
      userId = common.getIdFromToken(token).sub;
      includeArray.push({
        model: Notification,
        where: { INF_ID: userId },
        attributes: ['NOTI_ID'],
        required: false
      });
    }

    const advertise = await Advertise.findOne({
      where: { AD_ID: id },
      attributes: [
        'AD_ID', 'AD_INSTA', 'AD_YOUTUBE', 'AD_NAVER', 'AD_SRCH_START',
        'AD_SRCH_END', 'AD_CTG', 'AD_CTG2', 'AD_NAME', 'AD_SHRT_DISC',
        'AD_INF_CNT', 'AD_DELIVERY', 'AD_POST_CODE', 'AD_ROAD_ADDR', 'AD_DETAIL_ADDR',
        'AD_EXTR_ADDR', 'AD_TEL', 'AD_EMAIL', 'AD_SEARCH_KEY', 'AD_DISC', 'AD_DETAIL', 'AD_EMAIL'
      ],
      include: includeArray
    });

    res.status(200).json({ data: advertise });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/detail', async (req, res) => {
  try {
    const data = req.query;
    const { id } = data;

    const advertiseData = await Advertise.findOne({
      where: { AD_ID: id },
      include: [
        {
          model: Photo,
          required: false,
        }
      ]
    });

    res.status(200).json({
      data: advertiseData
    });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/createAd', (req, res) => {
  const data = req.body;
  const userId = common.getIdFromToken(data.token).sub;

  const post = {
    ADV_ID: userId,
    AD_TYPE: data.type,
    AD_PROD_PRICE: data.price,
    AD_PRICE: (data.nanoSum + data.microSum + data.macroSum + data.megaSum + data.celebritySum + data.videoPrice).toString()
  };

  if (data.reuse) post.AD_PROD_REUSE = 'Y';
  if (data.nano) post.AD_INF_NANO = data.nano;
  if (data.micro) post.AD_INF_MICRO = data.micro;
  if (data.macro) post.AD_INF_MACRO = data.macro;
  if (data.mega) post.AD_INF_MEGA = data.mega;
  if (data.celebrity) post.AD_INF_CELEB = data.celebrity;

  Advertise.create(post).then((result) => {
    res.json({
      code: 200,
      id: result.dataValues.AD_ID,
    });
  });
});

router.post('/updateAd', (req, res) => {
  const data = req.body;
  const { id } = data;

  // data.typeCategory, data.age, data.channel, data.photo are arrays
  // try to stringify them
  // need search_start datetime data


  const post = {
    AD_PROD_NAME: data.name,
    AD_SRCH_END: data.searchDate,
    AD_POST_END: data.finishDate,
    AD_SEX: data.sex,
    AD_COMP_NAME: data.presidentName,
    AD_ABOUT: data.about,
    AD_SPON_ITEM: data.sponsoredItem,
    AD_CONT_TYPE: data.content,
    AD_VIDEO_TYPE: data.videoType,
    AD_PUBL_TEXT: data.publicText,
    AD_TAGS: data.tags,
    AD_UID: `merchant_${id}`
  };

  if (data.typeCategory) post.AD_CTG = JSON.stringify(data.typeCategory);
  if (data.age) post.AD_AGE = JSON.stringify(data.age);
  if (data.channel) post.AD_CHANNEL = JSON.stringify(data.channel);
  if (data.photo) post.AD_PHOTO = JSON.stringify(data.photo);


  Advertise.update(post, {
    where: { AD_ID: id }
  }).then((result) => {
    if (result) {
      res.json({
        code: 200,
        userName: data.name,
      });
    }
  });
});

router.post('/delete', (req, res) => {
  const data = req.body;
  const { id } = data;

  Photo.destroy({
    where: { AD_ID: id }
  }).then((result) => {
    Notification.destroy({
      where: { AD_ID: id }
    }).then((result2) => {
      Payment.destroy({
        where: { AD_ID: id }
      }).then((result3) => {
        Advertise.destroy({
          where: { AD_ID: id }
        }).then((result4) => {
          if (result4) {
            res.json({
              code: 200,
            });
          }
        });
      });
    });
  });
});

// 이미지 업로드
router.post('/upload', async (req, res, next) => {
  try {
    const file = req.files.upload;
    // const { token, id } = req.body;
    // const userId = id || getIdFromToken(token).sub;
    const uid = uniqid();
    // const uid = 'profile';

    const newFileNm = path.normalize(uid + path.extname(file.name));
    const uploadPath = path.normalize(`${config.attachRoot}/campaign/detailPage/`) + newFileNm;

    const DRAWING_URL = `/attach/campaign/detailPage/${newFileNm}`;

    await fse.move(file.path, uploadPath, { clobber: true });

    return res.status(200).send({ uploaded: true, url: DRAWING_URL });
  } catch (err) {
    return res.status(400).json({ uploaded: false, error: { message: err.message } });
  }
});


module.exports = router;
