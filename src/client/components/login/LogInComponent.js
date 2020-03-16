import React from 'react';
import axios from 'axios';

import { Button, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';

import { GoogleLogout } from 'react-google-login';


import '../../css/sub.scss';
import SocialNetworks from './SocialNetworks';
import UserType from './UserType';


function LogOutButton(props) {
  const kakaoLogOut = (e) => {
    e.preventDefault();
    window.Kakao.Auth.logout((res) => {
      props.changeUser({ token: null, name: '', social_type: '' });
    });
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
          kakao: <button onClick={kakaoLogOut}>Logout</button>
        }[props.user.social_type]
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
          <LogOutButton {...props} />)

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
  const [userData, setUserData] = React.useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = React.useState({});

  const changeUserType = (event) => {
    setUserType(event.target.value);
  };

  function handleChange(event) {
    const { name } = event.target;
    const { value } = event.target;
    setUserData({ ...userData, [name]: value });
  }

  function validateCheck(data) {
    const payload = {
      errors: {},
      success: false
    };

    if (!data.password) {
      payload.errors.password = 'Please provide a password.';
    } else if (data.password.length < 8) {
      payload.errors.password = 'Password must have at least 8 characters.';
    }

    if (!data.email) {
      payload.errors.email = 'Please provide an email.';
    }

    payload.success = Object.entries(payload.errors).length === 0 && payload.errors.constructor === Object;

    return payload;
  }

  function logIn() {
    const data = {
      email: userData.email,
      password: userData.password,
      type: userType
    };

    axios.post('/api/auth/login', data)
      .then((res) => {
        if (res.data.code === 200) {
          console.log(res);
        } else if (res.data.code === 401) {
          setErrors({ message: res.data.message });
        } else {
          console.log(res);
        }
      })
      .catch(error => (error));
  }

  function handleClick() {
    const payload = validateCheck(userData);
    if (payload.success) {
      setErrors({});
      logIn();
    } else {
      const errorsObj = payload.errors;
      setErrors(errorsObj);
    }
  }

  return (
    <Dialog open={openDialog} className="login-dialog">
      <DialogTitle>Log In</DialogTitle>
      <DialogContent className="signUpContent">
        <Grid container justify="center">
          <UserType userType={userType} changeUserType={changeUserType} />
        </Grid>
        <Grid container justify="center">
          <Grid item xs={6}>
            <FormControl className="signUpFormElement">
              <TextField id="component-email" label="Email" name="email" value={userData.email} onChange={handleChange} error={errors.email} helperText={errors.email ? errors.email : ' '} />
            </FormControl>

            <FormControl className="signUpFormElement">
              <TextField id="component-password" label="Password" name="password" value={userData.password} onChange={handleChange} error={errors.password} helperText={errors.password ? errors.password : ' '} />
            </FormControl>

            <div className="error-message">{errors.message}</div>
          </Grid>

          <Grid item xs={6}>
            <SocialNetworks userType={userType} changeUser={changeUser} closeDialog={closeDialog} />
          </Grid>

        </Grid>
        <div className="error-message">{null}</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClick} color="primary">
          Log In
        </Button>
      </DialogActions>
    </Dialog>
  );
}


export default LogInComponent;


// <KakaoLogin
//             jsKey="621ae47398f559dd7479aaba4b841c4b"
//             onSuccess={result => responseKakao(result)}
//             onFailure={result => console.log(result)}
//             /*render={props => (
//                 <div onClick={props.onClick}>KAKAO LOGIN</div>
//             )}*/
//   // getProfile="true"
//   />
