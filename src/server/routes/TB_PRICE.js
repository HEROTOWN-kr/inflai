const express = require('express');
const Price = require('../models').TB_PRICE;

const router = express.Router();

router.get('/', (req, res) => {
  Price.findAll().then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured', err);
  });
});

router.post('/', (req, res) => {
  const data = req.body;
  const {
    nano, micro, macro, mega, celebrity
  } = data;

  const post = {};

  if (nano) post.PRC_NANO = nano;
  if (micro) post.PRC_MICRO = micro;
  if (macro) post.PRC_MACRO = macro;
  if (mega) post.PRC_MEGA = mega;
  if (celebrity) post.PRC_CELEBRITY = celebrity;

  Price.update(post, { where: { PRC_ID: 1 } }).then((result) => {
    res.json({
      code: 200,
      data: result,
    });
  }).error((err) => {
    res.send('error has occured', err);
  });
});

module.exports = router;
