import React from 'react';
import Grid from '@material-ui/core/Grid';


import { Link } from 'react-router-dom';
import Logo from '../../img/logo.png';

function Footer() {
  return (
    <div className="footer">
      <Grid container justify="center">
        <Grid item md={9} lg={6}>
          <Grid container>
            <Grid item xs={2}>
              <img src={Logo} />
            </Grid>
            <Grid item xs={10}>
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
              <div className="info">
                <div>대표 : 김무성 | 주소 : 경기도 고양시 일산동구 백마로 195 엠시티 섹션동 4층 4003호</div>
                <div>대표전화 : 1522-7947  | Mail : myfna@naver.com</div>
              </div>
              <div>Copyright © INFLAi. All Rights Reserved.</div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Footer;
