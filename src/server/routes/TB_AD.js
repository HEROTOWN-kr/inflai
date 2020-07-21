const express = require('express');
const Sequelize = require('sequelize');
const Advertise = require('../models').TB_AD;
const Advertiser = require('../models').TB_ADVERTISER;
const Influencer = require('../models').TB_INFLUENCER;
const Notification = require('../models').TB_NOTIFICATION;
const Payment = require('../models').TB_PAYMENT;
const Photo = require('../models').TB_PHOTO_AD;
const common = require('../config/common');


const router = express.Router();

router.post('/createAd', (req, res) => {
  const data = req.body;
  const userId = common.getIdFromToken(data.token).sub;

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

router.get('/', (req, res) => {
  const { token } = req.query;
  const userId = common.getIdFromToken(token).sub;

  Advertise.findAll({
    where: { ADV_ID: userId },
    order: [['AD_ID', 'DESC']],
    attributes: ['AD_ID', 'AD_PROD_NAME', 'AD_PRICE', 'AD_PROD_PRICE', 'AD_PAID', 'AD_SRCH_END', 'AD_UID', 'AD_INF_NANO', 'AD_INF_MICRO', 'AD_INF_MACRO', 'AD_INF_MEGA', 'AD_INF_CELEB',
      [Sequelize.literal('AD_INF_NANO + AD_INF_MICRO + AD_INF_MACRO + AD_INF_MEGA + AD_INF_CELEB'), 'INF_SUM'],
      // [Sequelize.literal('CASE WHEN "AD_PAID" = "Y" THEN "결제완료" ELSE "결제안됨"'), 'AD_PAID']
    ],
    include: [
      {
        model: Advertiser,
        attributes: ['ADV_NAME', 'ADV_COM_NAME', 'ADV_EMAIL', 'ADV_TEL']
      }
    ]
  }).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/getAdInfluencers', (req, res) => {
  const { token, adId } = req.query;
  const userId = common.getIdFromToken(token).sub;

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

router.get('/getAll', (req, res) => {
  const data = req.query;
  const offset = (data.page - 1) * 10;
  Advertise.findAndCountAll({
    attributes: ['AD_ID', 'AD_PROD_NAME', 'AD_PROD_PRICE', 'AD_PAID',
      [Sequelize.literal('AD_INF_NANO + AD_INF_MICRO + AD_INF_MACRO + AD_INF_MEGA + AD_INF_CELEB'), 'INF_SUM'],
      // [Sequelize.literal('CASE WHEN "AD_PAID" = "Y" THEN "결제완료" ELSE "결제안됨"'), 'AD_PAID']
    ],
    include: [
      {
        model: Advertiser,
        attributes: ['ADV_COM_NAME']
      }
    ],
    limit: 10,
    offset,
    order: [['AD_ID', 'DESC']]
  }).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/list', (req, res) => {
  Advertise.findAll({
    where: { AD_PAID: 'Y' },
    order: [['AD_ID', 'DESC']],
    attributes: ['AD_ID', 'AD_PROD_NAME', 'AD_PROD_PRICE', 'AD_TAGS', 'AD_ABOUT', 'AD_SRCH_END',
      [Sequelize.literal('AD_INF_NANO + AD_INF_MICRO + AD_INF_MACRO + AD_INF_MEGA + AD_INF_CELEB'), 'INF_SUM'],
      // [Sequelize.literal('CASE WHEN "AD_PAID" = "Y" THEN "결제완료" ELSE "결제안됨"'), 'AD_PAID']
    ],
    include: [
      {
        model: Advertiser,
        attributes: ['ADV_COM_NAME']
      },
      {
        model: Photo,
        attributes: ['PHO_ID', 'PHO_FILE']
      },
      {
        model: Notification,
        where: { NOTI_STATE: ['1', '4'] },
        attributes: ['NOTI_ID'],
        required: false,
      },
    ]
  }).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/campaignDetail', (req, res) => {
  const data = req.query;
  const { id, token } = data;
  const includeArray = [
    {
      model: Photo,
      attributes: ['PHO_ID', 'PHO_FILE'],
      required: false,
    }
  ];
  let userId;

  if (token) {
    userId = common.getIdFromToken(token).sub;
    includeArray.push({
      model: Notification,
      where: { INF_ID: userId },
      attributes: ['NOTI_ID'],
      required: false
    });
  }

  Advertise.findOne({
    where: { AD_ID: id },
    attributes: ['AD_ID', 'AD_PROD_NAME', 'AD_PROD_PRICE', 'AD_TAGS', 'AD_ABOUT', 'AD_SRCH_END', 'AD_CHANNEL', 'AD_SPON_ITEM', 'AD_CTG',
      [Sequelize.literal('AD_INF_NANO + AD_INF_MICRO + AD_INF_MACRO + AD_INF_MEGA + AD_INF_CELEB'), 'INF_SUM'],
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('AD_DT'), '%Y-%m-%d'), 'AD_DT']
    ],
    include: includeArray
  }).then((result) => {
    const resObj = result;
    resObj.AD_CHANNEL = resObj.AD_CHANNEL ? JSON.parse(resObj.AD_CHANNEL).join('/') : '';
    resObj.AD_CTG = resObj.AD_CTG ? JSON.parse(resObj.AD_CTG).join('/') : '';
    res.json({
      code: 200,
      data: resObj,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/detail', (req, res) => {
  const data = req.query;
  const { id } = data;

  Advertise.findOne({
    where: { AD_ID: id },
    include: [
      {
        model: Notification,
        required: false,
        attributes: ['NOTI_ID', 'NOTI_STATE'],
        include: [
          {
            model: Influencer,
            // attributes: ['INF_ID', 'INF_TOKEN', 'INF_INST_ID']
            attributes: ['INF_ID', 'INF_TOKEN', 'INF_INST_ID', 'INF_NAME', 'INF_EMAIL', 'INF_TEL',
              [Sequelize.literal('CASE INF_BLOG_TYPE WHEN \'1\' THEN \'인스타\' WHEN \'2\' THEN \'유튜브\' ELSE \'블로그\' END'), 'INF_BLOG_TYPE'],
            ],
          }
        ]
      }
    ]
  }).then((result) => {
    res.json({
      code: 200,
      // data: result.dataValues,
      data: result,
    });
    /* if (result.TB_NOTIFICATIONs) {
      const resObj = result;
      const notis = resObj.TB_NOTIFICATIONs;
      common.instaRequest(notis, (err, sortedArray) => {
        resObj.dataValues.TB_INFLUENCER = sortedArray;
        res.json({
          code: 200,
          // data: result.dataValues,
          data: resObj,
        });
      });
    } else {
      res.json({
        code: 200,
        // data: result.dataValues,
        data: result,
      });
    } */
  }).error((err) => {
    res.send('error has occured');
  });
});

router.post('/delete', (req, res) => {
  const data = req.body;
  const { id } = data;

  Photo.destroy({
    where: { AD_ID: id }
  }).then((result) => {
    Notification.destroy({
      where: { AD_ID: id }
    }).then((result2) => {
      Payment.destroy({
        where: { AD_ID: id }
      }).then((result3) => {
        Advertise.destroy({
          where: { AD_ID: id }
        }).then((result4) => {
          if (result4) {
            res.json({
              code: 200,
            });
          }
        });
      });
    });
  });
});

module.exports = router;
