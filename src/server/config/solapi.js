const path = require('path');
const { config, msg } = require('solapi');

// apiKey, apiSecret 설정 (설정하지 않으면 패키지 홈의 config.json 파일의 설정을 참고합니다.)
config.init({
  apiKey: process.env.SOL_API_KEY,
  apiSecret: process.env.SOL_API_SECRET
});

async function sendKakaoImgMessage() {
  try {
    const { fileId } = await msg.uploadKakaoImage(path.join(__dirname, '../img/example.jpg'), 'https://www.inflai.com');

    const msgParams = {
      messages: [
        {
          to: '01026763937',
          from: '01026763937',
          text: '카카오톡채널 친구로 추가되어 있어야 친구톡 발송이 가능합니다.',
          kakaoOptions: {
            pfId: 'KA01PF210721055340419Adykg2M6HK9',
            imageId: fileId
          }
        }
      ]
    };
    await msg.send(msgParams);
  } catch (e) {
    console.log(e.message);
  }
}

module.exports.sendKakaoImgMessage = sendKakaoImgMessage;
