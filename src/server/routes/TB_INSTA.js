const express = require('express');
const Sequelize = require('sequelize');
const async = require('async');
const Instagram = require('../models').TB_INSTA;
const Influencer = require('../models').TB_INFLUENCER;

const router = express.Router();

router.get('/', (req, res) => {
  let list;
  const firstRow = 0;

  const options = {
    where: {},
    attributes: ['INS_ID', 'INF_ID', 'INS_FLW', 'INS_FLWR', 'INS_PROFILE_IMG',
      // [Sequelize.literal('(RANK() OVER (ORDER BY rating DESC))'), 'rank']
      // [Sequelize.literal('(RANK() OVER (ORDER BY INS_FLWR))'), 'rank']
    ],
    include: [
      {
        model: Influencer,
        attributes: ['INF_NAME']
      },
    ],
    order: [['INS_FLWR', 'DESC']]
  };

  Instagram.findAll(options).then((result) => {
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
  });
});

module.exports = router;
