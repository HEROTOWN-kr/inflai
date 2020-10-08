import React, { useEffect, useState } from 'react';
import { Box, Grid, InputBase } from '@material-ui/core';
import axios from 'axios';
import StyledText from '../../containers/StyledText';
import StyledImage from '../../containers/StyledImage';
import instagramIcon from '../../../img/instagram.png';
import youtubeIcon from '../../../img/youtube.png';
import InstagramDialog from '../../join/inf-join/InstagramDialog';
import Common from '../../../lib/common';

function Sns(props) {
  const { userInfo } = props;
  const { TB_INSTum, TB_YOUTUBE } = userInfo;
  const { INS_ID, INS_USERNAME, INS_DT } = TB_INSTum || {};
  const { token } = Common.getUserInfo();

  const [instaDialogOpen, setInstaDialogOpen] = useState(false);

  function instagramAction() {
    if (!INS_ID) {
      setInstaDialogOpen(!instaDialogOpen);
    }
    console.log('delete instagram acc');
  }

  function facebookLogin() {
    window.FB.login((loginRes) => {
      if (loginRes.status === 'connected') {
        const { accessToken, userID } = loginRes.authResponse;
        axios.post('/api/TB_INSTA/add', {
          facebookToken: accessToken,
          facebookUserId: userID,
          token
        }).then((res) => {
          console.log(res);
        }).catch(err => alert(err.message));


        /* axios.post('/api/TB_INFLUENCER/instaSignUp', { facebookToken: accessToken }).then((res) => {
          if (res.data.code === 200) {
            if (res.data.userPhone) {
              changeUser({
                social_type: res.data.social_type,
                type: '2',
                token: res.data.userToken,
                name: res.data.userName,
                regState: res.data.regState
              });
            } else {
              goTo(`/detail/${res.data.userId}`);
            }
            // props.history.push(`${props.match.path}/instagram/${res.data.userId}`);
          } else if (res.data.code === 401) {
            console.log(res);
          } else {
            console.log(res);
          }
        }).catch(error => (error)); */
      } else {
        console.log('not connected');
      }
    }, { scope: 'public_profile, email, instagram_basic, manage_pages' });
  }

  async function deleteInstagram() {

  }

  async function addInstagram() {

  }


  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={2}>
            <StyledText fontSize="15">
                          인스타
            </StyledText>
          </Grid>
          <Grid item xs={3}>
            <Box py={2} px={4} border="1px solid #e9ecef" css={{ cursor: 'pointer' }} onClick={() => instagramAction()}>
              <Grid container justify="center" spacing={1}>
                <Grid item>
                  <StyledImage width="18" height="18" src={instagramIcon} />
                </Grid>
                <Grid item>
                  <StyledText>{INS_ID ? '인스타그램 연결 해제' : '인스타그램 연결하기'}</StyledText>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      {INS_ID ? (
        <Grid item xs={12}>
          <Grid container alignItems="center">
            <Grid item xs={2} />
            <Grid item xs={10}>
              <Box pb={2}>
                <StyledText fontSize="14">
                  {'연결한 계정: '}
                  <b>{INS_USERNAME}</b>
                </StyledText>
              </Box>
              <StyledText fontSize="13">{`${INS_DT}에 연결되었습니다`}</StyledText>
            </Grid>
          </Grid>
        </Grid>
      ) : null}
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={2}>
            <StyledText fontSize="15">
                          유튜브
            </StyledText>
          </Grid>
          <Grid item xs={3}>
            <Box py={2} px={4} border="1px solid #e9ecef" css={{ cursor: 'pointer' }}>
              <Grid container justify="center" spacing={1}>
                <Grid item>
                  <StyledImage width="24" height="18" src={youtubeIcon} />
                </Grid>
                <Grid item>
                  <StyledText>유튜브 연결하기</StyledText>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={2}>
            <StyledText fontSize="15">
                          네이버
            </StyledText>
          </Grid>
          <Grid item xs={4}>
            <Box py={1} px={2} border="1px solid #e9ecef">
              <InputBase
                fullWidth
                placeholder="http://블로그주소 또는 https://블로그주소"
                inputProps={{ 'aria-label': 'naked', style: { padding: '0' } }}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <InstagramDialog open={instaDialogOpen} closeDialog={instagramAction} facebookLogin={facebookLogin} userPage />
    </Grid>
  );
}

export default Sns;
