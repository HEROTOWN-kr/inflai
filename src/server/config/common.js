const jwt = require('jsonwebtoken');
const async = require('async');
const request = require('request');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const config = require('../config');
const testData = require('../config/testData');
const configKey = require('../config/config');


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
    const instagramId = item.INF_INST_ID || item.TB_INFLUENCER.INF_INST_ID || item.INS_ACCOUNT_ID;
    const instagramToken = item.INF_TOKEN || item.TB_INFLUENCER.INF_TOKEN || item.INS_TOKEN;
    const influencerId = item.INF_ID || item.TB_INFLUENCER.INF_ID;
    const influencerState = item.NOTI_STATE || null;

    const url = createUrl(instagramId, instagramToken);
    request.get(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const parsedBody = JSON.parse(body);
        callback(null, { ...parsedBody, INF_ID: influencerId, NOTI_STATE: influencerState });
      } else {
        callback(error, {});
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

function createMessageOption(
  phoneNumber,
  productName,
  campanyName,
  bonus,
  createdAt,
  collectFinishDate,
  adId
) {
  const options = {
    method: 'POST',
    url: 'http://api.apistore.co.kr/kko/1.6/msg/herotown',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      'x-waple-authorization': 'MTMwOTAtMTU5MTE2NTg4NjcyOC0xMmRiOGQzYi1mOTY0LTRiNTAtOWI4ZC0zYmY5NjQ3YjUwZjg='
    },
    form: {
      PHONE: phoneNumber,
      CALLBACK: '01023270875',
      MSG: '안녕하세요. 인플라이입니다.\n'
          + '새로운 캠페인이 등록되었습니다!\n\n'
          + `*제품명: ${productName}\n`
          + `*캠페인명: ${campanyName}\n`
          + `*혜택: ${bonus}\n`
          + `*캠페인 신청 일자: ${createdAt}\n`
          + `*블로거 신청 마감: ${collectFinishDate}\n\n`
          + '**혜택이 있는 기회를 놓치지 마시고, 기한은 엄수해 주세요~^^\n'
          + '**해당 메시지는 고객님께서 캠페인 공고 수신에 동의 해 주셔서 발송되었습니다.\n',
      TEMPLATE_CODE: 'API2020',
      FAILED_TYPE: 'N',
      BTN_TYPES: '웹링크',
      BTN_TXTS: '신청링크',
      BTN_URLS1: `https://www.inflai.com/CampaignList/${adId}`,
      BTN_URLS2: `https://www.inflai.com/CampaignList/${adId}`
    }
    // gzip: true
  };
  return options;
}

function createMessageOption2(
  phoneNumber,
  productName,
  campanyName,
  bonus,
  postingPrice,
  createdAt,
  collectFinishDate,
  influenserNumber,
  requirements,
  adId
) {
  const options = {
    method: 'POST',
    url: 'http://api.apistore.co.kr/kko/1.6/msg/herotown',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      'x-waple-authorization': 'MTMwOTAtMTU5MTE2NTg4NjcyOC0xMmRiOGQzYi1mOTY0LTRiNTAtOWI4ZC0zYmY5NjQ3YjUwZjg='
    },
    form: {
      PHONE: phoneNumber,
      CALLBACK: '01023270875',
      MSG: '안녕하세요. 체험단플랫폼 인플라이입니다.\n'
          + '새로운 캠페인이 등록되었습니다!\n\n'
          + `*제품명: ${productName}\n`
          + `*캠페인명: ${campanyName}\n`
          + `*시장가격: ${bonus}\n`
          + `*포스팅비용: ${postingPrice}\n`
          + `*모집기간: ${createdAt}~${collectFinishDate}\n`
          + `*인플루언서: ${influenserNumber}\n`
          + `*인플루언서: ${requirements}\n\n`
          + '**해당 메시지는 고객님께서 캠페인 공고 수신에 동의 해 주셔서 발송되었습니다.\n',
      TEMPLATE_CODE: 'API01',
      FAILED_TYPE: 'N',
      BTN_TYPES: '웹링크',
      BTN_TXTS: '신청링크',
      BTN_URLS1: `https://www.inflai.com/CampaignList/${adId}`,
      BTN_URLS2: `https://www.inflai.com/CampaignList/${adId}`
    }
    // gzip: true
  };
  return options;
}

function YoutubeRequest(data, cb) {
  async.map(data, (item, callback) => {
    function getOauthClient() {
      const oauth2Client = new google.auth.OAuth2(
        configKey.google_client_id,
        configKey.google_client_secret,
        configKey.google_client_redirect_url
      );
      return oauth2Client;
    }

    const oauth2Client = getOauthClient();
    const youtube = google.youtube('v3');

    const { YOU_TOKEN, YOU_ID } = item;
    oauth2Client.setCredentials({
      refresh_token: YOU_TOKEN
    });

    youtube.channels.list({
      auth: oauth2Client,
      part: 'snippet, statistics',
      mine: true,
      fields: 'items(snippet(title,description), statistics(viewCount, subscriberCount,videoCount))',
      quotaUser: `secretquotastring${YOU_ID}`,
    }, (err, response) => {
      if (err) {
        callback(null, err || response.statusCode);
      }
      const info = response.data.items;
      if (info.length == 0) {
        console.log('No channel found.');
        callback(null, response.data);
      } else {
        callback(null, { ...info[0], YOU_ID });
      }
    });
  }, (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
}

exports.getIdFromToken = getIdFromToken;
exports.createToken = createToken;
exports.instaRequest = instaRequest;
exports.mailSendData = mailSendData;
exports.createMessageOption = createMessageOption;
exports.createMessageOption2 = createMessageOption2;
exports.YoutubeRequest = YoutubeRequest;
