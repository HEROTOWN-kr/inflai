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

function participantSelectedV2(props) {
  const {
    phoneNumber,
    campanyName,
    influencerName,
    advertiserPhone
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
          + '인공지능 인플루언서 플랫폼 인플라이[INFLAi]에 신청하신 캠페인에 선정되셨습니다!\n'
          + '해당 캠페인은 광고주가 직접 올린 캠페인으로 궁금사항은 광고주분이랑 직접 소통하셔야 합니다.\n'
          + `${campanyName} 캠페인정보를 확인하세요!\n\n`
          + '◆ 체험 시 유의사항 ◆\n'
          + '① 캠페인에 선정되신 분들께만 가는 알림입니다. 선정되신 분들의 정보(이름,전화번호,주소)는 상품발송 및 상품관련된 소통내용등으로 쓰이게 됩니다\n'
          + '② 캠페인정보에서 가이드라인을 꼭 확인해주세요\n'
          + '③ 포스팅기한은 1주일을 꼭 지켜주세요\n'
          + '(제품: 수령 후 1주일 / 방문: 체험 후 1주일)\n'
          + '④ 아래위치에 후기등록을 완료해주세요!\n'
          + '[인플라이 로그인] → [캠페인 관리] → [선정된 캠페인] → [후기 등록]\n'
          + '후기등록하면 광고주분이 해당 캠페인의 만족도를 표시하고 여러분의 누적등급이 표시되니 꼭 등록해주세요\n'
          + '⑤ 위의 정보등이 부족하거나 궁금한 사항이 있으면 광고주랑 직접 소통하시면 됩니다\n'
          + `⑥ 해당 캠페인광고주님 전화번호는 ${advertiserPhone} 입니다. 궁금사항은 직접 소통해주세요.\n`
          + '해당 광고주의 연락처는 택배 및 게시물등 소통용으로만 사용할 수 있으며 그 외 사용목적일 경우 법에 따라 처벌 될 수 있습니다.',
      TEMPLATE_CODE: 'KM11',
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

function campaignApplied(props) {
  const {
    phoneNumber,
    campaignName,
    campaignId,
    advertiserName,
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
          + `${advertiserName}님!\n`
          + `${campaignName} 캠페인정보를 확인하세요!\n\n`
          + '인공지능 인플루언서 플랫폼 인플라이에 캠페인등록 신청해주셔서 감사합니다\n'
          + '24시간 이내 (근무일기준) 빠른 승인(반려)처리를 해서 노출하도록 하겠습니다\n'
          + '마감일이 지나면 3일 이내 반드시 신청자들 중 선정자를 뽑아주셔야 하고 상품(서비스)배송 해주셔야 합니다.\n'
          + '선정하신 인플루언서분들에게만 광고주분의 전화번호가 안내가 되며 인플루언서들이 궁금한 내용은 전화나 카톡등으로 물어볼 겁니다.\n'
          + '최대한 자세히 답을 달아주세요.\n'
          + '해당 인플루언서의 연락처는 택배 및 게시물등 소통용으로만 사용할 수 있으며 그 외 사용목적일 경우 법에 따라 처벌 될 수 있습니다.',
      TEMPLATE_CODE: 'KM12',
      FAILED_TYPE: 'N',
      BTN_TYPES: '웹링크',
      BTN_TXTS: '바로 가기',
      BTN_URLS1: `https://biz.inflai.com/Campaign/detail/${campaignId}`,
      BTN_URLS2: `https://biz.inflai.com/Campaign/detail/${campaignId}`
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

function campaignApproved(props) {
  const {
    phoneNumber,
    campanyName,
    campaignId,
    advertiserName,
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
          + `${advertiserName}님!\n`
          + `${campanyName} 캠페인정보를 확인하세요!\n\n`
          + '기쁜 소식 안내드립니다. 광고주님이 신청하신 캠페인이 승인되어 노출 중입니다. \n'
          + '인플루언서 모집캠페인 모집기간은 최소 1주일이며 마감일이 지나면 반드시 3일 이내 신청자들 중 선정자를 뽑아주셔야 하고 상품(서비스)배송 해주셔야 합니다\n'
          + '선정하신 인플루언서분들에게만 광고주분의 전화번호가 안내가 되며 인플루언서들이 궁금한 내용은 전화나 카톡등으로 물어볼 겁니다\n'
          + '질문이 올 경우 최대한 자세히 답해 주시면 좀더 좋은 퀄리티의 게시물이 생성됩니다. \n'
          + '해당 인플루언서의 연락처는 택배 및 게시물등 소통용으로만 사용할 수 있으며 그 외 사용목적일 경우 법에 따라 처벌 될 수 있습니다.',
      TEMPLATE_CODE: 'KM13',
      FAILED_TYPE: 'N',
      BTN_TYPES: '웹링크',
      BTN_TXTS: '바로 가기',
      BTN_URLS1: `https://biz.inflai.com/Campaign/detail/${campaignId}`,
      BTN_URLS2: `https://biz.inflai.com/Campaign/detail/${campaignId}`
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

function campaignApproveRequest(props) {
  const {
    phoneNumber,
    campaignName,
    adminName,
    advertiserName,
    createdDate,
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
      + `${adminName}님!\n`
      + `${advertiserName}님이\n`
      + `${createdDate} 에\n`
      + `${campaignName} 캠페인을 등록했습니다.\n\n`
      + 'Admin 페이지에서 확인하시고, 승인해주세요.',
      TEMPLATE_CODE: 'KM17',
      FAILED_TYPE: 'N',
      BTN_TYPES: '웹링크',
      BTN_TXTS: '바로 가기',
      BTN_URLS1: 'https://admin.inflai.com/Campaign/List',
      BTN_URLS2: 'https://admin.inflai.com/Campaign/List'
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
exports.campaignApproved = campaignApproved;
exports.campaignApproveRequest = campaignApproveRequest;
exports.campaignApplied = campaignApplied;
exports.participantSelectedV2 = participantSelectedV2;
