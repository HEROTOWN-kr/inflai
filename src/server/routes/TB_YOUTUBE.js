const express = require('express');
const Sequelize = require('sequelize');
const Youtube = require('../models').TB_YOUTUBE;
const Influencer = require('../models').TB_INFLUENCER;

const router = express.Router();

router.get('/', (req, res) => {
  const { id } = req.query;

  const options = {
    where: {},
    attributes: ['YOU_ID', 'INF_ID', 'YOU_SUBS', 'YOU_VIEWS'],
    include: [
      {
        model: Influencer,
        attributes: ['INF_NAME']
      },
    ],
    order: ''
  };

  Youtube.findAll(options).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

module.exports = router;
