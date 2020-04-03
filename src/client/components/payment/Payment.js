import React from 'react';
import { Button } from '@material-ui/core';

function Payment() {
  const userCode = 'imp16565297';

  const data = {
    pg: 'kcp',
    pay_method: 'card',
    merchant_uid: `merchant_${new Date().getTime()}`,
    name: 'myproject',
    amount: '100',
    currency: 'KRW',
    buyer_name: '홍길동',
    buyer_tel: '01012341234',
    buyer_email: 'example@example.com',
    escrow: undefined,
    request_id: 'req_1585878201926',
    tier_code: undefined
  };

  function callback(response) {
    /* const query = queryString.stringify(response);
    history.push(`/payment/result?${query}`); */
    console.log(response);
  }

  function paymentStart() {
    const { IMP } = window;
    IMP.init(userCode);
    console.log(data);
    IMP.request_pay(data, callback);
  }


  return (
    <Button variant="contained" color="secondary" onClick={paymentStart}>결제</Button>
  );
}

export default Payment;
