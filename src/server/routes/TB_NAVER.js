const express = require('express');
const request = require('request');
const Sequelize = require('sequelize');
const puppeteer = require('puppeteer');
const { parseString } = require('xml2js');
const Naver = require('../models').TB_NAVER;
const Participant = require('../models').TB_PARTICIPANT;
const Influencer = require('../models').TB_INFLUENCER;

const { Op } = Sequelize;

const {
  getGoogleData,
  getIdFromToken,
  YoutubeDataRequest
} = require('../config/common');

const router = express.Router();

router.get('/blogInfo', async (req, res) => {
  try {
    const { token } = req.query;
    const INF_ID = getIdFromToken(token).sub;

    const dbData = await Naver.findOne({ where: { INF_ID, NAV_BLOG_ID: { [Op.not]: null } } });

    if (dbData) {
      const {
        NAV_GUEST, NAV_FLWR, NAV_CONT, NAV_GUEST_AVG, ...rest
      } = dbData.dataValues;
      const { cntArray, dateArray } = JSON.parse(NAV_GUEST);
      const guestInt = NAV_GUEST_AVG.toLocaleString('en');
      const followerInt = NAV_FLWR.toLocaleString('en');
      const countInt = NAV_CONT.toLocaleString('en');

      return res.status(200).json({
        data: {
          ...rest,
          cntArray,
          dateArray,
          NAV_FLWR: followerInt,
          NAV_CONT: countInt,
          NAV_GUEST_AVG: guestInt
        }
      });
    }
    return res.status(201).json({ message: '연동된 계정 없습니다' });
  } catch (e) {
    return res.status(400).json({ message: e.message });
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
          include: [
            {
              model: Naver,
              attributes: ['NAV_ID', 'NAV_URL']
            }
          ],
        }
      ],
    });

    const {
      TB_INFLUENCER, PAR_NAME, PAR_EMAIL, PAR_TEL, PAR_POST_CODE, PAR_ROAD_ADDR, PAR_DETAIL_ADDR, PAR_EXTR_ADDR
    } = dbData;
    const { TB_NAVER } = TB_INFLUENCER || {};
    const { NAV_ID, NAV_URL } = TB_NAVER || {};

    res.status(200).json({
      data: {
        PAR_NAME, PAR_EMAIL, PAR_TEL, PAR_POST_CODE, PAR_ROAD_ADDR, PAR_DETAIL_ADDR, PAR_EXTR_ADDR, NAV_ID, NAV_URL
      }
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const data = req.body;
    const { url, token } = data;
    const INF_ID = getIdFromToken(token).sub;

    const naverAccountExist = await Naver.findOne({ where: { NAV_URL: url } });
    if (naverAccountExist) {
      res.status(500).json({ message: '중복된 네이버 블로그입니다' });
    } else {
      await Naver.create({
        INF_ID,
        NAV_URL: url
      });
      res.status(200).json({ message: 'success' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

function visitorsReq(url) {
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        parseString(body, { attrkey: 'visitor' }, (err, result) => {
          const cntArray = result.visitorcnts.visitorcnt.map(item => item.visitor.cnt);
          const dateArray = result.visitorcnts.visitorcnt.map(item => item.visitor.id);
          resolve({ cntArray, dateArray });
        });
      } else {
        reject(error.message);
      }
    });
  });
}

router.post('/addBlog', async (req, res) => {
  try {
    const { blogId, token } = req.body;

    const naverAccountExist = await Naver.findOne({ where: { NAV_BLOG_ID: blogId } });
    if (naverAccountExist) {
      res.status(500).json({ message: '중복된 네이버 블로그입니다' });
    } else {
      const blogUrl = `https://m.blog.naver.com/PostList.nhn?blogId=${blogId}`;
      const INF_ID = getIdFromToken(token).sub;

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      });
      const page = await browser.newPage();

      await page.goto(blogUrl);


      try {
        await page.waitForSelector('.count_buddy', { visible: true, timeout: 1000 });
      } catch (e) {
        res.status(400).json({ message: '오류가 발생되었습니다' });
      }

      const contentButton = await page.$('.btn_t2');
      await contentButton.click();
      await page.waitForSelector('.lst_t4 > li > a > em', { visible: true });

      const followersText = await page.$eval('.count_buddy', el => el.innerText);
      const content = await page.$eval('.lst_t4 > li > a > em', el => el.innerText);
      const contentInt = content.replace(',', '');
      await browser.close();

      const followersTextArray = followersText.split('ㆍ');
      const followersFiltered = followersTextArray.filter(item => item.indexOf('명의') !== -1);
      const followers = followersFiltered[0].replace('명의 이웃', '');
      const followersInt = followers.replace(',', '');

      const visitorUrl = `http://blog.naver.com/NVisitorgp4Ajax.nhn?blogId=${blogId}`;

      const visitors = await visitorsReq(visitorUrl);

      const { cntArray } = visitors;
      const cntSum = cntArray.reduce((a, b) => a + parseInt(b, 10), 0);
      const visitorsAvg = Math.round(cntSum / cntArray.length);

      const naverAccount = await Naver.findOne({ where: { INF_ID } });

      const insertObj = {
        NAV_BLOG_ID: blogId,
        NAV_FLWR: followersInt,
        NAV_CONT: contentInt,
        NAV_GUEST: JSON.stringify(visitors),
        NAV_GUEST_AVG: visitorsAvg,
      };

      if (naverAccount) {
        await Naver.update(insertObj, { INF_ID });
      } else {
        insertObj.INF_ID = INF_ID;
        await Naver.create(insertObj);
      }
      res.status(200).json({ message: 'success' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const data = req.body;
    const { id } = data;

    await Naver.destroy({ where: { NAV_ID: id } });

    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
