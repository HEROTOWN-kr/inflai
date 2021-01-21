const express = require('express');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const request = require('request');
const async = require('async');
const { google } = require('googleapis');

const uniqid = require('uniqid');
const fse = require('fs-extra');
const path = require('path');

const { asyncMiddleware } = require('../config/common');
const config = require('../config/config');
const configKey = require('../config/config');
const Influencer = require('../models').TB_INFLUENCER;
const Instagram = require('../models').TB_INSTA;
const Youtube = require('../models').TB_YOUTUBE;
const Naver = require('../models').TB_NAVER;
const Notification = require('../models').TB_NOTIFICATION;
const {
  getInstagramMediaData,
  getInstagramData,
  getInstagramInsights,
  YoutubeDataRequest,
  instaRequest,
  getIdFromToken,
  getFacebookLongToken,
  createToken,
  getFacebookInfo,
  getInstagramBusinessAccounts,
  getGoogleData,
  hashData,
  checkLocalHost
} = require('../config/common');
const testData = require('../config/testData');


const router = express.Router();


function getBlogType(blogType) {
  let social;
  switch (blogType) {
    case '1': {
      social = 'facebook';
      break;
    }
    case '2': {
      social = 'google';
      break;
    }
    case '3': {
      social = 'naver';
      break;
    }
    case '4': {
      social = 'kakao';
      break;
    }
    case '5': {
      social = 'noSocial';
      break;
    }
  }
  return social;
}

router.get('/', async (req, res) => {
  try {
    const { token, id, col } = req.query;
    const userId = id || getIdFromToken(token).sub;
    const options = {
      where: { INF_ID: userId },
      attributes: [
        'INF_NAME', 'INF_EMAIL', 'INF_TEL', 'INF_POST_CODE', 'INF_ROAD_ADDR', 'INF_DETAIL_ADDR', 'INF_EXTR_ADDR', 'INF_CITY', 'INF_AREA', 'INF_PROD', 'INF_CITY', 'INF_AREA', 'INF_PHOTO', 'INF_MESSAGE',
        [Sequelize.literal('CASE INF_BLOG_TYPE WHEN \'1\' THEN \'Facebook\' WHEN \'2\' THEN \'Google\' WHEN \'3\' THEN \'Naver\' WHEN \'4\' THEN \'Kakao\' ELSE \'일반\' END'), 'INF_BLOG_TYPE']
      ],
      include: [
        {
          model: Instagram,
          attributes: ['INS_ID', 'INS_USERNAME',
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('INS_DT'), '%Y년 %m월 %d일 %H시 %i분'), 'INS_DT'],

          ],
          required: false,
        },
        {
          model: Youtube,
          attributes: ['YOU_ID', 'YOU_NAME',
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('YOU_DT'), '%Y년 %m월 %d일 %H시 %i분'), 'YOU_DT'],

          ],
          required: false,
        },
        {
          model: Naver,
          attributes: ['NAV_ID', 'NAV_URL',
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('NAV_DT'), '%Y년 %m월 %d일 %H시 %i분'), 'NAV_DT'],
          ],
          required: false,
        },
      ],
    };

    if (col && col === 'nickName') options.attributes = ['INF_NAME'];
    if (col && col === 'phone') options.attributes = ['INF_TEL'];
    if (col && col === 'country') options.attributes = ['INF_CITY'];
    if (col && col === 'region') options.attributes = ['INF_AREA'];
    if (col && col === 'product') options.attributes = ['INF_PROD'];
    if (col && col === 'country region') options.attributes = ['INF_CITY', 'INF_AREA'];

    const result = await Influencer.findOne(options);
    const data = result.dataValues;
    // const { INF_PHOTO } = data;
    // if (INF_PHOTO) data.INF_PHOTO = `https://www.inflai.com${INF_PHOTO}`;
    res.json({ code: 200, data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/UserInfo', (req, res) => {
  const { token, id } = req.query;
  const userId = id || getIdFromToken(token).sub;

  Influencer.findOne({
    where: { INF_ID: userId },
    attributes: ['INF_EMAIL', 'INF_NAME', 'INF_BLOG_TYPE', 'INF_TEL', 'INF_REF_TOKEN', 'INF_TOKEN', 'INF_INST_ID', 'INF_COUNTRY', 'INF_CITY', 'INF_AREA', 'INF_PROD', 'INF_MESSAGE']
  }).then((result) => {
    if (result.INF_INST_ID) {
      const instaInfoUrl = `https://graph.facebook.com/v6.0/${result.INF_INST_ID}?fields=username&access_token=${result.INF_TOKEN}`;
      request.get(instaInfoUrl, (err3, response3, body3) => {
        const accountInfo = JSON.parse(body3);
        res.json({
          code: 200,
          data: result.dataValues,
          instaInfo: accountInfo
        });
      });
    } else {
      res.json({
        code: 200,
        data: result,
      });
    }
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/userId', (req, res) => {
  const { token, id } = req.query;
  const userId = id || getIdFromToken(token).sub;

  res.json({
    code: 200,
    data: { userId },
  });
});

router.get('/getInstaAccounts', (req, res) => {
  const { id } = req.query;

  Influencer.findOne({
    where: { INF_ID: id },
    attributes: ['INF_ID', 'INF_NAME', 'INF_EMAIL', 'INF_TOKEN', 'INF_BLOG_TYPE']
  }).then((result) => {
    const { INF_TOKEN, INF_BLOG_TYPE } = result.dataValues;
    if (INF_BLOG_TYPE === '1') {
      const pagesUrl = `https://graph.facebook.com/v6.0/me/accounts?access_token=${INF_TOKEN}`;
      const businessAccs = [];


      request.get(pagesUrl, (err, response, body) => {
        if (!err && response.statusCode == 200) {
          const pages = JSON.parse(body).data;
          pages.map((item) => {
            const instaAccUrl = `https://graph.facebook.com/v6.0/${item.id}?fields=instagram_business_account&access_token=${INF_TOKEN}`;
            request.get(instaAccUrl, (err2, response2, body2) => {
              const account = JSON.parse(body2);
              if (account.instagram_business_account) {
                const instaInfoUrl = `https://graph.facebook.com/v6.0/${account.instagram_business_account.id}?fields=profile_picture_url%2Cusername&access_token=${INF_TOKEN}`;
                request.get(instaInfoUrl, (err3, response3, body3) => {
                  const accountInfo = JSON.parse(body3);
                  businessAccs.push({ id: accountInfo.id, picture: accountInfo.profile_picture_url, username: accountInfo.username });
                });
              }
            });
          });
          setTimeout(() => {
            res.json({
              code: 200,
              // data: JSON.parse(body).data,
              data: businessAccs,
              info: {
                name: result.dataValues.INF_NAME,
                email: result.dataValues.INF_EMAIL
              }
            });
          }, 1500);
        }
      });
    } else {
      res.json({
        code: 200,
        info: {
          name: result.dataValues.INF_NAME,
          email: result.dataValues.INF_EMAIL,
          blogType: result.dataValues.INF_BLOG_TYPE
        }
      });
    }
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/getInfluencers', async (req, res) => {
  try {
    const data = req.query;
    const page = parseInt(data.page, 10);
    const limit = parseInt(data.limit, 10);
    const offset = (page - 1) * limit;

    const dbData = await Influencer.findAll({
      attributes: ['INF_ID', 'INF_NAME', 'INF_TEL', 'INF_EMAIL',
        [Sequelize.literal('CASE INF_BLOG_TYPE WHEN \'1\' THEN \'Facebook\' WHEN \'2\' THEN \'Google\' WHEN \'3\' THEN \'Naver\'  WHEN \'4\' THEN \'Kakao\' ELSE \'일반\' END'), 'INF_BLOG_TYPE'],
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('INF_DT'), '%Y-%m-%d'), 'INF_DT']],
      include: [
        {
          model: Instagram,
          attributes: ['INS_ID'],
          required: false,
        },
        {
          model: Youtube,
          attributes: ['YOU_ID'],
          required: false,
        },
        {
          model: Naver,
          attributes: ['NAV_ID'],
          required: false,
        }
      ],
      limit,
      offset,
      order: [['INF_ID', 'DESC']]
    });

    const InfluencerCount = await Influencer.count();
    const Influencers = dbData.map((item, index) => {
      const { dataValues } = item;
      const {
        TB_INSTum, TB_YOUTUBE, TB_NAVER, ...rest
      } = dataValues;
      if (TB_INSTum) rest.INS_ID = TB_INSTum.INS_ID;
      if (TB_YOUTUBE) rest.YOU_ID = TB_YOUTUBE.YOU_ID;
      if (TB_NAVER) rest.NAV_ID = TB_NAVER.NAV_ID;

      const rownum = InfluencerCount - offset - index;
      return { ...rest, rownum };
    });
    res.status(200).json({
      data: Influencers,
      InfluencerCount
    });
  } catch (e) {
    res.status(400).send({
      message: e.message
    });
  }
});

router.get('/getInstaInfo', (req, res) => {
  const { token } = req.query;
  const userId = getIdFromToken(token).sub;
  let resObj = {};

  Influencer.findOne({ where: { INF_ID: userId } }).then((result) => {
    const { INF_INST_ID, INF_TOKEN } = result.dataValues;
    const instaDataUrl = `https://graph.facebook.com/v6.0/${INF_INST_ID}?`
      + 'fields='
      + 'followers_count%2C'
      + 'follows_count%2C'
      + 'media_count%2C'
      + 'username%2C'
      + 'profile_picture_url%2C'
      + 'name&'
      + `access_token=${INF_TOKEN}`;

    const instaMediaDataUrl = `https://graph.facebook.com/v6.0/${INF_INST_ID}/media?`
        + 'fields='
        + 'thumbnail_url%2C'
        + 'media_url&'
        + `access_token=${INF_TOKEN}`;

    request.get(instaDataUrl, (error, response, body) => {
      resObj = { ...resObj, ...(JSON.parse(body)) };
      request.get(instaMediaDataUrl, (error2, response2, body2) => {
        resObj = { ...resObj, media: JSON.parse(body2).data };
        res.json({
          code: 200,
          data: resObj,
        });
      });
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/getApplicant', async (req, res) => {
  try {
    const { token, id, col } = req.query;
    const userId = id || getIdFromToken(token).sub;
    const options = {
      where: { INF_ID: userId },
      attributes: [
        'INF_NAME', 'INF_EMAIL', 'INF_TEL', 'INF_POST_CODE', 'INF_ROAD_ADDR',
        'INF_DETAIL_ADDR', 'INF_EXTR_ADDR'
      ],
      include: [
        {
          model: Instagram,
          attributes: ['INS_ID', 'INS_USERNAME',
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('INS_DT'), '%Y년 %m월 %d일 %H시 %i분'), 'INS_DT'],
          ],
          required: false,
        },
        {
          model: Youtube,
          attributes: ['YOU_ID', 'YOU_NAME',
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('YOU_DT'), '%Y년 %m월 %d일 %H시 %i분'), 'YOU_DT'],
          ],
          required: false,
        },
        {
          model: Naver,
          attributes: ['NAV_ID', 'NAV_URL',
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('NAV_DT'), '%Y년 %m월 %d일 %H시 %i분'), 'NAV_DT'],
          ],
          required: false,
        },
      ],
    };

    const result = await Influencer.findOne(options);
    const data = result.dataValues;

    const instaUserName = data.TB_INSTum && data.TB_INSTum.INS_USERNAME ? data.TB_INSTum.INS_USERNAME : '';
    const youtubeChannelName = data.TB_YOUTUBE && data.TB_YOUTUBE.YOU_NAME ? data.TB_YOUTUBE.YOU_NAME : '';
    const naverChannelName = data.TB_NAVER && data.TB_NAVER.NAV_URL ? data.TB_NAVER.NAV_URL : '';
    // const { INF_PHOTO } = data;
    // if (INF_PHOTO) data.INF_PHOTO = `https://www.inflai.com${INF_PHOTO}`;
    res.json({
      code: 200,
      data: {
        ...data, instaUserName, youtubeChannelName, naverChannelName
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/updateInfo', async (req, res) => {
  try {
    const data = req.body;
    const userId = getIdFromToken(data.token).sub;
    const {
      channel, nickName, phone, country, region, product, message, postcode,
      roadAddress, detailAddress, extraAddress
    } = data;

    const post = {};

    if (nickName) post.INF_NAME = nickName;
    if (phone) post.INF_TEL = phone;
    if (country) post.INF_CITY = country;
    if (region) post.INF_AREA = region;
    if (postcode) post.INF_POST_CODE = postcode;
    if (roadAddress) post.INF_ROAD_ADDR = roadAddress;
    if (detailAddress) post.INF_DETAIL_ADDR = detailAddress;
    if (extraAddress) post.INF_EXTR_ADDR = extraAddress;
    if (product) post.INF_PROD = product;
    if (message === 0 || message === 1) post.INF_MESSAGE = message;
    if (channel) {
      post.INF_CHANNEL = JSON.stringify(channel);
    }

    const updateData = await Influencer.update(post, { where: { INF_ID: userId } });
    res.status(200).json({ data: updateData });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/getLongLivedToken', (req, res) => {
  const {
    token, facebookToken, facebookUserId, instagramBusinessId
  } = req.query;
  const userId = getIdFromToken(token).sub;
  // const header = `Bearer ${token}`; // Bearer 다음에 공백 추가

  const apiUrl = 'https://graph.facebook.com/v6.0/oauth/access_token?'
      + 'grant_type=fb_exchange_token&'
      // + 'client_id=139193384125564&'
      // + 'client_secret=085e5020f9b2cdac9357bf7301f31e01&'  //using fbsecret
      + `client_id=${config.fb_client_id}&`
      + `client_secret=${config.fb_client_secret}&` // using fbsecret
      + `fb_exchange_token=${facebookToken}`;
  const options = {
    url: apiUrl,
  };

  request.get(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const longToken = (JSON.parse(body)).access_token;

      const apiUrl2 = `https://graph.facebook.com/v6.0/${facebookUserId}/accounts?`
          + `access_token=${longToken}`;

      request(apiUrl2, {}, (error2, response2, body2) => {
        if (!error && response.statusCode == 200) {
          // todo: find page long token api option for special fb page

          Influencer.update({ INF_TOKEN: longToken, INF_INST_ID: instagramBusinessId }, {
            where: { INF_ID: userId }
          }).then((result) => {
            res.json(longToken);
          });
        }
      });
    } else {
      console.log('error');
      if (response != null) {
        res.status(response.statusCode).end();
        console.log(`error = ${response.statusCode}`);
      }
    }
  });
});

router.post('/signup', async (req, res) => {
  try {
    const data = req.body;
    const { email, name, password } = data;

    const influencerData = await Influencer.findOne({
      where: { INF_EMAIL: email, INF_BLOG_TYPE: '5' }
    });

    if (influencerData) {
      res.status(201).json({ message: '이 이메일은 이미 사용중입니다.' });
    } else {
      const hashedPass = await hashData(password);
      const params = {
        INF_EMAIL: email,
        INF_NAME: name,
        INF_PASS: hashedPass,
        INF_BLOG_TYPE: '5'
      };
      const newUser = await Influencer.create(params);
      const { INF_ID, INF_NAME, INF_BLOG_TYPE } = newUser;

      res.status(200).json({
        userId: INF_ID,
        userToken: createToken(INF_ID),
        userName: INF_NAME,
        userPhone: '',
        social_type: getBlogType(INF_BLOG_TYPE)
      });
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/instaSignUp', (req, res) => {
  const data = req.body;
  const { facebookToken, facebookUserId } = data;
  let longToken;

  const longTokenUrl = 'https://graph.facebook.com/v6.0/oauth/access_token?'
      + 'grant_type=fb_exchange_token&'
      /* + 'client_id=139193384125564&'
      + 'client_secret=085e5020f9b2cdac9357bf7301f31e01&'  //using fbsecret */
      + `client_id=${config.fb_client_id}&`
      + `client_secret=${config.fb_client_secret}&` // using fbsecret
      + `fb_exchange_token=${facebookToken}`;

  const myInfoUrl = 'https://graph.facebook.com/v6.0/me?fields=email%2Cname&'
      + `access_token=${facebookToken}`;

  const pageLongToken = `https://graph.facebook.com/v6.0/${facebookUserId}/accounts?`
      + `access_token=${longToken}`;

  request.get(longTokenUrl, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      longToken = (JSON.parse(body)).access_token;
      const post = {
        INF_TOKEN: longToken
      };

      request.get(myInfoUrl, (error2, response2, body2) => {
        if (!error2 && response2.statusCode == 200) {
          // todo: find page long token api option for special fb page
          const userData = JSON.parse(response2.body);

          Influencer.findOne({ where: { INF_REG_ID: userData.id } }).then((result) => {
            if (!result) {
              post.INF_REG_ID = userData.id;
              post.INF_NAME = userData.name;
              post.INF_EMAIL = userData.email;
              post.INF_BLOG_TYPE = '1';
              Influencer.create(post).then((result2) => {
                res.json({
                  code: 200,
                  userId: result2.dataValues.INF_ID,
                  userToken: createToken(result2.dataValues.INF_ID),
                  userName: result2.dataValues.INF_NAME,
                  userPhone: result2.dataValues.INF_TEL,
                  social_type: getBlogType(result2.dataValues.INF_BLOG_TYPE)
                });
              });
            } else {
              const blogType = result.dataValues.INF_BLOG_TYPE;
              Influencer.update(post, {
                where: { INF_REG_ID: userData.id }
              }).then((result3) => {
                res.json({
                  code: 200,
                  userId: result.dataValues.INF_ID,
                  userToken: createToken(result.dataValues.INF_ID),
                  userName: result.dataValues.INF_NAME,
                  userPhone: result.dataValues.INF_TEL,
                  social_type: getBlogType(blogType)
                });
              });
            }
          });
        }
      });
    } else {
      console.log('error');
      if (response != null) {
        res.status(response.statusCode).end();
        console.log(`error = ${response.statusCode}`);
      }
    }
  });
});

router.post('/facebookLogin', async (req, res) => {
  try {
    const data = req.body;
    const { facebookToken, facebookUserId } = data;

    const longToken = await getFacebookLongToken(facebookToken);

    const userExist = await Influencer.findOne({ where: { INF_REG_ID: facebookUserId } });

    if (userExist) {
      const {
        INF_ID, INF_NAME, INF_BLOG_TYPE, INF_TEL, INF_PHOTO
      } = userExist;
      await Influencer.update({ INF_TOKEN: longToken }, { where: { INF_REG_ID: facebookUserId } });

      res.status(200).json({
        code: 200,
        userId: INF_ID,
        userToken: createToken(INF_ID),
        userName: INF_NAME,
        userPhone: INF_TEL,
        userPhoto: INF_PHOTO,
        social_type: getBlogType(INF_BLOG_TYPE)
      });
    } else {
      const instaAccounts = await getInstagramBusinessAccounts(longToken);
      if (instaAccounts.length === 0) {
        res.status(400).json({ message: '페이스북 페이지에 연결된 인스타그램 계정이 없습니다' });
      } else if (instaAccounts.length > 1) {
        res.status(202).json({ data: instaAccounts });
      } else {
        const instagramId = instaAccounts[0].id;
        const instaAccountExist = await Instagram.findOne({ where: { INS_ACCOUNT_ID: instagramId } });

        if (instaAccountExist) {
          res.status(400).json({ message: '중복된 인스타그램 계정입니다' });
        } else {
          const { picture, name, email } = await getFacebookInfo(facebookToken);
          const newUserData = await Influencer.create({
            INF_REG_ID: facebookUserId,
            INF_NAME: name,
            INF_EMAIL: email,
            INF_PHOTO: picture.data && picture.data.url ? picture.data.url : null,
            INF_BLOG_TYPE: '1'
          });

          const {
            INF_ID, INF_NAME, INF_BLOG_TYPE, INF_PHOTO
          } = newUserData;

          const instagramData = await getInstagramData(instagramId, longToken);
          const {
            follows_count, followers_count, media_count, username, profile_picture_url
          } = instagramData;

          const mediaData = await getInstagramMediaData(instagramId, longToken);
          const statistics = mediaData.reduce((acc, el) => ({
            likeSum: (acc.likeSum || 0) + el.like_count,
            commentsSum: (acc.commentsSum || 0) + el.comments_count,
          }), {});

          let ageStats;
          let genderLocalStats;

          try {
            const insights = await getInstagramInsights(instagramId, longToken);
            ageStats = insights[0].values[0].value;
            genderLocalStats = insights[1].values[0].value;
          } catch (err) {
            console.log(err);
          }

          const createParams = {
            INF_ID,
            INS_TOKEN: longToken,
            INS_ACCOUNT_ID: instagramId,
            INS_FLW: follows_count,
            INS_FLWR: followers_count,
            INS_NAME: instagramData.name,
            INS_USERNAME: username,
            INS_MEDIA_CNT: media_count,
            INS_PROFILE_IMG: profile_picture_url,
            INS_LIKES: statistics.likeSum,
            INS_CMNT: statistics.commentsSum
          };

          if (ageStats) createParams.INS_STAT_AGE_GENDER = JSON.stringify(ageStats);
          if (genderLocalStats) createParams.INS_STATE_LOC = JSON.stringify(genderLocalStats);

          await Instagram.create(createParams);

          res.status(200).json({
            userId: INF_ID,
            userToken: createToken(INF_ID),
            userName: INF_NAME,
            userPhone: '',
            userPhoto: INF_PHOTO,
            social_type: getBlogType(INF_BLOG_TYPE)
          });
        }
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/instaLogin', async (req, res) => {
  try {
    const data = req.body;
    const {
      facebookToken, facebookUserId, instaId
    } = data;

    const longToken = await getFacebookLongToken(facebookToken);
    const instaAccountExist = await Instagram.findOne({ where: { INS_ACCOUNT_ID: instaId } });

    if (instaAccountExist) {
      res.status(400).json({ message: '중복된 인스타그램 계정입니다' });
    } else {
      const { picture, name, email } = await getFacebookInfo(facebookToken);
      const newUserData = await Influencer.create({
        INF_REG_ID: facebookUserId,
        INF_NAME: name,
        INF_EMAIL: email,
        INF_PHOTO: picture.data && picture.data.url ? picture.data.url : '',
        INF_BLOG_TYPE: '1'
      });

      const {
        INF_ID, INF_NAME, INF_BLOG_TYPE, INF_PHOTO
      } = newUserData;

      const instagramData = await getInstagramData(instaId, longToken);
      const {
        follows_count, followers_count, media_count, username, profile_picture_url
      } = instagramData;

      const mediaData = await getInstagramMediaData(instaId, longToken);
      const statistics = mediaData.reduce((acc, el) => ({
        likeSum: (acc.likeSum || 0) + el.like_count,
        commentsSum: (acc.commentsSum || 0) + el.comments_count,
      }), {});

      let ageStats;
      let genderLocalStats;

      try {
        const insights = await getInstagramInsights(instaId, longToken);
        ageStats = insights[0].values[0].value;
        genderLocalStats = insights[1].values[0].value;
      } catch (err) {
        console.log(err);
      }

      const createParams = {
        INF_ID,
        INS_TOKEN: longToken,
        INS_ACCOUNT_ID: instaId,
        INS_FLW: follows_count,
        INS_FLWR: followers_count,
        INS_NAME: instagramData.name,
        INS_USERNAME: username,
        INS_MEDIA_CNT: media_count,
        INS_PROFILE_IMG: profile_picture_url,
        INS_LIKES: statistics.likeSum,
        INS_CMNT: statistics.commentsSum
      };

      if (ageStats) createParams.INS_STAT_AGE_GENDER = JSON.stringify(ageStats);
      if (genderLocalStats) createParams.INS_STATE_LOC = JSON.stringify(genderLocalStats);

      await Instagram.create(createParams);

      res.status(200).json({
        userId: INF_ID,
        userToken: createToken(INF_ID),
        userName: INF_NAME,
        userPhone: '',
        userPhoto: INF_PHOTO,
        social_type: getBlogType(INF_BLOG_TYPE)
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/instaUpdate', asyncMiddleware(
  async (req, res) => {
    const data = req.body;
    const {
      id, instaAccount, blogUrl, nickName, phone, country, region, product
    } = data;

    const post = {
      INF_NAME: nickName,
      INF_TEL: phone,
      INF_CITY: country,
      INF_AREA: region,
      INF_PROD: product
    };
    if (instaAccount) post.INF_INST_ID = instaAccount;
    if (blogUrl) post.INF_BLOG_URL = blogUrl;


    Influencer.update(post, { where: { INF_ID: id } });

    const InfluencerData = await Influencer.findOne({ where: { INF_ID: id } });
    const {
      INF_ID, INF_NAME, INF_TEL, INF_BLOG_TYPE, INF_TOKEN
    } = InfluencerData;
    const successResponse = {
      code: 200,
      userId: INF_ID,
      userToken: createToken(INF_ID),
      userName: INF_NAME,
      userPhone: INF_TEL,
      social_type: getBlogType(INF_BLOG_TYPE)
    };

    if (instaAccount) {
      try {
        const instagramData = await getInstagramData(instaAccount, INF_TOKEN);
        const {
          follows_count, followers_count, media_count, username, name, profile_picture_url
        } = instagramData;
        const instaAccountExist = await Instagram.findOne({ where: { INF_ID: id } });
        if (instaAccountExist) {
          Instagram.update({
            INS_TOKEN: INF_TOKEN,
            INS_ACCOUNT_ID: instaAccount,
            INS_FLW: follows_count,
            INS_FLWR: followers_count,
            INS_NAME: name,
            INS_USERNAME: username,
            INS_MEDIA_CNT: media_count,
            INS_PROFILE_IMG: profile_picture_url
          }, {
            where: { INF_ID: id }
          }).then((result4) => {
            res.json(successResponse);
          });
        } else {
          Instagram.create({
            INF_ID: id,
            INS_TOKEN: INF_TOKEN,
            INS_ACCOUNT_ID: instaAccount,
            INS_FLW: follows_count,
            INS_FLWR: followers_count,
            INS_NAME: name,
            INS_USERNAME: username,
            INS_MEDIA_CNT: media_count,
            INS_PROFILE_IMG: profile_picture_url
          }).then((result5) => {
            res.json(successResponse);
          });
        }
      } catch (err) {
        res.json({
          code: 400,
          error: err
        });
      }
    } else {
      res.json(successResponse);
    }
  }
));

router.get('/youtubeSignUp', async (req, res) => {
  try {
    const data = req.query;
    const { code, host } = data;
    const isLocal = checkLocalHost(host);
    const redirectUrl = isLocal ? `http://${host}` : `https://${host}`;

    const googleData = await getGoogleData(code, redirectUrl);
    const {
      name, email, id, refresh_token, picture
    } = googleData;
    const influencerData = await Influencer.findOne({ where: { INF_REG_ID: id } });

    if (!influencerData) {
      const newInfluencer = await Influencer.create({
        INF_NAME: name,
        INF_EMAIL: email,
        INF_PHOTO: picture || null,
        INF_REG_ID: id,
        INF_BLOG_TYPE: '2',
      });
      const { INF_ID, INF_NAME, INF_PHOTO } = newInfluencer;
      const youtubeChannelData = await YoutubeDataRequest(refresh_token, INF_ID);
      const channelId = youtubeChannelData.id;
      const { viewCount, subscriberCount } = youtubeChannelData.statistics;
      const { title, description } = youtubeChannelData.snippet;
      await Youtube.create({
        INF_ID,
        YOU_TOKEN: refresh_token,
        YOU_ACCOUNT_ID: channelId,
        YOU_NAME: title,
        YOU_SUBS: subscriberCount,
        YOU_VIEWS: viewCount
      });
      res.json({
        code: 200,
        userId: INF_ID,
        userToken: createToken(INF_ID),
        userName: INF_NAME,
        userPhone: null,
        userPhoto: INF_PHOTO,
        social_type: getBlogType('2')
      });
    } else {
      const {
        INF_BLOG_TYPE, INF_ID, INF_NAME, INF_TEL, INF_PHOTO
      } = influencerData;
      const youtubeChannelData = await YoutubeDataRequest(refresh_token, INF_ID);
      const { viewCount, subscriberCount } = youtubeChannelData.statistics;
      const { title, description } = youtubeChannelData.snippet;
      await Youtube.update({
        YOU_TOKEN: refresh_token,
        YOU_NAME: title,
        YOU_SUBS: subscriberCount,
        YOU_VIEWS: viewCount
      }, { where: { INF_ID } });

      res.json({
        code: 200,
        userId: INF_ID,
        userToken: createToken(INF_ID),
        userName: INF_NAME,
        userPhone: INF_TEL,
        userPhoto: INF_PHOTO,
        social_type: getBlogType(INF_BLOG_TYPE)
      });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.get('/getYoutubeInfo', (req, res) => {
  const { token } = req.query;
  const userId = getIdFromToken(token).sub;
  const resObj = {};
  const oauth2Client = getOauthClient();
  const youtube = google.youtube('v3');
  const oauth2 = google.oauth2('v2');

  Influencer.findOne({ where: { INF_ID: userId } }).then((result) => {
    const { INF_REF_TOKEN } = result.dataValues;
    oauth2Client.setCredentials({
      refresh_token: INF_REF_TOKEN
    });

    /* youtube.subscriptions.list({
      auth: oauth2Client,
      part: 'id',
      mySubscribers: true
    }, (err, response) => {
      if (err) {
        console.log(`The API returned an error: ${err}`);
        res.json({
          code: 400,
          data: err
        });
      } else {
        res.json({
          code: 200,
          data: response.data
        });
      } */

    youtube.channels.list({
      auth: oauth2Client,
      part: 'snippet, contentDetails, statistics',
      // part: 'id',
      mine: true,
      quotaUser: `secretquotastring${userId}`,
      // mySubscribers: true
    }, (err, response) => {
      if (err) {
        console.log(`The API returned an error: ${err}`);
        return;
      }
      const channels = response.data.items;
      if (channels.length == 0) {
        console.log('No channel found.');
        res.json({
          code: 200,
          data: response.data
        });
      } else {
        res.json({
          code: 200,
          data: response.data
        });
        /* console.log('This channel\'s ID is %s. Its title is \'%s\', and '
              + 'it has %s views.',
          channels[0].id,
          channels[0].snippet.title,
          channels[0].statistics.viewCount); */
      }
    });

    // refresh token get
    /* request.post('https://oauth2.googleapis.com/token',
      {
        form: {
          client_id: configKey.google_client_id,
          client_secret: configKey.google_client_secret,
          refresh_token: INF_REF_TOKEN,
          grant_type: 'refresh_token'
        }
      },
      (error, requestResponse, responseBody) => {
        if (!error && requestResponse.statusCode == 200) {
          res.json({
            code: 200,
            data: JSON.parse(responseBody)
          });
        } else if (requestResponse != null) {
          console.log(`error = ${requestResponse.statusCode}`);
          console.log(`error = ${error}`);
        }
      }); */
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/naverLogin', async (req, res) => {
  try {
    const data = req.query;
    const {
      email, id, name, profile_image, social_type
    } = data;

    const influencerData = await Influencer.findOne({ where: { INF_REG_ID: id, INF_BLOG_TYPE: '3' } });
    if (!influencerData) {
      const newData = await Influencer.create({
        INF_NAME: name,
        INF_EMAIL: email,
        INF_PHOTO: profile_image,
        INF_REG_ID: id,
        INF_BLOG_TYPE: '3'
      });
      const {
        INF_ID, INF_NAME, INF_TEL, INF_PHOTO
      } = newData;
      res.status(200).json({
        code: 200,
        userToken: createToken(INF_ID),
        userName: INF_NAME,
        userId: INF_ID,
        userPhone: INF_TEL,
        userPhoto: INF_PHOTO,
        social_type
      });
    } else {
      const {
        INF_ID, INF_NAME, INF_TEL, INF_PHOTO
      } = influencerData;
      res.status(200).json({
        userToken: createToken(INF_ID),
        userName: INF_NAME,
        userId: INF_ID,
        userPhone: INF_TEL,
        userPhoto: INF_PHOTO,
        social_type
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/kakaoLogin', async (req, res) => {
  try {
    const {
      id, email, name, type, social_type, photo
    } = req.query;

    const influencerData = await Influencer.findOne({ where: { INF_REG_ID: id } });
    if (!influencerData) {
      const newData = await Influencer.create({
        INF_NAME: name,
        INF_EMAIL: email,
        INF_PHOTO: photo || null,
        INF_REG_ID: id,
        INF_BLOG_TYPE: '4'
      });
      const { INF_ID, INF_NAME, INF_PHOTO } = newData;

      res.status(200).json({
        userToken: createToken(INF_ID),
        userName: INF_NAME,
        userPhone: null,
        userPhoto: INF_PHOTO,
        social_type
      });
    } else {
      const {
        INF_ID, INF_NAME, INF_TEL, INF_PHOTO
      } = influencerData;
      res.status(200).json({
        userToken: createToken(INF_ID),
        userName: INF_NAME,
        userId: INF_ID,
        userPhone: INF_TEL,
        userPhoto: INF_PHOTO,
        social_type
      });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.get('/rankInstagram', (req, res) => {
  const { type } = req.query;

  Influencer.findAll({
    where: { INF_BLOG_TYPE: type },
    attributes: ['INF_ID', 'INF_NAME', 'INF_EMAIL', 'INF_TOKEN', 'INF_INST_ID', 'INF_DT']
  }).then((result) => {
    instaRequest(result, (err, sortedArray) => {
      if (err) {
        res.json({
          code: 401,
          message: err
        });
      } else {
        res.json({
          code: 200,
          data: sortedArray
        });
      }
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/getInstagramRequests', (req, res) => {
  const { type, adId } = req.query;

  Notification.findAll({
    where: { NOTI_STATE: ['1', '4'], AD_ID: adId },
    attributes: ['NOTI_ID', 'NOTI_STATE'],
    include: [
      {
        model: Influencer,
        attributes: ['INF_ID', 'INF_NAME', 'INF_EMAIL', 'INF_TOKEN', 'INF_INST_ID', 'INF_DT']
      },
    ],
  }).then((result) => {
    instaRequest(result, (err, sortedArray) => {
      if (err) {
        res.json({
          code: 401,
          message: err
        });
      } else {
        res.json({
          code: 200,
          data: sortedArray
        });
      }
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/rankYoutube', (req, res) => {
  const { type } = req.query;

  const oauth2Client = getOauthClient();
  const youtube = google.youtube('v3');

  Influencer.findAll({
    where: { INF_BLOG_TYPE: type },
    attributes: ['INF_ID', 'INF_NAME', 'INF_EMAIL', 'INF_REF_TOKEN', 'INF_DT']
  }).then((result) => {
    async.map(result, (item, callback) => {
      const { INF_REF_TOKEN, INF_ID } = item.dataValues;
      oauth2Client.setCredentials({
        refresh_token: INF_REF_TOKEN
      });

      try {
        youtube.channels.list({
          auth: oauth2Client,
          part: 'snippet, statistics',
          mine: true,
          fields: 'items(snippet(title,description), statistics(viewCount, subscriberCount,videoCount))',
          quotaUser: `secretquotastring${INF_ID}`,
        }, (err, response) => {
          if (err) {
            callback(err || response.statusCode);
          }
          const info = response.data.items;
          if (info.length == 0) {
            console.log('No channel found.');
            callback(null, response.data);
          } else {
            callback(null, info[0]);
          }
        });
      } catch (e) {
        console.log(e);
      }
    }, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const sortedArray = results.sort((a, b) => {
          if (parseInt(a.statistics.subscriberCount, 10) < parseInt(b.statistics.subscriberCount, 10)) {
            return 1;
          }
          if (parseInt(a.statistics.subscriberCount, 10) > parseInt(b.statistics.subscriberCount, 10)) {
            return -1;
          }
          return 0;
        });

        res.json({
          code: 200,
          // data: JSON.parse(body).data,
          data: sortedArray
        });
      }
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

// 이미지 업로드
router.post('/upload', async (req, res, next) => {
  try {
    const { file } = req.files;
    const { token, id } = req.body;
    const userId = id || getIdFromToken(token).sub;
    const uid = uniqid();
    // const uid = 'profile';

    const newFileNm = path.normalize(uid + path.extname(file.name));
    const uploadPath = path.normalize(`${config.attachRoot}/profile/influencer/${userId}/`) + newFileNm;


    await fse.move(file.path, uploadPath, { clobber: true });

    const DRAWING_URL = `/attach/profile/influencer/${userId}/${newFileNm}`;

    const post = {
      INF_PHOTO: DRAWING_URL
    };

    await Influencer.update(post, {
      where: { INF_ID: userId }
    });

    return res.json({ code: 200, message: '', data: '' });
  } catch (err) {
    /* return res.json({
      code: 400,
      message: err.message
    }); */
    return res.status(400).json({ message: err.message });
  }
});

router.post('/delete', async (req, res, next) => {
  try {
    const { token, id } = req.body;
    const userId = id || getIdFromToken(token).sub;

    const InfluencerInfo = await Influencer.findOne({
      where: { INF_ID: userId },
      attributes: ['INF_PHOTO']
    });

    const { INF_PHOTO } = InfluencerInfo;
    const deletePath = path.normalize(`${config.downDir}${INF_PHOTO}`);
    await fse.remove(deletePath);

    const post = {
      INF_PHOTO: null
    };

    await Influencer.update(post, {
      where: { INF_ID: userId }
    });

    return res.json({ code: 200, message: '', data: '' });
  } catch (err) {
    return res.json({
      code: 400,
      message: err.message
    });
  }
});

module.exports = router;
