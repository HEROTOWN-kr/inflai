import React from 'react';
import { Button, Grid, Box } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Arrow from '../../img/arrow.png';
import Advertiser from '../../img/advert2.png';
import Influencer from '../../img/influencer.png';

function RegisterLink() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box py={{ xs: 4, sm: 8 }} className="register-link">
      <div className="title-holder">
        <div className="main-title">서비스 둘러보기</div>
        <div className="second-title">INFLAi로 최적의 효과를 누려보세요</div>
        <img src={Arrow} className="arrow-image" />
      </div>
      <Box px={{ xs: 8, sm: 2 }} className="link-field">
        <Grid container spacing={matches ? 4 : 2} justify="center">
          <Grid item xs={12} sm={6}>
            <Box p={4} className="user-card">
              <img src={Advertiser} />
              <p>광고주</p>
              <Button variant="outlined" className="func-button">회원가입</Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box p={4} className="user-card influencer">
              <img src={Influencer} />
              <p>인플루언서</p>
              <Button variant="outlined" className="func-button">회원가입</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default RegisterLink;

/* <div>
    <Grid xs={12} md={6} className="advertiser">
      <div className="y-wrap">
        <Grid container justify="center">
          <img src={Advertiser} />
        </Grid>
        <Grid container justify="center">
          <div className="job-type">광고주</div>
        </Grid>
        <Grid container justify="center" alignContent="flex-end">
          <Button variant="outlined" className="func-button">Request demo</Button>
        </Grid>
      </div>
    </Grid>
    <Grid xs={12} md={6} className="influencer">
      <div className="y-wrap">
        <Grid container justify="center">
          <img src={Influencer} />
        </Grid>
        <Grid container justify="center">
          <div className="job-type">인플루언서</div>
        </Grid>
        <Grid container justify="center">
          <Button variant="outlined" className="func-button">Sign Up</Button>
        </Grid>
      </div>
    </Grid>
  </div>; */
