import React, { useEffect, useState } from 'react';
import { Box, Grid, InputBase } from '@material-ui/core';
import axios from 'axios';
import StyledText from '../../containers/StyledText';
import StyledImage from '../../containers/StyledImage';
import instagramIcon from '../../../img/instagram.png';
import youtubeIcon from '../../../img/youtube.png';
import InstagramDialog from '../../join/inf-join/InstagramDialog';
import Common from '../../../lib/common';
import InstagramSelectDialog from '../../join/inf-join/InstagramSelectDialog';

function Sns(props) {
  const { userInfo, getUserInfo } = props;
  const { TB_INSTum, TB_YOUTUBE } = userInfo;
  const { INS_ID, INS_USERNAME, INS_DT } = TB_INSTum || {};
  const { token } = Common.getUserInfo();

  const [instaDialogOpen, setInstaDialogOpen] = useState(false);
  const [instaSelectDialogOpen, setInstaSelectDialogOpen] = useState(false);
  const [instaAccounts, setInstaAccounts] = useState([]);

  async function instagramAction() {
    if (!INS_ID) {
      setInstaDialogOpen(!instaDialogOpen);
    } else {
      axios.post('/api/TB_INSTA/delete', {
        id: INS_ID
      }).then((res) => {
        getUserInfo();
      }).catch(err => alert(err.message));
    }
  }

  function selectAccountDialog() {
    setInstaSelectDialogOpen(!instaSelectDialogOpen);
  }

  function findInstagramAccounts(accessToken, userID) {
    axios.post('/api/TB_INSTA/add', {
      facebookToken: accessToken,
      facebookUserId: userID,
      token
    }).then((res) => {
      if (res.status === 200) getUserInfo();
      if (res.status === 202) {
        setInstaAccounts(res.data.data);
        selectAccountDialog();
      }
    }).catch(err => alert(err.response.data.message));
  }

  function facebookLogin() {
    window.FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        const { accessToken, userID } = response.authResponse;
        findInstagramAccounts(accessToken, userID);
      } else {
        window.FB.login((loginRes) => {
          if (loginRes.status === 'connected') {
            const { accessToken, userID } = loginRes.authResponse;
            findInstagramAccounts(accessToken, userID);
          } else {
            alert('not connected');
          }
        }, { scope: 'pages_manage_engagement, public_profile, email, instagram_basic, instagram_manage_insights' });
      }
    }, true);
  }

  async function addInstagram(selectedId) {
    window.FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        const { accessToken, userID } = response.authResponse;
        axios.post('/api/TB_INSTA/add', {
          facebookToken: accessToken,
          facebookUserId: userID,
          token,
          instaId: selectedId
        }).then((res) => {
          getUserInfo();
        }).catch(err => alert(err.response.data));
      } else {
        alert('The user isn\'t logged in to Facebook');
      }
    });
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
          <Grid item xs={4}>
            <Box py={2} px={4} border="1px solid #e9ecef" css={{ cursor: 'pointer' }} onClick={() => instagramAction()}>
              <Grid container justify="center" spacing={1}>
                <Grid item>
                  <StyledImage width="18px" height="18px" src={instagramIcon} />
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
          <Grid item xs={4}>
            <Box py={2} px={4} border="1px solid #e9ecef" css={{ cursor: 'pointer' }}>
              <Grid container justify="center" spacing={1}>
                <Grid item>
                  <StyledImage width="24px" height="18px" src={youtubeIcon} />
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
          <Grid item xs={5}>
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
      <InstagramSelectDialog
        open={instaSelectDialogOpen}
        closeDialog={selectAccountDialog}
        instaAccounts={instaAccounts}
        connectAccount={addInstagram}
      />
    </Grid>
  );
}

export default Sns;
