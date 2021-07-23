const path = require('path');
const { config, msg } = require('solapi');

// apiKey, apiSecret 설정 (설정하지 않으면 패키지 홈의 config.json 파일의 설정을 참고합니다.)
config.init({
  apiKey: process.env.SOL_API_KEY,
  apiSecret: process.env.SOL_API_SECRET
});

async function sendKakaoImgMessage(props) {
  try {
    const {
      phoneNumber, messageText, fileUrl, filePath, webUrl
    } = props;

    const { fileId } = await msg.uploadKakaoImage(filePath, webUrl);
    // const { fileId } = await msg.uploadKakaoImage(fileUrl, webUrl);

    const msgParams = {
      messages: [
        {
          to: phoneNumber,
          from: '01026763937',
          text: messageText,
          kakaoOptions: {
            pfId: 'KA01PF210721055340419Adykg2M6HK9',
            imageId: fileId,
            buttons: [
              {
                buttonType: 'WL', // 웹링크
                buttonName: '바로가기',
                linkMo: webUrl,
                linkPc: webUrl // 생략 가능
              }
            ]
          }
        }
      ]
    };
    await msg.send(msgParams);
  } catch (e) {
    throw new Error(e.message);
    // console.log(e.message);
  }
}

module.exports.sendKakaoImgMessage = sendKakaoImgMessage;
