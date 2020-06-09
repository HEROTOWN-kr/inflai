import React, { useEffect, useState } from 'react';
import {
  Button, CircularProgress,
  Grid
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import Payment from '../../payment/Payment';
import Common from '../../../lib/common';
import SimpleDialog from '../../dialog/Dialog';

function OnGoing(props) {
  const [inProcess, setInProcess] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [itemId, setItemId] = useState(0);

  function toggleDialog() {
    setDeleteDialog(!deleteDialog);
  }

  function getCampaign() {
    const { token } = Common.getUserInfo();
    axios.get('/api/TB_AD/', {
      params: {
        token
      }
    }).then((res) => {
      setCampaigns(res.data.data);
      setInProcess(false);
    });
  }

  useEffect(() => {
    getCampaign();
  }, []);

  function deleteCampaign() {
    axios.post('/api/TB_AD/delete', { id: itemId }).then((res) => {
      if (res.data.code === 200) {
        getCampaign();
      } else if (res.data.code === 401) {
        console.log(res);
      } else {
        console.log(res);
      }
    }).catch(error => (error));
    /* if (deleteCampaign) {
      toggleDialog();
    } */
  }


  return (
    <React.Fragment>
      <SimpleDialog
        open={deleteDialog}
        selectNo={toggleDialog}
        selectYes={deleteCampaign}
      />
      <Grid container spacing={2}>
        { inProcess
          ? (
            <Grid item xs={12}>
              <CircularProgress />
            </Grid>
          )
          : (campaigns.map(item => (
            <Grid key={item.AD_ID} item md={12}>
              <Grid container justify="space-between" className="campaign-card">
                <Grid item md={3}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <p className="influencer-count">{`선발 ${item.INF_SUM}명`}</p>
                    </Grid>
                    <Grid item md={12} className="product-name">{item.AD_PROD_NAME}</Grid>
                    <Grid item md={12} className="product-price">
                      {item.AD_PRICE}
                          원
                      <span>(VAT 별도)</span>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3}>
                  <Grid container spacing={2} className="right-side">
                    <Grid item md={12} className="product-delete">
                      <DeleteIcon onClick={() => { setItemId(item.AD_ID); toggleDialog(); }} />
                    </Grid>
                    <Grid item md={12} className="product-payment">
                      {
                            item.AD_PAID === 'Y'
                              ? (
                                <React.Fragment>
                                  <Button variant="contained" color="primary" onClick={() => props.history.push(`/Campaign/influencers/${item.AD_ID}`)}>리스트</Button>
                                  <span>결제 완료</span>
                                </React.Fragment>
                              )
                              : <Payment item_data={item} getCampaign={getCampaign} />
                          }
                    </Grid>
                    {/* {
                  item.AD_PAID === 'Y'
                    ? (
                      <Grid item md={12} className="product-payment">
                        <Button variant="contained" color="primary" fullWidth>인플루언서 리스트</Button>
                      </Grid>
                    )
                    : null
                } */}
                    <Grid item md={12} className="product-date">
                          요청일:
                      {item.AD_SRCH_END}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))
          )
          }
      </Grid>
    </React.Fragment>
  );
}

export default OnGoing;
