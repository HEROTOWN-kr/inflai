import React, { useEffect, useState } from 'react';
import NaverLogin from 'react-naver-login';
import * as Yup from 'yup';
import {
  Box, Button, FormControl, FormControlLabel, FormHelperText, Grid, Radio, RadioGroup, SvgIcon, Icon
} from '@material-ui/core';
import { Formik } from 'formik';
import YouTubeIcon from '@material-ui/icons/YouTube';
import InstagramIcon from '@material-ui/icons/Instagram';
import AssessmentIcon from '@material-ui/icons/Assessment';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import NaverIcon from '../../../img/icons/naver.png';
import Influencer from '../../../img/influencer.png';
import Advertiser from '../../../img/advertiser.png';
import Common from '../../../lib/common';
import InstagramDialog from './InstagramDialog';
import YoutubeDialog from './YoutubeDialog';
import InstagramSelectDialog from './InstagramSelectDialog';

function InfluencerSns({
  changeUser,
  userData,
  changeUserData,
  goTo,
  history
}) {
  const { search } = document.location;
  const [instaDialogOpen, setInstaDialogOpen] = useState(false);
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [instaAccounts, setInstaAccounts] = useState([]);
  const [instaSelectDialogOpen, setInstaSelectDialogOpen] = useState(false);


  function toggleInstaDialog() {
    setInstaDialogOpen(!instaDialogOpen);
  }

  function toggleYoutubeDialog() {
    setYoutubeDialogOpen(!youtubeDialogOpen);
  }


  function parseParms(str) {
    const pieces = str.split('&');
    const data = {};
    let i;
    let parts;
    // process each query pair
    for (i = 0; i < pieces.length; i++) {
      parts = pieces[i].split('=');
      if (parts.length < 2) {
        parts.push('');
      }
      data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    }
    return data;
  }

  function getNaverInfo(url) {
    const decodedURL = decodeURIComponent(url);
    const urlObj = parseParms(decodedURL.slice(1));
    console.log(urlObj);

    axios.get('/api/TB_INFLUENCER/naverSignUp', {
      params: urlObj
    }).then((res) => {
      console.log(res);
    });
  }

  useEffect(() => {
    if (search) {
      getNaverInfo(search);
    }
  }, []);


  const GoogleButtonRef = React.useRef(null);
  const NaverButtonRef = React.useRef(null);

  const types = [
    {
      text: 'Youtube',
      value: '1',
      icon: YouTubeIcon
    },
    {
      text: 'Instagram',
      value: '2',
      icon: InstagramIcon,
      addClass: 'instagram',
    },
    {
      text: 'Blog',
      value: '3',
      icon: AssessmentIcon,
      addClass: 'blog'
    }
  ];

  function selectAccountDialog() {
    setInstaSelectDialogOpen(!instaSelectDialogOpen);
  }

  async function addInstagram(selectedId) {
    window.FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        const { accessToken, userID } = response.authResponse;
        axios.post('/api/TB_INFLUENCER/instaLogin', {
          facebookToken: accessToken,
          facebookUserId: userID,
          instaId: selectedId
        }).then((res) => {
          if (res.status === 200) {
            changeUser({
              social_type: res.data.social_type,
              type: '2',
              token: res.data.userToken,
              name: res.data.userName,
              regState: res.data.regState
            });
            history.push('/profile');
          }
        }).catch(err => alert(err.response.data));
      } else {
        alert('The user isn\'t logged in to Facebook');
      }
    });
  }

  function facebookLogin() {
    window.FB.login((loginRes) => {
      if (loginRes.status === 'connected') {
        const { accessToken, userID } = loginRes.authResponse;

        axios.post('/api/TB_INFLUENCER/facebookLogin', {
          facebookToken: accessToken,
          facebookUserId: userID
        }).then((res) => {
          if (res.status === 200) {
            if (res.data.userPhone) {
              changeUser({
                social_type: res.data.social_type,
                type: '2',
                token: res.data.userToken,
                name: res.data.userName,
                regState: res.data.regState
              });
              history.push('/');
            } else {
              changeUser({
                social_type: res.data.social_type,
                type: '2',
                token: res.data.userToken,
                name: res.data.userName,
                regState: res.data.regState
              });
              history.push('/profile');
            }
          }
          if (res.status === 202) {
            setInstaAccounts(res.data.data);
            selectAccountDialog();
          }
        }).catch((err) => {
          alert(err.response.data.message);
        });
      } else {
        console.log('not connected');
      }
    }, { scope: 'public_profile, email, manage_pages, instagram_basic, instagram_manage_insights' });
  }

  function clickSns(sns) {
    switch (sns) {
      case 'Instagram': {
        toggleInstaDialog();
        break;
      }
      case 'Youtube': {
        toggleYoutubeDialog();
        break;
      }
      case 'Blog': {
        NaverButtonRef.current.click();
        break;
      }
      default: {
        break;
      }
    }
  }

  function StyledRadio({
    item,
    selected
  }) {
    return (
      <Grid container className={`card ${item.addClass ? item.addClass : null}`} justify="center" onClick={() => clickSns(item.text)}>
        <Grid item>
          <Box>
            <SvgIcon component={item.icon} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <p>{item.text}</p>
        </Grid>
      </Grid>
    );
  }

  const responseGoogle = (response) => {
    if (!response.error) {
      axios.get('/api/TB_INFLUENCER/youtubeSignUp', {
        params: {
          code: response.code,
          host: window.location.host,
        }
      }).then((res) => {
        if (res.data.userPhone) {
          changeUser({
            social_type: res.data.social_type,
            type: '2',
            token: res.data.userToken,
            name: res.data.userName,
            regState: res.data.regState
          });
          history.push('/');
        } else {
          goTo(`/detail/${res.data.userId}`);
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      console.log('google auth error');
    }
  };

  function responseNaver(response) {
    const { user } = response;
    axios.get('/api/TB_INFLUENCER/naverSignUp', {
      params: {
        email: user.email,
        naverId: user.id,
        name: user.name
      }
    }).then((res) => {
      if (res.data.userPhone) {
        changeUser({
          social_type: res.data.social_type,
          type: '2',
          token: res.data.userToken,
          name: res.data.userName,
          regState: res.data.regState
        });
        history.push('/');
      } else {
        goTo(`/detail/${res.data.userId}`);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className="join-sns">
      <Box py={4}>
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
        <NaverLogin
          clientId="KyWNbHHgcX4ZcIagGtBg"
                // callbackUrl="http://127.0.0.1:3000/Join/Influencer/sns"
          callbackUrl={`${window.location.origin}/Join/Influencer/sns`}
          render={props => <div ref={NaverButtonRef} onClick={props.onClick} style={{ display: 'none' }}>Naver Login</div>}
          isPopup="true"
          onSuccess={result => responseNaver(result)}
          onFailure={result => responseNaver(result)}
        />
        {/* <a href="https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=4rBF5bJ4y2jKn0gHoSCf&redirect_uri=http://127.0.0.1:3000/Join/Influencer/sns&state=hLiDdL2uhPtsftcU">naverlink</a> */}
        <InstagramDialog open={instaDialogOpen} closeDialog={toggleInstaDialog} facebookLogin={facebookLogin} />
        <InstagramSelectDialog
          open={instaSelectDialogOpen}
          closeDialog={selectAccountDialog}
          instaAccounts={instaAccounts}
          connectAccount={addInstagram}
        />
        <YoutubeDialog open={youtubeDialogOpen} closeDialog={toggleYoutubeDialog} googleLogin={() => GoogleButtonRef.current.click()} />
        <div className="title">인플루언서 유형을 선택해주세요</div>
        <Grid container spacing={1}>
          {types.map(item => (
            <Grid item xs={12} md={4} key={item.value}>
              <StyledRadio item={item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default InfluencerSns;
