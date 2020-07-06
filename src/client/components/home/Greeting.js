import React from 'react';
import '../../css/sub.scss';
import { Hidden, useMediaQuery, Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import TitleImage from '../../img/home-title.png';
import IphoneImage from '../../img/iphone.png';

function Greeting() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <div>
      <div className="main-part">
        <Grid container className="background-part">
          <Grid item xs={12} md={8} className="triangle-part" />
          <Hidden mdDown>
            <Grid item md={4} />
          </Hidden>
        </Grid>
        <div className="text-part">
          <Grid container spacing={1} className="text-container">
            <Grid container justify={matches ? null : 'center'} item xs={12} md={6}>
              <Grid item>
                <div className="title">INFLAi</div>
                <div className="main-title">똑똑한 인플루언서 마케팅의 시작</div>
                <div className="main-text">
                  보다 저렴하게 보다 직관적으로
                  <br />
                  직접 소통을 통해 확실한 마케팅을
                  <br />
                  원하는 분들을 위한 서비스
                </div>
              </Grid>
            </Grid>
            <Grid item md={6} className="image-holder">
              <img src={TitleImage} className="greeting-image" />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default Greeting;
