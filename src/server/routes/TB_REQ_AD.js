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


module.exports = router;
