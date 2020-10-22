const express = require('express');
const Sequelize = require('sequelize');
const Naver = require('../models').TB_NAVER;

const {
  getGoogleData,
  getIdFromToken,
  YoutubeDataRequest
} = require('../config/common');

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

router.post('/add', async (req, res) => {
  try {
    const data = req.body;
    const { url, token } = data;
    const INF_ID = getIdFromToken(token).sub;

    const naverAccountExist = await Naver.findOne({ where: { NAV_URL: url } });
    if (naverAccountExist) {
      res.status(500).json({ message: '중복된 네이버 블로그입니다' });
    } else {
      await Naver.create({
        INF_ID,
        NAV_URL: url
      });
      res.status(200).json({ message: 'success' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const data = req.body;
    const { id } = data;

    await Naver.destroy({ where: { NAV_ID: id } });

    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
