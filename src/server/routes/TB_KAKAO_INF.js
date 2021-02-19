const express = require('express');
const Sequelize = require('sequelize');
const KakInf = require('../models').TB_KAKAO_INF;
const Influencer = require('../models').TB_INFLUENCER;
const { getIdFromToken } = require('../config/common');

const router = express.Router();

router.get('/getInfo', async (req, res) => {
  try {
    const { token } = req.query;
    const userId = getIdFromToken(token).sub;

    const dbData = await KakInf.findOne({
      where: { INF_ID: userId },
      attributes: ['KAK_ID',
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('KAK_DT'), '%Y년 %m월 %d일 %H시 %i분'), 'KAK_DT'],
      ],
    });

    res.status(200).json({
      data: dbData || null
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post('/kakaoAdd', async (req, res) => {
  try {
    const data = req.body;
    const { id, token } = data;
    const userId = getIdFromToken(token).sub;

    const userExist = await KakInf.findOne({ where: { KAK_ACC_ID: id } });

    if (userExist) {
      res.status(201).json({ message: '중복된 네이버 계정입니다' });
    } else {
      const post = { INF_ID: userId, KAK_ACC_ID: id };
      const newUser = await KakInf.create(post);

      res.status(200).json({ data: newUser });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/kakaoDelete', async (req, res) => {
  try {
    const data = req.body;
    const { token } = data;
    const userId = getIdFromToken(token).sub;

    const dbData = await Influencer.findOne({
      where: { INF_ID: userId },
      attributes: ['INF_PASS']
    });

    const { INF_PASS } = dbData;

    if (!INF_PASS) {
      res.status(201).json({ message: '비밀번호 만들어주세요' });
    } else {
      await KakInf.destroy({ where: { INF_ID: userId, } });
      res.status(200).json({ message: 'success' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
