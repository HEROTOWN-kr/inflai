const express = require('express');
const Sequelize = require('sequelize');
const Youtube = require('../models').TB_YOUTUBE;
const Influencer = require('../models').TB_INFLUENCER;
const {
  getGoogleData,
  getIdFromToken,
  YoutubeDataRequest,
  checkLocalHost
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
    const { code, token, host } = data;
    const INF_ID = getIdFromToken(token).sub;
    const isLocal = checkLocalHost(host);
    const redirectUrl = isLocal ? `http://${host}` : `https://${host}`;
    const googleData = await getGoogleData(code, redirectUrl);

    const {
      name, email, id, refresh_token
    } = googleData;

    const youtubeChannelData = await YoutubeDataRequest(refresh_token, INF_ID);
    const channelId = youtubeChannelData.id;
    const { viewCount, subscriberCount } = youtubeChannelData.statistics;
    const { title, description } = youtubeChannelData.snippet;

    const youtubeAccountExist = await Youtube.findOne({ where: { YOU_ACCOUNT_ID: channelId } });
    if (youtubeAccountExist) {
      res.status(409).json({ message: '중복된 유튜브 채널입니다' });
    } else {
      await Youtube.create({
        INF_ID,
        YOU_TOKEN: refresh_token,
        YOU_ACCOUNT_ID: channelId,
        YOU_NAME: title,
        YOU_SUBS: subscriberCount,
        YOU_VIEWS: viewCount
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

    await Youtube.destroy({ where: { YOU_ID: id } });

    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
