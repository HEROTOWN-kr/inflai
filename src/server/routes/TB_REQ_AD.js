const express = require('express');
const Sequelize = require('sequelize');
const RequestAgency = require('../models').TB_REQ_AD;
const Advertiser = require('../models').TB_ADVERTISER;
const common = require('../config/common');


const router = express.Router();

router.post('/', (req, res) => {
  const data = req.body;
  const userId = common.getIdFromToken(data.token).sub;

  const post = {
    ADV_ID: userId,
    REQ_COMP_NAME: data.companyName,
    REQ_NAME: data.name,
    REQ_EMAIL: data.email,
    REQ_TEL: data.phone,
    REQ_BRAND: data.productName,
    REQ_AIM: JSON.stringify(data.campaignAim),
    REQ_BUDJET: data.capital,
    REQ_CONSULT: JSON.stringify(data.consult)
  };

  if (data.description) post.REQ_OTHER = data.description;
  if (data.anotherAim) post.REQ_ANOTHER_AIM = data.anotherAim;

  RequestAgency.create(post).then((result) => {
    res.json({
      code: 200,
      id: result.dataValues.AD_ID,
    });
  });
});

router.get('/', (req, res) => {
  RequestAgency.findAll({
    attributes: ['REQ_ID', 'REQ_COMP_NAME', 'REQ_NAME', 'REQ_TEL', 'REQ_BRAND',
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('REQ_DT'), '%Y-%m-%d'), 'REQ_DT']],
    include: [
      {
        model: Advertiser,
        attributes: ['ADV_NAME']
      },
    ],
    order: [['REQ_DT', 'DESC']]
  }).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

router.get('/detail', (req, res) => {
  const data = req.query;
  const { id } = data;

  RequestAgency.findOne({
    attributes: ['REQ_ID', 'ADV_ID', 'REQ_COMP_NAME', 'REQ_NAME', 'REQ_EMAIL', 'REQ_TEL', 'REQ_BRAND', 'REQ_AIM', 'REQ_ANOTHER_AIM', 'REQ_BUDJET', 'REQ_CONSULT', 'REQ_OTHER',
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('REQ_DT'), '%Y-%m-%d'), 'REQ_DT']],
    where: { REQ_ID: id },
    include: [
      {
        model: Advertiser,
        attributes: ['ADV_NAME']
      },
    ],
    order: [['REQ_DT', 'DESC']]
  }).then((result) => {
    const returnObj = {...result.dataValues, REQ_AIM: JSON.parse(result.dataValues.REQ_AIM), REQ_CONSULT: JSON.parse(result.dataValues.REQ_CONSULT)};

    res.json({
      code: 200,
      data: returnObj
    });
  }).error((err) => {
    res.send('error has occured');
  });
});

module.exports = router;
