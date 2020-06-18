import React from 'react';
import Grid from '@material-ui/core/Grid';
import '../../css/sub.scss';
import { Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TitleImage from '../../img/home-title.png';
import IphoneImage from '../../img/iphone.png';

function Greeting({

}) {
  const useStyles = makeStyles(theme => ({
    root: {
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'center',
      }
    },
  }));

  const classes = useStyles();

  const $colorBg = '#fefefe'; const $colorBlue = '#093c5e'; const $aqua = '#23c9cf'; const
    $white = '#ffffff';

  const FontSettings = {
    first: {
      fontSize: '30px',
      color: $aqua
    },
    second: {
      paddingTop: '15px',
      fontWeight: 'bold',
      fontSize: '72px',
      color: $aqua
    },
    third: {
      fontSize: '18px',
      color: $white,
      fontWeight: 'bold',
      lineHeight: '180%',
      paddingTop: '80px'
    },
    fourth: {
      marginTop: '170px',
      width: '178px',
      height: '50px',
      border: '2px solid #23c9cf',
      fontSize: '20px',
      color: $white,
      borderRadius: '25px'
    },
  };

  return (
    <div>
      {/* <div className="main-part">
        <Grid container className="background-part">
          <Grid item md={9} className="triangle-part" />
          <Grid item md={3} />
        </Grid>
        <div className="text-part">
          <Grid container className="text-container">
            <div>
              text
            </div>
          </Grid>
        </div>
      </div> */}
      <Grid container className="greeting">
        <Grid item xs={12} md={5} className="greeting-content">
          <div className="wraper">
            <Grid container>
              <Grid container alignContent="flex-start" className="title">INFLAi</Grid>
              <Grid container className="main-title">똑똑한 인플루언서 마케팅의 시작</Grid>
              <Grid container className="main-text">
                보다 저렴하게 보다 직관적으로
                <br />
                직접 소통을 통해 확실한 마케팅을
                <br />
                원하는 분들을 위한 서비스
              </Grid>
              <Grid container alignContent="flex-end">
                <Grid container alignItems="center" justify="center" className="start-button">
                            Get Started
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Hidden xsDown>
          <Grid item md={4} style={{ background: '#093c5e' }}>
            <div className="triangle-content" />
          </Grid>
          <Grid item md={3} style={{ background: '#fefefe' }}>
            <img src={TitleImage} className="greeting-image" />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
}

export default Greeting;
