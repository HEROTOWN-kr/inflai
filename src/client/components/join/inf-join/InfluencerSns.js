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

function InfluencerSns({
  changeUser,
  userData,
  changeUserData,
  goTo,
  history
}) {
  const { search } = document.location;
  const [instaDialogOpen, setInstaDialogOpen] = useState(false);

  function toggleInstaDialog() {
    setInstaDialogOpen(!instaDialogOpen);
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
    /* const twitchToken = urlObj.access_token;
    Common.saveUserToken(twitchToken);
    const header = `Bearer ${twitchToken}`; */

    /* axios.get('https://api.twitch.tv/helix/users', {
      headers: { Authorization: header }
    }).then((res) => {
      // console.log(res);
      if (res.data) {
        axios.get('/api/TB_ADVERTISER/loginTwitch', {
          params: {
            id: res.data.data[0].id,
            email: res.data.data[0].email,
            name: res.data.data[0].display_name,
            type: '2',
            social_type: 'twitch'
          }
        }).then((res) => {
          console.log(res);
          props.changeUser({
            social_type: res.data.social_type,
            type: '2',
            token: res.data.userToken,
            name: res.data.userName,
          });
          props.history.push('/');
        });
      }
    }); */
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

  function facebookLogin() {
    window.FB.login((loginRes) => {
      if (loginRes.status === 'connected') {
        const { accessToken, userID } = loginRes.authResponse;

        axios.post('/api/TB_INFLUENCER/instaSignUp', { facebookToken: accessToken })
          .then((res) => {
            if (res.data.code === 200) {
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
              // props.history.push(`${props.match.path}/instagram/${res.data.userId}`);
            } else if (res.data.code === 401) {
              console.log(res);
            } else {
              console.log(res);
            }
          })
          .catch(error => (error));
      } else {
        console.log('not connected');
      }
    }, { scope: 'public_profile, email, instagram_basic, instagram_manage_insights, manage_pages' });
  }

  function clickSns(sns) {
    switch (sns) {
      case 'Instagram': {
        // facebookLogin();
        toggleInstaDialog();
        break;
      }
      case 'Youtube': {
        GoogleButtonRef.current.click();
        break;
      }
      case 'Blog': {
        NaverButtonRef.current.click();
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
          code: response.code
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
          clientId="4rBF5bJ4y2jKn0gHoSCf"
                // callbackUrl="http://127.0.0.1:3000/Join/Influencer/sns"
          callbackUrl={`${window.location.origin}/Join/Influencer/sns`}
          render={props => <div ref={NaverButtonRef} onClick={props.onClick} style={{ display: 'none' }}>Naver Login</div>}
          isPopup="true"
          onSuccess={result => responseNaver(result)}
          onFailure={result => responseNaver(result)}
        />
        {/* <a href="https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=4rBF5bJ4y2jKn0gHoSCf&redirect_uri=http://127.0.0.1:3000/Join/Influencer/sns&state=hLiDdL2uhPtsftcU">naverlink</a> */}
        <InstagramDialog open={instaDialogOpen} closeDialog={toggleInstaDialog} facebookLogin={facebookLogin} />
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
