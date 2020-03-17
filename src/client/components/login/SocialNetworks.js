import React from 'react';
import Grid from '@material-ui/core/Grid';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import NaverLogin from 'react-naver-login';
import axios from 'axios';
import SocialButton from './SocialButton';
import NaverIcon from '../../img/naver-icon.png';
import KakaoIcon from '../../img/kakao-logo.png';
import GoogleIcon from '../../img/google-logo.png';
import FacebookIcon from '../../img/facebook-logo.png';


function SocialNetworks({
  userType,
  changeUser,
  closeDialog
}) {
  function responseGoogle(response) {
    console.log(response);
    if (response) {
      axios.get('/api/TB_ADVERTISER/loginGoogle', {
        params: {
          social_type: response.tokenObj.idpId,
          type: userType,
          token: response.tokenId
        }
      }).then((res) => {
        changeUser({
          social_type: res.data.social_type,
          type: userType,
          token: res.data.userToken,
          name: res.data.userName,
        });
        closeDialog();
      });
    }
  }

  const responseFacebook = (response) => {
    console.log(response);
    if (response) {
      axios.get('/api/TB_ADVERTISER/loginFacebook', {
        params: {
          id: response.userID,
          email: response.email,
          name: response.name,
          type: userType,
          social_type: response.graphDomain
        }
      }).then((res) => {
        changeUser({
          social_type: res.data.social_type,
          type: userType,
          token: res.data.userToken,
          name: res.data.userName,
        });
        closeDialog();
      });
    }
  };

  const responseNaver = (response) => {
    console.log(response);
    /* if (response) {
          axios.get('/api/TB_ADVERTISER/loginFacebook', {
            params: {
              id: response.userID,
              email: response.email,
              name: response.name,
              type: userType,
              social_type: response.graphDomain
            }
          }).then((res) => {
            changeUser({
              social_type: res.data.social_type,
              type: userType,
              token: res.data.userToken,
              name: res.data.userName,
            });
            closeDialog();
          });
        } */
  };

  const responseKakao = (response) => {
    if (response) {
      axios.get('/api/TB_ADVERTISER/loginKakao', {
        params: {
          id: response.profile.id,
          email: response.profile.kakao_account.email,
          name: response.profile.properties.nickname,
          type: userType,
          social_type: response.graphDomain
        }
      }).then((res) => {
        changeUser({
          social_type: res.data.social_type,
          type: userType,
          token: res.data.userToken,
          name: res.data.userName,
        });
        closeDialog();
      });
    }
  };

  const kakaoLoginForm = () => {
    window.Kakao.Auth.loginForm({
      success(authObj) {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success(res) {
            axios.get('/api/TB_ADVERTISER/loginKakao', {
              params: {
                id: res.id,
                email: res.kakao_account.email,
                name: res.kakao_account.profile.nickname,
                type: userType,
                social_type: 'kakao'
              }
            }).then((response) => {
              changeUser({
                social_type: response.data.social_type,
                type: userType,
                token: response.data.userToken,
                name: response.data.userName,
              });
              closeDialog();
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
  };


  return (
    <React.Fragment>
      {/*<Grid container justify="center">
        <GoogleLogin
          clientId="997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com" // CLIENTID
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          render={renderProps => (
            <div onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</div>
          )}
        />
      </Grid>*/}

      {/* <Grid container justify="center">
         <FacebookLogin
              appId="139193384125564" // APP ID NOT CREATED YET
              fields="name,email,picture"
              callback={responseFacebook}
              // cssClass="facebook-button"
            />
        <FacebookLogin
          appId="139193384125564"
          autoLoad
          fields="name,email,picture"
          callback={responseFacebook}
          render={renderProps => (
            <div className="social-login-button facebook" onClick={renderProps.onClick} />
          )}
        />

      </Grid> */}

      {/* <Grid container justify="center">
        <NaverLogin
          clientId="4rBF5bJ4y2jKn0gHoSCf"
                // callbackUrl="http://127.0.0.1:3000/login"
          callbackUrl="http://127.0.0.1:3000/login"
          render={props => <div className="social-login-button naver" onClick={props.onClick} />}
          onSuccess={result => responseNaver(result)}
          onFailure={result => responseNaver(result)}
        />
      </Grid> */}

      <Grid container justify="center">
        <GoogleLogin
          clientId="997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com" // CLIENTID
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          render={renderProps => (
            <SocialButton clicked={renderProps.onClick} icon={GoogleIcon} text="구글 로그인" bgColor="#4285F4" textColor="#ffffff" />
          )}
        />
      </Grid>

      <Grid container justify="center">
        <FacebookLogin
          appId="139193384125564"
          autoLoad
          fields="name,email,picture"
          callback={responseFacebook}
          render={renderProps => (
            <SocialButton clicked={renderProps.onClick} icon={FacebookIcon} text="페이스북 로그인" bgColor="#3B5998" textColor="#FFFFFF" />
          )}
        />

      </Grid>

      <Grid container justify="center">
        <NaverLogin
          clientId="4rBF5bJ4y2jKn0gHoSCf"
            // callbackUrl="http://127.0.0.1:3000/login"
          callbackUrl="http://127.0.0.1:3000/login"
          render={props => <SocialButton clicked={props.onClick} icon={NaverIcon} text="네이버 로그인" bgColor="#00CE38" textColor="#FFFFFF" />}
          onSuccess={result => responseNaver(result)}
          onFailure={result => responseNaver(result)}
        />
      </Grid>

      <Grid container justify="center">
        <SocialButton clicked={kakaoLoginForm} icon={KakaoIcon} text="카카오 로그인" bgColor="#F7E317" textColor="#3C1E1E" />
      </Grid>

      {/* <Grid container justify="center">
        <div onClick={kakaoLoginForm} className="social-login-button kakao" />
      </Grid> */}
    </React.Fragment>
  );
}

export default SocialNetworks;