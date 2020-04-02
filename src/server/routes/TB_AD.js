const express = require('express');
const jwt = require('jsonwebtoken');
const request = require('request');

const config = require('../config');
const Advertise = require('../models').TB_AD;
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
    AD_TAGS: data.tags
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


module.exports = router;
