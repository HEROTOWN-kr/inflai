import React, { useEffect, useState } from 'react';
import {
  Grid, Divider, Box, Button
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { SupervisorAccount } from '@material-ui/icons';

import axios from 'axios';
import StyledText from '../containers/StyledText';
import { Colors } from '../../lib/Сonstants';
import StyledGrid from '../containers/StyledGrid';

function CampaignAll({
  history,
  isHome,
  match
}) {
  const [campaigns, setCampaigns] = useState([]);
  const testImage = 'https://www.inflai.com/attach/portfolio/33/1yqw1whkavscxke.PNG';
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    axios.get('/api/TB_AD/list').then((res) => {
      const { data } = res.data;
      setCampaigns(data);
      console.log(data);
    });
  }, []);

  function calculateDates(date) {
    const currentDate = new Date();
    const lastDate = new Date(date);
    const daysLag = Math.ceil(Math.abs(lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    return daysLag;
  }

  function detailInfo(AD_ID) {
    history.push(`CampaignList/${AD_ID}`);
    // width="100%" maxWidth="1920px" minWidth="1200px"
  }

  return (
    <Box px={{ xs: 2, md: 6 }} py={{ xs: 4, md: 8 }}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <StyledText fontSize="25">
            <span style={{ color: Colors.pink }}>{isHome ? '최근 ' : '진행중 '}</span>
            캠페인
          </StyledText>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={matches ? 4 : 2}>
            <Grid item style={{ background: 'red', width: '20%' }}>
              test
            </Grid>
            <Grid item style={{ background: 'red', width: '20%' }}>
              test
            </Grid>
            <Grid item style={{ background: 'red', width: '20%' }}>
              test
            </Grid>
            <Grid item style={{ background: 'red', width: '20%' }}>
              test
            </Grid>
            <Grid item style={{ background: 'red', width: '20%' }}>
              test
            </Grid>
            <Grid item style={{ background: 'red', width: '20%' }}>
              test
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  /* <Box px={2} py={{ xs: 4, md: 8 }} className="campaign-list">
      <div className="title">
        {`${isHome ? '최근' : '진행중'} 캠페인`}
      </div>
      <Box my={2}>
        <Divider />
      </Box>
      <Grid container spacing={matches ? 4 : 2}>
        {campaigns.map(item => (
          <Grid key={item.AD_ID} item xs={6} md={4} lg={3}>
            <Grid container spacing={1} onClick={() => detailInfo(item.AD_ID)} className="campaign-item">
              <Grid item xs={12}>
                <div className="image">
                  <img src={item.TB_PHOTO_ADs[0] ? `${item.TB_PHOTO_ADs[0].PHO_FILE}` : testImage} alt="nofoto" />
                </div>
                 <img src={require('/home/inflai/upload/attach/portfolio/34/2ya5c1cokb8p1w8o.png')} alt="nofoto" />
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
                  <Grid item>{`신청 ${(item.TB_PARTICIPANTs).length}/모집 ${item.AD_INF_CNT}`}</Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
        {
          isHome ? (
            <Grid container justify="flex-end" item xs={12}>
              <Grid item>
                <Button variant="contained" onClick={() => history.push('/CampaignList')}>더보기</Button>
              </Grid>
            </Grid>
          ) : null
        }
      </Grid>
    </Box> */
  );
}

export default CampaignAll;
