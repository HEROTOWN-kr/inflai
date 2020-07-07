import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Rectangle from '../../img/rectangle.png';

function Service({
  CategoryIcons,
  InfluenserIcons
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box px={4} py={{ xs: 8, md: 32 }} className="service">
      <Box mb={{ xs: 4, md: 16 }} className="main-text">INFLAi</Box>
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
    </Box>
  );
}

export default Service;
