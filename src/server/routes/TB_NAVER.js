const express = require('express');
const Sequelize = require('sequelize');
const Naver = require('../models').TB_NAVER;
const Participant = require('../models').TB_PARTICIPANT;
const Influencer = require('../models').TB_INFLUENCER;

const {
  getGoogleData,
  getIdFromToken,
  YoutubeDataRequest
} = require('../config/common');

const router = express.Router();

router.get('/getInfo', async (req, res) => {
  try {
    const { id } = req.query;
    const dbData = await Participant.findOne({
      where: { PAR_ID: id },
      attributes: ['PAR_ID', 'PAR_NAME', 'PAR_EMAIL', 'PAR_TEL', 'PAR_POST_CODE',
        'PAR_ROAD_ADDR', 'PAR_DETAIL_ADDR', 'PAR_EXTR_ADDR'],
      include: [
        {
          model: Influencer,
          attributes: ['INF_ID'],
          include: [
            {
              model: Naver,
              attributes: ['NAV_ID', 'NAV_URL']
            }
          ],
        }
      ],
    });

    const {
      TB_INFLUENCER, PAR_NAME, PAR_EMAIL, PAR_TEL, PAR_POST_CODE, PAR_ROAD_ADDR, PAR_DETAIL_ADDR, PAR_EXTR_ADDR
    } = dbData;
    const { TB_NAVER } = TB_INFLUENCER || {};
    const { NAV_ID, NAV_URL } = TB_NAVER || {};

    res.status(200).json({
      data: {
        PAR_NAME, PAR_EMAIL, PAR_TEL, PAR_POST_CODE, PAR_ROAD_ADDR, PAR_DETAIL_ADDR, PAR_EXTR_ADDR, NAV_ID, NAV_URL
      }
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
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
