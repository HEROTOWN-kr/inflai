import React from 'react';
import Grid from '@material-ui/core/Grid';


import Logo from '../../img/logo.png';

function Footer() {
  return (
    <div className="footer">
      <Grid container justify="center">
        <Grid container md={9} lg={6}>
          <Grid xs={2}>
            <img src={Logo} />
          </Grid>
          <Grid xs={10}>
            <div className="rules">이용약관 | 개인정보 처리방침</div>
            <div className="info">
              <div>대표 : 김무성 | 주소 : 경기도 고양시 일산동구 백마로 195 엠시티 섹션동 4층 4003호</div>
              <div>대표전화 : 1522-7947  | Mail : myfna@naver.com</div>
            </div>
            <div>Copyright © INFLAi. All Rights Reserved.</div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Footer;
