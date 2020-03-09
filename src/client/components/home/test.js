import React from 'react';
import Grid from '@material-ui/core/Grid';
import '../../css/sub.scss';
import TitleImage from '../../img/home-title.png';
import {Hidden} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function Test({

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
      <Grid container className="greeting">
        <Grid item xs={12} md={5} className="greeting-content">
          <div className="wraper">
            <Grid container>
              <Grid container alignContent="flex-start" className="title">Show me your brand</Grid>
              <Grid container className="main-title">인플루언서 마케팅</Grid>
              <Grid container className="main-text">
                        여러분의 상품과 서비스를 인플루언서를 통해 일려보세요.
                <br />
                        유튜버와 인스타그래머, 블로거들이 상세히 알려드릴
                <br />
                        준비를 하고 있습니다.
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

export default Test;
