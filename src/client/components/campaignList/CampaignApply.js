import React, { useState } from 'react';
import {
  Box, CircularProgress, Divider, Grid
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import StyledText from '../containers/StyledText';
import { Colors } from '../../lib/Сonstants';

function CampaignApply(props) {
  const { match, history } = props;
  const [applyData, setApplyData] = useState({});
  const [isSticky, setSticky] = useState(false);
  const theme = useTheme();

  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  const is1600 = useMediaQuery('(min-width:1600px)');
  const isLG = useMediaQuery(theme.breakpoints.up('lg'));
  const isMD = useMediaQuery(theme.breakpoints.up('md'));

  function getWidth() {
    if (isXl) {
      return '800px';
    } if (isLG) {
      return '800px';
    }
    return '100%';
  }
  const fixedStyles = {
    boxSizing: 'border-box',
    width: '359px',
    position: 'fixed',
    left: '1173px',
    zIndex: '1039',
    marginTop: '0px',
    top: '0px',
  };

  function ApplyFormComponent(props) {
    const { title, children } = props;
    return (
      <Grid container>
        <Grid item xs={3}>
          <Box py={5}>
            <StyledText fontWeight="bold" fontSize="16">
              {title}
            </StyledText>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <Box py={5} borderBottom={`1px solid ${Colors.grey7}`}>
            {children}
          </Box>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box width="1160px" margin="0 auto" className="campaign-detail">
      <Grid container>
        <Grid item style={{ width: getWidth() }}>
          <Box py={6} pr={6}>
            <StyledText fontSize="28" fontWeight="bold">캠페인 신청하기</StyledText>
            <Box mt={3} mb={2}>
              <Divider />
            </Box>
            <ApplyFormComponent title="SNS">
              data
            </ApplyFormComponent>
            <ApplyFormComponent title="이름">
              data
            </ApplyFormComponent>
            <ApplyFormComponent title="신청한마디">
              data
            </ApplyFormComponent>
            <ApplyFormComponent title="제공상품 수령인">
              data
            </ApplyFormComponent>
            <ApplyFormComponent title="제공상품 배송지">
              data
            </ApplyFormComponent>
            <ApplyFormComponent title="연락처">
              data
            </ApplyFormComponent>
            <ApplyFormComponent title="메일주소">
              data
            </ApplyFormComponent>
          </Box>
        </Grid>
        <Grid item style={{ width: '360px', borderLeft: '1px solid #eee' }}>
          <Box py={6} pl={6} style={isSticky ? fixedStyles : {}} />
        </Grid>
      </Grid>


      {/* {Object.keys(applyData).length ? (
        <Grid container>
          <Grid item style={{ width: getWidth() }}>
            <Box py={6} pr={6}>
              test
            </Box>
          </Grid>
          <Grid item style={{ width: '360px', borderLeft: '1px solid #eee' }}>
            <Box py={6} pl={6} style={isSticky ? fixedStyles : {}} />
          </Grid>
        </Grid>
      ) : (
        <Grid container justify="center">
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      )} */}
    </Box>
  );
}

export default CampaignApply;
