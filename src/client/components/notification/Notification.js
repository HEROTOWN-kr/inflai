import React, { useEffect, useState } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import axios from 'axios';
import Payment from '../payment/Payment';
import Common from '../../lib/common';

function Notification() {
  const [campaigns, setCampaigns] = useState([]);

  function getNotification() {
    const { token } = Common.getUserInfo();
    axios.get('/api/TB_NOTIFICATION/', {
      params: {
        token
      }
    }).then((res) => {
      setCampaigns(res.data.data);
      console.log(res);
    });
  }

  useEffect(() => {
    getNotification();
  }, []);

  function changeState(id, state) {
    axios.post('/api/TB_NOTIFICATION/changeState', { id, state })
      .then((res) => {
        if (res.data.code === 200) {
          getNotification();
        } else if (res.data.code === 401) {
          console.log(res);
        } else {
          console.log(res);
        }
      })
      .catch(error => (error));
  }

  function StateContainer(props) {
    const item = {
      1: <Grid item>승인함</Grid>,
      2: <Grid item>거절함</Grid>,
      3: <React.Fragment>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => changeState(props.item.NOTI_ID, 1)}>승인</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={() => changeState(props.item.NOTI_ID, 2)}>거절</Button>
        </Grid>
      </React.Fragment>
    }[props.item.NOTI_STATE];

    return item;
  }

  return (
    <div className="notification">
      <Grid container justify="center">
        <Grid item md={5}>
          <Box py={6}>
            <Grid container spacing={2}>
              {campaigns.map(item => (
                <Grid key={item.NOTI_ID} item md={12}>
                  <Box p={3} className="card">
                    <Grid container justify="space-between" className="campaign-card">
                      <Grid item md={3}>
                        <Grid container spacing={2}>
                          <Grid item>
                            <p className="influencer-count">{`선발 ${item.TB_AD.INF_SUM}명`}</p>
                          </Grid>
                          <Grid item md={12} className="product-name">{item.TB_AD.AD_PROD_NAME}</Grid>
                          <Grid item md={12} className="product-price">
                            {item.TB_AD.AD_PROD_PRICE}
                              원
                            <span>(VAT 별도)</span>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item md={3}>
                        <Grid container spacing={2} className="right-side">
                          <Grid item md={12} className="product-delete">
                            <Grid container spacing={2} justify="flex-end">
                              <StateContainer item={item} />
                            </Grid>
                          </Grid>
                          <Grid item md={12} className="product-payment">
                            {
                                // item.AD_PAID === 'Y' ? <p>결제 완료</p> : <Payment item_data={item} getCampaign={getCampaign} />
                              }
                          </Grid>
                          <Grid item md={12} className="product-date">
                              요청일:
                            {item.NOTI_DT}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default Notification;
