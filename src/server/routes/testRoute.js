const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const vision = require('@google-cloud/vision');
const moment = require('moment');
const category = require('../config/detectCategory');
const { sendKakaoImgMessage } = require('../config/solapi');

const {
  getInstagramMediaData,
  getInstaOnlineFlwrs,
  resizeImage
} = require('../config/common');

const Instagram = require('../models').TB_INSTA;
const Advertise = require('../models').TB_AD;
const Photo = require('../models').TB_PHOTO_AD;

const router = express.Router();

function checkLocalHost(hostname) {
  const result = hostname.indexOf('localhost');
  return result !== -1;
}

router.get('/test', async (req, res) => {
  try {
    const { INS_ID, host } = req.query;
    const { detectCategory } = category;
    const isLocal = checkLocalHost(host);

    const colors = [
      '#FF835D', '#409CFF', '#52D726', '#FF0000',
      '#FFEC00', '#7CDDDD', '#4D4D4D', '#5DA5DA',
      '#FAA43A', '#60BD68', '#F17CB0', '#B2912F',
      '#B276B2', '#DECF3F', '#81726A', '#270722',
      '#E8C547', '#C2C6A7', '#ECCE8E', '#DC136C',
      '#353A47', '#84B082', '#5C80BC', '#CDD1C4',
      '#7CDDDD'
    ];

    const filePath = isLocal ? {
      keyFileName: 'src/server/config/googleVisionKey.json',
      imagePath: './src/server/img/image'
    } : {
      keyFileName: '/data/inflai/src/server/config/googleVisionKey.json',
      imagePath: '../server/img/image'
    };

    const client = new vision.ImageAnnotatorClient({
      keyFilename: filePath.keyFileName
    });

    const InstaData = await Instagram.findOne({
      where: { INS_ID },
      attributes: ['INS_ID', 'INS_TOKEN', 'INS_ACCOUNT_ID'],
    });

    const { INS_TOKEN, INS_ACCOUNT_ID } = InstaData;

    const instaData = await getInstagramMediaData(INS_ACCOUNT_ID, INS_TOKEN);

    if (instaData.length > 0) {
      const downloadedFiles = instaData.map(async (mediaInfo, index) => {
        const { thumbnail_url, media_url } = mediaInfo;
        const fileUrl = thumbnail_url || media_url;
        const response = await fetch(fileUrl);
        const buffer = await response.buffer();
        const fileName = `${filePath.imagePath}${index}.jpg`;

        return new Promise((resolve, reject) => {
          fs.writeFile(fileName, buffer, (err) => {
            if (err) resolve(null);
            resolve(fileName);
          });
        });
      });

      const filesToDetect = await Promise.all(downloadedFiles);

      const detectedFiles = filesToDetect.map(async (item, index) => {
        const [result] = await client.labelDetection(item);
        const labels = result.labelAnnotations;

        return new Promise((resolve, reject) => {
          if (labels && labels[0]) {
            const { score, description } = labels[0];

            const name = detectCategory.reduce((acc, ctg) => {
              const wordExist = (ctg.categories.indexOf(description) > -1);
              if (wordExist) return ctg.name;
              return acc;
            }, description);
            resolve(name);
          }
          resolve(null);
        });
      });

      const detectedFilesObj = filesToDetect.map(async (item, index) => {
        const [result] = await client.objectLocalization(item);
        const objects = result.localizedObjectAnnotations;

        return new Promise((resolve, reject) => {
          if (objects.length > 0) {
            const { name, score } = objects[0];

            const description = detectCategory.reduce((acc, ctg) => {
              const wordExist = (ctg.categories.indexOf(name) > -1);
              if (wordExist) return ctg.name;
              return acc;
            }, name);
            resolve(description);
          }
          resolve(null);
        });
      });

      const detectionResultsObj = await Promise.all(detectedFilesObj);

      const resultFilteredObj = detectionResultsObj.reduce((acc, el) => {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
      }, {});

      const resultArrayObj = Object.keys(resultFilteredObj).map(item => ({
        description: item,
        count: resultFilteredObj[item]
      }));

      const resultSortObj = resultArrayObj.sort((a, b) => b.count - a.count).slice(0, 4);

      const resultPercentageObj = resultSortObj.map((item, index) => {
        const { description, count } = item;
        const value = Math.round(100 / (instaData.length / count));
        return { description, value, color: colors[index] };
      });

      const percentSumObj = resultPercentageObj.reduce((acc, el) => acc + el.value, 0);

      if (percentSumObj < 100) {
        const other = { description: '기타', value: 100 - percentSumObj, color: '#84B082' };
        const statistics = [...resultPercentageObj, other];
        return res.status(200).json({ statistics });
      }

      return res.status(200).json({ statistics: resultPercentageObj });
    }

    return res.status(200).json({ instaData });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.get('/test2', async (req, res) => {
  try {
    const { AD_ID } = req.query;
    const imagePath = path.join(__dirname, '/../img');

    const dbData = await Advertise.findOne({
      where: { AD_ID },
      attributes: ['AD_NAME', 'AD_SRCH_START', 'AD_SRCH_END'],
      include: [
        {
          model: Photo,
          where: { PHO_IS_MAIN: 1 },
          attributes: ['PHO_FILE_URL'],
        }
      ]
    });

    const {
      AD_NAME, AD_SRCH_START, AD_SRCH_END, TB_PHOTO_ADs
    } = dbData;

    const { PHO_FILE_URL } = TB_PHOTO_ADs[0];

    const response = await fetch(PHO_FILE_URL);
    const buffer = await response.buffer();
    const fileName = `${imagePath}/kakaoImg.jpg`;
    const fileNameChanged = `${imagePath}/kakaoImgChanged.jpg`;

    fs.writeFile(fileName, buffer, async (err) => {
      try {
        if (err) return res.status(400).send(err.message);

        await resizeImage(fileName, fileNameChanged, 720);

        const messageText = '놓치면 후회하는 인플라이 캠페인이 등록되었습니다♥\n\n'
            + `*캠페인명: ${AD_NAME}\n`
            + `*캠페인 신청 일자: ${AD_SRCH_START}\n`
            + `*블로거 신청 마감: ${AD_SRCH_END}\n`;

        const props = {
          phoneNumber: '01023270875',
          messageText,
          // fileUrl: PHO_FILE_URL,
          filePath: fileNameChanged,
          webUrl: `https://influencer.inflai.com/Campaign/detail/${AD_ID}`
        };

        await sendKakaoImgMessage(props);
        return res.status(200).json({ dbData });
      } catch (e) {
        return res.status(400).send({ message: e.message });
      }
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});


module.exports = router;
