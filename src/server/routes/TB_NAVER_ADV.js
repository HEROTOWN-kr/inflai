const express = require('express');
const Sequelize = require('sequelize');
const NavAdv = require('../models').TB_NAVER_ADV;
const Advertiser = require('../models').TB_ADVERTISER;
const { getIdFromToken } = require('../config/common');

const router = express.Router();

router.get('/getInfo', async (req, res) => {
  try {
    const { token } = req.query;
    const userId = getIdFromToken(token).sub;

    const dbData = await NavAdv.findOne({
      where: { ADV_ID: userId },
      attributes: ['NAD_ID',
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('NAD_DT'), '%Y년 %m월 %d일 %H시 %i분'), 'NAD_DT'],
      ],
    });

    res.status(200).json({
      data: dbData || null
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post('/naverAdd', async (req, res) => {
  try {
    const data = req.body;
    const { id, token } = data;
    const userId = getIdFromToken(token).sub;

    const userExist = await NavAdv.findOne({ where: { NAD_ACC_ID: id } });

    if (userExist) {
      res.status(201).json({ message: '중복된 네이버 계정입니다' });
    } else {
      const post = { ADV_ID: userId, NAD_ACC_ID: id };
      const newUser = await NavAdv.create(post);

      res.status(200).json({ data: newUser });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/naverDelete', async (req, res) => {
  try {
    const data = req.body;
    const { token } = data;
    const userId = getIdFromToken(token).sub;

    const dbData = await Advertiser.findOne({
      where: { ADV_ID: userId },
      attributes: ['ADV_PASS']
    });

    const { ADV_PASS } = dbData;

    if (!ADV_PASS) {
      res.status(201).json({ message: '비밀번호 만들어주세요' });
    } else {
      await NavAdv.destroy({ where: { ADV_ID: userId, } });
      res.status(200).json({ message: 'success' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
