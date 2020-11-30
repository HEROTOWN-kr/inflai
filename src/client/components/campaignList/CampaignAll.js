import React, { useEffect, useState } from 'react';
import {
  Grid, Divider, Box, Button, Icon
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Room, SupervisorAccount } from '@material-ui/icons';

import axios from 'axios';
import { Skeleton } from '@material-ui/lab';
import StyledText from '../containers/StyledText';
import { AdvertiseTypes, Colors } from '../../lib/Сonstants';
import StyledGrid from '../containers/StyledGrid';
import StyledImage from '../containers/StyledImage';
import StyledSvg from '../containers/StyledSvg';
import CampaignCard from './CampaignCard';


function CampaignAll({
  history,
  isHome,
  match
}) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

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

  function getCampaigns() {
    setLoading(true);
    axios.get('/api/TB_AD/list').then((res) => {
      const { data } = res.data;
      setCampaigns(data);
      setLoading(false);
    }).catch(err => alert(err.response.data.message));
  }

  useEffect(() => {
    getCampaigns();
  }, []);

  function calculateDates(date) {
    const currentDate = new Date();
    const lastDate = new Date(date);
    const daysLag = Math.ceil(Math.abs(lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    return daysLag;
  }

  function detailInfo(AD_ID) {
    history.push(`CampaignList/${AD_ID}`);
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
          {loading ? (
            <Grid container>
              <Grid item style={{ width: getCardWidth() }}>
                <Box
                  border="1px solid #eaeaea"
                  overflow="hidden"
                  borderRadius="10px"
                  css={{ cursor: 'pointer' }}
                >
                  <Skeleton variant="rect" width="100%" height={186} />
                  <Box p={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Skeleton variant="text" width="50%" />
                      </Grid>
                      <Grid item xs={12}>
                        <Skeleton variant="text" />
                      </Grid>
                      <Grid item xs={12}>
                        <Skeleton variant="text" />
                      </Grid>
                      <Grid item xs={12}>
                        <Skeleton variant="text" />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {campaigns.map((item) => {
                const {
                  AD_ID, AD_CTG, AD_CTG2, AD_SRCH_END, AD_NAME, AD_SHRT_DISC, TB_PARTICIPANTs, AD_INF_CNT, proportion, TB_PHOTO_ADs,
                } = item;
                return (
                  <Grid item key={AD_ID} style={{ width: getCardWidth() }}>
                    <CampaignCard
                      image={TB_PHOTO_ADs[0] ? TB_PHOTO_ADs[0].PHO_FILE : null}
                      ctg1={AD_CTG}
                      ctg2={AD_CTG2}
                      srchEnd={AD_SRCH_END}
                      name={AD_NAME}
                      shrtDisc={AD_SHRT_DISC}
                      participantsLength={TB_PARTICIPANTs.length}
                      cnt={AD_INF_CNT}
                      proportion={proportion}
                      onClick={() => detailInfo(item.AD_ID)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}

        </Grid>
      </Grid>
    </Box>
  );
}

export default CampaignAll;
