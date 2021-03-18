const express = require('express');
const Sequelize = require('sequelize');

const router = new express.Router();
const { getIdFromToken } = require('../config/common');
const Favorites = require('../models').TB_FAVORITES;
const Advertise = require('../models').TB_AD;
const Participant = require('../models').TB_PARTICIPANT;
const Influencer = require('../models').TB_INFLUENCER;
const Photo = require('../models').TB_PHOTO_AD;

router.get('/', async (req, res) => {
  try {
    const { token } = req.query;
    const userId = getIdFromToken(token).sub;

    const dbData = await Favorites.findAll({
      where: { INF_ID: userId },
      attributes: ['FAV_ID'],
      include: [
        {
          model: Advertise,
          attributes: ['AD_ID', 'AD_INSTA', 'AD_YOUTUBE', 'AD_NAVER', 'AD_SRCH_START', 'AD_SRCH_END', 'AD_CTG', 'AD_CTG2', 'AD_NAME', 'AD_SHRT_DISC', 'AD_INF_CNT'],
          include: [
            {
              model: Photo,
              attributes: ['PHO_ID', 'PHO_FILE', 'PHO_FILE_URL'],
              required: false
            },
            {
              model: Participant,
              attributes: ['PAR_ID'],
              required: false
            },
          ],
        },
      ],
    });

    const advertises = dbData.map((item) => {
      const data = item.dataValues;
      const adData = data.TB_AD.dataValues;
      const proportion = Math.round(100 / (adData.AD_INF_CNT / adData.TB_PARTICIPANTs.length));
      return { ...adData, proportion, FAV_ID: data.FAV_ID };
    });

    res.status(200).json({
      data: advertises
    });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/check', async (req, res) => {
  try {
    const { token, adId } = req.query;
    const userId = getIdFromToken(token).sub;

    const dbData = await Favorites.findOne({
      where: { INF_ID: userId, AD_ID: adId },
      attributes: ['FAV_ID']
    });

    res.status(200).json({
      data: dbData
    });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { token, adId } = req.body;
    const userId = getIdFromToken(token).sub;

    const newFavorite = await Favorites.create({
      AD_ID: adId,
      INF_ID: userId,
    });

    res.status(200).json({
      data: newFavorite
    });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const { token, adId } = req.body;
    const userId = getIdFromToken(token).sub;

    await Favorites.destroy({
      where: {
        AD_ID: adId,
        INF_ID: userId,
      }
    });

    res.status(200).json({ message: 'success' });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

module.exports = router;
