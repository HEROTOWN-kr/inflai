const express = require('express');
const Participant = require('../models').TB_PARTICIPANT;

const router = express.Router();
const {
  getIdFromToken,
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

module.exports = router;
