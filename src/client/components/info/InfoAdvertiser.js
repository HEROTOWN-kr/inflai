import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@material-ui/core';
import axios from 'axios';
import Common from '../../lib/common';

function InfoAdvertiser({
  editProfile
}) {
  const { token } = Common.getUserInfo();
  const [userData, setUserData] = useState({});
  const [process, setProcess] = useState(true);

  useEffect(() => {
    axios.get('/api/TB_ADVERTISER/userInfo', {
      params: { token }
    }).then((res) => {
      // console.log(res);
      const { data } = res.data;
      setUserData(data);
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
                <Grid item className="info-text">{userData.ADV_EMAIL}</Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <div className="label">담당자</div>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item className="info-text">{userData.ADV_NAME}</Grid>
                    <Grid item className="change-button" onClick={() => editProfile('name')}>수정</Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <div className="label">회사명</div>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item className="info-text">{userData.ADV_COM_NAME}</Grid>
                    <Grid item className="change-button" onClick={() => editProfile('companyName')}>수정</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <div className="label">기업구분</div>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item className="info-text">{userData.ADV_TYPE}</Grid>
                    <Grid item className="change-button" onClick={() => editProfile('jobType')}>수정</Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <div className="label">사업자구분</div>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item className="info-text">{userData.ADV_CLASS}</Grid>
                    <Grid item className="change-button" onClick={() => editProfile('classification')}>수정</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Grid container spacing={5}>
                  <Grid item xs={6}>
                    <div className="label">담당자 연락처</div>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item className="info-text">{userData.ADV_TEL}</Grid>
                      <Grid item className="change-button" onClick={() => editProfile('phone')}>수정</Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="label">사업자 등록번호</div>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item className="info-text">{userData.ADV_REG_NUM}</Grid>
                      <Grid item className="change-button" onClick={() => editProfile('registerNumber')}>수정</Grid>
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

export default InfoAdvertiser;
