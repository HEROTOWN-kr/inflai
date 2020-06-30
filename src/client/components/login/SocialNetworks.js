import React from 'react';
import Grid from '@material-ui/core/Grid';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import NaverLogin from 'react-naver-login';
import axios from 'axios';
import SocialButton from './SocialButton';
import NaverIcon from '../../img/naver-icon.png';
import KakaoIcon from '../../img/kakao-logo.png';
import GoogleIcon from '../../img/google-logo2.png';
import FacebookIcon from '../../img/facebook-logo.png';
import TwitchIcon from '../../img/twitch-logo-white.png';


function SocialNetworks({
  changeUser,
  history
}) {
  let facebookID;
  if (window.location.host === 'www.inflai.com') {
    facebookID = '663450957780119';
  } else {
    facebookID = '139193384125564';
  }

  function responseGoogle(response) {
    if (response) {
      axios.get('/api/TB_ADVERTISER/loginGoogle', {
        params: {
          social_type: response.tokenObj.idpId,
          type: '1',
          token: response.tokenId
        }
      }).then((res) => {
        if (res.data.userPhone) {
          changeUser({
            social_type: res.data.social_type,
            type: '1',
            token: res.data.userToken,
            name: res.data.userName,
            regState: res.data.regState
          });
          history.push('/');
        } else {
          history.push(`/Join/Advertiser/SignUp/Detail/${res.data.userId}`);
        }
      });
    }
  }

  const responseFacebook = (response) => {
    if (response) {
      axios.get('/api/TB_ADVERTISER/loginFacebook', {
        params: {
          id: response.userID,
          email: response.email,
          name: response.name,
          type: '1',
          social_type: response.graphDomain
        }
      }).then((res) => {
        if (res.data.userPhone) {
          changeUser({
            social_type: res.data.social_type,
            type: '1',
            token: res.data.userToken,
            name: res.data.userName,
            regState: res.data.regState
          });
          history.push('/');
        } else {
          history.push(`/Join/Advertiser/SignUp/Detail/${res.data.userId}`);
        }
      });
    }
  };

  const responseNaver = (response) => {
    const { email, id, name } = response.user;
    if (response) {
      axios.get('/api/TB_ADVERTISER/loginNaver', {
        params: {
          id,
          email,
          name,
          type: '1',
          social_type: 'naver'
        }
      }).then((res) => {
        if (res.data.userPhone) {
          changeUser({
            social_type: res.data.social_type,
            type: '1',
            token: res.data.userToken,
            name: res.data.userName,
            regState: res.data.regState
          });
          history.push('/');
        } else {
          history.push(`/Join/Advertiser/SignUp/Detail/${res.data.userId}`);
        }
      });
    }
  };

  const kakaoLoginForm = () => {
    window.Kakao.Auth.loginForm({
      success(authObj) {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success(response) {
            axios.get('/api/TB_ADVERTISER/loginKakao', {
              params: {
                id: response.id,
                email: response.kakao_account.email,
                name: response.kakao_account.profile.nickname,
                type: '1',
                social_type: 'kakao'
              }
            }).then((res) => {
              if (res.data.userPhone) {
                changeUser({
                  social_type: res.data.social_type,
                  type: '1',
                  token: res.data.userToken,
                  name: res.data.userName,
                  regState: res.data.regState
                });
                history.push('/');
              } else {
                history.push(`/Join/Advertiser/SignUp/Detail/${res.data.userId}`);
              }
            });
          },
          fail(error) {
            console.log(JSON.stringify(error));
          }
        });
      },
      fail(err) {
        console.log(JSON.stringify(err));
      }
    });
    /* window.Kakao.Auth.login({
      // scope: 'friends',
      success(response) {
        console.log(response);
      },
      fail(error) {
        console.log(error);
      },
    }); */
  };


  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <GoogleLogin
            clientId="997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com" // CLIENTID
            buttonText="LOGIN WITH GOOGLE"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            render={renderProps => (
              <SocialButton clicked={renderProps.onClick} icon={GoogleIcon} text="구글 로그인" bgColor="#f5f5f5" textColor="#3f51b5" />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <FacebookLogin
            // appId="139193384125564"
            appId={facebookID}
            autoLoad
            fields="name,email,picture"
            callback={responseFacebook}
            render={renderProps => (
              <SocialButton clicked={renderProps.onClick} icon={FacebookIcon} text="페이스북 로그인" bgColor="#3B5998" textColor="#FFFFFF" />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <NaverLogin
            clientId="4rBF5bJ4y2jKn0gHoSCf"
            callbackUrl={`${window.location.origin}/Join/Advertiser/Login`}
            render={props => <SocialButton clicked={props.onClick} icon={NaverIcon} text="네이버 로그인" bgColor="#00CE38" textColor="#FFFFFF" />}
            onSuccess={result => responseNaver(result)}
            onFailure={result => responseNaver(result)}
          />
        </Grid>
        <Grid item xs={12}>
          <SocialButton clicked={kakaoLoginForm} icon={KakaoIcon} text="카카오 로그인" bgColor="#F7E317" textColor="#3C1E1E" />
        </Grid>
        {/* <Grid item md={12}>
          <SocialButton
            clicked={() => console.log('click')}
            icon={TwitchIcon}
            text="트위치 로그인"
            bgColor="#6034B1"
            textColor="#FFFFFF"
              // link="https://id.twitch.tv/oauth2/authorize?client_id=hnwk0poqnawvjedf2nxzaaznj16e1g&redirect_uri=http://localhost:3000&response_type=token&scope=user:edit+user:read:email&force_verify=true"
            link="https://id.twitch.tv/oauth2/authorize?client_id=hnwk0poqnawvjedf2nxzaaznj16e1g&redirect_uri=http://www.inflai.com&response_type=token&scope=user:edit+user:read:email&force_verify=true"
          />
        </Grid> */}
      </Grid>
    </React.Fragment>
  );
}

export default SocialNetworks;
