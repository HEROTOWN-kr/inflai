import React from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dot from '../../img/dot.png';
import Laptop from '../../img/Laptop3.png';

function Profit({
  Profits,
  FontSettings
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const allCategories = Profits.leftCategory.concat(Profits.rightCategory);

  return (
    <Box px={4} py={{ xs: 8, md: 20 }} className="profit">
      <div className="profit-container">
        <Box className="title">
          데이터 기반 정보마케팅
          <span>을 통한 ROI 상승</span>
        </Box>
        <Box my={{ xs: 2, md: 6 }} className="main-text">
          우리의 알고리즘은 당신의 제품을 가장 우수하고 가장 관련성이 높은 인플루언서와 매칭시켜,
          결과적으로 최종 소비자에게 좋은 영향을 주게됩니다.
          인플루언서들에게 우리는 그들의 팔로워들이 좋아할 서비스나 제품을 제공합니다.
        </Box>
        <Grid container spacing={matches ? 6 : 2}>
          <Grid item xs={12} className="detail">
            <Box py={6}>
              <Grid container justify="space-between">
                <Grid item xs={5} md={3}>
                  <Grid container spacing={4} style={FontSettings.textRight}>
                    {Profits.leftCategory.map(item => (
                      <Grid key={item.name} item xs={12}>
                        <div className="profit-name">
                          {item.name}
                          <img src={Dot} />
                        </div>
                        <div className="profit-desc">
                          {item.desc}
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={5} className="laptop">
                  <Grid container alignItems="center" style={{ height: '100%' }}>
                    <img src={Laptop} alt="" />
                  </Grid>
                </Grid>
                <Grid item xs={5} md={3}>
                  <Grid container spacing={4}>
                    {Profits.rightCategory.map(item => (
                      <Grid key={item.name} item xs={12}>
                        <div className="profit-name">
                          {item.name}
                          <img className="left" src={Dot} />
                        </div>
                        <div className="profit-desc">
                          {item.desc}
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} className="detail-mobile">
            <Grid container spacing={2}>
              {allCategories.map(item => (
                <Grid key={item.name} item xs={6}>
                  <Box p={{ xs: 2, sm: 4 }} className="card">
                    <div className="profit-name">{item.name}</div>
                    <div className="profit-desc">{item.desc}</div>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Grid item>
                <Button variant="outlined" className="func-button">Read More</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}

export default Profit;
