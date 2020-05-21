const express = require('express');
const Sequelize = require('sequelize');
const Advertise = require('../models').TB_AD;
const Advertiser = require('../models').TB_ADVERTISER;
const Photo = require('../models').TB_PHOTO_AD;
const common = require('../config/common');


const router = express.Router();

router.post('/createAd', (req, res) => {
  const data = req.body;
  const userId = common.getIdFromToken(data.token).sub;

  const post = {
    ADV_ID: userId,
    AD_TYPE: data.type,
    AD_PROD_PRICE: data.price,
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

router.get('/', (req, res) => {
  const { token } = req.query;
  const userId = common.getIdFromToken(token).sub;

  Advertise.findAll({
    where: { ADV_ID: userId },
    order: [['AD_ID', 'DESC']],
    attributes: ['AD_ID', 'AD_PROD_NAME', 'AD_PROD_PRICE', 'AD_PAID', 'AD_SRCH_END',
      [Sequelize.literal('AD_INF_NANO + AD_INF_MICRO + AD_INF_MACRO + AD_INF_MEGA + AD_INF_CELEB'), 'INF_SUM'],
      // [Sequelize.literal('CASE WHEN "AD_PAID" = "Y" THEN "결제완료" ELSE "결제안됨"'), 'AD_PAID']
    ],
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

router.get('/getAll', (req, res) => {
  Advertise.findAll({
    order: [['AD_ID', 'DESC']],
    attributes: ['AD_ID', 'AD_PROD_NAME', 'AD_PROD_PRICE', 'AD_PAID',
      [Sequelize.literal('AD_INF_NANO + AD_INF_MICRO + AD_INF_MACRO + AD_INF_MEGA + AD_INF_CELEB'), 'INF_SUM'],
      // [Sequelize.literal('CASE WHEN "AD_PAID" = "Y" THEN "결제완료" ELSE "결제안됨"'), 'AD_PAID']
    ],
    include: [
      {
        model: Advertiser,
        attributes: ['ADV_COM_NAME']
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

router.get('/detail', (req, res) => {
  const data = req.query;
  const { id } = data;

  Advertise.findOne({ where: { AD_ID: id } }).then((result) => {
    res.json({
      code: 200,
      data: result.dataValues,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.post('/delete', (req, res) => {
  const data = req.body;
  const { id } = data;

  Photo.destroy({
    where: { AD_ID: id }
  }).then((result) => {
    Advertise.destroy({
      where: { AD_ID: id }
    }).then((result2) => {
      if (result2) {
        res.json({
          code: 200,
        });
      }
    });
  });
});

module.exports = router;
