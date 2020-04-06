import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function SimpleDialog({
  open,
  selectNo,
  selectYes
}) {
  return (
    <Dialog
      open={open}
      // onClose={}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableScrollLock
    >
      <DialogTitle id="alert-dialog-title">삭제</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
                  삭제하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={selectNo} color="primary">
                  아니요
        </Button>
        <Button onClick={() => selectYes()} color="primary" autoFocus>
                  네
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SimpleDialog;
