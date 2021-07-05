const jwt = require('jsonwebtoken');
const async = require('async');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const vision = require('@google-cloud/vision');
const request = require('request');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const crypto = require('crypto');
const config = require('../config');
const testData = require('../config/testData');
const configKey = require('./config');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET
});


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

function hashData(string) {
  const saltRounds = 10;

  return new Promise(((resolve, reject) => {
    bcrypt.hash(string, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  }));
}

function mailSendData({ receiver, content, subject }) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.naver.com',
    port: 465,
    secure: true, // use SSL
    // secure: false, // use SSL
    auth: {
      user: 'inflai@naver.com',
      pass: 'N_emc2021'
    }
  });

  const mailOptions = {
    to: receiver,
    from: {
      name: '인플라이｜inflAi',
      address: 'inflai@naver.com'
    },
    subject,
    // text: '인플라이 가입해주셔서 환영합니다! 다음 링크로 이동하시면 회원가입이 완료될겁니다.',
    text: content,
  };

  return new Promise(((resolve, reject) => {
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve('success');
      }
    });
  }));
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

function createMessageOption(props) {
  const {
    phoneNumber,
    productName,
    campanyName,
    bonus,
    createdAt,
    collectFinishDate,
    adId
  } = props;

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
      BTN_URLS1: `https://influencer.inflai.com/CampaignList/${adId}`,
      BTN_URLS2: `https://influencer.inflai.com/CampaignList/${adId}`
    }
  };

  return new Promise(((resolve, reject) => {
    request(options, (error, requestResponse, responseBody) => {
      if (!error && requestResponse.statusCode == 200) {
        resolve(responseBody);
      } else if (requestResponse != null) {
        reject(error);
      }
    });
  }));
}

function createMessageOption2(props) {
  const {
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
  } = props;
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

function createMessageOption3(props) {
  const {
    phoneNumber,
    campanyName,
    influencerName,
    adId
  } = props;
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
      MSG: '안녕하세요. 인플라이입니다.\n\n'
          + `${influencerName}님!\n`
          + '인플라이에 신청하신 캠페인에 선정되셨습니다!\n'
          + `${campanyName}선정내역 확인하세요!\n\n`
          + '**해당 메시지는 고객님께서 캠페인 공고 수신에 동의 해 주셔서 발송되었습니다.\n',
      TEMPLATE_CODE: 'KM3',
      FAILED_TYPE: 'N',
      BTN_TYPES: '웹링크',
      BTN_TXTS: '캠페인링크',
      BTN_URLS1: `https://influencer.inflai.com/Campaign/detail/${adId}`,
      BTN_URLS2: `https://influencer.inflai.com/Campaign/detail/${adId}`
    }
    // gzip: true
  };
  return new Promise(((resolve, reject) => {
    request(options, (error, requestResponse, responseBody) => {
      if (!error && requestResponse.statusCode == 200) {
        resolve(responseBody);
      } else if (requestResponse != null) {
        reject(error);
      }
    });
  }));
}

function getGoogleData(code, redirectUrl) {
  function getOauthClient() {
    const oauth2Client = new google.auth.OAuth2(
      configKey.google_client_id,
      configKey.google_client_secret,
      redirectUrl
    );
    return oauth2Client;
  }
  const oauth2Client = getOauthClient();

  return new Promise(((resolve, reject) => {
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) { reject(err); }
      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2('v2');
      oauth2.userinfo.get({ auth: oauth2Client, alt: 'json' }, (err2, response) => {
        if (err2) { reject(err2); }
        const {
          name, email, id, picture
        } = response.data;
        const { refresh_token } = tokens;
        resolve({
          name, email, id, refresh_token, picture
        });
      });
    });
  }));
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

function YoutubeDataRequest(YOU_TOKEN, YOU_ID) {
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

  return new Promise(((resolve, reject) => {
    youtube.channels.list({
      auth: oauth2Client,
      part: 'snippet, statistics, id',
      mine: true,
      fields: 'items(id, snippet(title,description), statistics(viewCount, subscriberCount,videoCount))',
      quotaUser: `secretquotastring${YOU_ID}`,
    }, (err, response) => {
      if (err) {
        resolve({
          error: err,
          YOU_ID
        });
      } else {
        const info = response.data.items;
        if (info.length === 0) {
          reject(new Error('No channel found.'));
        } else {
          resolve({ ...info[0], YOU_ID });
        }
      }
    });
  }));
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

function getInstagramMediaData(instagramId, facebookToken, limit, since, until) {
  const iData = `https://graph.facebook.com/v6.0/${instagramId}/media?`
      + 'fields='
      + 'thumbnail_url%2C'
      + 'media_url,like_count,comments_count&'
      + `access_token=${facebookToken}${limit ? `&limit=${limit}` : ''}`
      + `${since ? `&since=${since}` : ''}${until ? `&until=${until}` : ''}`;
  // + `access_token=${facebookToken}&limit=100`;

  return new Promise(((resolve, reject) => {
    request.get(iData, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const imgArray = JSON.parse(body).data;
        resolve(Object.values(imgArray));
      } else {
        const messageError = JSON.parse(response.body).error;
        reject(messageError);
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

function getInstaOnlineFlwrs(instagramId, facebookToken, since, until) {
  const iData = `https://graph.facebook.com/v6.0/${instagramId}/insights?pretty=0&since=${since}&until=${until}&metric=online_followers&period=lifetime&access_token=${facebookToken}`;

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

function getInstaImpressions(instagramId, facebookToken, since, until) {
  const iData = `https://graph.facebook.com/v6.0/${instagramId}/insights?pretty=0&since=${since}&until=${until}&metric=impressions&period=day&access_token=${facebookToken}`;

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

function getNewFollowers(instagramId, facebookToken, since, until) {
  const iData = `https://graph.facebook.com/v6.0/${instagramId}/insights?pretty=0&since=${since}&until=${until}&metric=follower_count&period=day&access_token=${facebookToken}`;

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

function getFacebookInfo(facebookToken) {
  const myInfoUrl = 'https://graph.facebook.com/v6.0/me?fields=picture.width(400).height(400)%7Burl%7D%2Cemail%2Cname%2Cid&'
      + `access_token=${facebookToken}`;

  return new Promise(((resolve, reject) => {
    request.get(myInfoUrl, (error, response, body) => {
      if (JSON.parse(body).error) {
        reject(JSON.parse(body).error);
      } else {
        const userData = JSON.parse(response.body);
        resolve(userData);
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

function resizeImage(currentPath, newPathName, width, height) {
  return new Promise(((resolve, reject) => {
    sharp(currentPath)
      .resize(width, height)
      // .toBuffer({ resolveWithObject: true })
      .toFile(newPathName)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  }));
}

function checkLocalHost(hostname) {
  const result = hostname.indexOf('localhost');
  return result !== -1;
}

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

function encrypt(text) {
  const ENCRYPTION_KEY = 'SgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6'; // Must be 256 bits (32 characters)
  const IV_LENGTH = 16; // For AES, this is always 16

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(text) {
  const ENCRYPTION_KEY = 'SgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6';// Must be 256 bits (32 characters)
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

function readFile(currentPath) {
  return new Promise(((resolve, reject) => {
    fs.readFile(currentPath, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  }));
}

function s3Upload(name, type, data) {
  const params = {
    ACL: 'public-read',
    Bucket: 'inflai-aws-bucket', // pass your bucket name
    Key: name, // file will be saved as testBucket/contacts.csv
    ContentType: type,
    // Body: JSON.stringify(data, null, 2)
    Body: data
  };

  return new Promise(((resolve, reject) => {
    s3.upload(params, (s3Err, s3Data) => {
      if (s3Err) reject(s3Err);
      resolve(s3Data);
    });
  }));
}

function s3DeleteObject(name) {
  const params = {
    Bucket: 'inflai-aws-bucket', // pass your bucket name
    Key: name, // file will be saved as testBucket/contacts.csv
  };

  return new Promise(((resolve, reject) => {
    s3.deleteObject(params, (s3Err, s3Data) => {
      if (s3Err) reject(s3Err);
      resolve(s3Data);
    });
  }));
}

function localeCodeToEnglish(loc) {
  if (typeof loc !== 'string') throw new TypeError('Input must be string');
  const parts = loc.split('-');
  const ISO639_1 = {
    ab: 'Abkhazian', aa: 'Afar', af: 'Afrikaans', ak: 'Akan', sq: 'Albanian', am: 'Amharic', ar: 'Arabic', an: 'Aragonese', hy: 'Armenian', as: 'Assamese', av: 'Avaric', ae: 'Avestan', ay: 'Aymara', az: 'Azerbaijani', bm: 'Bambara', ba: 'Bashkir', eu: 'Basque', be: 'Belarusian', bn: 'Bengali', bh: 'Bihari languages', bi: 'Bislama', nb: 'Norwegian Bokmål', bs: 'Bosnian', br: 'Breton', bg: 'Bulgarian', my: 'Burmese', es: 'Spanish', ca: 'Valencian', km: 'Central Khmer', ch: 'Chamorro', ce: 'Chechen', ny: 'Nyanja', zh: 'Chinese', za: 'Zhuang', cu: 'Old Slavonic', cv: 'Chuvash', kw: 'Cornish', co: 'Corsican', cr: 'Cree', hr: 'Croatian', cs: 'Czech', da: 'Danish', dv: 'Maldivian', nl: 'Flemish', dz: 'Dzongkha', en: 'English', eo: 'Esperanto', et: 'Estonian', ee: 'Ewe', fo: 'Faroese', fj: 'Fijian', fi: 'Finnish', fr: 'French', ff: 'Fulah', gd: 'Scottish Gaelic', gl: 'Galician', lg: 'Ganda', ka: 'Georgian', de: 'German', ki: 'Kikuyu', el: 'Greek, Modern (1453-)', kl: 'Kalaallisut', gn: 'Guarani', gu: 'Gujarati', ht: 'Haitian Creole', ha: 'Hausa', he: 'Hebrew', hz: 'Herero', hi: 'Hindi', ho: 'Hiri Motu', hu: 'Hungarian', is: 'Icelandic', io: 'Ido', ig: 'Igbo', id: 'Indonesian', ia: 'Interlingua (International Auxiliary Language Association)', ie: 'Occidental', iu: 'Inuktitut', ik: 'Inupiaq', ga: 'Irish', it: 'Italian', ja: 'Japanese', jv: 'Javanese', kn: 'Kannada', kr: 'Kanuri', ks: 'Kashmiri', kk: 'Kazakh', rw: 'Kinyarwanda', ky: 'Kyrgyz', kv: 'Komi', kg: 'Kongo', ko: 'Korean', kj: 'Kwanyama', ku: 'Kurdish', lo: 'Lao', la: 'Latin', lv: 'Latvian', lb: 'Luxembourgish', li: 'Limburgish', ln: 'Lingala', lt: 'Lithuanian', lu: 'Luba-Katanga', mk: 'Macedonian', mg: 'Malagasy', ms: 'Malay', ml: 'Malayalam', mt: 'Maltese', gv: 'Manx', mi: 'Maori', mr: 'Marathi', mh: 'Marshallese', ro: 'Romanian', mn: 'Mongolian', na: 'Nauru', nv: 'Navajo', nd: 'North Ndebele', nr: 'South Ndebele', ng: 'Ndonga', ne: 'Nepali', se: 'Northern Sami', no: 'Norwegian', nn: 'Nynorsk, Norwegian', ii: 'Sichuan Yi', oc: 'Occitan (post 1500)', oj: 'Ojibwa', or: 'Oriya', om: 'Oromo', os: 'Ossetic', pi: 'Pali', pa: 'Punjabi', ps: 'Pushto', fa: 'Persian', pl: 'Polish', pt: 'Portuguese', qu: 'Quechua', rm: 'Romansh', rn: 'Rundi', ru: 'Russian', sm: 'Samoan', sg: 'Sango', sa: 'Sanskrit', sc: 'Sardinian', sr: 'Serbian', sn: 'Shona', sd: 'Sindhi', si: 'Sinhalese', sk: 'Slovak', sl: 'Slovenian', so: 'Somali', st: 'Sotho, Southern', su: 'Sundanese', sw: 'Swahili', ss: 'Swati', sv: 'Swedish', tl: 'Tagalog', ty: 'Tahitian', tg: 'Tajik', ta: 'Tamil', tt: 'Tatar', te: 'Telugu', th: 'Thai', bo: 'Tibetan', ti: 'Tigrinya', to: 'Tonga (Tonga Islands)', ts: 'Tsonga', tn: 'Tswana', tr: 'Turkish', tk: 'Turkmen', tw: 'Twi', ug: 'Uyghur', uk: 'Ukrainian', ur: 'Urdu', uz: 'Uzbek', ve: 'Venda', vi: 'Vietnamese', vo: 'Volapük', wa: 'Walloon', cy: 'Welsh', fy: 'Western Frisian', wo: 'Wolof', xh: 'Xhosa', yi: 'Yiddish', yo: 'Yoruba', zu: 'Zulu'
  };
  const ISO639_2 = {
    abk: 'Abkhazian', ace: 'Achinese', ach: 'Acoli', ada: 'Adangme', ady: 'Adyghe', aar: 'Afar', afh: 'Afrihili', afr: 'Afrikaans', afa: 'Afro-Asiatic languages', ain: 'Ainu', aka: 'Akan', akk: 'Akkadian', alb: 'Albanian', sqi: 'Albanian', gsw: 'Swiss German', ale: 'Aleut', alg: 'Algonquian languages', tut: 'Altaic languages', amh: 'Amharic', anp: 'Angika', apa: 'Apache languages', ara: 'Arabic', arg: 'Aragonese', arp: 'Arapaho', arw: 'Arawak', arm: 'Armenian', hye: 'Armenian', rup: 'Macedo-Romanian', art: 'Artificial languages', asm: 'Assamese', ast: 'Leonese', ath: 'Athapascan languages', aus: 'Australian languages', map: 'Austronesian languages', ava: 'Avaric', ave: 'Avestan', awa: 'Awadhi', aym: 'Aymara', aze: 'Azerbaijani', ban: 'Balinese', bat: 'Baltic languages', bal: 'Baluchi', bam: 'Bambara', bai: 'Bamileke languages', bad: 'Banda languages', bnt: 'Bantu languages', bas: 'Basa', bak: 'Bashkir', baq: 'Basque', eus: 'Basque', btk: 'Batak languages', bej: 'Beja', bel: 'Belarusian', bem: 'Bemba', ben: 'Bengali', ber: 'Berber languages', bho: 'Bhojpuri', bih: 'Bihari languages', bik: 'Bikol', byn: 'Blin', bin: 'Edo', bis: 'Bislama', zbl: 'Blissymbols', nob: 'Norwegian Bokmål', bos: 'Bosnian', bra: 'Braj', bre: 'Breton', bug: 'Buginese', bul: 'Bulgarian', bua: 'Buriat', bur: 'Burmese', mya: 'Burmese', cad: 'Caddo', spa: 'Spanish', cat: 'Valencian', cau: 'Caucasian languages', ceb: 'Cebuano', cel: 'Celtic languages', cai: 'Central American Indian languages', khm: 'Central Khmer', chg: 'Chagatai', cmc: 'Chamic languages', cha: 'Chamorro', che: 'Chechen', chr: 'Cherokee', nya: 'Nyanja', chy: 'Cheyenne', chb: 'Chibcha', chi: 'Chinese', zho: 'Chinese', chn: 'Chinook jargon', chp: 'Dene Suline', cho: 'Choctaw', zha: 'Zhuang', chu: 'Old Slavonic', chk: 'Chuukese', chv: 'Chuvash', nwc: 'Old Newari', syc: 'Classical Syriac', rar: 'Rarotongan', cop: 'Coptic', cor: 'Cornish', cos: 'Corsican', cre: 'Cree', mus: 'Creek', crp: 'Creoles and pidgins', cpe: 'Creoles and pidgins, English based', cpf: 'Creoles and pidgins, French-based', cpp: 'Creoles and pidgins, Portuguese-based', crh: 'Crimean Turkish', hrv: 'Croatian', cus: 'Cushitic languages', cze: 'Czech', ces: 'Czech', dak: 'Dakota', dan: 'Danish', dar: 'Dargwa', del: 'Delaware', div: 'Maldivian', zza: 'Zazaki', din: 'Dinka', doi: 'Dogri', dgr: 'Dogrib', dra: 'Dravidian languages', dua: 'Duala', dut: 'Flemish', nld: 'Flemish', dum: 'Dutch, Middle (ca.1050-1350)', dyu: 'Dyula', dzo: 'Dzongkha', frs: 'Eastern Frisian', efi: 'Efik', egy: 'Egyptian (Ancient)', eka: 'Ekajuk', elx: 'Elamite', eng: 'English', enm: 'English, Middle (1100-1500)', ang: 'English, Old (ca.450-1100)', myv: 'Erzya', epo: 'Esperanto', est: 'Estonian', ewe: 'Ewe', ewo: 'Ewondo', fan: 'Fang', fat: 'Fanti', fao: 'Faroese', fij: 'Fijian', fil: 'Pilipino', fin: 'Finnish', fiu: 'Finno-Ugrian languages', fon: 'Fon', fre: 'French', fra: 'French', frm: 'French, Middle (ca.1400-1600)', fro: 'French, Old (842-ca.1400)', fur: 'Friulian', ful: 'Fulah', gaa: 'Ga', gla: 'Scottish Gaelic', car: 'Galibi Carib', glg: 'Galician', lug: 'Ganda', gay: 'Gayo', gba: 'Gbaya', gez: 'Geez', geo: 'Georgian', kat: 'Georgian', ger: 'German', deu: 'German', nds: 'Saxon, Low', gmh: 'German, Middle High (ca.1050-1500)', goh: 'German, Old High (ca.750-1050)', gem: 'Germanic languages', kik: 'Kikuyu', gil: 'Gilbertese', gon: 'Gondi', gor: 'Gorontalo', got: 'Gothic', grb: 'Grebo', grc: 'Greek, Ancient (to 1453)', gre: 'Greek, Modern (1453-)', ell: 'Greek, Modern (1453-)', kal: 'Kalaallisut', grn: 'Guarani', guj: 'Gujarati', gwi: "Gwich'in", hai: 'Haida', hat: 'Haitian Creole', hau: 'Hausa', haw: 'Hawaiian', heb: 'Hebrew', her: 'Herero', hil: 'Hiligaynon', him: 'Western Pahari languages', hin: 'Hindi', hmo: 'Hiri Motu', hit: 'Hittite', hmn: 'Mong', hun: 'Hungarian', hup: 'Hupa', iba: 'Iban', ice: 'Icelandic', isl: 'Icelandic', ido: 'Ido', ibo: 'Igbo', ijo: 'Ijo languages', ilo: 'Iloko', arc: 'Official Aramaic (700-300 BCE)', smn: 'Inari Sami', inc: 'Indic languages', ine: 'Indo-European languages', ind: 'Indonesian', inh: 'Ingush', ina: 'Interlingua (International Auxiliary Language Association)', ile: 'Occidental', iku: 'Inuktitut', ipk: 'Inupiaq', ira: 'Iranian languages', gle: 'Irish', mga: 'Irish, Middle (900-1200)', sga: 'Irish, Old (to 900)', iro: 'Iroquoian languages', ita: 'Italian', jpn: 'Japanese', jav: 'Javanese', kac: 'Kachin', jrb: 'Judeo-Arabic', jpr: 'Judeo-Persian', kbd: 'Kabardian', kab: 'Kabyle', xal: 'Oirat', kam: 'Kamba', kan: 'Kannada', kau: 'Kanuri', pam: 'Pampanga', kaa: 'Kara-Kalpak', krc: 'Karachay-Balkar', krl: 'Karelian', kar: 'Karen languages', kas: 'Kashmiri', csb: 'Kashubian', kaw: 'Kawi', kaz: 'Kazakh', kha: 'Khasi', khi: 'Khoisan languages', kho: 'Sakan', kmb: 'Kimbundu', kin: 'Kinyarwanda', kir: 'Kyrgyz', tlh: 'tlhIngan-Hol', kom: 'Komi', kon: 'Kongo', kok: 'Konkani', kor: 'Korean', kos: 'Kosraean', kpe: 'Kpelle', kro: 'Kru languages', kua: 'Kwanyama', kum: 'Kumyk', kur: 'Kurdish', kru: 'Kurukh', kut: 'Kutenai', lad: 'Ladino', lah: 'Lahnda', lam: 'Lamba', day: 'Land Dayak languages', lao: 'Lao', lat: 'Latin', lav: 'Latvian', ltz: 'Luxembourgish', lez: 'Lezghian', lim: 'Limburgish', lin: 'Lingala', lit: 'Lithuanian', jbo: 'Lojban', dsb: 'Lower Sorbian', loz: 'Lozi', lub: 'Luba-Katanga', lua: 'Luba-Lulua', lui: 'Luiseno', smj: 'Lule Sami', lun: 'Lunda', luo: 'Luo (Kenya and Tanzania)', lus: 'Lushai', mac: 'Macedonian', mkd: 'Macedonian', mad: 'Madurese', mag: 'Magahi', mai: 'Maithili', mak: 'Makasar', mlg: 'Malagasy', may: 'Malay', msa: 'Malay', mal: 'Malayalam', mlt: 'Maltese', mnc: 'Manchu', mdr: 'Mandar', man: 'Mandingo', mni: 'Manipuri', mno: 'Manobo languages', glv: 'Manx', mao: 'Maori', mri: 'Maori', arn: 'Mapudungun', mar: 'Marathi', chm: 'Mari', mah: 'Marshallese', mwr: 'Marwari', mas: 'Masai', myn: 'Mayan languages', men: 'Mende', mic: 'Micmac', min: 'Minangkabau', mwl: 'Mirandese', moh: 'Mohawk', mdf: 'Moksha', rum: 'Romanian', ron: 'Romanian', mkh: 'Mon-Khmer languages', lol: 'Mongo', mon: 'Mongolian', mos: 'Mossi', mul: 'Multiple languages', mun: 'Munda languages', nqo: "N'Ko", nah: 'Nahuatl languages', nau: 'Nauru', nav: 'Navajo', nde: 'North Ndebele', nbl: 'South Ndebele', ndo: 'Ndonga', nap: 'Neapolitan', new: 'Newari', nep: 'Nepali', nia: 'Nias', nic: 'Niger-Kordofanian languages', ssa: 'Nilo-Saharan languages', niu: 'Niuean', zxx: 'Not applicable', nog: 'Nogai', non: 'Norse, Old', nai: 'North American Indian languages', frr: 'Northern Frisian', sme: 'Northern Sami', nso: 'Sotho, Northern', nor: 'Norwegian', nno: 'Nynorsk, Norwegian', nub: 'Nubian languages', iii: 'Sichuan Yi', nym: 'Nyamwezi', nyn: 'Nyankole', nyo: 'Nyoro', nzi: 'Nzima', oci: 'Occitan (post 1500)', pro: 'Provençal, Old (to 1500)', oji: 'Ojibwa', ori: 'Oriya', orm: 'Oromo', osa: 'Osage', oss: 'Ossetic', oto: 'Otomian languages', pal: 'Pahlavi', pau: 'Palauan', pli: 'Pali', pag: 'Pangasinan', pan: 'Punjabi', pap: 'Papiamento', paa: 'Papuan languages', pus: 'Pushto', per: 'Persian', fas: 'Persian', peo: 'Persian, Old (ca.600-400 B.C.)', phi: 'Philippine languages', phn: 'Phoenician', pon: 'Pohnpeian', pol: 'Polish', por: 'Portuguese', pra: 'Prakrit languages', que: 'Quechua', raj: 'Rajasthani', rap: 'Rapanui', 'qaa-qtz': 'Reserved for local use', roa: 'Romance languages', roh: 'Romansh', rom: 'Romany', run: 'Rundi', rus: 'Russian', sal: 'Salishan languages', sam: 'Samaritan Aramaic', smi: 'Sami languages', smo: 'Samoan', sad: 'Sandawe', sag: 'Sango', san: 'Sanskrit', sat: 'Santali', srd: 'Sardinian', sas: 'Sasak', sco: 'Scots', sel: 'Selkup', sem: 'Semitic languages', srp: 'Serbian', srr: 'Serer', shn: 'Shan', sna: 'Shona', scn: 'Sicilian', sid: 'Sidamo', sgn: 'Sign Languages', bla: 'Siksika', snd: 'Sindhi', sin: 'Sinhalese', sit: 'Sino-Tibetan languages', sio: 'Siouan languages', sms: 'Skolt Sami', den: 'Slave (Athapascan)', sla: 'Slavic languages', slo: 'Slovak', slk: 'Slovak', slv: 'Slovenian', sog: 'Sogdian', som: 'Somali', son: 'Songhai languages', snk: 'Soninke', wen: 'Sorbian languages', sot: 'Sotho, Southern', sai: 'South American Indian languages', alt: 'Southern Altai', sma: 'Southern Sami', srn: 'Sranan Tongo', suk: 'Sukuma', sux: 'Sumerian', sun: 'Sundanese', sus: 'Susu', swa: 'Swahili', ssw: 'Swati', swe: 'Swedish', syr: 'Syriac', tgl: 'Tagalog', tah: 'Tahitian', tai: 'Tai languages', tgk: 'Tajik', tmh: 'Tamashek', tam: 'Tamil', tat: 'Tatar', tel: 'Telugu', ter: 'Tereno', tet: 'Tetum', tha: 'Thai', tib: 'Tibetan', bod: 'Tibetan', tig: 'Tigre', tir: 'Tigrinya', tem: 'Timne', tiv: 'Tiv', tli: 'Tlingit', tpi: 'Tok Pisin', tkl: 'Tokelau', tog: 'Tonga (Nyasa)', ton: 'Tonga (Tonga Islands)', tsi: 'Tsimshian', tso: 'Tsonga', tsn: 'Tswana', tum: 'Tumbuka', tup: 'Tupi languages', tur: 'Turkish', ota: 'Turkish, Ottoman (1500-1928)', tuk: 'Turkmen', tvl: 'Tuvalu', tyv: 'Tuvinian', twi: 'Twi', udm: 'Udmurt', uga: 'Ugaritic', uig: 'Uyghur', ukr: 'Ukrainian', umb: 'Umbundu', mis: 'Uncoded languages', und: 'Undetermined', hsb: 'Upper Sorbian', urd: 'Urdu', uzb: 'Uzbek', vai: 'Vai', ven: 'Venda', vie: 'Vietnamese', vol: 'Volapük', vot: 'Votic', wak: 'Wakashan languages', wln: 'Walloon', war: 'Waray', was: 'Washo', wel: 'Welsh', cym: 'Welsh', fry: 'Western Frisian', wal: 'Wolaytta', wol: 'Wolof', xho: 'Xhosa', sah: 'Yakut', yao: 'Yao', yap: 'Yapese', yid: 'Yiddish', yor: 'Yoruba', ypk: 'Yupik languages', znd: 'Zande languages', zap: 'Zapotec', zen: 'Zenaga', zul: 'Zulu', zun: 'Zuni'
  };
  const ISO3166_1 = {
    AF: 'AFGHANISTAN', AX: 'ÅLAND ISLANDS', AL: 'ALBANIA', DZ: 'ALGERIA', AS: 'AMERICAN SAMOA', AD: 'ANDORRA', AO: 'ANGOLA', AI: 'ANGUILLA', AQ: 'ANTARCTICA', AG: 'ANTIGUA AND BARBUDA', AR: 'ARGENTINA', AM: 'ARMENIA', AW: 'ARUBA', AU: 'AUSTRALIA', AT: 'AUSTRIA', AZ: 'AZERBAIJAN', BS: 'BAHAMAS', BH: 'BAHRAIN', BD: 'BANGLADESH', BB: 'BARBADOS', BY: 'BELARUS', BE: 'BELGIUM', BZ: 'BELIZE', BJ: 'BENIN', BM: 'BERMUDA', BT: 'BHUTAN', BO: 'BOLIVIA, PLURINATIONAL STATE OF', BQ: 'BONAIRE, SINT EUSTATIUS AND SABA', BA: 'BOSNIA AND HERZEGOVINA', BW: 'BOTSWANA', BV: 'BOUVET ISLAND', BR: 'BRAZIL', IO: 'BRITISH INDIAN OCEAN TERRITORY', BN: 'BRUNEI DARUSSALAM', BG: 'BULGARIA', BF: 'BURKINA FASO', BI: 'BURUNDI', KH: 'CAMBODIA', CM: 'CAMEROON', CA: 'CANADA', CV: 'CAPE VERDE', KY: 'CAYMAN ISLANDS', CF: 'CENTRAL AFRICAN REPUBLIC', TD: 'CHAD', CL: 'CHILE', CN: 'CHINA', CX: 'CHRISTMAS ISLAND', CC: 'COCOS (KEELING) ISLANDS', CO: 'COLOMBIA', KM: 'COMOROS', CG: 'CONGO', CD: 'CONGO, THE DEMOCRATIC REPUBLIC OF THE', CK: 'COOK ISLANDS', CR: 'COSTA RICA', CI: "CÔTE D'IVOIRE", HR: 'CROATIA', CU: 'CUBA', CW: 'CURAÇAO', CY: 'CYPRUS', CZ: 'CZECH REPUBLIC', DK: 'DENMARK', DJ: 'DJIBOUTI', DM: 'DOMINICA', DO: 'DOMINICAN REPUBLIC', EC: 'ECUADOR', EG: 'EGYPT', SV: 'EL SALVADOR', GQ: 'EQUATORIAL GUINEA', ER: 'ERITREA', EE: 'ESTONIA', ET: 'ETHIOPIA', FK: 'FALKLAND ISLANDS (MALVINAS)', FO: 'FAROE ISLANDS', FJ: 'FIJI', FI: 'FINLAND', FR: 'FRANCE', GF: 'FRENCH GUIANA', PF: 'FRENCH POLYNESIA', TF: 'FRENCH SOUTHERN TERRITORIES', GA: 'GABON', GM: 'GAMBIA', GE: 'GEORGIA', DE: 'GERMANY', GH: 'GHANA', GI: 'GIBRALTAR', GR: 'GREECE', GL: 'GREENLAND', GD: 'GRENADA', GP: 'GUADELOUPE', GU: 'GUAM', GT: 'GUATEMALA', GG: 'GUERNSEY', GN: 'GUINEA', GW: 'GUINEA-BISSAU', GY: 'GUYANA', HT: 'HAITI', HM: 'HEARD ISLAND AND MCDONALD ISLANDS', VA: 'HOLY SEE (VATICAN CITY STATE)', HN: 'HONDURAS', HK: 'HONG KONG', HU: 'HUNGARY', IS: 'ICELAND', IN: 'INDIA', ID: 'INDONESIA', IR: 'IRAN, ISLAMIC REPUBLIC OF', IQ: 'IRAQ', IE: 'IRELAND', IM: 'ISLE OF MAN', IL: 'ISRAEL', IT: 'ITALY', JM: 'JAMAICA', JP: 'JAPAN', JE: 'JERSEY', JO: 'JORDAN', KZ: 'KAZAKHSTAN', KE: 'KENYA', KI: 'KIRIBATI', KP: "KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF", KR: 'KOREA, REPUBLIC OF', KW: 'KUWAIT', KG: 'KYRGYZSTAN', LA: "LAO PEOPLE'S DEMOCRATIC REPUBLIC", LV: 'LATVIA', LB: 'LEBANON', LS: 'LESOTHO', LR: 'LIBERIA', LY: 'LIBYA', LI: 'LIECHTENSTEIN', LT: 'LITHUANIA', LU: 'LUXEMBOURG', MO: 'MACAO', MK: 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF', MG: 'MADAGASCAR', MW: 'MALAWI', MY: 'MALAYSIA', MV: 'MALDIVES', ML: 'MALI', MT: 'MALTA', MH: 'MARSHALL ISLANDS', MQ: 'MARTINIQUE', MR: 'MAURITANIA', MU: 'MAURITIUS', YT: 'MAYOTTE', MX: 'MEXICO', FM: 'MICRONESIA, FEDERATED STATES OF', MD: 'MOLDOVA, REPUBLIC OF', MC: 'MONACO', MN: 'MONGOLIA', ME: 'MONTENEGRO', MS: 'MONTSERRAT', MA: 'MOROCCO', MZ: 'MOZAMBIQUE', MM: 'MYANMAR', NA: 'NAMIBIA', NR: 'NAURU', NP: 'NEPAL', NL: 'NETHERLANDS', NC: 'NEW CALEDONIA', NZ: 'NEW ZEALAND', NI: 'NICARAGUA', NE: 'NIGER', NG: 'NIGERIA', NU: 'NIUE', NF: 'NORFOLK ISLAND', MP: 'NORTHERN MARIANA ISLANDS', NO: 'NORWAY', OM: 'OMAN', PK: 'PAKISTAN', PW: 'PALAU', PS: 'PALESTINIAN TERRITORY, OCCUPIED', PA: 'PANAMA', PG: 'PAPUA NEW GUINEA', PY: 'PARAGUAY', PE: 'PERU', PH: 'PHILIPPINES', PN: 'PITCAIRN', PL: 'POLAND', PT: 'PORTUGAL', PR: 'PUERTO RICO', QA: 'QATAR', RE: 'RÉUNION', RO: 'ROMANIA', RU: 'RUSSIAN FEDERATION', RW: 'RWANDA', BL: 'SAINT BARTHÉLEMY', SH: 'SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA', KN: 'SAINT KITTS AND NEVIS', LC: 'SAINT LUCIA', MF: 'SAINT MARTIN (FRENCH PART)', PM: 'SAINT PIERRE AND MIQUELON', VC: 'SAINT VINCENT AND THE GRENADINES', WS: 'SAMOA', SM: 'SAN MARINO', ST: 'SAO TOME AND PRINCIPE', SA: 'SAUDI ARABIA', SN: 'SENEGAL', RS: 'SERBIA', SC: 'SEYCHELLES', SL: 'SIERRA LEONE', SG: 'SINGAPORE', SX: 'SINT MAARTEN (DUTCH PART)', SK: 'SLOVAKIA', SI: 'SLOVENIA', SB: 'SOLOMON ISLANDS', SO: 'SOMALIA', ZA: 'SOUTH AFRICA', GS: 'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS', SS: 'SOUTH SUDAN', ES: 'SPAIN', LK: 'SRI LANKA', SD: 'SUDAN', SR: 'SURINAME', SJ: 'SVALBARD AND JAN MAYEN', SZ: 'SWAZILAND', SE: 'SWEDEN', CH: 'SWITZERLAND', SY: 'SYRIAN ARAB REPUBLIC', TW: 'TAIWAN, PROVINCE OF CHINA', TJ: 'TAJIKISTAN', TZ: 'TANZANIA, UNITED REPUBLIC OF', TH: 'THAILAND', TL: 'TIMOR-LESTE', TG: 'TOGO', TK: 'TOKELAU', TO: 'TONGA', TT: 'TRINIDAD AND TOBAGO', TN: 'TUNISIA', TR: 'TURKEY', TM: 'TURKMENISTAN', TC: 'TURKS AND CAICOS ISLANDS', TV: 'TUVALU', UG: 'UGANDA', UA: 'UKRAINE', AE: 'UNITED ARAB EMIRATES', GB: 'UNITED KINGDOM', US: 'UNITED STATES', UM: 'UNITED STATES MINOR OUTLYING ISLANDS', UY: 'URUGUAY', UZ: 'UZBEKISTAN', VU: 'VANUATU', VE: 'VENEZUELA, BOLIVARIAN REPUBLIC OF', VN: 'VIET NAM', VG: 'VIRGIN ISLANDS, BRITISH', VI: 'VIRGIN ISLANDS, U.S.', WF: 'WALLIS AND FUTUNA', EH: 'WESTERN SAHARA', YE: 'YEMEN', ZM: 'ZAMBIA', ZW: 'ZIMBABWE'
  };
  if (parts.length > 2) throw new SyntaxError(`Unexpected number of segments ${parts.length}`);
  if (parts.length > 1) return `${ISO639_1[parts[0]] || ISO639_2[parts[0]] || parts[0]}, ${ISO3166_1[parts[1]] || parts[1]}`;
  if (parts.length > 0) return ISO639_1[parts[0]] || ISO639_2[parts[0]] || ISO3166_1[parts[0]] || parts[0];
  return '';
}

exports.getIdFromToken = getIdFromToken;
exports.createToken = createToken;
exports.hashData = hashData;
exports.instaRequest = instaRequest;
exports.mailSendData = mailSendData;
exports.createMessageOption = createMessageOption;
exports.createMessageOption2 = createMessageOption2;
exports.createMessageOption3 = createMessageOption3;
exports.YoutubeRequest = YoutubeRequest;
exports.YoutubeDataRequest = YoutubeDataRequest;
exports.getInstagramData = getInstagramData;
exports.getInstagramMediaData = getInstagramMediaData;
exports.getInstagramInsights = getInstagramInsights;
exports.googleVision = googleVision;
exports.getFacebookLongToken = getFacebookLongToken;
exports.getFacebookInfo = getFacebookInfo;
exports.getFacebookPages = getFacebookPages;
exports.checkInstagramBusinessAccount = checkInstagramBusinessAccount;
exports.getInstagramBusinessAccounts = getInstagramBusinessAccounts;
exports.average = average;
exports.standardDeviation = standardDeviation;
exports.resizeImage = resizeImage;
exports.checkLocalHost = checkLocalHost;
exports.asyncMiddleware = asyncMiddleware;
exports.getGoogleData = getGoogleData;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.readFile = readFile;
exports.s3Upload = s3Upload;
exports.s3DeleteObject = s3DeleteObject;
exports.localeCodeToEnglish = localeCodeToEnglish;
exports.getInstaOnlineFlwrs = getInstaOnlineFlwrs;
exports.getInstaImpressions = getInstaImpressions;
exports.getNewFollowers = getNewFollowers;
