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

router.get('/rank', async (req, res) => {
  try {
    const data = req.query;
    const { orderBy, direction, token } = data;
    const INF_ID = getIdFromToken(token).sub;

    const page = parseInt(data.page, 10);
    const limit = parseInt(data.limit, 10);
    const offset = (page - 1) * limit;

    const dbData = await Youtube.findAll({
      limit,
      offset,
      order: [[orderBy, direction]]
    });

    const YoutubersList = dbData.map((item, index) => {
      const rownum = offset + index + 1;
      const returnObj = {
        ...item.dataValues,
        rownum
      };
      if (item.INF_ID === INF_ID) returnObj.selected = 'selected';

      return returnObj;
    });

    const YoutubersCount = await Youtube.count();
    return res.status(200).json({
      data: YoutubersList,
      count: YoutubersCount
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

router.get('/channelInfo', async (req, res) => {
  try {
    const { token } = req.query;
    const INF_ID = getIdFromToken(token).sub;

    const dbData = await Youtube.findOne({ where: { INF_ID } });

    if (dbData) {
      const { YOU_SUBS, YOU_VIEWS, ...rest } = dbData.dataValues;
      const subsInt = YOU_SUBS.toLocaleString('en');
      const viewsInt = YOU_VIEWS.toLocaleString('en');

      return res.status(200).json({
        data: { ...rest, YOU_SUBS: subsInt, YOU_VIEWS: viewsInt }
      });
    }
    return res.status(201).json({ message: '연동된 계정 없습니다' });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
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
