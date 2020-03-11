import React from 'react';
import axios from 'axios';

import { Button } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import GoogleLogin, { GoogleLogout } from 'react-google-login';


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
          <GoogleLogout
            clientId="997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com"
            buttonText="Logout"
            onLogoutSuccess={() => { props.changeUser({ token: null, name: '' }); }}
          />
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
  function responseGoogle(response) {
    console.log(response);
    if (response) {
      axios.get('/api/TB_ADVERTISER/login', {
        params: {
          token: response.tokenId
        }
      }).then((res) => {
        changeUser({
          token: res.data.userToken,
          name: res.data.userName
        });
        closeDialog();
      });
    }
  }


  return (
    <Dialog open={openDialog}>
      <DialogTitle>Log In</DialogTitle>
      <DialogContent className="signUpForm">
        <GoogleLogin
          clientId="997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com" // CLIENTID NOT CREATED YET
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
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
