const jwt = require('jsonwebtoken');
const async = require('async');
const request = require('request');
const nodemailer = require('nodemailer');
const config = require('../config');
const testData = require('../config/testData');


function getIdFromToken(token) {
  const id = jwt.verify(token, config.jwtSecret);
  return id;
}

function createToken(id) {
  const payload = {
    sub: id
  };
  return jwt.sign(payload, config.jwtSecret);
}

function mailSendData() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.naver.com',
    port: 465,
    secure: true, // use SSL
    // secure: false, // use SSL
    auth: {
      user: 'andriantsoy@naver.com',
      pass: 'tshega93'
    }
  });

  const mailOptions = {
    to: '',
    from: 'andriantsoy@naver.com',
    subject: '인플라이 테스트 메세지',
    text: '인플라이 테스트 메세지'
  };

  return { transporter, mailOptions };
}

function instaRequest(data, cb) {
  function createUrl(INF_INST_ID, INF_TOKEN) {
    const instaDataUrl = `https://graph.facebook.com/v6.0/${INF_INST_ID}?`
        + 'fields='
        + 'followers_count%2C'
        + 'follows_count%2C'
        + 'media_count%2C'
        + 'username%2C'
        + 'profile_picture_url%2C'
        + 'name&'
        + `access_token=${INF_TOKEN}`;
    return instaDataUrl;
  }

  async.map(data, (item, callback) => {
    const instagramId = item.INF_INST_ID || item.TB_INFLUENCER.INF_INST_ID;
    const instagramToken = item.INF_TOKEN || item.TB_INFLUENCER.INF_TOKEN;
    const influencerId = item.INF_ID || item.TB_INFLUENCER.INF_ID;
    const influencerState = item.NOTI_STATE || null;

    const url = createUrl(instagramId, instagramToken);
    request.get(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const parsedBody = JSON.parse(body);
        callback(null, { ...parsedBody, INF_ID: influencerId, NOTI_STATE: influencerState });
      } else {
        callback(error || response.statusCode);
      }
    });
  }, (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      const sortedArray = results.sort((a, b) => {
        if (a.followers_count < b.followers_count) {
          return 1;
        }
        if (a.followers_count > b.followers_count) {
          return -1;
        }
        return 0;
      });

      cb(null, sortedArray);
    }
  });


  /* const sortedArray = testData.instaAccounts.sort((a, b) => {
    if (parseInt(a.followers_count, 10) < parseInt(b.followers_count, 10)) {
      return 1;
    }
    if (parseInt(a.followers_count, 10) > parseInt(b.followers_count, 10)) {
      return -1;
    }
    return 0;
  });

  cb(null, sortedArray); */
}

exports.getIdFromToken = getIdFromToken;
exports.createToken = createToken;
exports.instaRequest = instaRequest;
exports.mailSendData = mailSendData;
