import React from 'react';
import {
  Dialog, DialogContent, DialogTitle, Divider, Grid, Button, Box
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import StyledText from '../../containers/StyledText';

function InstagramDialog(props) {
  const {
    closeDialog, open, facebookLogin, userPage
  } = props;

  const data = {
    instagram: {
      title: '인스타그램 계정 연결 안내',
      title2: '연결 주의사항',
      rule1: '1. 인스타그램 정책에 의해 인스타그램 계정은 프로페셔널 계정이며, 페이스북 페이지와 연결되어',
      rule2: '야 연결이 가능합니다. 계정 전환 방법과 연결 방법은 아래 버튼을 눌러 확인해 주세요.',
      rule3: '2. 기존 레뷰에 연결했던 인스타그램 계정이 있다면, 기존 계정을 1개를 연결해 주세요.',
      rule4: '3. 권한 설정 시, 인스타그램 계정과 페이지를 반드시 1개 선택해주세요.',
      rule5: '인스타그램에 연결한 페이지를 선택해주셔야 합니다.',
      rule6: '또한 모든 권한을 허용해주셔야 정상적으로 서비스를 이용하실 수 있습니다.'
    },
    facebook: {
      title: '페이스북 아이디 연결 안내',
      title2: '페이스북 아이디를 사용할 경우, 인스타그램 계정을 함께 연결합니다.',
      rule1: '인스타그램 정책에 따라 인스타그램 계정이',
      rule2: '프로페셔널 계정이며, 인스타그램 계정과 페이지가 연결되어 있을 때 연결하실 수 있습니다.',
      rule3: '또한 권한 허용 시 인스타그램과 연결된 페이지를 선택하셔야 합니다.',
    }
  };

  const text = userPage ? data.instagram : data.facebook;

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
            {text.title}
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
            <Box pt={1}><StyledText fontSize="16" fontWeight="700">{text.title2}</StyledText></Box>
          </Grid>
          <Grid item xs={12} className="dialog-text">
            <Grid container spacing={1}>
              <Grid item>{text.rule1}</Grid>
              <Grid item>{text.rule2}</Grid>
              <Grid item>{text.rule3}</Grid>
              {text.rule4 ? (<Grid item>{text.rule4}</Grid>) : null}
              {text.rule5 ? (<Grid item>{text.rule5}</Grid>) : null}
              {text.rule6 ? (<Grid item>{text.rule6}</Grid>) : null}
            </Grid>
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
