const express = require('express');
const jwt = require('jsonwebtoken');
const request = require('request');

const config = require('../config');
const Advertise = require('../models').TB_AD;
const common = require('../config/common');

const router = express.Router();

router.post('/saveAd', (req, res) => {
  const data = req.body;
  const userId = common.getIdFromToken(data.token).sub;

  const post = {
    ADV_ID: userId,
    AD_TYPE: data.jobType,
    AD_COMP_NAME: data.companyName,
    AD_BUDJET: data.budget,
    AD_INSTA: data.instagram,
    AD_YOUTUBE: data.youtube,
    AD_BLOG: data.blog,
    AD_EMAIL: data.email,
    AD_COUNTRY: data.country,
    AD_TEL: data.phone
  };

  Advertise.create(post).then((result) => {
    /* console.log(message.get({
      plain: true
    })); */
    res.send(result);
  });
});

module.exports = router;
