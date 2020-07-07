import React from 'react';
import { Box, Grid } from '@material-ui/core';
import RatingImage from '../../img/rating.png';

function Rating({
  FontSettings
}) {
  return (
    <Box py={{ xs: 10, md: 30 }} className="rating">
      <Grid container justify="center">
        <Grid container spacing={3} item className="rating-container">
          <Grid item xs={12}>
            <img src={RatingImage} />
          </Grid>
          <Grid item xs={12}>
            <div className="title">
                          마케팅이 끝나고
              <br />
              <span style={FontSettings.blue}>인플루언서 활동 만족도 체크</span>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="main-text">
                          별점만족도조사를 통하여 지속적인 사후체크 및 마케팅효과 상승을 유도합니다
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Rating;
