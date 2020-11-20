import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import axios from 'axios';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Skeleton } from '@material-ui/lab';
import { Colors } from '../../../../lib/Сonstants';
import StyledText from '../../../containers/StyledText';
import AuthContext from '../../../../context/AuthContext';
import CampaignCard from '../../../campaignList/CampaignCard';

function TabComponent(props) {
  const {
    tab, setTab, text, tabNumber
  } = props;
  const styles = tab === tabNumber ? {
    border: `3px solid ${Colors.pink2}`,
    fontWeight: 'bold'
  } : {
    border: '0',
    fontWeight: '400'
  };

  return (
    <Box
      padding="13px 20px"
      borderBottom={styles.border}
      css={{ cursor: 'pointer' }}
      onClick={() => setTab(tabNumber)}
    >
      <StyledText fontSize="16" fontWeight={styles.fontWeight}>{text}</StyledText>
    </Box>
  );
}

function AdvCampaignInfo(props) {
  const { history, match } = props;
  const [tab, setTab] = useState(1);
  const [campaigns, setCampaigns] = useState([]);
  const { token } = useContext(AuthContext);

  function getCampaigns() {
    axios.get('/api/TB_AD/', {
      params: { token }
    }).then((res) => {
      const { data } = res.data;
      setCampaigns(data);
    }).catch(err => alert(err));
  }

  useEffect(() => {
    if (token) getCampaigns();
  }, [token]);

  const theme = useTheme();

  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  const is1600 = useMediaQuery('(min-width:1600px)');
  const isLG = useMediaQuery(theme.breakpoints.up('lg'));
  const isMD = useMediaQuery(theme.breakpoints.up('md'));

  function getCardWidth() {
    if (isXl) {
      return '25%';
    } if (is1600) {
      return '33.333%';
    } if (isLG) {
      return '33.333%';
    } if (isMD) {
      return '33.333%';
    }
    return '100%';
  }

  function detailInfo(AD_ID) {
    history.push(`/CampaignList/${AD_ID}`);
  }

  return (
    <Box py={4} px={6}>
      <Box borderBottom={`2px solid ${Colors.grey7}`}>
        <Grid container>
          <Grid item>
            <TabComponent tab={tab} setTab={setTab} text="전체 캠페인" tabNumber={1} />
          </Grid>
          <Grid item>
            <TabComponent tab={tab} setTab={setTab} text="진행중 캠페인" tabNumber={2} />
          </Grid>
        </Grid>
      </Box>
      <Box mt={4}>
        { campaigns.length > 0 ? (
          <Grid container spacing={3}>
            {campaigns.map((item) => {
              const {
                AD_ID, AD_CTG, AD_CTG2, AD_SRCH_END, AD_NAME, AD_SHRT_DISC, TB_PARTICIPANTs, AD_INF_CNT, proportion, TB_PHOTO_ADs,
              } = item;
              return (
                <Grid item key={AD_ID} style={{ width: getCardWidth() }}>
                  <CampaignCard
                    image={TB_PHOTO_ADs[0].PHO_FILE}
                    ctg1={AD_CTG}
                    ctg2={AD_CTG2}
                    srchEnd={AD_SRCH_END}
                    name={AD_NAME}
                    shrtDisc={AD_SHRT_DISC}
                    participantsLength={TB_PARTICIPANTs.length}
                    cnt={AD_INF_CNT}
                    proportion={proportion}
                    onClick={() => detailInfo(AD_ID)}
                  />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Grid container justify="center">
            <Grid item>
                  등록된 캠페인이 없습니다.
            </Grid>
          </Grid>
        )}
      </Box>
      <Box py={4}>
        <Grid container>
          <Grid item xs={3}>
            <Skeleton width="100%" height="200px" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AdvCampaignInfo;
