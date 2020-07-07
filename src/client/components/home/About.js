import React from 'react';
import { Box, Grid, Hidden } from '@material-ui/core';
import AboutImage from '../../img/home-about.png';

function About({
  FontSettings
}) {
  return (
    <Box px={{ xs: 8 }} py={{ xs: 8, md: 32 }} className="about">
      <div className="about-container">
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs={12} md={8} className="about-image">
            <img src={AboutImage} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Grid container className="text" spacing={3}>
              <Hidden smDown>
                <Grid item xs={12} className="title">
                                      INFL
                  <span style={FontSettings.aqua}>Ai</span>
                </Grid>
                <Grid item xs={12} className="main-text">
                                      아직도 팔로워나
                  <br />
                                      좋아요 숫자에 연연하시나요?
                  <br />
                                      구매전환율이 높은
                  <br />
                                      인플루언서를 매칭해드립니다.
                </Grid>
                <Grid item xs={12} className="text-footer">
                                      AI 분석결과 추천된 인플루언서들은 다음과 같은 이유로
                  <br />
                                      INFLAI 의 우수성을 증명해줍니다.
                </Grid>
              </Hidden>
              <Hidden mdUp>
                <Grid item xs={12} className="title">
                                      INFL
                  <span style={FontSettings.aqua}>Ai</span>
                </Grid>
                <Grid item xs={12} className="main-text">
                        아직도 팔로워나 좋아요 숫자에 연연하시나요? 구매전환율이 높은 인플루언서를 매칭해드립니다.
                </Grid>
                <Grid item xs={12} className="text-footer">
                      AI 분석결과 추천된 인플루언서들은 다음과 같은 이유로 INFLAI 의 우수성을 증명해줍니다.
                </Grid>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}

export default About;
