import React from 'react';
import {
  Dialog, DialogContent, DialogTitle, Divider, Grid, Button
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

function InstagramDialog(props) {
  const { closeDialog, open, facebookLogin } = props;

  function loginFacebook() {
    facebookLogin();
    closeDialog();
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={closeDialog}
      aria-labelledby="simple-dialog-title"
      open={open}
      className="instagram-dialog"
    >
      <DialogTitle id="simple-dialog-title">
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
                  페이스북 아이디 연결 안내
          </Grid>
          <Grid item>
            <CloseIcon className="close-icon" onClick={closeDialog} />
          </Grid>
        </Grid>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2} justify="center">
          <Grid item xs={12} className="dialog-text">
              페이스북 아이디를 사용할 경우, 인스타그램 계정을 함께 연결합니다.
          </Grid>
          <Grid item xs={12} className="dialog-text">
                  인스타그램 정책에 따라 인스타그램 계정이
            <br />
                  프로페셔널 계정이며, 인스타그램 계정과 페이지가 연결되어 있을 때 연결하실 수 있습니다.
            <br />
                  또한 권한 허용 시 인스타그램과 연결된 페이지를 선택하셔야 합니다.
          </Grid>
          {/* <Grid item xs={12} className="dialog-text">단, 기존에 레뷰 서비스에 연결한 인스타그램 계정이 있는 경우, 동일한 계정을 선택해 연결해주셔야 정상적으로 서비스를 이용하실 수 있습니다. 계정 전환 방법과 연결 방법은 아래 버튼을 눌러 확인해주세요.</Grid> */}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              className="facebook-button"
              onClick={loginFacebook}
            >
                Login with Facebook
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default InstagramDialog;
