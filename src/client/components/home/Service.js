import React from 'react';
import { Box, Grid, Hidden } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Slider from 'react-slick';
import Rectangle from '../../img/rectangle.png';

function Service({
  CategoryIcons,
  InfluenserIcons
}) {
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
        breakpoint: 959,
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
    <Box px={4} py={{ xs: 8, md: 32 }} className="service">
      <Box mb={{ xs: 2, md: 16 }} className="main-text">INFLAi</Box>
      <Hidden smDown>
        <Grid container justify={matches ? 'space-between' : 'center'}>
          <Grid item sm={10} md={5}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className="category-name">
                  <img src={Rectangle} />
                  인플루언서로 최적의 효과를
                  <br />
                  보는 카테고리
                </div>
              </Grid>
              {
                Object.keys(CategoryIcons).map(Row => (
                  <Grid key={Row} item xs={12}>
                    <Grid container justify="space-between">
                      {CategoryIcons[Row].map(i => (
                        <Grid key={i} item className="category-image">
                          <img src={i} alt="image" />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                ))
              }
            </Grid>
          </Grid>
          <Grid item sm={10} md={5}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className="category-name">
                  <img src={Rectangle} />
                  우리 플랫폼의 인플루언서들
                </div>
              </Grid>
              {
                Object.keys(InfluenserIcons).map(Row => (
                  <Grid key={Row} item xs={12}>
                    <Grid container justify="space-between">
                      {InfluenserIcons[Row].map(i => (
                        <Grid key={i} item className="category-image">
                          <img src={i} alt="image" className="image-influencer" />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                ))
              }
            </Grid>
          </Grid>
        </Grid>
      </Hidden>
      <Slider {...settings}>
        <div>
          <Box p={3}>
            <Grid container justify="center" spacing={4}>
              <Grid item xs={12}>
                <div className="category-name">
                  <img src={Rectangle} />
                  인플루언서로 최적의 효과를
                  <br />
                  보는 카테고리
                </div>
              </Grid>
              {
                Object.keys(CategoryIcons).map(Row => (
                  <Grid key={Row} item xs={12} sm={8}>
                    <Grid container justify="space-between">
                      {CategoryIcons[Row].map(i => (
                        <Grid key={i} item className="category-image">
                          <img src={i} alt="image" />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                ))
              }
            </Grid>
          </Box>
        </div>
        <div>
          <Box p={3}>
            <Grid container justify="center" spacing={4}>
              <Grid item xs={12}>
                <div className="category-name">
                  <img src={Rectangle} />
                  우리 플랫폼의 인플루언서들
                </div>
              </Grid>
              {
                Object.keys(InfluenserIcons).map(Row => (
                  <Grid key={Row} item xs={12} sm={10}>
                    <Grid container justify="space-between">
                      {InfluenserIcons[Row].map(i => (
                        <Grid key={i} item className="category-image">
                          <img src={i} alt="image" className="image-influencer" />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                ))
              }
            </Grid>
          </Box>
        </div>
      </Slider>

    </Box>
  );
}

export default Service;
