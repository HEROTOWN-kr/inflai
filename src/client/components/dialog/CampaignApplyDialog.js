import React from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import StyledText from '../containers/StyledText';
import StyledButton from '../containers/StyledButton';

export default function CampaignApplyDialog(props) {
  const {
    open, setOpen, onConfirm, dialogText
  } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    setOpen(false);
  };

  const onConfirmFunc = () => {
    onConfirm();
    handleClose();
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <StyledText textAlign="center" fontSize="14">INFLAI</StyledText>
        </DialogTitle>
        <DialogContent>
          <StyledText textAlign="center" fontSize="14">{dialogText}</StyledText>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={handleClose}>
                        아니요
          </StyledButton>
          <StyledButton onClick={onConfirmFunc}>
                        네
          </StyledButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
