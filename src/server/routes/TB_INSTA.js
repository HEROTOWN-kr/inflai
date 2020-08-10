const express = require('express');
const Sequelize = require('sequelize');
const Instagram = require('../models').TB_INSTA;
const Influencer = require('../models').TB_INFLUENCER;

const router = express.Router();

router.get('/', (req, res) => {
  const { id } = req.query;

  const options = {
    where: {},
    attributes: ['INS_ID', 'INF_ID', 'INS_FLW', 'INS_FLWR', 'INS_PROFILE_IMG'],
    include: [
      {
        model: Influencer,
        attributes: ['INF_NAME']
      },
    ],
    order: [['INS_FLWR', 'DESC']]
  };

  Instagram.findAll(options).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

module.exports = router;
