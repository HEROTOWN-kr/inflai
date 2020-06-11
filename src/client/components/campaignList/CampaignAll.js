import React, { useEffect, useState } from 'react';
import { Grid, Divider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import axios from 'axios';
import NameArray from '../../lib/nameArray';
import Common from '../../lib/common';

const theme = createMuiTheme({
  spacing: 1,
});

function CampaignAll({
  history,
  match
}) {
  const [campaigns, setCampaigns] = useState([]);
  const testImage = 'https://www.inflai.com/attach/portfolio/33/1yqw1whkavscxke.PNG';

  useEffect(() => {
    axios.get('/api/TB_AD/list').then((res) => {
      // console.log(res.data);
      const { data } = res.data;
      setCampaigns(data);
    });
  }, []);

  function calculateDates(date) {
    const currentDate = new Date();
    const lastDate = new Date(date);
    const daysLag = Math.ceil(Math.abs(lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    return daysLag;
  }

  return (
    <Grid container justify="center">
      <Grid item className="campaign-list">
        <Grid container spacing={5}>
          {campaigns.map(item => (
            <Grid key={item.AD_ID} item xs={3}>
              <Grid container spacing={theme.spacing(1)} onClick={() => history.push(`${match.path}/${item.AD_ID}`)} className="campaign-item">
                <Grid item xs={12}>
                  <img src={item.TB_PHOTO_ADs[0] ? `https://www.inflai.com${item.TB_PHOTO_ADs[0].PHO_FILE}` : testImage} alt="nofoto" />
                  {/* <img src={require('/home/inflai/upload/attach/portfolio/34/2ya5c1cokb8p1w8o.png')} alt="nofoto" /> */}
                </Grid>
                <Grid item xs={12} className="tags">
                  {item.AD_TAGS}
                </Grid>
                <Grid item xs={12} className="title">
                  {item.AD_PROD_NAME}
                </Grid>
                <Grid item xs={12} className="text">
                  {item.AD_ABOUT}
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} className="count">
                  <Grid container justify="space-between">
                    <Grid item>{`D-${calculateDates(item.AD_SRCH_END)}`}</Grid>
                    <Grid item>{`신청 ${(item.TB_NOTIFICATIONs).length}/모집 ${item.INF_SUM}`}</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CampaignAll;
