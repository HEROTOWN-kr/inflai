import React from 'react';
import Grid from '@material-ui/core/Grid';


import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import Logo from '../../img/logo.png';

function Footer() {
  return (
    <Box py={6} className="footer">
      <Box px={2} className="footer-container">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3} className="footer-logo">
            <img src={Logo} />
          </Grid>
          <Grid item xs={12} sm={9} className="footer-text">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div className="rules">
                  <Link
                    className="link"
                    to="/Policy/Service"
                  >
                    이용약관
                  </Link>
                  {' | '}
                  <Link
                    className="link"
                    to="/Policy/Privacy"
                  >
                    개인정보 처리방침
                  </Link>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info">
                  <div>대표 : 김무성 | 주소 : 경기도 고양시 일산동구 백마로 195 엠시티 섹션동 4층 4003호</div>
                  <div>대표전화 : 1522-7947  | Mail : myfna@naver.com</div>
                  <div>사업자번호 : 695-81-00452</div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div>Copyright © INFLAi. All Rights Reserved.</div>
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={12} sm={3} className="footer-logo">
            <img src={Logo} />
          </Grid>
          <Grid item xs={12} sm={9} className="footer-text">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div className="rules">
                  <Link
                    className="link"
                    to="/Policy/Service"
                  >
                    이용약관
                  </Link>
                  {' | '}
                  <Link
                    className="link"
                    to="/Policy/Privacy"
                  >
                    개인정보 처리방침
                  </Link>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="info">
                  <div>대표 : 김무성 | 주소 : 경기도 고양시 일산동구 백마로 195 엠시티 섹션동 4층 4003호</div>
                  <div>대표전화 : 1522-7947  | Mail : myfna@naver.com</div>
                  <div>사업자번호 : 695-81-00452</div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div>Copyright © INFLAi. All Rights Reserved.</div>
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Box>
    </Box>
  );
}

export default Footer;
