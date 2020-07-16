import axios from 'axios';
import React, { useEffect } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GoogleLogin from 'react-google-login';
import { Box, Button, Grid } from '@material-ui/core';
import Common from '../../lib/common';

import Logo from '../../img/logo.png';
import LogInComponent from '../login/LogInComponent';
import SignUpComponent from '../login/SignUpComponent';
import SocialButton from '../login/SocialButton';
import GoogleIcon from '../../img/google-logo2.png';

{ /* <Button onClick={twitchLogin}>TwitchLogin</Button> */ }
{ /* <a onClick={test} href="https://id.twitch.tv/oauth2/authorize?client_id=hnwk0poqnawvjedf2nxzaaznj16e1g&redirect_uri=http://localhost:8080/testRoute/twiterTest&response_type=code&scope=user:edit+user:read:email">
                Sign In
              </a> */ }

{ /* <a href="https://id.twitch.tv/oauth2/authorize?client_id=hnwk0poqnawvjedf2nxzaaznj16e1g&redirect_uri=http://localhost:3000&response_type=token&scope=user:edit+user:read:email&force_verify=true">
                SignInLocal
              </a> */ }


{ /* <Grid container className="bar" alignItems="center">
          <Hidden mdDown>
            <Grid container xs={4} justify="flex-end" spacing={3}>
               <a
                href={googleLink}
              >
                Sign Google
              </a>
               <GoogleLogin
                clientId="997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com" // CLIENTID                buttonText="LOGIN WITH GOOGLE"
                scope="profile email https://www.googleapis.com/auth/youtube.readonly"
                responseType="code"
                accessType="offline"
                prompt="consent"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
              />
               <Button variant="contained" color="secondary" onClick={signGoogle}>Sign Google</Button>
            </Grid>
          </Hidden>
          <Hidden mdUp>
            <Grid container xs={6} justify="flex-end">
              <div onClick={toggleDrawer(true)} className="menu-icon">
                <MenuIcon />
              </div>
            </Grid>
          </Hidden>
          <Drawer anchor="right" open={openMenu} onClose={toggleDrawer(false)}>
            {sideList()}
          </Drawer>
        </Grid> */ }

function testFunction() {
  axios.get('/api/TB_INFLUENCER/rankYoutube', {
    params: {
      type: '2'
    }
  }).then((res) => {
    console.log(res);
  });
}


function addChannel() {
  window.Kakao.Channel.addChannel({
    channelPublicId: '_lxmhexb',
  });
}

/* useEffect(() => {
  function watchScroll() {
    window.addEventListener('scroll', logit);
  }
  watchScroll();
  logit();
  return () => {
    window.removeEventListener('scroll', logit);
  };
}); */

function logit() {
  if (props.history.location.pathname !== '/') {
    setActiveClass(' active');
  } else if (window.pageYOffset > 200) {
    setActiveClass(' active');
  } else {
    setActiveClass('');
  }
}

const { hash } = document.location;

useEffect(() => {
  if (hash) {
    getTwitchInfo(hash);
  }
}, []);


function getTwitchInfo(hash) {
  const decodedURL = decodeURIComponent(hash);
  const urlObj = parseParms(decodedURL.slice(1));
  // console.log(urlObj);
  const twitchToken = urlObj.access_token;
  Common.saveUserToken(twitchToken);
  const header = `Bearer ${twitchToken}`;

  axios.get('https://api.twitch.tv/helix/users', {
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
  });
}

const googleLink = 'https://accounts.google.com'
    + '/o/oauth2/v2/auth?'
    + 'scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly '
    + 'https://www.googleapis.com/auth/userinfo.profile '
    + 'https://www.googleapis.com/auth/userinfo.email&'
    // + 'profile email&'
    + 'access_type=offline&redirect_uri=http://localhost:8080/TB_ADVERTISER/Googletest1&'
    + 'response_type=code&'
    + 'client_id=997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com';

const sideList = () => (
  <div
    className={classes.list}
    role="presentation"
    onClick={toggleDrawer(false)}
    onKeyDown={toggleDrawer(false)}
  >
    {
            props.user.name ? (
              <UserMenuItems />
            ) : (
              <Box my={2}>
                <Grid container justify="center">
                  <Grid item xs={7}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => props.history.push('/Join/Type')}
                    >
                                로그인 | 회원가입
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )
        }
  </div>
);

function twitchLogin() {
  axios.get('https://id.twitch.tv/oauth2/authorize', {
    params: {
      client_id: 'hnwk0poqnawvjedf2nxzaaznj16e1g',
      redirect_uri: 'http://localhost:3000',
      response_type: 'token',
      scope: 'user:edit+user:read:email',
    }
  });
}

function scrollTo() {
  props.history.push('/');
  setTimeout(() => {
    Scroller.scrollTo('target', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      ignoreCancelEvents: true
    });
  }, 1);
}
