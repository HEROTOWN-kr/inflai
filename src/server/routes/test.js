const request = require('request');
const nodemailer = require('nodemailer');
const async = require('async');
const { google } = require('googleapis');
const configKey = require('../config/config');
const Influenser = require('../models').TB_INFLUENCER;
const Insta = require('../models').TB_INSTA;
const Youtube = require('../models').TB_YOUTUBE;
const common = require('../config/common');


function mailTest() {
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
    to: 'andriantsoy@gmail.com',
    from: 'andriantsoy@naver.com',
    subject: '인디언즈 비밀번호 재설정 안내',
    text: 'testing message'
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('info', 'An e-mail has been sent to with further instructions.');
    }
  });
}

function youtubeTest() {
  /* const data = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImNiNDA0MzgzODQ0YjQ2MzEyNzY5YmI5MjllY2VjNTdkMGFkOGUzYmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTk3Mjc0NDIyNzI1LWdiNDBvNXR2NTc5Y3NyMDljaDdxOGFuNjN0Zm1qZ2ZvLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTk3Mjc0NDIyNzI1LWdiNDBvNXR2NTc5Y3NyMDljaDdxOGFuNjN0Zm1qZ2ZvLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA5NTA0MzM5NzIxNDY4NjkyMzc2IiwiZW1haWwiOiJhbmRyaWFudHNveUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Il90d3doRlB3ODJTcGFKMTB0bXdBUEEiLCJuYW1lIjoi0JDQvdC00YDQtdC5INCm0L7QuSIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLWtqQ2pVYUNvNFNVL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FLRjA1bkNyX1p6TjktLUp6OHNrVm54VUZxeUVnT05KdUEvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6ItCQ0L3QtNGA0LXQuSIsImZhbWlseV9uYW1lIjoi0KbQvtC5IiwibG9jYWxlIjoicnUiLCJpYXQiOjE1ODM5MDQ2OTQsImV4cCI6MTU4MzkwODI5NCwianRpIjoiMGIwODBiMjVjYzlkYjNkYTAyNDg2Y2QwZDRiMzljZTFiMDgzY2NhMCJ9.I4QnN5RHl91ZjMQCkG9hz9xcai5xmitMEvZ8vCTJeCPbEvi6-UwrHzcZuL7IE3hdxhJ7cY8osXxnb-B51UF8YpGOX_OqFnkPLJDkCfoTut3XhTCYCt32OIJNNpOZmMDREr7WLRM9K1ADaszZyLmfTtCw0fFoId1qVkkqF-XPupzWFMm8XHZHN70N9R5_Gz34vL6Eq7E5HguUF_gIJn3qJN-UYOcQTTQNJoF-ZncAr_o8nFG9JR3KIsoqnPtFiHZaKqTv1m8bp_dqpy_uqQoH7TjGMVp5YzHmBIaXuQQw0szU1LFZGan52fKtuygCNIfZMmLAD77Vr2xYgYzG2LOn2w';
  const buff = new Buffer(data, 'base64');
  const text = buff.toString('ascii');
  const decoded = jwt.decode(data); */

  const token = 'ya29.a0Ae4lvC1DA8at72_9lTKlhL3JM0BRbT406VDRcYGP1UR9dGKHpJyuT3-Jn9DeDOIphFsU74noLaAlZpFnA0BFyqydsSbtmpzzqffhVYK8s-iunTEXj03pn-c2dBBUK0sow9BXKhdTxbDyCY3aeoe66p_PFIsaHdMLVLU';
  const apiKey = '997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com';

  const myUrl = `https://www.googleapis.com/youtube/v3/subscriptions?part=id&mySubscribers=true&key=${apiKey}`;

  const options = {
    method: 'GET',
    url: myUrl,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    },
    gzip: true
  };


  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      console.log(requestResponse);
    } else if (requestResponse != null) {
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
}

function kakaoTest() {
  const myUrl = 'http://api.apistore.co.kr/kko/1/msg/herotown';

  const options = {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    url: myUrl,
    headers: {
      'x-waple-authorization': 'b4ed715d8ed0ae6cf6bedabf40559903fb5b8fba',
    },
    form: {
      PHONE: '01026763937',
      CALLBACK: '01026763937',
      MSG: '새로운 캠페인이 등록되었습니다!',
      TEMPLATE_CODE: 'API2020',
      FAILED_TYPE: 'SMS',
      BTN_TYPES: '',
      BTN_TXTS: '',
      BTN_URLS1: ''
    }
  };

  request(options, (error, requestResponse, responseBody) => {
    if (!error && requestResponse.statusCode == 200) {
      console.log(requestResponse);
    } else if (requestResponse != null) {
      console.log(`error = ${requestResponse.statusCode}`);
      console.log(`error = ${error}`);
      console.log(options);
    }
  });
}

function copyData(clb) {
  const attributes = ['INF_ID', 'INF_EMAIL', 'INF_TOKEN', 'INF_INST_ID'];
  const filter = {
    find: { INF_BLOG_TYPE: '1' },
    update: { INF_ID: item.INF_ID }
  };

  Influenser.findAll({
    where: filter.find,
    attributes
  }).then((result) => {
    async.map(result, (item, callback) => {
      Youtube.create({
        INF_ID: item.INF_ID,
      }).then((createResult) => {
        callback(null, 'success');
      }).error((err) => {
        callback(null, err);
      });
    }, (err, asyncResult) => clb(asyncResult));
  });
  // return clb('success test');
}

function getInstaData(clb) {
  function FacebookRequest(data, cb) {
    function createUrl(instagramId, facebookToken) {
      const instaDataUrl = `https://graph.facebook.com/v6.0/${instagramId}?`
          + 'fields='
          + 'followers_count%2C'
          + 'follows_count%2C'
          + 'media_count%2C'
          + 'username%2C'
          + 'profile_picture_url%2C'
          + 'name&'
          + `access_token=${facebookToken}`;
      return instaDataUrl;
    }

    async.map(data, (item, callback) => {
      const instagramId = item.INS_ACCOUNT_ID;
      const instagramToken = item.INS_TOKEN;
      const influencerId = item.INF_ID;

      const url = createUrl(instagramId, instagramToken);

      request.get(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const parsedBody = JSON.parse(body);
          callback(null, { ...parsedBody, INF_ID: influencerId });
        } else {
          // callback({ error: error || response.statusCode });
          callback(error, {});
        }
      });
    }, (err, results) => {
      cb(err, results);
    });
  }


  Insta.findAll({
    attributes: ['INS_ID', 'INF_ID', 'INS_TOKEN', 'INS_ACCOUNT_ID']
  }).then((result) => {
    FacebookRequest(result, (error, data) => {
      async.map(data, (item, callback) => {
        const {
          INF_ID, follows_count, followers_count, profile_picture_url
        } = item;
        Insta.update(
          {
            INS_FLW: follows_count,
            INS_FLWR: followers_count,
            INS_PROFILE_IMG: profile_picture_url,
          },
          {
            where: { INF_ID }
          }
        ).then((createResult) => {
          callback(null, 'success');
        }).error((err) => {
          callback(null, err);
        });
      }, (err, asyncResult) => clb(asyncResult));
      // if (!err) { clb(data); } else { clb(err); }
    });
  });
}

function getYoutubeData(clb) {
  Youtube.findAll({
    attributes: ['YOU_ID', 'INF_ID', 'YOU_TOKEN']
  }).then((result) => {
    common.YoutubeRequest(result, (error, data) => {
      clb(data);

      /* async.map(data, (item, callback) => {
        const { YOU_ID } = item;
        const { title, description } = item.snippet;
        const { viewCount, subscriberCount, videoCount } = item.statistics;

        Youtube.update(
          {
            YOU_SUBS: subscriberCount,
            YOU_VIEWS: viewCount,
          },
          {
            where: { YOU_ID }
          }
        ).then((createResult) => {
          callback(null, 'success');
        }).error((err) => {
          callback(null, err);
        });
      }, (err, asyncResult) => clb(asyncResult)); */
    });
  });
}

exports.copyData = copyData;
exports.getInstaData = getInstaData;
exports.getYoutubeData = getYoutubeData;
