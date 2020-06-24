import axios from 'axios';
import React from 'react';
import { Button } from '@material-ui/core';
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import Common from '../../lib/common';

function LogOutButton(props) {
  const kakaoLogOut = (e) => {
    e.preventDefault();
    window.Kakao.Auth.logout((res) => {
      props.changeUser({
        token: null, name: '', social_type: '', type: '', regState: ''
      });
      props.history.push('/');
    });
  };

  const twitchLogOut = (e) => {
    e.preventDefault();
    const token = Common.getToken();
    if (token) {
      const url = `https://id.twitch.tv/oauth2/revoke?client_id=hnwk0poqnawvjedf2nxzaaznj16e1g&token=${token}`;
      // POST https://id.twitch.tv/oauth2/revoke?client_id=uo6dggojyb8d6soh92zknwmi5ej1q2&token=0123456789abcdefghijABCDEFGHIJ
      axios.post(url).then((res) => {
        // console.log(res);
        if (res) {
          console.log(res);
        }
      });
    }
    props.changeUser({
      token: null, name: '', social_type: '', type: '', regState: ''
    });
    props.history.push('/');
  };

  const googleLogOut = (e) => {
    e.preventDefault();
    window.gapi.load('auth2', () => {
      /* Ready. Make a call to gapi.auth2.init or some other API */
      /* window.gapi.auth2.getAuthInstance({
        client_id: '997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com'
      }); */
      const auth2 = window.gapi.auth2.getAuthInstance({
        client_id: '997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com'
      });
      if (auth2) {
        auth2.disconnect();
        props.changeUser({
          token: null, name: '', social_type: '', type: '', regState: ''
        });
        props.history.push('/');
      } else {
        props.changeUser({
          token: null, name: '', social_type: '', type: '', regState: ''
        });
        props.history.push('/');
      }
    });
  };

  return (
    <React.Fragment>
      {
                {
                  facebook: <Button
                    variant="contained"
                    color="secondary"
                    className="login-button"
                    onClick={(e) => {
                      e.preventDefault(); window.FB.logout(); props.changeUser({
                        token: null, name: '', social_type: '', type: '', regState: ''
                      });
                      props.history.push('/');
                    }}
                    className="login-button"
                  >
로그아웃
                            </Button>,
                  /* google: <GoogleLogout
                    clientId="997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com"
                    buttonText="Logout"
                    scope="profile email https://www.googleapis.com/auth/youtube.readonly"
                    accessType="offline"
                    onLogoutSuccess={() => { props.changeUser({ token: null, name: '', social_type: '', type: '', regState: ''  }); }}
                    render={renderProps => (
                      <Button className="login-button" onClick={renderProps.onClick} disabled={renderProps.disabled}>로그아웃</Button>
                    )}
                  />, */
                  google: <Button variant="contained" color="secondary" className="login-button" onClick={googleLogOut}>로그아웃</Button>,
                  kakao: <Button variant="contained" color="secondary" className="login-button" onClick={kakaoLogOut}>로그아웃</Button>,
                  twitch: <Button variant="contained" color="secondary" className="login-button" onClick={twitchLogOut}>로그아웃</Button>,
                  noSocial: <Button
                    variant="contained"
                    color="secondary"
                    className="login-button"
                    onClick={(e) => {
                      props.changeUser({
                        token: null, name: '', social_type: '', type: '', regState: ''
                      });
                      props.history.push('/');
                    }}
                  >
                  로그아웃
                  </Button>,
                  naver: <Button
                    variant="contained"
                    color="secondary"
                    className="login-button"
                    onClick={(e) => {
                      props.changeUser({
                        token: null, name: '', social_type: '', type: '', regState: ''
                      });
                      props.history.push('/');
                    }}
                  >
                    로그아웃
                  </Button>
                }[props.user.social_type]
            }
    </React.Fragment>
  );
}

export default LogOutButton;
