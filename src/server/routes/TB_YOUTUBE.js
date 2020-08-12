const express = require('express');
const Sequelize = require('sequelize');
const Youtube = require('../models').TB_YOUTUBE;
const Influencer = require('../models').TB_INFLUENCER;

const router = express.Router();

router.get('/', (req, res) => {
  let list;
  const firstRow = 0;

  const options = {
    where: {},
    attributes: ['YOU_ID', 'INF_ID', 'YOU_SUBS', 'YOU_VIEWS'],
    include: [
      {
        model: Influencer,
        attributes: ['INF_NAME']
      },
    ],
    order: [['YOU_SUBS', 'DESC']]
  };

  Youtube.findAll(options).then((result) => {
    list = result;
    Youtube.count().then((cnt) => {
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
