import React, { useEffect, useState } from 'react';
import {
  Grid
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import Payment from '../../payment/Payment';
import Common from '../../../lib/common';
import SimpleDialog from '../../dialog/Dialog';

function OnGoing() {
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
    })
      .then((res) => {
        setCampaigns(res.data.data);
      });
  }

  useEffect(() => {
    getCampaign();
  }, []);

  function deleteCampaign() {
    axios.post('/api/TB_AD/delete', { id: itemId })
      .then((res) => {
        if (res.data.code === 200) {
          getCampaign();
        } else if (res.data.code === 401) {
          console.log(res);
        } else {
          console.log(res);
        }
      })
      .catch(error => (error));
    if (deleteCampaign) {
      toggleDialog();
    }
  }


  return (
    <React.Fragment>
      <SimpleDialog
        open={deleteDialog}
        selectNo={toggleDialog}
        selectYes={deleteCampaign}
      />
      {campaigns.map(item => (
        <Grid key={item.AD_ID} item md={12}>
          <Grid container justify="space-between" className="campaign-card">
            <Grid item md={3}>
              <Grid container spacing={2}>
                <Grid item md={12}>
                  <p className="influencer-count">선발 1명</p>
                </Grid>
                <Grid item md={12} className="product-name">{item.AD_PROD_NAME}</Grid>
                <Grid item md={12} className="product-price">
                  {item.AD_PROD_PRICE}
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
                  <Payment />
                </Grid>
                <Grid item md={12} className="product-date">
                    요청일:
                  {item.AD_SRCH_END}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </React.Fragment>
  );
}

export default OnGoing;
