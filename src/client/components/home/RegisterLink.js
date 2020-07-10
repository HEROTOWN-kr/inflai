import React from 'react';
import {
  Button, Grid, Box, Hidden
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Slider from 'react-slick';
import Arrow from '../../img/arrow.png';
import Advertiser from '../../img/advert2.png';
import Influencer from '../../img/influencer.png';

function RegisterLink() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    // autoplay: true,
    dots: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 599,
        settings: { slidesToShow: 1, slidesToScroll: 1, infinite: false }
      },
      {
        breakpoint: 10000,
        settings: 'unslick'
      },
    ]
    // centerMode: true
  };

  return (
    <Box py={{ xs: 4, sm: 8 }} className="register-link">
      <div className="title-holder">
        <div className="main-title">서비스 둘러보기</div>
        <div className="second-title">INFLAi로 최적의 효과를 누려보세요</div>
        <img src={Arrow} className="arrow-image" />
      </div>


      <Box px={{ xs: 8, sm: 2 }} className="link-field">
        <Hidden xsDown>
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
        </Hidden>
        <Slider {...settings} className="register-link-slider">
          <div>
            <Box p={1}>
              <Box p={4} className="user-card">
                <img src={Advertiser} />
                <p>광고주</p>
                <Button variant="outlined" className="func-button">회원가입</Button>
              </Box>
            </Box>
          </div>
          <div>
            <Box p={1}>
              <Box p={4} className="user-card influencer">
                <img src={Influencer} />
                <p>인플루언서</p>
                <Button variant="outlined" className="func-button">회원가입</Button>
              </Box>
            </Box>
          </div>
        </Slider>
      </Box>
    </Box>
  );
}

export default RegisterLink;
