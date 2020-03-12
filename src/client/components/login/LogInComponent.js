import React from 'react';
import axios from 'axios';

import { Button } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import GoogleLogin, { GoogleLogout } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import NaverLogin from 'react-naver-login';


import '../../css/sub.scss';


function LogOutButton(props) {
  return (
    <React.Fragment>
      {
          props.user.social_type === 'facebook'
            ?
              // <a href="#" onClick={(e) => { e.preventDefault(); window.FB.logout(); props.changeUser({ token: null, name: '', social_type: '' }); }}>logout</a>
              <Button onClick={(e) => { e.preventDefault(); window.FB.logout(); props.changeUser({ token: null, name: '', social_type: '' }); }} className="login-button">LogOut</Button>
            : (
              <GoogleLogout
                clientId="997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com"
                buttonText="Logout"
                onLogoutSuccess={() => { props.changeUser({ token: null, name: '', social_type: '' }); }}
              />
            )
        }
    </React.Fragment>
  );
}

function LogInComponent(props) {
  const [openDialog, setOpenDialog] = React.useState(false);

  function toggleLoginDialog() {
    setOpenDialog(!openDialog);
  }
  return (
    <div>
      <LoginDialog {...props} openDialog={openDialog} closeDialog={toggleLoginDialog} />
      {props.user.token
        ? (
          <LogOutButton {...props} />
        )
        : <Button onClick={toggleLoginDialog} className="login-button">LogIn</Button>
        }
    </div>
  );
}

function LoginDialog({
  openDialog,
  closeDialog,
  user,
  changeUser
}) {
  const [userType, setUserType] = React.useState('');

  const changeUserType = (event) => {
    setUserType(event.target.value);
  };

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


  return (
    <Dialog open={openDialog} className="login-dialog">
      <DialogTitle>Log In</DialogTitle>
      <DialogContent className="signUpContent">
        <Grid container justify="center">
          <FormControl component="fieldset" className="">
            <FormLabel component="legend">회원 직무</FormLabel>
            <RadioGroup row aria-label="gender" name="gender1" value={userType} onChange={changeUserType}>
              <FormControlLabel value="1" control={<Radio />} label="광고주" />
              <FormControlLabel value="2" control={<Radio />} label="인플루언서" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid container justify="center">
          <Grid container justify="center">
            <GoogleLogin
              clientId="997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com" // CLIENTID
              buttonText="LOGIN WITH GOOGLE"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
            />
          </Grid>

          <FacebookLogin
            appId="139193384125564" // APP ID NOT CREATED YET
            fields="name,email,picture"
            callback={responseFacebook}
          />

          <NaverLogin
            clientId="4rBF5bJ4y2jKn0gHoSCf"
            callbackUrl="http://127.0.0.1:3000/home"
            render={props => <button>Naver Login</button>}
            onSuccess={console.log(1)}
            onFailure={console.log(2)}
          />

        </Grid>
        <div className="error-message">{null}</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
              Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}


export default LogInComponent;
