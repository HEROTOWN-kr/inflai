import React from 'react';
import {
  Dialog, DialogContent, DialogTitle, Divider, Grid, Button
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

function YoutubeDialog(props) {
  const { closeDialog, open, googleLogin } = props;

  function loginGoogle() {
    googleLogin();
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
                        구글 아이디 연결 안내
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
                        구글 아이디를 사용할 경우, 유튜브 계정을 함께 연결합니다.
          </Grid>
          {/* <Grid item xs={12} className="dialog-text">단, 기존에 레뷰 서비스에 연결한 인스타그램 계정이 있는 경우, 동일한 계정을 선택해 연결해주셔야 정상적으로 서비스를 이용하실 수 있습니다. 계정 전환 방법과 연결 방법은 아래 버튼을 눌러 확인해주세요.</Grid> */}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              className="google-button"
              onClick={loginGoogle}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default YoutubeDialog;
