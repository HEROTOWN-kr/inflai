const express = require('express');
const Seller = require('../models').TB_SELLER;

const router = express.Router();

router.post('/save', async (req, res) => {
  try {
    const {
      name, phone, email, blogUrl, instaUrl, youtubeUrl, salesNumber, biography
    } = req.body;

    const post = {
      SEL_NAME: name,
      SEL_EMAIL: email,
      SEL_TEL: phone,
      SEL_SALES_NUM: salesNumber,
      SEL_BIO: biography,
    };

    if (blogUrl) post.SEL_BLOG = blogUrl;
    if (instaUrl) post.SEL_INSTA = instaUrl;
    if (youtubeUrl) post.SEL_YOUTUBE = youtubeUrl;

    const newSeller = await Seller.create(post);

    res.status(200).json({ data: newSeller });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
