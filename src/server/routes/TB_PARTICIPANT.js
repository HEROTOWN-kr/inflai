const express = require('express');
const Sequelize = require('sequelize');
const Participant = require('../models').TB_PARTICIPANT;
const Influencer = require('../models').TB_INFLUENCER;
const Insta = require('../models').TB_INSTA;
const Naver = require('../models').TB_NAVER;
const Advertise = require('../models').TB_AD;
const Photo = require('../models').TB_PHOTO_AD;

const router = express.Router();
const {
  getIdFromToken,
  createMessageOption,
  createMessageOption3,
} = require('../config/common');

router.get('/', async (req, res) => {
  try {
    const {
      orderBy, direction, searchWord
    } = req.query;

    const firstRow = 0;

    const options = {
      where: {},
      attributes: [
        'INS_ID',
        'INF_ID',
        'INS_NAME',
        'INS_USERNAME',
        'INS_MEDIA_CNT',
        'INS_FLW',
        'INS_FLWR',
        'INS_PROFILE_IMG',
        'INS_LIKES',
        'INS_CMNT',
        'INS_TYPES',
      ],
      include: [
        {
          model: Influencer,
          attributes: ['INF_NAME'],
          where: {}
        },
      ],
      order: [[orderBy, direction]]
    };

    if (searchWord) {
      options.where = {
        [Op.or]: [
          { INS_NAME: { [Op.like]: `%${searchWord}%` } },
          { INS_USERNAME: { [Op.like]: `%${searchWord}%` } },
          { INS_TYPES: { [Op.like]: `%${searchWord}%` } },
          { '$TB_INFLUENCER.INF_NAME$': { [Op.like]: `%${searchWord}%` } }
        ],
      };
    }

    const InstaBlogers = await Instagram.findAll(options);
    const InstaCount = await Instagram.count();

    let iCount = InstaCount - 1;

    for (let i = 0; i < InstaBlogers.length; i++) {
      InstaBlogers[i].dataValues.rownum = InstaCount - firstRow - (iCount--);
    }

    res.json({
      code: 200,
      data: { list: InstaBlogers, cnt: InstaCount },
    });

    /* try {
          const blogersArray = InstaBlogers.map((item, index) => {
            // const rownum = InstaCount - firstRow - (iCount - index);
            const rownum = { a: 5 };
            const obj = Object.assign(item, rownum);
            return obj;
          /!*  const x = '';
            return new Promise(((resolve, reject) => {
              const rownum = InstaCount - firstRow - (iCount - index);
              resolve({ ...item, rownum });
            })); *!/
          });

          res.json({
            code: 200,
            data: blogersArray,
          });
        } catch (err) {
          res.json({
            code: 400,
            data: err.message,
          });
        } */


    /* Instagram.findAll(options).then((result) => {
          list = result;
          Instagram.count().then((cnt) => {
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
        }); */
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/save', async (req, res) => {
  try {
    const data = req.body;
    const {
      token, adId, detailAddress, email, extraAddress, insta, message, name, naver, phone,
      postcode, receiverName, roadAddress, youtube
    } = data;

    const id = getIdFromToken(token).sub;

    const createParams = {
      INF_ID: id,
      AD_ID: adId,
      PAR_INSTA: insta ? 1 : 0,
      PAR_YOUTUBE: youtube ? 1 : 0,
      PAR_NAVER: naver ? 1 : 0,
      PAR_NAME: name,
      PAR_MESSAGE: message,
      PAR_TEL: phone,
      PAR_EMAIL: email,
    };

    if (receiverName) createParams.PAR_RECEIVER = receiverName;
    if (postcode) createParams.PAR_POST_CODE = postcode;
    if (roadAddress) createParams.PAR_ROAD_ADDR = roadAddress;
    if (detailAddress) createParams.PAR_DETAIL_ADDR = detailAddress;
    if (extraAddress) createParams.PAR_EXTR_ADDR = extraAddress;

    await Participant.create(createParams);

    res.status(200).json({
      data: 'success',
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/checkParticipant', async (req, res) => {
  try {
    const {
      token, adId
    } = req.query;
    const id = getIdFromToken(token).sub;

    const result = await Participant.findOne({
      where: { INF_ID: id, AD_ID: adId }
    });

    if (result) {
      res.status(201).json({
        data: { message: '이미 신청되었습니다!' },
      });
    } else {
      res.status(200).json({
        data: { message: 'success' }
      });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/getList', async (req, res) => {
  try {
    const data = req.query;
    const { adId, onlySelected } = data;

    const page = parseInt(data.page, 10);
    const limit = parseInt(data.limit, 10);
    const offset = (page - 1) * limit;

    const where = { AD_ID: adId };
    if (onlySelected) where.PAR_STATUS = '2';

    const options = {
      where: { AD_ID: adId },
      attributes: ['PAR_ID', 'INF_ID', 'PAR_INSTA', 'PAR_YOUTUBE', 'PAR_NAVER', 'PAR_NAME', 'PAR_MESSAGE', 'PAR_STATUS', 'PAR_REVIEW',
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('PAR_DT'), '%Y-%m-%d %H:%i:%S'), 'PAR_DT']
      ],
      include: [
        {
          model: Influencer,
          attributes: ['INF_ID', 'INF_PHOTO']
        },
      ],
      limit,
      offset,
      order: [['PAR_ID', 'DESC']]
    };

    const CountOptions = { where: { AD_ID: adId } };

    if (onlySelected) {
      options.where.PAR_STATUS = '2';
      CountOptions.where.PAR_STATUS = '2';
    }

    const result = await Participant.findAll(options);
    const ParticipantCount = await Participant.count(CountOptions);

    const ParticipantsList = result.map((item) => {
      const {
        INF_ID, INF_NAME, INF_EMAIL, INF_PHOTO
      } = item.TB_INFLUENCER.dataValues;

      return {
        ...item.dataValues,
        INF_ID,
        INF_NAME,
        INF_EMAIL,
        INF_PHOTO
      };
    });

    const PromiseArray = ParticipantsList.map(item => new Promise(((resolve, reject) => {
      const { INF_ID, PAR_INSTA, PAR_NAVER } = item;
      if (PAR_INSTA === 1) {
        Insta.findOne({
          where: { INF_ID },
          attributes: ['INS_ID']
        }).then((resp) => {
          resolve({
            ...item, INS_ID: resp ? resp.INS_ID : null
          });
        });
      } else if (PAR_NAVER === 1) {
        Naver.findOne({
          where: { INF_ID },
          attributes: ['NAV_ID']
        }).then((resp) => {
          resolve({
            ...item, NAV_ID: resp ? resp.NAV_ID : null
          });
        });
      } else {
        resolve(item);
      }
    })));

    const ParticipantFinal = await Promise.all(PromiseArray);

    res.status(200).json({
      data: ParticipantFinal,
      count: ParticipantCount
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/getCampaigns', async (req, res) => {
  try {
    const { token, status } = req.query;

    const id = getIdFromToken(token).sub;

    const whereProps = {
      INF_ID: id
    };

    if (status) whereProps.PAR_STATUS = status;

    const dbData = await Participant.findAll({
      where: whereProps,
      attributes: ['PAR_ID', 'PAR_REVIEW'],
      include: [
        {
          model: Advertise,
          attributes: ['AD_ID', 'AD_INSTA', 'AD_YOUTUBE', 'AD_NAVER', 'AD_SRCH_START', 'AD_SRCH_END', 'AD_CTG', 'AD_CTG2', 'AD_NAME', 'AD_SHRT_DISC', 'AD_INF_CNT'],
          include: [
            {
              model: Photo,
              attributes: ['PHO_ID', 'PHO_FILE'],
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
      const { PAR_ID, PAR_REVIEW, TB_AD } = item.dataValues;
      const adData = TB_AD.dataValues;
      const proportion = Math.round(100 / (adData.AD_INF_CNT / adData.TB_PARTICIPANTs.length));
      return {
        ...adData, proportion, PAR_ID, PAR_REVIEW
      };
    });

    res.status(200).json({
      data: advertises
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

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
        }
      ],
    });

    const {
      TB_INFLUENCER, PAR_NAME, PAR_EMAIL, PAR_TEL, PAR_POST_CODE, PAR_ROAD_ADDR, PAR_DETAIL_ADDR, PAR_EXTR_ADDR
    } = dbData;

    res.status(200).json({
      data: {
        PAR_NAME, PAR_EMAIL, PAR_TEL, PAR_POST_CODE, PAR_ROAD_ADDR, PAR_DETAIL_ADDR, PAR_EXTR_ADDR
      }
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post('/change', async (req, res) => {
  try {
    const data = req.body;
    const {
      adId, participantId
    } = data;

    const AdResponse = await Advertise.findOne({
      where: { AD_ID: adId },
      attributes: ['AD_INF_CNT']
    });

    const ParResponse = await Participant.findAndCountAll({
      where: { AD_ID: adId, PAR_STATUS: '2' },
      attributes: ['PAR_ID']
    });

    const { count } = ParResponse;
    const { AD_INF_CNT } = AdResponse;

    if (count >= parseInt(AD_INF_CNT, 10)) {
      res.status(201).send({ message: '이미 다 모집되었습니다!' });
    } else {
      const post = { PAR_STATUS: '2' };

      await Participant.update(post, {
        where: { AD_ID: adId, PAR_ID: participantId }
      });

      const ParticipantInfo = await Participant.findOne({
        where: { PAR_ID: participantId },
        attributes: ['PAR_NAME', 'PAR_TEL'],
        include: [
          {
            model: Advertise,
            attributes: ['AD_NAME']
          },
        ]
      });

      const { PAR_NAME, PAR_TEL, TB_AD } = ParticipantInfo;
      const { AD_NAME } = TB_AD;
      const props = {
        phoneNumber: PAR_TEL,
        campanyName: AD_NAME,
        influencerName: PAR_NAME,
        adId,
      };

      await createMessageOption3(props);

      res.status(200).json({ message: 'success' });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/writeReview', async (req, res) => {
  try {
    const data = req.body;
    const {
      adId, token, url
    } = data;

    const userId = getIdFromToken(token).sub;

    const post = { PAR_REVIEW: url };

    await Participant.update(post, {
      where: { AD_ID: adId, INF_ID: userId }
    });

    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
