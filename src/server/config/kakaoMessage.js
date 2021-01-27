const request = require('request');

function membershipSubscribe(props) {
  const {
    phoneNumber,
    advertiserName,
    planName,
    planMonth,
    price,
    bankAccount,
    accountHolder,
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
      MSG: `${advertiserName} 광고주님!\n`
                + '인플라이 가입을 환영합니다!\n\n'
                + `현재 ${planName}멤버십을 신청하셨습니다.\n`
                + `멤버십 이용기간은 결제일로부터 ${planMonth}개월입니다.\n\n`
                + '24시간 내에 아래 계좌로 결제해주세요. 결제확인 후, 승인이 되면 바로 이용이 가능합니다.\n\n'
                + `결제액 : ${price}원 (VAT포함)\n`
                + `${bankAccount}\n`
                + `예금주 : ${accountHolder}\n`,
      TEMPLATE_CODE: 'KM5',
      FAILED_TYPE: 'N',
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

function membershipApprove(props) {
  const {
    phoneNumber,
    advertiserName,
    startDate,
    endDate,
    influencerCount,
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
      MSG: `${advertiserName} 광고주님!\n`
          + '인플라이 멤버십 결제가 확인 되었습니다.!\n\n'
          + `멤버십 이용기간은 ${startDate} 부터 ${endDate} 까지이며, 총 ${influencerCount}명의 인플루언서를 활용하실 수 있습니다. 감사합니다\n`,
      TEMPLATE_CODE: 'KM6',
      FAILED_TYPE: 'N',
      BTN_TYPES: '웹링크',
      BTN_TXTS: '지금 바로 모집하기',
      BTN_URLS1: 'https://biz.inflai.com/Campaign',
      BTN_URLS2: 'https://biz.inflai.com/Campaign'
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

exports.membershipSubscribe = membershipSubscribe;
exports.membershipApprove = membershipApprove;