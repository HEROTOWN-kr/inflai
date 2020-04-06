const express = require('express');
const Payment = require('../models').TB_PAYMENT;
const Advertise = require('../models').TB_AD;
const common = require('../config/common');

const router = express.Router();

router.post('/', (req, res) => {
  const data = req.body;
  const { id } = data;

  const post = {
    AD_ID: id,
    PAY_RESP: JSON.stringify(data.payment_res)
  };

  Payment.create(post).then((result) => {
    if (result) {
      Advertise.update({ AD_PAID: 'Y' }, {
        where: { AD_ID: id }
      }).then((result2) => {
        if (result2) {
          res.json({
            code: 200,
            data: result2
          });
        }
      });
    }
  });
});

module.exports = router;
