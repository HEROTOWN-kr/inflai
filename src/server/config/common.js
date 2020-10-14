const jwt = require('jsonwebtoken');
const async = require('async');
const fs = require('fs');
const fetch = require('node-fetch');
const vision = require('@google-cloud/vision');
const request = require('request');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const config = require('../config');
const testData = require('../config/testData');
const configKey = require('./config');


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

function YoutubeDataRequest(YOU_TOKEN, YOU_ID, cb) {
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
      cb(err);
    } else {
      const info = response.data.items;
      if (info.length === 0) {
        console.log('No channel found.');
        cb(response.data);
      } else {
        cb({ ...info[0], YOU_ID });
      }
    }
  });
}

function getInstagramData(instagramId, facebookToken) {
  const url = `https://graph.facebook.com/v6.0/${instagramId}?`
      + 'fields='
      + 'followers_count%2C'
      + 'follows_count%2C'
      + 'media_count%2C'
      + 'username%2C'
      + 'website%2C'
      + 'biography%2C'
      + 'profile_picture_url%2C'
      + 'name&'
      + `access_token=${facebookToken}`;

  return new Promise(((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const parsedBody = JSON.parse(body);
        resolve(parsedBody);
      } else {
        const parsedError = JSON.parse(body).error;
        reject(parsedError);
      }
    });
  }));
}

function getInstagramMediaData(instagramId, facebookToken) {
  const iData = `https://graph.facebook.com/v6.0/${instagramId}/media?`
      + 'fields='
      + 'thumbnail_url%2C'
      + 'media_url,like_count,comments_count&'
      + `access_token=${facebookToken}`;
  // + `access_token=${facebookToken}&limit=100`;

  return new Promise(((resolve, reject) => {
    request.get(iData, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const imgArray = JSON.parse(body).data;
        resolve(Object.values(imgArray));
      } else {
        reject(error);
      }
    });
  }));
}

function getInstagramInsights(instagramId, facebookToken) {
  const iData = `https://graph.facebook.com/v6.0/${instagramId}/insights?metric=audience_gender_age%2Caudience_country&period=lifetime&access_token=${facebookToken}`;

  return new Promise(((resolve, reject) => {
    request.get(iData, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const imgArray = JSON.parse(body).data;
        resolve(Object.values(imgArray));
      } else {
        reject(JSON.parse(response.body).error);
      }
    });
  }));
}

async function googleVision(instaData) {
  /* const filePath = isLocal ? {
    keyFileName: 'src/server/config/googleVisionKey.json',
    imagePath: './src/server/img/image'
  } : {
    keyFileName: '/data/inflai/src/server/config/googleVisionKey.json',
    imagePath: '../server/img/image'
  }; */

  const filePath = {
    keyFileName: 'src/server/config/googleVisionKey.json',
    imagePath: './src/server/img/image'
  };


  const client = new vision.ImageAnnotatorClient({
    keyFilename: filePath.keyFileName
  });

  const colors = [
    '#52D726', '#FFEC00', '#FF7300', '#FF0000',
    '#007ED6', '#7CDDDD', '#4D4D4D', '#5DA5DA',
    '#FAA43A', '#60BD68', '#F17CB0', '#B2912F',
    '#B276B2', '#DECF3F', '#81726A', '#270722',
    '#E8C547', '#C2C6A7', '#ECCE8E', '#DC136C',
    '#353A47', '#84B082', '#5C80BC', '#CDD1C4',
    '#7CDDDD'
  ];

  async function detectPic(index) {
    const fileName = `${filePath.imagePath}${index}.jpg`;
    try {
      const [result] = await client.labelDetection(fileName);
      const labels = result.labelAnnotations;
      return new Promise(((resolve, reject) => {
        if (labels && labels[0]) {
          const { score, description } = labels[0];
          resolve({ score, description });
        }
        resolve({});
      }));
    } catch (err) {
      return new Promise(((resolve, reject) => {
        resolve({ err });
      }));
    }
  }

  async function downloadAndDetect(fileUrl, index) {
    const response = await fetch(fileUrl);
    const buffer = await response.buffer();
    const path = `${filePath.imagePath}${index}.jpg`;

    return new Promise((async (resolve, reject) => {
      fs.writeFile(path, buffer, async () => {
        const detectResult = await detectPic(index);
        resolve(detectResult);
      });
    }));
  }

  try {
    const gDatas = await Promise.all(
      instaData.map(async (mediaInfo, index) => {
        const { thumbnail_url, media_url } = mediaInfo;
        const fileUrl = thumbnail_url || media_url;
        const detectData = await downloadAndDetect(fileUrl, index);
        return { ...mediaInfo, ...detectData };
      })
    );

    const statistics = gDatas.reduce((acc, el) => {
      acc[el.description] = {
        count: (acc[el.description] && acc[el.description].count || 0) + 1,
        likeCountSum: (acc[el.description] && acc[el.description].likeCountSum || 0) + el.like_count,
        commentsCountSum: (acc[el.description] && acc[el.description].comments_count || 0) + el.comments_count,
      };
      return acc;
    }, {});

    /* Object.keys(statistics).map((key) => {
      statistics[key].percentage = 100 / (gDatas.length / statistics[key].percentage);
      return null;
    }); */

    const finalArray = Object.keys(statistics).map((key, index) => {
      statistics[key].value = 100 / (gDatas.length / statistics[key].count);
      return { ...statistics[key], description: key, color: colors[index] };
    });

    finalArray.sort((a, b) => b.value - a.value);

    return {
      types: finalArray,
    };
  } catch (err) {
    return {
      types: err,
    };
  }
}

function getFacebookLongToken(facebookToken) {
  const longTokenUrl = 'https://graph.facebook.com/v6.0/oauth/access_token?'
      + 'grant_type=fb_exchange_token&'
      /* + 'client_id=139193384125564&'
      + 'client_secret=085e5020f9b2cdac9357bf7301f31e01&'  //using fbsecret */
      + `client_id=${configKey.fb_client_id}&`
      + `client_secret=${configKey.fb_client_secret}&` // using fbsecret
      + `fb_exchange_token=${facebookToken}`;

  return new Promise(((resolve, reject) => {
    request.get(longTokenUrl, (error, response, body) => {
      if (JSON.parse(body).error) {
        reject(JSON.parse(body).error);
      } else {
        const longToken = (JSON.parse(body)).access_token;
        resolve(longToken);
      }
    });
  }));
}

function getFacebookPages(facebookToken) {
  const pagesUrl = `https://graph.facebook.com/v6.0/me/accounts?access_token=${facebookToken}`;

  return new Promise(((resolve, reject) => {
    request.get(pagesUrl, (error, response, body) => {
      if (JSON.parse(body).error) {
        reject(JSON.parse(body).error);
      } else {
        const facebookPages = (JSON.parse(body)).data;
        resolve(facebookPages);
      }
    });
  }));
}

function checkInstagramBusinessAccount(pageId, facebookToken) {
  const instaAccUrl = `https://graph.facebook.com/v6.0/${pageId}?fields=instagram_business_account&access_token=${facebookToken}`;

  return new Promise(((resolve, reject) => {
    request.get(instaAccUrl, (error, response, body) => {
      if (JSON.parse(body).error) {
        reject(JSON.parse(body).error);
      } else {
        const { instagram_business_account } = JSON.parse(body);
        resolve(instagram_business_account);
      }
    });
  }));
}

function getInstagramBusinessAccounts(facebookToken) {
  const instaAccUrl = `https://graph.facebook.com/v8.0/me?fields=accounts%7Binstagram_business_account%7Bid%2Cusername%2Cprofile_picture_url%7D%7D&access_token=${facebookToken}`;

  return new Promise(((resolve, reject) => {
    request.get(instaAccUrl, (error, response, body) => {
      if (JSON.parse(body).error) {
        reject(JSON.parse(body).error);
      } else {
        const accounts = JSON.parse(body).accounts.data;
        const instaAccounts = accounts.reduce((acc, item) => {
          if (item.instagram_business_account) acc.push(item.instagram_business_account);
          return acc;
        }, []);

        resolve(instaAccounts);
      }
    });
  }));
}

function average(data) {
  const sum = data.reduce((sum, value) => sum + value, 0);

  const avg = sum / data.length;
  return avg;
}

function standardDeviation(values) {
  const avg = average(values);

  const squareDiffs = values.map((value) => {
    const diff = value - avg;
    const sqrDiff = diff * diff;
    return sqrDiff;
  });

  const avgSquareDiff = average(squareDiffs);

  const stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}


const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

exports.getIdFromToken = getIdFromToken;
exports.createToken = createToken;
exports.instaRequest = instaRequest;
exports.mailSendData = mailSendData;
exports.createMessageOption = createMessageOption;
exports.createMessageOption2 = createMessageOption2;
exports.YoutubeRequest = YoutubeRequest;
exports.YoutubeDataRequest = YoutubeDataRequest;
exports.getInstagramData = getInstagramData;
exports.getInstagramMediaData = getInstagramMediaData;
exports.getInstagramInsights = getInstagramInsights;
exports.googleVision = googleVision;
exports.getFacebookLongToken = getFacebookLongToken;
exports.getFacebookPages = getFacebookPages;
exports.checkInstagramBusinessAccount = checkInstagramBusinessAccount;
exports.getInstagramBusinessAccounts = getInstagramBusinessAccounts;
exports.average = average;
exports.standardDeviation = standardDeviation;
exports.asyncMiddleware = asyncMiddleware;
