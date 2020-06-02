import React from 'react';
import { Button } from '@material-ui/core';
import axios from 'axios';

function Payment({
  item_data,
  getCampaign
}) {
  const userCode = 'imp16565297';

  const data = {
    pg: 'kcp',
    pay_method: 'card',
    merchant_uid: item_data.AD_UID,
    // merchant_uid: `merchant_${new Date().getTime()}`,
    name: item_data.AD_PROD_NAME,
    amount: item_data.AD_PRICE,
    currency: 'KRW',
    buyer_name: item_data.TB_ADVERTISER.ADV_COM_NAME,
    buyer_tel: item_data.TB_ADVERTISER.ADV_TEL,
    buyer_email: item_data.TB_ADVERTISER.ADV_EMAIL,
    escrow: undefined,
    request_id: 'req_1585878201926',
    tier_code: undefined,
    // data: item_data
  };

  function callback(response) {
    /* const query = queryString.stringify(response);
    history.push(`/payment/result?${query}`); */

    if (response.success) {
      const obj = {
        payment_res: response,
        id: item_data.AD_ID
      };
      axios.post('/api/TB_PAYMENT/', obj)
        .then((res) => {
          getCampaign();
          if (res.data.code === 200) {
            axios.post('/api/TB_NOTIFICATION/sendNotification', item_data).then((res2) => {
              if (res2.data.code === 200) {
                console.log(res2);
              } else if (res2.data.code === 401) {
                console.log(res2);
              }
            });
          } else if (res.data.code === 401) {
            console.log(res);
          } else {
            console.log(res);
          }
        })
        .catch(error => (error));
    }
  }

  function paymentStart() {
    console.log(data);
    const { IMP } = window;
    IMP.init(userCode);
    IMP.request_pay(data, callback);
  }

  function testButton() {
    axios.post('/api/TB_NOTIFICATION/sendNotification', item_data).then((res2) => {
      if (res2.data.code === 200) {
        console.log(res2);
      } else if (res2.data.code === 401) {
        console.log(res2);
      }
    });
  }

  return (
    <Button variant="contained" color="secondary" onClick={paymentStart}>결제</Button>
  );
}

export default Payment;
