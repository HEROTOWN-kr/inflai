import React from 'react';
import { Grid, Paper, Box } from '@material-ui/core';

function ProductCreate(props) {
  const { history } = props;

  return (
    <Box px={{ xs: 3, md: 6 }} py={{ xs: 5, md: 8 }} className="product select-reg-type">
      <Grid container spacing={3} className="title">
        <Grid item xs={12} className="main-title">
                      매칭형 인플루언서 마케팅
        </Grid>
        <Grid item xs={12} className="main-title second">
                      메가급부터 마이크로, 나노급 까지!
        </Grid>
        <Grid item xs={12} className="main-title third">
                      브랜드의 마케팅 목적에 맞춰 최적의 인플루언서를 매칭하고 캠페인을 설계해보세요!
        </Grid>
      </Grid>
      <Grid container className="cards">
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Paper elevation={3}>
                <div className="content" onClick={() => history.push('/Campaign/Create')}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} className="content-title">다이렉트 마케팅</Grid>
                    <Grid item xs={12} className="content-description">
                                합리적인 가격으로 신속하게!
                      <br />
                              직접 인플루언서 마케팅을 진행하세요.
                    </Grid>
                  </Grid>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={3}>
                <div className="content" onClick={() => history.push('/Campaign/Agency')}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} className="content-title">마케팅 대행 요청</Grid>
                    <Grid item xs={12} className="content-description">
                            전략 기획부터 마케팅의 과정을 인플라이
                      <br />
                             마케팅 전문가들과 함께 진행하세요.
                    </Grid>
                  </Grid>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductCreate;
