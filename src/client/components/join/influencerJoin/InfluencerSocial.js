import React, { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import NaverLogin from 'react-naver-login';
import axios from 'axios';
import { Box } from '@material-ui/core';
import SocialButton from '../../login/SocialButton';
import NaverIcon from '../../../img/naver-icon.png';
import KakaoIcon from '../../../img/kakao-logo.png';
import GoogleIcon from '../../../img/google-logo2.png';
import FacebookIcon from '../../../img/facebook-logo.png';
import TwitchIcon from '../../../img/twitch-logo-white.png';
import InstagramDialog from './InstagramDialog';
import InstagramSelectDialog from './InstagramSelectDialog';
import YoutubeDialog from '../inf-join/YoutubeDialog';
import AuthContext from '../../../context/AuthContext';


function InfluencerSocial(props) {
  const { history } = props;
  const auth = useContext(AuthContext);
  const [instaDialogOpen, setInstaDialogOpen] = useState(false);
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [instaAccounts, setInstaAccounts] = useState([]);
  const [instaSelectDialogOpen, setInstaSelectDialogOpen] = useState(false);

  const GoogleButtonRef = React.useRef(null);

  const responseGoogle = async (response) => {
    if (!response.error) {
      axios.get('/api/TB_INFLUENCER/youtubeSignUp', {
        params: {
          code: response.code
        }
      }).then((res) => {
        const {
          userPhone, social_type, userToken, userName, regState
        } = res.data;
        auth.login(userToken, '2', userName, social_type);
        if (userPhone) {
          history.push('/');
        } else {
          history.push('/profile');
        }
      }).catch((error) => {
        alert(error);
      });
    } else {
      alert('google auth error');
    }
  };

  function toggleInstaDialog() {
    setInstaDialogOpen(!instaDialogOpen);
  }

  function toggleYoutubeDialog() {
    setYoutubeDialogOpen(!youtubeDialogOpen);
  }

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
            const {
              userPhone, social_type, userToken, userName, regState
            } = res.data;
            auth.login(userToken, '2', userName, social_type);
            if (userPhone) {
              history.push('/');
            } else {
              history.push('/profile');
            }
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
            const {
              userPhone, social_type, userToken, userName, regState
            } = res.data;
            auth.login(userToken, '2', userName, social_type);
            if (userPhone) {
              history.push('/');
            } else {
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

  const responseNaver = (response) => {
    try {
      if (response) {
        console.log(response);
        const {
          email, id, name, profile_image
        } = response.user;
        axios.get('/api/TB_INFLUENCER/naverLogin', {
          params: {
            id,
            email,
            name,
            profile_image,
            type: '2',
            social_type: 'naver'
          }
        }).then((influencerData) => {
          const {
            social_type, userToken, userName, regState, userPhone
          } = influencerData.data;
          auth.login(userToken, '2', userName, social_type);
          if (userPhone) {
            history.push('/');
          } else {
            history.push('/profile');
          }
        }).catch((err) => {
          alert(err.response.data.message);
        });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const kakaoLoginForm = () => {
    try {
      const { Kakao } = window;

      Kakao.Auth.loginForm({
        success(authObj) {
          Kakao.API.request({
            url: '/v2/user/me',
            success(response) {
              const { id, kakao_account } = response;
              axios.get('/api/TB_INFLUENCER/kakaoLogin', {
                params: {
                  id,
                  email: kakao_account.email,
                  name: kakao_account.profile.nickname,
                  type: '1',
                  social_type: 'kakao'
                }
              }).then((influencerData) => {
                const {
                  social_type, userToken, userName, regState, userPhone
                } = influencerData.data;
                auth.login(userToken, '2', userName, social_type);
                if (userPhone) {
                  history.push('/');
                } else {
                  history.push('/profile');
                }
              });
            },
            fail(err2) {
              console.log(JSON.stringify(err2));
            }
          });
        },
        fail(err) {
          console.log(JSON.stringify(err));
        }
      });
    } catch (err) {
      alert(err.response.message);
    }
  };


  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SocialButton clicked={toggleYoutubeDialog} icon={GoogleIcon} text="구글 로그인" bgColor="#f5f5f5" textColor="#3f51b5" />
        </Grid>
        <Grid item xs={12}>
          <SocialButton clicked={toggleInstaDialog} icon={FacebookIcon} text="페이스북 로그인" bgColor="#3B5998" textColor="#FFFFFF" />
        </Grid>
        <Grid item xs={12}>
          <NaverLogin
                        // clientId="4rBF5bJ4y2jKn0gHoSCf"
            clientId="HddfazOY2WePr9AUHcfh"
            callbackUrl={`${window.location.origin}/Join/Influencer/Login`}
            render={props => <SocialButton clicked={props.onClick} icon={NaverIcon} text="네이버 로그인" bgColor="#00CE38" textColor="#FFFFFF" />}
            onSuccess={result => responseNaver(result)}
            onFailure={result => responseNaver(result)}
          />
        </Grid>
        <Grid item xs={12}>
          <SocialButton clicked={kakaoLoginForm} icon={KakaoIcon} text="카카오 로그인" bgColor="#F7E317" textColor="#3C1E1E" />
        </Grid>
      </Grid>
      <InstagramDialog open={instaDialogOpen} closeDialog={toggleInstaDialog} facebookLogin={facebookLogin} />
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
    </React.Fragment>
  );
}

export default InfluencerSocial;
