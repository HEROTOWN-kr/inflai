import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Grid } from '@material-ui/core';
import Common from '../../lib/common';
import NameArray from '../../lib/nameArray';

function InfoInfluencer({
  editProfile
}) {
  const { token } = Common.getUserInfo();
  const [userData, setUserData] = useState({});
  const [process, setProcess] = useState(true);

  useEffect(() => {
    axios.get('/api/TB_INFLUENCER/userInfo', {
      params: { token }
    }).then((res) => {
      console.log(res);
      const { data, instaInfo } = res.data;
      setUserData({ ...data, INF_BLOG_URL: instaInfo.username });
      setProcess(false);
    });
  }, []);

  return (
    <React.Fragment>
      {process ? (
        <Grid item>
          <CircularProgress />
        </Grid>
      ) : (
        <React.Fragment>
          <div className="title">
              계정정보
          </div>
          <Grid container spacing={2} className="form-text">
            <Grid item xs={12}>
              <div className="label">이메일 아이디</div>
              <Grid container justify="space-between" alignItems="center">
                <Grid item className="info-text">{userData.INF_EMAIL}</Grid>
                <Grid item className="change-button" onClick={() => editProfile()}>수정</Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <div className="label">이름</div>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item className="info-text">{userData.INF_NAME}</Grid>
                    <Grid item className="change-button" onClick={() => editProfile()}>수정</Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <div className="label">전화번호</div>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item className="info-text">{userData.INF_TEL}</Grid>
                    <Grid item className="change-button" onClick={() => editProfile()}>수정</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <div className="label">주소</div>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item className="info-text">{`${NameArray.city()[userData.INF_CITY]} ${NameArray.area()[userData.INF_CITY][userData.INF_AREA]}`}</Grid>
                    <Grid item className="change-button" onClick={() => editProfile()}>수정</Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <div className="label">제품, 서비스</div>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item className="info-text">{userData.INF_PROD}</Grid>
                    <Grid item className="change-button" onClick={() => editProfile()}>수정</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Grid container spacing={5}>
                  <Grid item xs={6}>
                    <div className="label">블로그 플로필</div>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item className="info-text">
                        {userData.INF_BLOG_URL}
                      </Grid>
                      <Grid item>
                        <a href={`https://www.instagram.com/${userData.INF_BLOG_URL}/`} target="_blank">
                          <div className="change-button">보기</div>
                        </a>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default InfoInfluencer;
