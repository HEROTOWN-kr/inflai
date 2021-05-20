const express = require('express');
const Sequelize = require('sequelize');

const { Op } = Sequelize;

const uniqid = require('uniqid');
const fse = require('fs-extra');
const path = require('path');
const config = require('../config/config');
const {
  campaignCreated, campaignApproved, campaignApplied, campaignApproveRequest
} = require('../config/kakaoMessage');

const Advertise = require('../models').TB_AD;
const Advertiser = require('../models').TB_ADVERTISER;
const Influencer = require('../models').TB_INFLUENCER;
const Notification = require('../models').TB_NOTIFICATION;
const Participant = require('../models').TB_PARTICIPANT;
const Payment = require('../models').TB_PAYMENT;
const Photo = require('../models').TB_PHOTO_AD;
const Favorites = require('../models').TB_FAVORITES;
const {
  getIdFromToken, resizeImage, s3DeleteObject, readFile, s3Upload
} = require('../config/common');
const common = require('../config/common');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      token, page, limit, tab
    } = req.query;
    const userId = getIdFromToken(token).sub;
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const offset = (pageInt - 1) * limitInt;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const where = {
      ADV_ID: userId,
    };

    if (tab === '2') where.AD_SRCH_END = { [Op.gte]: currentDate };
    if (tab === '3') where.AD_SRCH_END = { [Op.lt]: currentDate };

    const dbData = await Advertise.findAndCountAll({
      where,
      distinct: true,
      offset,
      limit: limitInt,
      order: [['AD_ID', 'DESC']],
      attributes: ['AD_ID', 'AD_TYPE', 'AD_INSTA', 'AD_YOUTUBE', 'AD_NAVER', 'AD_SRCH_START', 'AD_SRCH_END', 'AD_CTG', 'AD_CTG2', 'AD_NAME', 'AD_SHRT_DISC', 'AD_INF_CNT'],
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
    });

    const { rows, count } = dbData;

    const advertises = rows.map((item) => {
      const data = item.dataValues;
      const proportion = Math.round(100 / (data.AD_INF_CNT / data.TB_PARTICIPANTs.length));
      return { ...data, proportion };
    });

    res.status(200).json({
      data: advertises,
      count
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/getAll', async (req, res) => {
  try {
    const { page } = req.query;
    const limit = parseInt(req.query.limit, 10);
    const offset = (page - 1) * limit;

    const dbData = await Advertise.findAll({
      attributes: ['AD_ID', 'AD_NAME', 'AD_CTG', 'AD_CTG2', 'AD_SRCH_START', 'AD_SRCH_END', 'AD_TYPE',
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('AD_DT'), '%Y-%m-%d'), 'AD_DT']
      ],
      include: [
        {
          model: Photo,
          attributes: ['PHO_FILE', 'PHO_FILE_URL'],
          required: false,
        }
      ],
      limit,
      offset,
      order: [['AD_ID', 'DESC']]
    });

    const AdvertiseCount = await Advertise.count();

    const campaignsRes = dbData.map((item, index) => {
      const { dataValues } = item;
      const rownum = AdvertiseCount - offset - index;
      return { ...dataValues, rownum };
    });

    res.status(200).json({ data: { campaignsRes, countRes: AdvertiseCount } });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/getAdDataBiz', async (req, res) => {
  try {
    const { adId, token } = req.query;
    const userId = getIdFromToken(token).sub;

    const advertiseData = await Advertise.findOne({
      where: { AD_ID: adId, ADV_ID: userId },
      include: [
        {
          model: Photo,
          required: false,
        }
      ]
    });

    if (!advertiseData) {
      res.status(201).json({ message: '정보 없습니다' });
    } else {
      res.status(200).json({ data: advertiseData });
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/getAdDataAdmin', async (req, res) => {
  try {
    const { adId } = req.query;

    const advertiseData = await Advertise.findOne({
      where: { AD_ID: adId },
      include: [
        {
          model: Photo,
          required: false,
        }
      ]
    });

    if (!advertiseData) {
      res.status(201).json({ message: '정보 없습니다' });
    } else {
      res.status(200).json({ data: advertiseData });
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/getAdInfluencers', (req, res) => {
  const { token, adId } = req.query;
  const userId = getIdFromToken(token).sub;

  Advertise.findOne({
    where: { AD_ID: adId },
    attributes: ['AD_ID', 'ADV_ID', 'AD_PROD_NAME', 'AD_INF_NANO', 'AD_INF_MICRO', 'AD_INF_MACRO', 'AD_INF_MEGA', 'AD_INF_CELEB'],
  }).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/list', async (req, res) => {
  try {
    const {
      limit, category, subCategory, select
    } = req.query;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const props = {
      where: { AD_VISIBLE: 1 },
      order: [['AD_ID', 'DESC']],
      attributes: ['AD_ID', 'AD_INSTA', 'AD_YOUTUBE', 'AD_NAVER', 'AD_SRCH_START', 'AD_SRCH_END', 'AD_CTG', 'AD_CTG2', 'AD_NAME', 'AD_SHRT_DISC', 'AD_INF_CNT', 'AD_TYPE'],
      include: [
        {
          model: Photo,
          where: { PHO_IS_MAIN: 1 },
          attributes: ['PHO_ID', 'PHO_FILE', 'PHO_IS_MAIN', 'PHO_FILE_URL'],
          required: false,
        },
        {
          model: Participant,
          attributes: ['PAR_ID'],
          required: false,
        },
      ],
    };

    if (select) {
      props.where.AD_SEL_START = { [Op.lte]: currentDate };
      props.where.AD_SEL_END = { [Op.gte]: currentDate };
    } else {
      props.where.AD_SRCH_END = { [Op.gte]: currentDate };
    }
    if (limit) props.limit = parseInt(limit, 10);
    if (category) props.where.AD_CTG = parseInt(category, 10);
    if (subCategory) props.where.AD_CTG2 = parseInt(subCategory, 10);

    const advertises = await Advertise.findAll(props);

    const advertisesMaped = advertises.map((item) => {
      const { AD_INF_CNT, TB_PARTICIPANTs, TB_PHOTO_ADs } = item.dataValues;
      const mainImage = TB_PHOTO_ADs[0] ? TB_PHOTO_ADs[0].PHO_FILE_URL : null;
      const proportion = Math.round(100 / (AD_INF_CNT / TB_PARTICIPANTs.length));
      return {
        ...item.dataValues, proportion, mainImage
      };
    });


    res.status(200).json({ data: advertisesMaped });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/listHome', async (req, res) => {
  try {
    const {
      offset, limit, category, subCategory
    } = req.query;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const props = {
      where: { AD_VISIBLE: 1, AD_SEL_END: { [Op.gte]: currentDate } },
      order: [['AD_ID', 'DESC']],
      attributes: ['AD_ID', 'AD_INSTA', 'AD_YOUTUBE', 'AD_NAVER', 'AD_SRCH_START', 'AD_SRCH_END', 'AD_CTG', 'AD_CTG2', 'AD_NAME', 'AD_SHRT_DISC', 'AD_INF_CNT', 'AD_TYPE'],
      include: [
        {
          model: Photo,
          where: { PHO_IS_MAIN: 1 },
          attributes: ['PHO_ID', 'PHO_FILE', 'PHO_IS_MAIN', 'PHO_FILE_URL'],
          required: false,
        },
        {
          model: Participant,
          attributes: ['PAR_ID'],
          required: false,
        },
      ],
    };

    const countProps = {
      where: { AD_VISIBLE: 1, AD_SEL_END: { [Op.gte]: currentDate } },
    };

    if (limit) props.limit = parseInt(limit, 10);
    if (offset) props.offset = parseInt(limit, 10);
    if (category) {
      props.where.AD_CTG = parseInt(category, 10);
      countProps.where.AD_CTG = parseInt(category, 10);
    }
    if (subCategory) {
      props.where.AD_CTG2 = parseInt(subCategory, 10);
      countProps.where.AD_CTG2 = parseInt(subCategory, 10);
    }

    const advertises = await Advertise.findAll(props);
    const count = await Advertise.count(countProps);

    const advertisesMaped = advertises.map((item) => {
      const { AD_INF_CNT, TB_PARTICIPANTs, TB_PHOTO_ADs } = item.dataValues;
      const mainImage = TB_PHOTO_ADs[0] ? TB_PHOTO_ADs[0].PHO_FILE : null;
      const proportion = Math.round(100 / (AD_INF_CNT / TB_PARTICIPANTs.length));
      return {
        ...item.dataValues, proportion, mainImage
      };
    });


    res.status(200).json({ data: advertisesMaped, count });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { searchWord } = req.query;

    const props = {
      where: {
        AD_VISIBLE: 1,
        [Op.or]: [
          { AD_NAME: { [Op.like]: `%${searchWord}%` } },
          { AD_SHRT_DISC: { [Op.like]: `%${searchWord}%` } },
        ],
      },
      order: [['AD_ID', 'DESC']],
      attributes: ['AD_ID', 'AD_INSTA', 'AD_YOUTUBE', 'AD_NAVER', 'AD_SRCH_START', 'AD_SRCH_END', 'AD_CTG', 'AD_CTG2', 'AD_NAME', 'AD_SHRT_DISC', 'AD_INF_CNT', 'AD_TYPE'],
      include: [
        {
          model: Photo,
          where: { PHO_IS_MAIN: 1 },
          attributes: ['PHO_ID', 'PHO_FILE', 'PHO_IS_MAIN'],
          required: false,
        },
        {
          model: Participant,
          attributes: ['PAR_ID'],
          required: false,
        },
      ],
    };

    const advertises = await Advertise.findAll(props);

    const advertisesMaped = advertises.map((item) => {
      const { AD_INF_CNT, TB_PARTICIPANTs, TB_PHOTO_ADs } = item.dataValues;
      const mainImage = TB_PHOTO_ADs[0] ? TB_PHOTO_ADs[0].PHO_FILE : null;
      const proportion = Math.round(100 / (AD_INF_CNT / TB_PARTICIPANTs.length));
      return {
        ...item.dataValues, proportion, mainImage
      };
    });

    res.status(200).json({ data: advertisesMaped });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/campaignDetail', async (req, res) => {
  try {
    const data = req.query;
    const { id, token } = data;

    const params = {
      where: { AD_ID: id },
      attributes: [
        'AD_ID', 'AD_INSTA', 'AD_YOUTUBE', 'AD_NAVER', 'AD_SRCH_START', 'AD_TYPE',
        'AD_SRCH_END', 'AD_SEL_START', 'AD_SEL_END', 'AD_CTG', 'AD_CTG2', 'AD_NAME', 'AD_SHRT_DISC',
        'AD_INF_CNT', 'AD_DELIVERY', 'AD_POST_CODE', 'AD_ROAD_ADDR', 'AD_DETAIL_ADDR',
        'AD_EXTR_ADDR', 'AD_TEL', 'AD_EMAIL', 'AD_SEARCH_KEY', 'AD_DISC', 'AD_DETAIL', 'AD_PROVIDE', 'AD_MONEY', 'AD_EMAIL',
        // [Sequelize.fn('DATE_ADD', Sequelize.col('AD_SEL_END'), Sequelize.literal('DAY'), 1), 'AD_BLG_START']
      ],
      include: [
        {
          model: Photo,
          attributes: ['PHO_ID', 'PHO_FILE', 'PHO_FILE_URL'],
          required: false,
        },
        {
          model: Participant,
          required: false,
        },
      ]
    };

    if (token) {
      const userId = getIdFromToken(token).sub;
      const adResponse = await Advertise.findOne({
        where: { AD_ID: id },
        attributes: ['ADV_ID']
      });
      const { ADV_ID } = adResponse;
      if (ADV_ID === userId) {
        const advertise = await Advertise.findOne(params);
        const { AD_INF_CNT, TB_PARTICIPANTs } = advertise.dataValues;
        const proportion = Math.round(100 / (AD_INF_CNT / TB_PARTICIPANTs.length));
        res.status(200).json({ data: { ...advertise.dataValues, proportion } });
      } else {
        res.status(201).json({ message: '회원이 등록된 캠페인이 아닙니다!' });
      }
    } else {
      const advertise = await Advertise.findOne(params);
      const { AD_INF_CNT, TB_PARTICIPANTs } = advertise.dataValues;
      const proportion = Math.round(100 / (AD_INF_CNT / TB_PARTICIPANTs.length));

      res.status(200).json({ data: { ...advertise.dataValues, proportion } });
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/detail', async (req, res) => {
  try {
    const data = req.query;
    const { id } = data;

    const advertiseData = await Advertise.findOne({
      where: { AD_ID: id },
      include: [
        {
          model: Photo,
          required: false,
        }
      ]
    });

    res.status(200).json({
      data: advertiseData
    });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/notify', async (req, res) => {
  try {
    const { ids } = req.query;

    const advertiseData = await Advertise.findAll({
      where: { AD_ID: ids },
      attributes: ['AD_ID', 'AD_SRCH_START', 'AD_SRCH_END', 'AD_NAME'],
    });

    const campaignData = {
      campaignName1: advertiseData[0].AD_NAME,
      campaignName2: advertiseData[1].AD_NAME,
      campaignName3: advertiseData[2].AD_NAME,
      campaignStartDate1: advertiseData[0].AD_SRCH_START,
      campaignStartDate2: advertiseData[1].AD_SRCH_START,
      campaignStartDate3: advertiseData[2].AD_SRCH_START,
      campaignEndDate1: advertiseData[0].AD_SRCH_END,
      campaignEndDate2: advertiseData[1].AD_SRCH_END,
      campaignEndDate3: advertiseData[2].AD_SRCH_END,
    };

    const influencerData = await Influencer.findAll({
      where: { INF_TEL: { [Op.like]: '010%' }, INF_END_DT: null },
      // where: { INF_ID: 108 },
      attributes: ['INF_ID', 'INF_NAME', 'INF_TEL'],
    });

    const PromiseArray = influencerData.map(item => new Promise((async (resolve, reject) => {
      const { INF_NAME, INF_TEL } = item;

      const kakaoMessageProps = {
        phoneNumber: INF_TEL,
        influencerName: INF_NAME,
        ...campaignData
      };
      await campaignCreated(kakaoMessageProps);
      resolve('success');
    })));

    await Promise.all(PromiseArray);

    res.status(200).json({
      data: influencerData
    });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const data = req.body;
    // const userId = common.getIdFromToken(data.token).sub;
    const {
      advertiserId, campaignName, delivery, detailAddress, detailInfo,
      discription, email, extraAddress, influencerCount, phone,
      postcode, provideInfo, roadAddress, searchFinish, searchKeyword,
      searchStart, shortDisc, sns, subtype, type, visible, insta,
      naver, youtube, token
    } = data;

    const userId = token ? getIdFromToken(token).sub : 48;

    const post = {
      ADV_ID: userId,
      AD_INF_CNT: influencerCount,
      AD_SRCH_START: searchStart,
      AD_SRCH_END: searchFinish,
      AD_DELIVERY: delivery,
      AD_VISIBLE: visible,
      AD_CTG: type,
      AD_CTG2: subtype,
      AD_POST_CODE: postcode,
      AD_ROAD_ADDR: roadAddress,
      AD_DETAIL_ADDR: detailAddress,
      AD_EXTR_ADDR: extraAddress,
      AD_TEL: phone,
      AD_EMAIL: email,
      AD_NAME: campaignName,
      AD_SHRT_DISC: shortDisc,
      AD_SEARCH_KEY: searchKeyword,
      AD_DISC: discription,
      AD_INSTA: insta,
      AD_YOUTUBE: youtube,
      AD_NAVER: naver,
    };

    if (detailInfo) post.AD_DETAIL = detailInfo;
    if (provideInfo) post.AD_PROVIDE = provideInfo;

    const newAdvertise = await Advertise.create(post);

    res.status(200).json({ data: newAdvertise });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/createBiz', async (req, res) => {
  try {
    const data = req.body;

    const {
      campaignName, delivery, email, influencerCount, phone,
      searchFinish, searchKeyword, searchStart, selectStart, selectFinish,
      shortDisc, sns, subtype, type,
      detailAddress, postcode, extraAddress,
      roadAddress, provideInfo, provideMoney, detailInfo, discription, token
    } = data;

    const userId = getIdFromToken(token).sub;

    const post = {
      ADV_ID: userId,
      AD_VISIBLE: '0',
      AD_INF_CNT: influencerCount,
      AD_SRCH_START: searchStart,
      AD_SRCH_END: searchFinish,
      AD_SEL_START: selectStart,
      AD_SEL_END: selectFinish,
      AD_DELIVERY: delivery,
      AD_CTG: type,
      AD_CTG2: subtype,
      AD_TEL: phone,
      AD_EMAIL: email,
      AD_NAME: campaignName,
      AD_SHRT_DISC: shortDisc,
      AD_DISC: discription,
      AD_SEARCH_KEY: searchKeyword,
      AD_TYPE: sns
    };

    if (detailInfo) post.AD_DETAIL = detailInfo;
    if (provideMoney) post.AD_MONEY = provideMoney;
    if (provideInfo) post.AD_PROVIDE = provideInfo;
    if (postcode) post.AD_POST_CODE = postcode;
    if (roadAddress) post.AD_ROAD_ADDR = roadAddress;
    if (detailAddress) post.AD_DETAIL_ADDR = detailAddress;
    if (extraAddress) post.AD_EXTR_ADDR = extraAddress;

    const newAdvertise = await Advertise.create(post);

    const dbInfo = await Advertiser.findOne({
      where: { ADV_ID: userId, },
      attributes: ['ADV_NAME', 'ADV_TEL']
    });

    const { AD_ID, AD_DT } = newAdvertise;
    const { ADV_NAME, ADV_TEL } = dbInfo;

    const props = {
      phoneNumber: ADV_TEL,
      campaignName,
      campaignId: AD_ID,
      advertiserName: ADV_NAME,
    };

    const today = new Date();
    const Year = today.getFullYear();
    const Month = (`0${today.getMonth() + 1}`).slice(-2);
    const Day = (`0${today.getDate()}`).slice(-2);

    const adminProps = {
      phoneNumber: '01026763937',
      campaignName,
      adminName: 'Andrian',
      advertiserName: ADV_NAME,
      createdDate: `${Year}-${Month}-${Day}`
    };

    await campaignApplied(props);
    await campaignApproveRequest(adminProps);

    res.status(200).json({ data: newAdvertise });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/createAdmin', async (req, res) => {
  try {
    const data = req.body;

    const {
      campaignName, delivery, email, influencerCount, phone, visible,
      searchFinish, searchKeyword, searchStart, selectStart, selectFinish,
      shortDisc, sns, subtype, type,
      detailAddress, postcode, extraAddress,
      roadAddress, provideInfo, provideMoney, detailInfo, discription
    } = data;

    const post = {
      ADV_ID: 48,
      AD_VISIBLE: visible,
      AD_INF_CNT: influencerCount,
      AD_SRCH_START: searchStart,
      AD_SRCH_END: searchFinish,
      AD_SEL_START: selectStart,
      AD_SEL_END: selectFinish,
      AD_DELIVERY: delivery,
      AD_CTG: type,
      AD_CTG2: subtype,
      AD_TEL: phone,
      AD_EMAIL: email,
      AD_NAME: campaignName,
      AD_SHRT_DISC: shortDisc,
      AD_DISC: discription,
      AD_SEARCH_KEY: searchKeyword,
      AD_TYPE: sns
    };

    if (detailInfo) post.AD_DETAIL = detailInfo;
    if (provideMoney) post.AD_MONEY = provideMoney;
    if (provideInfo) post.AD_PROVIDE = provideInfo;
    if (postcode) post.AD_POST_CODE = postcode;
    if (roadAddress) post.AD_ROAD_ADDR = roadAddress;
    if (detailAddress) post.AD_DETAIL_ADDR = detailAddress;
    if (extraAddress) post.AD_EXTR_ADDR = extraAddress;

    const newAdvertise = await Advertise.create(post);

    res.status(200).json({ data: newAdvertise });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/updateBiz', async (req, res) => {
  try {
    const data = req.body;

    const {
      campaignName, delivery, email, influencerCount, phone,
      searchFinish, searchKeyword, searchStart, selectStart, selectFinish,
      shortDisc, discription, sns, subtype, type,
      detailAddress, postcode, extraAddress,
      roadAddress, provideInfo, detailInfo, token, adId
    } = data;

    const userId = getIdFromToken(token).sub;

    const post = {
      AD_INF_CNT: influencerCount,
      AD_SRCH_START: searchStart,
      AD_SRCH_END: searchFinish,
      AD_SEL_START: selectStart,
      AD_SEL_END: selectFinish,
      AD_DELIVERY: delivery,
      AD_CTG: type,
      AD_CTG2: subtype,
      AD_TEL: phone,
      AD_EMAIL: email,
      AD_NAME: campaignName,
      AD_SHRT_DISC: shortDisc,
      AD_DISC: discription,
      AD_SEARCH_KEY: searchKeyword,
      AD_TYPE: sns
    };

    if (detailInfo) post.AD_DETAIL = detailInfo;
    if (provideInfo) post.AD_PROVIDE = provideInfo;
    if (postcode) post.AD_POST_CODE = postcode;
    if (roadAddress) post.AD_ROAD_ADDR = roadAddress;
    if (detailAddress) post.AD_DETAIL_ADDR = detailAddress;
    if (extraAddress) post.AD_EXTR_ADDR = extraAddress;

    await Advertise.update(post, {
      where: { AD_ID: adId, ADV_ID: userId }
    });

    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/updateAdmin', async (req, res) => {
  try {
    const data = req.body;

    const {
      campaignName, delivery, email, influencerCount, phone,
      searchFinish, searchKeyword, searchStart, selectStart, selectFinish,
      shortDisc, discription, sns, subtype, type,
      detailAddress, postcode, extraAddress,
      roadAddress, provideInfo, provideMoney, detailInfo, visible, adId, visibilityChanged
    } = data;

    const post = {
      AD_VISIBLE: visible,
      AD_INF_CNT: influencerCount,
      AD_SRCH_START: searchStart,
      AD_SRCH_END: searchFinish,
      AD_SEL_START: selectStart,
      AD_SEL_END: selectFinish,
      AD_DELIVERY: delivery,
      AD_CTG: type,
      AD_CTG2: subtype,
      AD_TEL: phone,
      AD_EMAIL: email,
      AD_NAME: campaignName,
      AD_SHRT_DISC: shortDisc,
      AD_DISC: discription,
      AD_SEARCH_KEY: searchKeyword,
      AD_TYPE: sns
    };

    if (detailInfo) post.AD_DETAIL = detailInfo;
    if (provideInfo) post.AD_PROVIDE = provideInfo;
    if (provideMoney) post.AD_MONEY = provideMoney;
    if (postcode) post.AD_POST_CODE = postcode;
    if (roadAddress) post.AD_ROAD_ADDR = roadAddress;
    if (detailAddress) post.AD_DETAIL_ADDR = detailAddress;
    if (extraAddress) post.AD_EXTR_ADDR = extraAddress;

    await Advertise.update(post, {
      where: { AD_ID: adId }
    });

    if (visibilityChanged) {
      const dbData = await Advertise.findOne({
        where: { AD_ID: adId },
        include: [
          {
            model: Advertiser,
            attributes: ['ADV_ID', 'ADV_TEL', 'ADV_NAME']
          }
        ]
      });

      const { TB_ADVERTISER } = dbData;
      const { ADV_TEL, ADV_NAME } = TB_ADVERTISER;

      const props = {
        phoneNumber: ADV_TEL,
        campanyName: campaignName,
        campaignId: adId,
        advertiserName: ADV_NAME,
      };

      await campaignApproved(props);
    }

    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const data = req.body;
    const {
      campaignId, campaignName, delivery, detailAddress, detailInfo,
      discription, email, extraAddress, influencerCount, phone,
      postcode, provideInfo, roadAddress, searchFinish, searchKeyword,
      searchStart, shortDisc, subtype, type, visible, insta,
      naver, youtube
    } = data;

    const post = {
      AD_INF_CNT: influencerCount,
      AD_SRCH_START: searchStart,
      AD_SRCH_END: searchFinish,
      AD_DELIVERY: delivery,
      AD_VISIBLE: visible,
      AD_CTG: type,
      AD_CTG2: subtype,
      AD_POST_CODE: postcode,
      AD_ROAD_ADDR: roadAddress,
      AD_DETAIL_ADDR: detailAddress,
      AD_EXTR_ADDR: extraAddress,
      AD_TEL: phone,
      AD_EMAIL: email,
      AD_NAME: campaignName,
      AD_SHRT_DISC: shortDisc,
      AD_SEARCH_KEY: searchKeyword,
      AD_DISC: discription.split('\n').join('<br>'),
      // AD_DISC: discription,
      AD_INSTA: insta,
      AD_YOUTUBE: youtube,
      AD_NAVER: naver,
    };

    if (detailInfo) post.AD_DETAIL = detailInfo;
    if (provideInfo) post.AD_PROVIDE = provideInfo;

    await Advertise.update(post, { where: { AD_ID: campaignId } });

    res.status(200).json({ message: 'success' });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/adminCreateAd', (req, res) => {
  const data = req.body;

  const post = {
    ADV_ID: data.advId,
    AD_TYPE: data.type,
    AD_PROD_PRICE: data.price,
    AD_PRICE: (data.nanoSum + data.microSum + data.macroSum + data.megaSum + data.celebritySum + data.videoPrice).toString()
  };


  if (data.reuse) post.AD_PROD_REUSE = 'Y';
  if (data.nano) post.AD_INF_NANO = data.nano;
  if (data.micro) post.AD_INF_MICRO = data.micro;
  if (data.macro) post.AD_INF_MACRO = data.macro;
  if (data.mega) post.AD_INF_MEGA = data.mega;
  if (data.celebrity) post.AD_INF_CELEB = data.celebrity;

  if (data.name) post.AD_PROD_NAME = data.name;
  if (data.searchDate) post.AD_SRCH_END = data.searchDate;
  if (data.finishDate) post.AD_POST_END = data.finishDate;
  if (data.startSearch) post.AD_SRCH_START = data.startSearch;
  if (data.typeCategory) post.AD_CTG = JSON.stringify(data.typeCategory);
  if (data.channel) post.AD_CHANNEL = JSON.stringify(data.channel);
  if (data.presidentName) post.AD_COMP_NAME = data.presidentName;
  if (data.about) post.AD_ABOUT = data.about;
  if (data.tags) post.AD_TAGS = data.tags;
  if (data.photo) post.AD_PHOTO = JSON.stringify(data.photo);


  /* res.json({
    code: 200,
    data: post
  }); */

  Advertise.create(post).then((result) => {
    res.json({
      code: 200,
      id: result.dataValues.AD_ID,
    });
  });
});

router.post('/createAd', (req, res) => {
  const data = req.body;
  const userId = getIdFromToken(data.token).sub;

  const post = {
    ADV_ID: userId,
    AD_TYPE: data.type,
    AD_PROD_PRICE: data.price,
    AD_PRICE: (data.nanoSum + data.microSum + data.macroSum + data.megaSum + data.celebritySum + data.videoPrice).toString()
  };

  if (data.reuse) post.AD_PROD_REUSE = 'Y';
  if (data.nano) post.AD_INF_NANO = data.nano;
  if (data.micro) post.AD_INF_MICRO = data.micro;
  if (data.macro) post.AD_INF_MACRO = data.macro;
  if (data.mega) post.AD_INF_MEGA = data.mega;
  if (data.celebrity) post.AD_INF_CELEB = data.celebrity;

  Advertise.create(post).then((result) => {
    res.json({
      code: 200,
      id: result.dataValues.AD_ID,
    });
  });
});

router.post('/updateAd', (req, res) => {
  const data = req.body;
  const { id } = data;

  // data.typeCategory, data.age, data.channel, data.photo are arrays
  // try to stringify them
  // need search_start datetime data


  const post = {
    AD_PROD_NAME: data.name,
    AD_SRCH_END: data.searchDate,
    AD_POST_END: data.finishDate,
    AD_SEX: data.sex,
    AD_COMP_NAME: data.presidentName,
    AD_ABOUT: data.about,
    AD_SPON_ITEM: data.sponsoredItem,
    AD_CONT_TYPE: data.content,
    AD_VIDEO_TYPE: data.videoType,
    AD_PUBL_TEXT: data.publicText,
    AD_TAGS: data.tags,
    AD_UID: `merchant_${id}`
  };

  if (data.typeCategory) post.AD_CTG = JSON.stringify(data.typeCategory);
  if (data.age) post.AD_AGE = JSON.stringify(data.age);
  if (data.channel) post.AD_CHANNEL = JSON.stringify(data.channel);
  if (data.photo) post.AD_PHOTO = JSON.stringify(data.photo);


  Advertise.update(post, {
    where: { AD_ID: id }
  }).then((result) => {
    if (result) {
      res.json({
        code: 200,
        userName: data.name,
      });
    }
  });
});

router.post('/delete', async (req, res) => {
  try {
    const data = req.body;
    const { id } = data;

    const props = { where: { AD_ID: id } };

    const CampaignPhoto = await Photo.findAll({ where: { AD_ID: id }, attributes: ['PHO_ID', 'PHO_FILE'] });
    CampaignPhoto.map(async (item) => {
      const { PHO_FILE } = item;
      const deletePath = path.normalize(`${config.downDir}${PHO_FILE}`);
      await fse.remove(deletePath);
    });

    await Favorites.destroy(props);
    await Photo.destroy(props);
    await Participant.destroy(props);
    await Advertise.destroy(props);

    res.status(200).json({ message: 'success', data: '' });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/deleteAWS', async (req, res) => {
  try {
    const data = req.body;
    const { id } = data;

    const props = { where: { AD_ID: id } };

    const CampaignPhoto = await Photo.findAll({ where: { AD_ID: id }, attributes: ['PHO_ID', 'PHO_FILE_KEY'] });

    const PromiseArray = CampaignPhoto.map(item => new Promise((async (resolve, reject) => {
      try {
        const { PHO_FILE_KEY } = item;
        await s3DeleteObject(PHO_FILE_KEY);
        resolve('success');
      } catch (e) {
        resolve('failed');
      }
    })));
    await Promise.all(PromiseArray);

    await Favorites.destroy(props);
    await Photo.destroy(props);
    await Participant.destroy(props);
    await Advertise.destroy(props);

    return res.status(200).json({ message: 'success', data: '' });
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
});


// 이미지 업로드
router.post('/upload', async (req, res) => {
  try {
    const file = req.files.upload;
    const uid = uniqid();

    const currentPath = file.path;
    const fileExtension = path.extname(file.name);
    const fileName = `${uid}_660${fileExtension}`;
    const tmpPath = path.normalize(`${config.tmp}${fileName}`);
    const uploadPath = path.normalize(`${config.attachRoot}/campaign/detailPage/${fileName}`);

    await resizeImage(currentPath, tmpPath, 660, null);
    await fse.move(tmpPath, uploadPath, { clobber: true });
    await fse.remove(currentPath);

    const DRAWING_URL = `/attach/campaign/detailPage/${fileName}`;

    return res.status(200).send({ uploaded: true, url: DRAWING_URL });
  } catch (err) {
    return res.status(400).json({ uploaded: false, error: { message: err.message } });
  }
});

router.post('/uploadAWS', async (req, res) => {
  try {
    const file = req.files.upload;
    const uid = uniqid();

    const currentPath = file.path;
    const fileExtension = path.extname(file.name);
    const fileName = `${uid}_660${fileExtension}`;
    const tmpPath = path.normalize(`${config.tmp}${fileName}`);
    const uploadPath = `campaign/detailPage/${fileName}`;

    await resizeImage(currentPath, tmpPath, 660, null);
    const fileData = await readFile(tmpPath);
    const s3Data = await s3Upload(uploadPath, file.type, fileData);

    await fse.remove(currentPath);
    await fse.remove(tmpPath);

    const { Location } = s3Data;

    return res.status(200).send({ uploaded: true, url: Location });
  } catch (err) {
    return res.status(400).json({ uploaded: false, error: { message: err.message } });
  }
});


module.exports = router;
