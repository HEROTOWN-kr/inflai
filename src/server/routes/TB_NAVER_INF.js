const express = require('express');
const NavInf = require('../models').TB_NAVER_INF;
const { getIdFromToken } = require('../config/common');

const router = express.Router();

router.get('/getInfo', async (req, res) => {
  try {
    const { token } = req.query;
    const userId = getIdFromToken(token).sub;

    const dbData = await NavInf.findOne({
      where: { INF_ID: userId },
      attributes: ['NIF_ID', 'NIF_DT'],
    });

    res.status(200).json({
      data: dbData || null
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
