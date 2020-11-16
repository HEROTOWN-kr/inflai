import axios from 'axios';
import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import Common from '../../lib/common';
import AuthContext from '../../context/AuthContext';

function LogOutButton(props) {
  const { socialType, logout } = useContext(AuthContext);

  const kakaoLogOut = (e) => {
    e.preventDefault();
    window.Kakao.Auth.logout((res) => {
      logout();
      props.history.push('/');
    });
  };

  const twitchLogOut = (e) => {
    e.preventDefault();
    const token = Common.getToken();
    if (token) {
      const url = `https://id.twitch.tv/oauth2/revoke?client_id=hnwk0poqnawvjedf2nxzaaznj16e1g&token=${token}`;
      axios.post(url).then((res) => {
        if (res) {
          console.log(res);
        }
      });
    }
    logout();
    props.history.push('/');
  };

  const googleLogOut = (e) => {
    e.preventDefault();
    window.gapi.load('auth2', () => {
      const auth2 = window.gapi.auth2.getAuthInstance({
        client_id: '997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com'
      });
      if (auth2) {
        auth2.disconnect();
        logout();
        props.history.push('/');
      } else {
        logout();
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
              e.preventDefault();
              window.FB.logout();
              logout();
              props.history.push('/');
            }}
            className="login-button"
          >
            로그아웃
          </Button>,
          google: <Button variant="contained" color="secondary" className="login-button" onClick={googleLogOut}>로그아웃</Button>,
          kakao: <Button variant="contained" color="secondary" className="login-button" onClick={kakaoLogOut}>로그아웃</Button>,
          twitch: <Button variant="contained" color="secondary" className="login-button" onClick={twitchLogOut}>로그아웃</Button>,
          noSocial: <Button
            variant="contained"
            color="secondary"
            className="login-button"
            onClick={(e) => {
              logout();
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
              logout();
              props.history.push('/');
            }}
          >
            로그아웃
          </Button>
        }[socialType]
      }
    </React.Fragment>
  );
}

export default LogOutButton;
