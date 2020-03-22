import axios from 'axios';
import React from 'react';
import { Button } from '@material-ui/core';
import { GoogleLogout } from 'react-google-login';
import Common from '../../lib/common';

function LogOutButton(props) {
  const kakaoLogOut = (e) => {
    e.preventDefault();
    window.Kakao.Auth.logout((res) => {
      props.changeUser({ token: null, name: '', social_type: '' });
    });
  };

  const twitchLogOut = (e) => {
    e.preventDefault();
    const token = Common.getToken();
    if (token) {
      const url = `https://id.twitch.tv/oauth2/revoke?client_id=hnwk0poqnawvjedf2nxzaaznj16e1g&token=${token}`;
      // POST https://id.twitch.tv/oauth2/revoke?client_id=uo6dggojyb8d6soh92zknwmi5ej1q2&token=0123456789abcdefghijABCDEFGHIJ
      axios.post(url
        /* {
                  client_id: 'hnwk0poqnawvjedf2nxzaaznj16e1g',
                  token: 'hc632de3r22mvr6dze94t17rozb3lw'
                } */).then((res) => {
        // console.log(res);
        if (res) {
          console.log(res);
        }
      });
    }
    props.changeUser({ token: null, name: '', social_type: '' });
  };

  return (
    <React.Fragment>
      {
                {
                  facebook: <Button onClick={(e) => { e.preventDefault(); window.FB.logout(); props.changeUser({ token: null, name: '', social_type: '' }); }} className="login-button">LogOut</Button>,
                  google: <GoogleLogout
                    clientId="997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com"
                    buttonText="Logout"
                    onLogoutSuccess={() => { props.changeUser({ token: null, name: '', social_type: '' }); }}
                  />,
                  kakao: <button onClick={kakaoLogOut}>Logout</button>,
                  twitch: <button onClick={twitchLogOut}>Logout</button>,
                  noSocial: <button onClick={e => props.changeUser({ token: null, name: '', social_type: '' })}>LogoutSample</button>
                }[props.user.social_type]
            }
    </React.Fragment>
  );
}

export default LogOutButton;
