const express = require('express');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const request = require('request');
const bcrypt = require('bcryptjs');
const { google } = require('googleapis');
const fse = require('fs-extra');
const path = require('path');
const uniqid = require('uniqid');

const config = require('../config/config');
const Advertiser = require('../models').TB_ADVERTISER;
const Kakao = require('../models').TB_KAKAO_ADV;
const NaverAdv = require('../models').TB_NAVER_ADV;
const {
  getIdFromToken,
  createToken,
  hashData,
  getGoogleData,
  checkLocalHost,
  encrypt,
  decrypt,
  mailSendData,
  s3DeleteObject,
  s3Upload,
  readFile,
  resizeImage
} = require('../config/common');

const saltRounds = 10;

const router = express.Router();

function getOauthClient() {
  const oauth2Client = new google.auth.OAuth2(
    config.google_client_id,
    config.google_client_secret,
    config.google_client_redirect_url
  );
  return oauth2Client;
}

router.get('/sendKakaoMessage', (req, res) => {
  const options = {
    method: 'POST',
    url: 'http://api.apistore.co.kr/kko/1.6/msg/herotown',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      'x-waple-authorization': 'MTMwOTAtMTU5MTE2NTg4NjcyOC0xMmRiOGQzYi1mOTY0LTRiNTAtOWI4ZC0zYmY5NjQ3YjUwZjg='
    },
    form: {
      PHONE: '01053275745',
      CALLBACK: '01026763937',
      MSG: '안녕하세요. 인플라이입니다.\n'
          + '새로운 캠페인이 등록되었습니다!\n\n'
          + '*제품명: 미니선풍기\n'
          + '*캠페인명: 선풍기 캠페인\n'
          + '*혜택: 10만원 쿠폰\n'
          + '*캠페인 신청 일자: 2020/06/18\n'
          + '*블로거 신청 마감: 2020/06/16 \n\n'
          + '**혜택이 있는 기회를 놓치지 마시고, 기한은 엄수해 주세요~^^\n'
          + '**해당 메시지는 고객님께서 캠페인 공고 수신에 동의 해 주셔서 발송되었습니다.\n',
      TEMPLATE_CODE: 'API2020',
      FAILED_TYPE: 'N',
      BTN_TYPES: '웹링크',
      BTN_TXTS: '신청링크',
      BTN_URLS1: 'https://www.inflai.com/CampaignList/37',
      BTN_URLS2: 'https://www.inflai.com/CampaignList/37'
    }
    // gzip: true
  };

  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      res.json({
        code: 200,
        data: JSON.parse(responseBody)
      });
    } else if (requestResponse != null) {
      res.json({
        code: 400,
        data: error
      });
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
});

router.get('/templateCheck', (req, res) => {
  const options = {
    method: 'GET',
    url: 'http://api.apistore.co.kr/kko/1/template/list/herotown',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      'x-waple-authorization': 'MTMwOTAtMTU5MTE2NTg4NjcyOC0xMmRiOGQzYi1mOTY0LTRiNTAtOWI4ZC0zYmY5NjQ3YjUwZjg='
    },
    qs: {
      TEMPLATE_CODE: 'API2020',
      STATUS: '1'
    },
  };

  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      res.json({
        code: 200,
        data: JSON.parse(responseBody)
      });
      console.log(requestResponse);
    } else if (requestResponse != null) {
      res.json({
        code: 400,
        data: error
      });
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
});

router.get('/sendNumbersCheck', (req, res) => {
  const options = {
    method: 'GET',
    url: 'http://api.apistore.co.kr/kko/1/sendnumber/list/herotown',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      'x-waple-authorization': 'MTMwOTAtMTU5MTE2NTg4NjcyOC0xMmRiOGQzYi1mOTY0LTRiNTAtOWI4ZC0zYmY5NjQ3YjUwZjg='
    }
  };

  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      res.json({
        code: 200,
        data: JSON.parse(responseBody)
      });
      console.log(requestResponse);
    } else if (requestResponse != null) {
      res.json({
        code: 400,
        data: error
      });
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
});

router.get('/requestSenderNumber', (req, res) => {
  const options = {
    method: 'POST',
    url: 'http://api.apistore.co.kr/kko/2/sendnumber/save/herotown',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      'x-waple-authorization': 'MTMwOTAtMTU5MTE2NTg4NjcyOC0xMmRiOGQzYi1mOTY0LTRiNTAtOWI4ZC0zYmY5NjQ3YjUwZjg='
    },
    form: {
      sendnumber: '01023270875',
      comment: '대가들이대표번호',
      pintype: 'SMS'
    }
  };

  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      res.json({
        code: 200,
        data: JSON.parse(responseBody)
      });
    } else if (requestResponse != null) {
      res.json({
        code: 400,
        data: error
      });
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
});

router.get('/saveSenderNumber', (req, res) => {
  const options = {
    method: 'POST',
    url: 'http://api.apistore.co.kr/kko/2/sendnumber/save/herotown',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      'x-waple-authorization': 'MTMwOTAtMTU5MTE2NTg4NjcyOC0xMmRiOGQzYi1mOTY0LTRiNTAtOWI4ZC0zYmY5NjQ3YjUwZjg='
    },
    form: {
      sendnumber: '01023270875',
      comment: '대가들이대표번호',
      pintype: 'SMS',
      pincode: '648152'
    }
  };

  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      res.json({
        code: 200,
        data: JSON.parse(responseBody)
      });
      console.log(requestResponse);
    } else if (requestResponse != null) {
      res.json({
        code: 400,
        data: error
      });
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
});

router.get('/getInfo', async (req, res) => {
  try {
    const { token } = req.query;
    const userId = getIdFromToken(token).sub;

    const dbInfo = await Advertiser.findOne({
      where: { ADV_ID: userId },
      attributes: ['ADV_ID', 'ADV_EMAIL', 'ADV_TEL', 'ADV_NAME', 'ADV_COM_NAME']
    });

    if (!dbInfo) return res.status(201).send({ message: '해당 사용자가 없습니다' });

    return res.status(200).send({ data: dbInfo });
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
});

router.get('/', (req, res) => {
  const { token, id, col } = req.query;
  const userId = id || getIdFromToken(token).sub;
  const options = {
    where: { ADV_ID: userId }
  };

  if (col && col === 'name') options.attributes = ['ADV_NAME'];
  if (col && col === 'companyName') options.attributes = ['ADV_COM_NAME'];
  if (col && col === 'phone') options.attributes = ['ADV_TEL'];
  if (col && col === 'registerNumber') options.attributes = ['ADV_REG_NUM'];
  if (col && col === 'classification') options.attributes = ['ADV_CLASS'];
  if (col && col === 'jobType') options.attributes = ['ADV_TYPE'];

  Advertiser.findOne(options).then((result) => {
    res.json({
      code: 200,
      data: result.dataValues,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/UserInfo', (req, res) => {
  const { token, id } = req.query;
  const userId = id || getIdFromToken(token).sub;

  Advertiser.findOne({
    where: { ADV_ID: userId },
    attributes: ['ADV_EMAIL', 'ADV_TEL', 'ADV_REG_NUM', 'ADV_NAME', 'ADV_COM_NAME', 'ADV_CLASS', 'ADV_POST_CODE', 'ADV_ROAD_ADDR', 'ADV_DETAIL_ADDR', 'ADV_EXTR_ADDR', 'ADV_PHOTO', 'ADV_PHOTO_URL', 'ADV_MESSAGE',
      [Sequelize.literal('CASE ADV_BLOG_TYPE WHEN \'1\' THEN \'Facebook\' WHEN \'2\' THEN \'Google\' WHEN \'3\' THEN \'Naver\' WHEN \'4\' THEN \'Kakao\' ELSE \'일반\' END'), 'ADV_BLOG_TYPE']
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

router.get('/getAdvertisers', async (req, res) => {
  try {
    const data = req.query;
    const page = parseInt(data.page, 10);
    const limit = parseInt(data.limit, 10);
    const offset = (page - 1) * limit;

    const dbData = await Advertiser.findAll({
      attributes: ['ADV_ID', 'ADV_NAME', 'ADV_TEL', 'ADV_EMAIL', 'ADV_COM_NAME', 'ADV_PHOTO', 'ADV_PHOTO_URL',
        [Sequelize.literal('CASE ADV_TYPE WHEN \'1\' THEN \'일반\' WHEN \'2\' THEN \'에이전시\' ELSE \'소상공인\' END'), 'ADV_TYPE'],
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('ADV_DT'), '%Y-%m-%d'), 'ADV_DT']
      ],
      limit,
      offset,
      order: [['ADV_ID', 'DESC']]
    });

    const AdvertiserCount = await Advertiser.count();
    const Advertisers = dbData.map((item, index) => {
      const { dataValues } = item;
      const rownum = AdvertiserCount - offset - index;
      return { ...dataValues, rownum };
    });

    res.status(200).json({
      data: Advertisers,
      AdvertiserCount
    });
  } catch (e) {
    res.status(400).send({
      message: e.message
    });
  }
});

router.get('/naverTest', (req, res) => {
  const token = 'AAAAO7ObqHQmS2x-G4UYKZ4SDKDZnRVG_0xJLLZZ0FWqEraRQZLW4-jAv1qVlFzA_6WhL6Ilagtv5y3EVJmiTzuhhL4';
  const header = `Bearer ${token}`; // Bearer 다음에 공백 추가

  const apiUrl = 'https://openapi.naver.com/v1/nid/me';
  const options = {
    url: apiUrl,
    headers: { Authorization: header }
  };
  request.get(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
      /* res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
      res.end(body); */
    } else {
      console.log('error');
      if (response != null) {
        res.status(response.statusCode).end();
        console.log(`error = ${response.statusCode}`);
      }
    }
  });
});

router.get('/kakaoTest', (req, res) => {
  const { token } = req.query;
  const header = `Bearer ${token}`; // Bearer 다음에 공백 추가

  const apiUrl = 'https://kapi.kakao.com/v1/user/me';
  const options = {
    url: apiUrl,
    headers: { Authorization: header }
  };
  request.post(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      res.json(body);
      // res.json(JSON.parse(body));
      /* res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
      res.end(body); */
    } else {
      console.log('error');
      if (response != null) {
        res.status(response.statusCode).end();
        console.log(`error = ${response.statusCode}`);
      }
    }
  });
});

router.get('/test2', (req, res) => {
  console.log('getting all advertisers');
  Advertiser.findAll().then((result) => {
    res.json(result);
  });
});

router.get('/loginGoogle', async (req, res) => {
  try {
    const data = req.query;
    const { code, host } = data;
    const isLocal = checkLocalHost(host);
    const redirectUrl = isLocal ? `http://${host}` : `https://${host}`;
    const googleData = await getGoogleData(code, redirectUrl);
    const {
      name, email, id, refresh_token, picture
    } = googleData;

    const advertiserData = await Advertiser.findOne({ where: { ADV_REG_ID: id } });

    if (!advertiserData) {
      const newAdvertiser = await Advertiser.create({
        ADV_NAME: name,
        ADV_EMAIL: email,
        ADV_PHOTO: picture || null,
        ADV_REG_ID: id,
        ADV_BLOG_TYPE: '2',
      });
      const { ADV_ID, ADV_NAME, ADV_PHOTO } = newAdvertiser;
      res.status(200).json({
        userToken: createToken(ADV_ID),
        userName: ADV_NAME,
        userPhone: null,
        userPhoto: ADV_PHOTO,
        social_type: 'google'
      });
    } else {
      const {
        ADV_ID, ADV_NAME, ADV_TEL, ADV_PHOTO
      } = advertiserData;
      res.status(200).json({
        userToken: createToken(ADV_ID),
        userName: ADV_NAME,
        userPhone: ADV_TEL,
        userPhoto: ADV_PHOTO,
        social_type: 'google'
      });
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/loginFacebook', async (req, res) => {
  try {
    const {
      id, email, name, social_type, photo
    } = req.query;

    const userFacebook = await Advertiser.findOne({ where: { ADV_REG_ID: id } });

    if (!userFacebook) {
      const newUser = await Advertiser.create({
        ADV_NAME: name,
        ADV_EMAIL: email,
        ADV_REG_ID: id,
        ADV_PHOTO: photo,
        ADV_BLOG_TYPE: '1',
      });
      const { ADV_ID, ADV_NAME, ADV_PHOTO } = newUser;
      res.status(200).json({
        userToken: createToken(ADV_ID),
        userName: ADV_NAME,
        userPhone: null,
        userPhoto: ADV_PHOTO,
        social_type
      });
    } else {
      const {
        ADV_ID, ADV_NAME, ADV_TEL, ADV_PHOTO
      } = userFacebook;
      res.status(200).json({
        userToken: createToken(ADV_ID),
        userName: ADV_NAME,
        userPhone: ADV_TEL,
        userPhoto: ADV_PHOTO,
        social_type
      });
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/loginNaver', async (req, res) => {
  try {
    const {
      id, email, name, social_type, profile_image
    } = req.query;

    const userNaver = await Advertiser.findOne({ where: { ADV_REG_ID: id } });

    if (!userNaver) {
      const newUser = await Advertiser.create({
        ADV_NAME: name,
        ADV_EMAIL: email,
        ADV_REG_ID: id,
        ADV_PHOTO: profile_image || null,
        ADV_BLOG_TYPE: '3'
      });
      const { ADV_ID, ADV_NAME, ADV_PHOTO } = newUser;
      res.status(200).json({
        userToken: createToken(ADV_ID),
        userName: ADV_NAME,
        userPhone: null,
        userPhoto: ADV_PHOTO,
        social_type
      });
    } else {
      const {
        ADV_ID, ADV_NAME, ADV_TEL, ADV_PHOTO
      } = userNaver;
      res.status(200).json({
        userToken: createToken(ADV_ID),
        userName: ADV_NAME,
        userPhone: ADV_TEL,
        userPhoto: ADV_PHOTO,
        social_type
      });
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/naverLoginNew', async (req, res) => {
  try {
    const data = req.query;
    const {
      email, id, name, profile_image, social_type
    } = data;

    const userExist = await NaverAdv.findOne({ where: { NAD_ACC_ID: id } });

    if (userExist) {
      const { ADV_ID } = userExist;
      const InfData = await Advertiser.findOne({ where: { ADV_ID } });
      const { ADV_NAME, ADV_PHOTO_URL, ADV_ACTIVATED } = InfData;

      if (ADV_ACTIVATED === 0) {
        res.status(400).json({ message: '이메일 인증링크를 확인 후, 시도해주세요' });
      } else {
        res.status(200).json({
          userToken: createToken(ADV_ID),
          userName: ADV_NAME,
          userPhoto: ADV_PHOTO_URL,
          social_type: 'naver'
        });
      }
    } else {
      res.status(201).json({
        navData: { id, profile_image }
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/naverSignUp', async (req, res) => {
  try {
    const data = req.body;
    const {
      navData, email, name, phone
    } = data;

    const userExist = await Advertiser.findOne({ where: { ADV_EMAIL: email } });

    if (userExist) {
      res.status(201).json({ message: '중복된 이메일입니다' });
    } else {
      const { id, profile_image } = navData;

      const newUserData = await Advertiser.create({
        ADV_NAME: name,
        ADV_EMAIL: email,
        ADV_TEL: phone,
        ADV_PHOTO_URL: profile_image || null,
        ADV_BLOG_TYPE: '3'
      });

      const { ADV_ID, ADV_EMAIL } = newUserData;

      const createParams = {
        ADV_ID,
        NAD_ACC_ID: id
      };

      await NaverAdv.create(createParams);

      const encryptedId = encrypt(ADV_ID.toString());

      await mailSendData({
        receiver: ADV_EMAIL,
        content: '환영합니다! 지금부터 인플라이에서 즐거운 인플루언서 활동을 즐겨보세요♥ 다음 링크로 이동하시면 회원가입이 완료됩니다. \n'
            + `https://biz.inflai.com/Activate/${encryptedId}`,
        subject: '회원가입 인증 링크'
      });

      res.status(200).json({ message: '가입 가능' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/loginKakao', async (req, res) => {
  try {
    const {
      id, email, name, social_type, photo
    } = req.query;

    const advertiserData = await Advertiser.findOne({ where: { ADV_REG_ID: id } });

    if (!advertiserData) {
      const newData = await Advertiser.create({
        ADV_NAME: name,
        ADV_EMAIL: email,
        ADV_PHOTO: photo || null,
        ADV_REG_ID: id,
        ADV_BLOG_TYPE: '4'
      });
      const { ADV_ID, ADV_NAME, ADV_PHOTO } = newData;
      res.status(200).json({
        userToken: createToken(ADV_ID),
        userName: ADV_NAME,
        userPhone: null,
        userPhoto: ADV_PHOTO,
        social_type
      });
    } else {
      const {
        ADV_ID, ADV_NAME, ADV_TEL, ADV_PHOTO
      } = advertiserData;
      res.json({
        userToken: createToken(ADV_ID),
        userName: ADV_NAME,
        userPhone: ADV_TEL,
        userPhoto: ADV_PHOTO,
        social_type
      });
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get('/kakaoLoginNew', async (req, res) => {
  try {
    const { id, photo } = req.query;

    const userExist = await Kakao.findOne({ where: { KAD_ACC_ID: id } });

    if (userExist) {
      const { ADV_ID } = userExist;
      const AdvData = await Advertiser.findOne({ where: { ADV_ID } });
      const { ADV_NAME, ADV_PHOTO_URL, ADV_ACTIVATED } = AdvData;

      if (ADV_ACTIVATED === 0) {
        res.status(400).json({ message: '이메일 인증링크를 확인 후, 시도해주세요' });
      } else {
        res.status(200).json({
          userToken: createToken(ADV_ID),
          userName: ADV_NAME,
          userPhoto: ADV_PHOTO_URL,
          social_type: 'kakao'
        });
      }
    } else {
      res.status(201).json({
        kakaoData: { id, photo }
      });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/kakaoSignUp', async (req, res) => {
  try {
    const data = req.body;
    const {
      kakaoData, email, name, phone
    } = data;

    const userExist = await Advertiser.findOne({ where: { ADV_EMAIL: email } });

    if (userExist) {
      res.status(201).json({ message: '중복된 이메일입니다' });
    } else {
      const { id, photo } = kakaoData;

      const newUserData = await Advertiser.create({
        ADV_NAME: name,
        ADV_EMAIL: email,
        ADV_TEL: phone,
        ADV_PHOTO_URL: photo || null,
        ADV_BLOG_TYPE: '4'
      });

      const { ADV_ID, ADV_EMAIL } = newUserData;

      const createParams = {
        ADV_ID,
        KAD_ACC_ID: id
      };

      await Kakao.create(createParams);

      const encryptedId = encrypt(ADV_ID.toString());

      await mailSendData({
        receiver: ADV_EMAIL,
        content: '환영합니다! 지금부터 인플라이에서 즐거운 인플루언서 활동을 즐겨보세요♥ 다음 링크로 이동하시면 회원가입이 완료됩니다. \n'
            + `https://biz.inflai.com/Activate/${encryptedId}`,
        subject: '회원가입 인증 링크'
      });

      res.status(200).json({ message: '가입 가능' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/activate', async (req, res) => {
  try {
    const data = req.body;
    const { hash } = data;

    const ADV_ID = parseInt(decrypt(hash), 10);
    await Advertiser.update({ ADV_ACTIVATED: 1 }, { where: { ADV_ID } });

    res.status(200).json({ message: ADV_ID });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/findId', async (req, res) => {
  try {
    const { phone, name } = req.query;

    const dbData = await Advertiser.findOne({
      where: { ADV_TEL: phone, ADV_NAME: name },
      attributes: ['ADV_EMAIL']
    });

    if (!dbData) {
      res.status(201).json({ message: '해당 사용자가 없습니다' });
    } else {
      const { ADV_EMAIL } = dbData;

      res.status(200).json({
        data: ADV_EMAIL
      });
    }
  } catch (e) {
    res.status(400).send({
      message: e.message
    });
  }
});

router.get('/resetPassLink', async (req, res) => {
  try {
    const { email } = req.query;

    const dbData = await Advertiser.findOne({
      where: { ADV_EMAIL: email },
      attributes: ['ADV_ID']
    });

    if (!dbData) {
      res.status(201).json({ message: '해당 사용자가 없습니다' });
    } else {
      const { ADV_ID } = dbData;

      const encryptedId = encrypt(ADV_ID.toString());

      await mailSendData({
        receiver: email,
        content: '다음 링크로 이동하시면 비밀번호 변경하실 수 있습니다. \n'
            + `https://biz.inflai.com/Reset/${encryptedId}`,
        subject: '비밀번호 변경링크'
      });

      res.status(200).json({ message: 'success' });
    }
  } catch (e) {
    res.status(400).send({
      message: e.message
    });
  }
});

router.post('/resetPass', async (req, res) => {
  try {
    const { hash, password } = req.body;

    const ADV_ID = parseInt(decrypt(hash), 10);
    const hashedPass = await hashData(password);
    await Advertiser.update({ ADV_PASS: hashedPass }, { where: { ADV_ID } });

    res.status(200).json({ message: 'success' });
  } catch (e) {
    res.status(400).send({
      message: e.message
    });
  }
});

router.get('/getPass', async (req, res) => {
  const { token } = req.query;
  const userId = getIdFromToken(token).sub;
  const dbData = await Advertiser.findOne({
    where: { ADV_ID: userId },
    attributes: ['ADV_PASS']
  });
  const { ADV_PASS } = dbData;

  res.status(200).json({ data: ADV_PASS ? 'exist' : null });
});

router.post('/updatePass', async (req, res) => {
  try {
    const { currentPassword, password, token } = req.body;
    const userId = getIdFromToken(token).sub;

    if (currentPassword) {
      const dbData = await Advertiser.findOne({
        where: { ADV_ID: userId },
        attributes: ['ADV_PASS']
      });
      const { ADV_PASS } = dbData;

      Advertiser.options.instanceMethods.validPassword(currentPassword, ADV_PASS, async (passwordErr, isMatch) => {
        if (passwordErr) {
          res.status(400).send({
            message: passwordErr.message
          });
        } else if (!isMatch) {
          res.status(201).json({ message: '기존 비밀번호는 일치하지 않습니다' });
        } else {
          const hashedCurrentPass = await hashData(password);
          await Advertiser.update({ ADV_PASS: hashedCurrentPass }, { where: { ADV_ID: userId } });
          res.status(200).json({ message: '수정되었습니다' });
        }
      });
    } else {
      const hashedPass = await hashData(password);
      await Advertiser.update({ ADV_PASS: hashedPass }, { where: { ADV_ID: userId } });
      res.status(200).json({ message: '수정되었습니다' });
    }
  } catch (e) {
    res.status(400).send({
      message: e.message
    });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const data = req.body;
    const { email, name, password } = data;

    const advertiserData = await Advertiser.findOne({
      where: { ADV_EMAIL: email }
    });

    if (advertiserData) {
      res.status(201).json({ message: '이 이메일은 이미 사용중입니다.' });
    } else {
      const hashedPass = await hashData(password);
      const params = {
        ADV_EMAIL: email,
        ADV_NAME: name,
        ADV_PASS: hashedPass,
        ADV_BLOG_TYPE: '5'
      };
      const newUser = await Advertiser.create(params);
      const {
        ADV_ID, ADV_EMAIL, ADV_NAME, ADV_PHOTO
      } = newUser;

      res.status(200).json({
        userId: ADV_ID,
        userToken: createToken(ADV_ID),
        userName: ADV_NAME,
        userPhone: '',
        userPhoto: ADV_PHOTO,
        social_type: '일반'
      });
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/signupNew', async (req, res) => {
  try {
    const data = req.body;
    const {
      email, name, password, phone
    } = data;

    const userExist = await Advertiser.findOne({
      where: { ADV_EMAIL: email }
    });

    if (userExist) {
      res.status(201).json({ message: '중복된 이메일입니다' });
    } else {
      const hashedPass = await hashData(password);
      const params = {
        ADV_EMAIL: email,
        ADV_NAME: name,
        ADV_TEL: phone,
        ADV_PASS: hashedPass,
        ADV_BLOG_TYPE: '5'
      };

      const newUserData = await Advertiser.create(params);

      const { ADV_ID, ADV_EMAIL } = newUserData;

      const encryptedId = encrypt(ADV_ID.toString());

      await mailSendData({
        receiver: ADV_EMAIL,
        content: '환영합니다! 지금부터 인플라이에서 즐거운 인플루언서 활동을 즐겨보세요♥ 다음 링크로 이동하시면 회원가입이 완료됩니다. \n'
            + `https://biz.inflai.com/Activate/${encryptedId}`,
        subject: '회원가입 인증 링크'
      });
      res.status(200).json({ message: '가입 가능' });
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const data = req.body;
    const {
      id, token, nickName, registerNumber, phone, companyName, postcode, roadAddress,
      detailAddress, extraAddress, message
    } = data;
    const userId = id || getIdFromToken(token).sub;

    const post = {};

    if (nickName) post.ADV_NAME = nickName;
    if (registerNumber) post.ADV_REG_NUM = registerNumber;
    if (phone) post.ADV_TEL = phone;
    if (companyName) post.ADV_COM_NAME = companyName;
    if (postcode) post.ADV_POST_CODE = postcode;
    if (roadAddress) post.ADV_ROAD_ADDR = roadAddress;
    if (detailAddress) post.ADV_DETAIL_ADDR = detailAddress;
    if (extraAddress) post.ADV_EXTR_ADDR = extraAddress;
    if (message === 0 || message === 1) post.ADV_MESSAGE = message;

    await Advertiser.update(post, { where: { ADV_ID: userId } });

    res.status(200).json({ message: 'success' });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
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
    const uploadPath = path.normalize(`${config.attachRoot}/profile/biz/${userId}/`) + newFileNm;


    await fse.move(file.path, uploadPath, { clobber: true });

    const DRAWING_URL = `/attach/profile/biz/${userId}/${newFileNm}`;

    const post = {
      ADV_PHOTO: DRAWING_URL
    };

    await Advertiser.update(post, {
      where: { ADV_ID: userId }
    });

    return res.status(200).json({ message: '' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post('/uploadAWS', async (req, res, next) => {
  try {
    const { file } = req.files;
    const { token, id } = req.body;
    const userId = id || getIdFromToken(token).sub;
    const uid = uniqid();

    const currentPath = file.path;
    const fileExtension = path.extname(file.name);
    const fileName = `${uid}_500${fileExtension}`;
    const tmpPath = path.normalize(`${config.tmp}${fileName}`);
    const uploadPath = `profile/biz/${userId}/${fileName}`;

    await resizeImage(currentPath, tmpPath, 500, null);
    const fileData = await readFile(tmpPath);
    const s3Data = await s3Upload(uploadPath, file.type, fileData);

    await fse.remove(currentPath);
    await fse.remove(tmpPath);

    const { Location, Key } = s3Data;

    const post = {
      ADV_PHOTO_URL: Location,
      ADV_PHOTO_KEY: Key
    };

    await Advertiser.update(post, {
      where: { ADV_ID: userId }
    });

    return res.status(200).json({ message: 'success' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const { token, id } = req.body;
    const userId = id || getIdFromToken(token).sub;

    const AdvertiserInfo = await Advertiser.findOne({
      where: { ADV_ID: userId },
      attributes: ['ADV_PHOTO']
    });

    const { ADV_PHOTO } = AdvertiserInfo;
    const deletePath = path.normalize(`${config.downDir}${ADV_PHOTO}`);
    await fse.remove(deletePath);

    const post = {
      ADV_PHOTO: null
    };

    await Advertiser.update(post, {
      where: { ADV_ID: userId }
    });

    return res.status(200).json({ message: '', data: '' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post('/deleteAWS', async (req, res) => {
  try {
    const { token, id } = req.body;
    const userId = id || getIdFromToken(token).sub;

    const AdvertiserInfo = await Advertiser.findOne({
      where: { ADV_ID: userId },
      attributes: ['ADV_PHOTO_KEY']
    });

    const { ADV_PHOTO_KEY } = AdvertiserInfo;

    const post = {
      ADV_PHOTO_URL: null
    };

    if (ADV_PHOTO_KEY) {
      post.ADV_PHOTO_KEY = null;
      await s3DeleteObject(ADV_PHOTO_KEY);
    }

    await Advertiser.update(post, {
      where: { ADV_ID: userId }
    });

    return res.status(200).json({ message: '', data: '' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
