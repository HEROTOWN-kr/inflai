import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Checkbox, CircularProgress, Grid } from '@material-ui/core';
import Common from '../../lib/common';
import NameArray from '../../lib/nameArray';
import InfoYoutube from './InfoYoutube';

function InfoInfluencer(props) {
  const { editProfile, userData, setUserData } = props;
  const { token } = Common.getUserInfo();

  function updateData(checked) {
    const apiObj = { token };
    apiObj.message = checked ? 1 : 0;
    setUserData({ ...userData, INF_MESSAGE: apiObj.message });
    axios.post('/api/TB_INFLUENCER/updateInfo', apiObj).then((res) => {
      if (res.data.code === 200) {

      } else if (res.data.code === 401) {
        alert(res.data);
      } else {
        alert(res.data);
      }
    }).catch(error => (error));
  }

  return (
    <React.Fragment>
      <Grid container spacing={2} className="form-text">
        <Grid item xs={12}>
          <div className="label">이메일 아이디</div>
          <Grid container justify="space-between" alignItems="center">
            <Grid item className="info-text">{userData.INF_EMAIL}</Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <div className="label">이름</div>
              <Grid container justify="space-between" alignItems="center">
                <Grid item className="info-text">{userData.INF_NAME}</Grid>
                <Grid item className="change-button" onClick={() => editProfile('nickName')}>수정</Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="label">전화번호</div>
              <Grid container justify="space-between" alignItems="center">
                <Grid item className="info-text">{userData.INF_TEL}</Grid>
                <Grid item className="change-button" onClick={() => editProfile('phone')}>수정</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <div className="label">주소</div>
              <Grid container justify="space-between" alignItems="center">
                <Grid item className="info-text">{`${NameArray.city()[userData.INF_CITY]} ${NameArray.area()[userData.INF_CITY][userData.INF_AREA]}`}</Grid>
                <Grid item className="change-button" onClick={() => editProfile('country region')}>수정</Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="label">제품, 서비스</div>
              <Grid container justify="space-between" alignItems="center">
                <Grid item className="info-text">{userData.INF_PROD}</Grid>
                <Grid item className="change-button" onClick={() => editProfile('product')}>수정</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {
          userData.INF_BLOG_URL ? (
            <Grid item xs={12}>
              <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
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
          ) : null
        }
        <Grid item xs={12}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <div className="label">알림</div>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <input id="kakaoCheck" type="checkbox" checked={userData.INF_MESSAGE} style={{ margin: '0' }} onChange={e => updateData(e.target.checked)} />
                  <label htmlFor="kakaoCheck">
                    {' 카카오톡 통한 캠페인 모집 및 추천, 이벤트 정보 등의 수신에 동의합니다.'}
                  </label>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default InfoInfluencer;
