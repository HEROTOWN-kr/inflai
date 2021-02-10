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

function campaignCreated(props) {
  const {
    phoneNumber,
    influencerName,
    campaignName1,
    campaignName2,
    campaignName3,
    campaignStartDate1,
    campaignStartDate2,
    campaignStartDate3,
    campaignEndDate1,
    campaignEndDate2,
    campaignEndDate3
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
      MSG: `${influencerName}님!\n`
        + '놓치면 후회하는\n'
        + '인플라이 캠페인이 등록되었습니다♥\n\n'
        + `*캠페인명: 1. ${campaignName1}\n`
        + `*캠페인 신청 일자: ${campaignStartDate1}\n`
        + `*블로거 신청 마감: ${campaignEndDate1}\n\n`
        + `*캠페인명: 2. ${campaignName2}\n`
        + `*캠페인 신청 일자: ${campaignStartDate2}\n`
        + `*블로거 신청 마감: ${campaignEndDate2}\n\n`
        + `*캠페인명: 3. ${campaignName3}\n`
        + `*캠페인 신청 일자: ${campaignStartDate3}\n`
        + `*블로거 신청 마감: ${campaignEndDate3}\n\n\n`
        + '똑똑한 인플루언서 체험단\n'
        + '인플라이｜inflAi',
      TEMPLATE_CODE: 'KM8',
      FAILED_TYPE: 'N',
      BTN_TYPES: '웹링크',
      BTN_TXTS: '바로가기',
      BTN_URLS1: 'https://influencer.inflai.com',
      BTN_URLS2: 'https://influencer.inflai.com'
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

function participantSelected(props) {
  const {
    phoneNumber,
    campanyName,
    influencerName,
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
          + `${campanyName} 캠페인정보를 확인하세요!\n\n`
          + '◆ 체험 시 유의사항 ◆\n'
          + '① 캠페인정보에서 가이드라인을 꼭 확인해주세요\n'
          + '② 포스팅기한은 1주일을 꼭 지켜주세요\n'
          + '(제품: 수령 후 1주일 / 방문: 체험 후 1주일)\n'
          + '③ 아래위치에 후기등록을 완료해주세요!\n'
          + '[인플라이 로그인] → [캠페인 관리] → [선정된 캠페인] → [후기 등록]\n\n'
          + '**해당 메시지는 고객님께서 캠페인 공고 수신에 동의 해 주셔서 발송되었습니다.\n',
      TEMPLATE_CODE: 'KM10',
      FAILED_TYPE: 'N',
      BTN_TYPES: '웹링크',
      BTN_TXTS: '바로 가기',
      BTN_URLS1: 'https://influencer.inflai.com/Profile/CampaignInfo',
      BTN_URLS2: 'https://influencer.inflai.com/Profile/CampaignInfo'
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
exports.campaignCreated = campaignCreated;
exports.participantSelected = participantSelected;
