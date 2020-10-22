import React, { useEffect, useState } from 'react';
import {
  Box, Button, Grid, InputBase
} from '@material-ui/core';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import { useForm } from 'react-hook-form';
import StyledText from '../../containers/StyledText';
import StyledImage from '../../containers/StyledImage';
import instagramIcon from '../../../img/instagram.png';
import youtubeIcon from '../../../img/youtube.png';
import InstagramDialog from '../../join/inf-join/InstagramDialog';
import Common from '../../../lib/common';
import InstagramSelectDialog from '../../join/inf-join/InstagramSelectDialog';
import YoutubeDialog from '../../join/inf-join/YoutubeDialog';
import StyledButton from '../../containers/StyledButton';
import { Colors } from '../../../lib/Сonstants';

function Sns(props) {
  const { userInfo, getUserInfo } = props;
  const { TB_INSTum, TB_YOUTUBE, TB_NAVER } = userInfo;
  const { INS_ID, INS_USERNAME, INS_DT } = TB_INSTum || {};
  const { YOU_ID, YOU_NAME, YOU_DT } = TB_YOUTUBE || {};
  const { NAV_ID, NAV_URL, NAV_DT } = TB_NAVER || {};
  const { token } = Common.getUserInfo();

  const {
    register, handleSubmit, watch, errors, setValue, control, getValues
  } = useForm();

  const [instaDialogOpen, setInstaDialogOpen] = useState(false);
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [instaSelectDialogOpen, setInstaSelectDialogOpen] = useState(false);
  const [instaAccounts, setInstaAccounts] = useState([]);

  async function instagramButtonClick() {
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

  const GoogleButtonRef = React.useRef(null);

  function toggleYoutubeDialog() {
    setYoutubeDialogOpen(!youtubeDialogOpen);
  }

  const responseGoogle = async (response) => {
    if (!response.error) {
      axios.post('/api/TB_YOUTUBE/add', {
        code: response.code,
        token
      }).then((res) => {
        getUserInfo();
      }).catch(error => alert(error.response.message));
    } else {
      alert('google auth error');
    }
  };

  function youtubeButtonClick() {
    if (!YOU_ID) {
      setYoutubeDialogOpen(!youtubeDialogOpen);
    } else {
      axios.post('/api/TB_YOUTUBE/delete', {
        id: YOU_ID
      }).then((res) => {
        getUserInfo();
      }).catch(err => alert(err.message));
    }
  }

  function naverButtonClick() {
    if (!NAV_ID) {
      const url = getValues('naverUrl');
      if (!url) {
        alert('네이버 주소를 입력해주세요');
      } else {
        axios.post('/api/TB_NAVER/add', {
          url,
          token
        }).then((res) => {
          getUserInfo();
        }).catch((error) => {
          alert(error.response.data.message);
        });
      }
    } else {
      axios.post('/api/TB_NAVER/delete', {
        id: NAV_ID
      }).then((res) => {
        getUserInfo();
      }).catch(err => alert(err.response.data.message));
    }
  }

  function selectAccountDialog() {
    setInstaSelectDialogOpen(!instaSelectDialogOpen);
  }

  function findInstagramAccounts(accessToken, userID) {
    const { FB } = window;

    FB.api('/me', 'GET', {
      fields: 'accounts{instagram_business_account{id,username,profile_picture_url}}'
    }, (response) => {
      const { data } = response.accounts;
      if (!data) {
        alert('페이스북 페이지에 연결된 인스타그램 계정이 없습니다');
      } else if (data && data.length > 1) {
        const accounts = data.map(item => item.instagram_business_account);
        setInstaAccounts(accounts);
        selectAccountDialog();
      } else {
        axios.post('/api/TB_INSTA/add', {
          facebookToken: accessToken,
          facebookUserId: userID,
          token,
          instaId: data[0].instagram_business_account.id
        }).then((res) => {
          getUserInfo();
        }).catch(err => alert(err.response.data));
      }
    });
  }

  async function facebookLogin() {
    const { FB } = window;

    FB.getLoginStatus((loginRes) => {
      if (loginRes.status === 'connected') {
        const { accessToken, userID } = loginRes.authResponse;
        findInstagramAccounts(accessToken, userID);
      } else {
        FB.login((loginRes2) => {
          if (loginRes2.status === 'connected') {
            const { accessToken, userID } = loginRes2.authResponse;
            findInstagramAccounts(accessToken, userID);
          } else {
            alert('not connected');
          }
        }, { scope: 'public_profile, email, manage_pages, instagram_basic, instagram_manage_insights' });
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
            <Box py={2} px={4} border="1px solid #e9ecef" css={{ cursor: 'pointer' }} onClick={() => instagramButtonClick()}>
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
            <Box py={2} px={4} border="1px solid #e9ecef" css={{ cursor: 'pointer' }} onClick={() => youtubeButtonClick()}>
              <Grid container justify="center" spacing={1}>
                <Grid item>
                  <StyledImage width="24px" height="18px" src={youtubeIcon} />
                </Grid>
                <Grid item>
                  <StyledText>{YOU_ID ? '유튜브 연결 해제' : '유튜브 연결하기'}</StyledText>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      {YOU_ID ? (
        <Grid item xs={12}>
          <Grid container alignItems="center">
            <Grid item xs={2} />
            <Grid item xs={10}>
              <Box pb={2}>
                <StyledText fontSize="14">
                  {'연결한 채널: '}
                  <b>{YOU_NAME}</b>
                </StyledText>
              </Box>
              <StyledText fontSize="13">{`${YOU_DT}에 연결되었습니다`}</StyledText>
            </Grid>
          </Grid>
        </Grid>
      ) : null}
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={2}>
            <StyledText fontSize="15">
                          네이버
            </StyledText>
          </Grid>
          <Grid item xs={7}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={9}>
                {NAV_ID ? (
                  <React.Fragment>
                    {NAV_URL}
                  </React.Fragment>
                ) : (
                  <Box py={1} px={2} border="1px solid #e9ecef">
                    <InputBase
                      name="naverUrl"
                      fullWidth
                      inputRef={register({ required: true })}
                      placeholder="http://블로그주소 또는 https://블로그주소"
                      inputProps={{ 'aria-label': 'naked', style: { padding: '0' } }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={3}>
                <StyledButton
                  height={38}
                  boxShadow="none"
                  padding="0 10"
                  background={Colors.blue2}
                  onClick={naverButtonClick}
                >
                  {NAV_ID ? '연결해제' : '연결하기'}
                </StyledButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <InstagramDialog open={instaDialogOpen} closeDialog={instagramButtonClick} facebookLogin={facebookLogin} userPage />
      <InstagramSelectDialog
        open={instaSelectDialogOpen}
        closeDialog={selectAccountDialog}
        instaAccounts={instaAccounts}
        connectAccount={addInstagram}
      />
      <YoutubeDialog open={youtubeDialogOpen} closeDialog={toggleYoutubeDialog} googleLogin={() => GoogleButtonRef.current.click()} />
      <GoogleLogin
        clientId="997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com" // CLIENTID                buttonText="LOGIN WITH GOOGLE"
        scope="profile email https://www.googleapis.com/auth/youtube.readonly"
        responseType="code"
        accessType="offline"
        prompt="consent"
        render={renderProps => (
          <button ref={GoogleButtonRef} onClick={renderProps.onClick} disabled={renderProps.disabled} style={{ display: 'none' }}>This is my custom Google button</button>
        )}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
      />
    </Grid>
  );
}

export default Sns;
