import React from 'react';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';
import UserType from './UserType';
import SocialNetworks from './SocialNetworks';

function SignUpComponent(props) {
  const [openDialog, setOpenDialog] = React.useState(false);

  function toggleLoginDialog() {
    setOpenDialog(!openDialog);
  }
  return (
    <div>
      <SignUpDialog {...props} openDialog={openDialog} closeDialog={toggleLoginDialog} />
      <Button onClick={toggleLoginDialog} className="login-button">SignUp</Button>
    </div>
  );
}

function SignUpDialog({
  openDialog,
  closeDialog,
  user,
  changeUser
}) {
  const [userType, setUserType] = React.useState('');
  const [userData, setUserData] = React.useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: ''
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

    if (data.password !== data.passwordConfirm) {
      payload.errors.pwconfirm = 'Password confirmation doesn\'t match.';
    }


    if (!data.password) {
      payload.errors.password = 'Please provide a password.';
    } else if (data.password.length < 8) {
      payload.errors.password = 'Password must have at least 8 characters.';
    }

    if (!data.passwordConfirm) {
      payload.errors.pwconfirm = 'Please confirm the password.';
    }

    if (!data.email) {
      payload.errors.email = 'Please provide an email.';
    }

    if (!data.name) {
      payload.errors.name = 'Please provide a name.';
    }

    payload.success = Object.entries(payload.errors).length === 0 && payload.errors.constructor === Object;

    return payload;
  }

  function signUp() {
    const data = { ...userData, type: userType };

    axios.post('/api/TB_ADVERTISER/signup', data)
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
      signUp();
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

            <FormControl className="signUpFormElement">
              <TextField id="component-passwordConfirm" label="Confirm Password" name="passwordConfirm" value={userData.passwordConfirm} onChange={handleChange} error={errors.pwconfirm} helperText={errors.pwconfirm ? errors.pwconfirm : ' '} />
            </FormControl>

            <FormControl className="signUpFormElement">
              <TextField id="component-name" label="Name" name="name" value={userData.name} onChange={handleChange} error={errors.name} helperText={errors.name ? errors.name : ' '} />
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


export default SignUpComponent;
