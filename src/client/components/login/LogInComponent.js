import React from 'react';
import axios from 'axios';
import '../../css/sub.scss';

import { Button, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';

import SocialNetworks from './SocialNetworks';
import UserType from './UserType';
import LogOutButton from './LogOutButton';


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
      payload.errors.password = '비밀번호를 입력해 주세요';
    } else if (data.password.length < 8) {
      payload.errors.password = '비밀번호는 8자 이상이어야합니다';
    }

    if (!data.email) {
      payload.errors.email = '이메일을 입력해 주세요';
    }

    if (!userType) {
      payload.errors.type = '회원 직무를 선택해 주세요';
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
          changeUser({
            social_type: res.data.social_type,
            type: userType,
            token: res.data.userToken,
            name: res.data.userName,
          });
          closeDialog();
        } else if (res.data.code === 401) {
          setErrors({ message: res.data.message });
        } else {
          setErrors({ message: res.data.message });
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

  function closeDialogButton() {
    setErrors({});
    closeDialog();
  }

  return (
    <Dialog open={openDialog} className="login-dialog">
      <DialogTitle>Log In</DialogTitle>
      <DialogContent className="signUpContent">
        <Grid container justify="center">
          <UserType userType={userType} changeUserType={changeUserType} />
        </Grid>
        <Grid container justify="center">
          <div className="error-message mb-10">{errors.type}</div>
        </Grid>
        <Grid container>
          <Grid container xs={6} justify="center">
            <FormControl className="signUpFormElement">
              <TextField id="component-email" label="Email" name="email" value={userData.email} onChange={handleChange} error={errors.email} helperText={errors.email ? errors.email : ' '} />
            </FormControl>

            <FormControl className="signUpFormElement">
              <TextField id="component-password" label="Password" name="password" value={userData.password} onChange={handleChange} error={errors.password} helperText={errors.password ? errors.password : ' '} />
            </FormControl>

            <div className="error-message">{errors.message}</div>
          </Grid>

          <Grid item xs={6} className="social-networks">
            <SocialNetworks userType={userType} changeUser={changeUser} closeDialog={closeDialog} />
          </Grid>

        </Grid>
        <div className="error-message">{null}</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialogButton} color="primary">
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
