import React, { useEffect, useState } from 'react';
import {
  Grid, Divider, Box, Button, Icon
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Room, SupervisorAccount } from '@material-ui/icons';

import axios from 'axios';
import StyledText from '../containers/StyledText';
import { AdvertiseTypes, Colors } from '../../lib/Сonstants';
import StyledGrid from '../containers/StyledGrid';
import StyledImage from '../containers/StyledImage';
import StyledSvg from '../containers/StyledSvg';

function CampaignAll({
  history,
  isHome,
  match
}) {
  const [campaigns, setCampaigns] = useState([]);
  const testImage = 'https://www.inflai.com/attach/portfolio/33/1yqw1whkavscxke.PNG';
  const theme = useTheme();

  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  const is1600 = useMediaQuery('(min-width:1600px)');
  const isLG = useMediaQuery(theme.breakpoints.up('lg'));
  const isMD = useMediaQuery(theme.breakpoints.up('md'));

  function getCardWidth() {
    if (isXl) {
      return '16.666%';
    } if (is1600) {
      return '20%';
    } if (isLG) {
      return '25%';
    } if (isMD) {
      return '33.333%';
    }
    return '100%';
  }

  useEffect(() => {
    axios.get('/api/TB_AD/list').then((res) => {
      const { data } = res.data;
      setCampaigns(data);
      console.log(data);
    }).catch(err => alert(err.response.data.message));
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
    <Box px={{ xs: 2, md: 6 }} py={{ xs: 4, md: 8 }} maxWidth="1920px" margin="0 auto">
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <StyledText fontSize="25">
            <span style={{ color: Colors.pink }}>{isHome ? '최근 ' : '진행중 '}</span>
            캠페인
          </StyledText>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {campaigns.map(item => (
              <Grid item style={{ width: getCardWidth() }}>
                <Box border="1px solid #eaeaea" overflow="hidden" borderRadius="10px" css={{ cursor: 'pointer' }} onClick={() => detailInfo(item.AD_ID)}>
                  <StyledImage width="100%" height="auto" src={item.TB_PHOTO_ADs[0].PHO_FILE || testImage} />
                  <Box p={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <StyledText overflowHidden>
                          <span style={{ color: Colors.pink }}>{`${AdvertiseTypes.mainType[item.AD_CTG]}/${AdvertiseTypes.subType[item.AD_CTG][item.AD_CTG2]}`}</span>
                          {` D-${calculateDates(item.AD_SRCH_END)}`}
                        </StyledText>
                      </Grid>
                      <Grid item xs={12}>
                        <StyledText overflowHidden fontWeight="bold" fontSize="16">
                          {item.AD_NAME}
                        </StyledText>
                      </Grid>
                      <Grid item xs={12}>
                        <StyledText overflowHidden fontSize="13" color={Colors.grey5}>
                          {item.AD_SHRT_DISC}
                        </StyledText>
                      </Grid>
                      <Grid item xs={12}>
                        <Box pt={1}>
                          <Grid container alignItems="center" justify="space-between">
                            <Grid item>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <StyledSvg
                                  component={SupervisorAccount}
                                  color={Colors.grey5}
                                  fontSize="20px"
                                />
                                <StyledText overflowHidden fontSize="13" color={Colors.grey5}>
                                  <span style={{ color: Colors.pink }}>{`${item.TB_PARTICIPANTs.length}`}</span>
                                  {`/${item.AD_INF_CNT}명`}
                                </StyledText>
                              </div>
                            </Grid>
                            <Grid item>
                              <StyledText overflowHidden fontSize="13" color={Colors.grey5}>
                                {`${item.proportion}%`}
                              </StyledText>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box height="5px" borderRadius="50px" overflow="hidden" css={{ background: Colors.grey6 }}>
                          <Box height="4px" width={`${item.proportion}%`} css={{ background: Colors.pink2 }} />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CampaignAll;
