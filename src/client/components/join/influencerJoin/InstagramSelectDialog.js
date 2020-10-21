import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogTitle, Divider, Grid, Button, Box
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import StyledText from '../../containers/StyledText';
import StyledImage from '../../containers/StyledImage';

function InstagramSelectDialog(props) {
  const {
    closeDialog, open, connectAccount, instaAccounts
  } = props;

  const [selectedId, setSelectedId] = useState(0);

  function selectAccount(id) {
    setSelectedId(id);
  }

  function connectButtonClick() {
    connectAccount(selectedId);
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
            인스타그램 계정 선택
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
            <Grid container spacing={1}>
              <Grid item>선택한 인스타그램 계정 중 1개의 계정만 레뷰에 연결하실 수 있습니다.</Grid>
              <Grid item>단, 이미 참여하고 있는 캠페인이 있는 경우 기존에 연결했던 인스타그램 계 정을 연결하셔야 정상</Grid>
              <Grid item>적으로 서비스를 이용하실 수 있습니다.</Grid>
              <Grid item>이 페이지를 나가실 경우, 연결이 완료되지 않습니다.</Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box py={5}>
              <Grid container justify="center">
                {instaAccounts.map((item, index) => (
                  <Grid item key={item.id} onClick={() => selectAccount(item.id)}>
                    <Box px={3}>
                      <StyledImage width="80px" height="80px" borderRadius="100%" border={selectedId === item.id ? '2px solid red' : '2px solid #ffffff'} src={item.profile_picture_url} />
                      <Box pt={1}>{item.username}</Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item>
            <Button
              disabled={!selectedId}
              variant="contained"
              className="facebook-button"
              onClick={connectButtonClick}
            >
                연결 완료
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default InstagramSelectDialog;
