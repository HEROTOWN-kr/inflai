import React from 'react';
import {
  Box,
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, useMediaQuery
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import StyledText from '../containers/StyledText';
import StyledButton from '../containers/StyledButton';

export default function PlanSuccessDialog(props) {
  const {
    open, handleClose, onConfirm, selectedData
  } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const onConfirmFunc = () => {
    onConfirm();
    handleClose();
  };

  const PaymentData = [
    {
      title: '선택한 플랜',
      data: 'planName'
    },
    {
      title: '송금 금액',
      // data: 'pricePerMonth'
      data: 'price'
    },
    {
      title: '가상계좌은행',
      data: 'bankName'
    },
    {
      title: '가상계좌번호',
      data: 'bankAccount'
    },
    {
      title: '계좌추인',
      data: 'bankHost'
    }
  ];

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <Box p={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <StyledText textAlign="center" fontSize="28">계좌 송금 안내</StyledText>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              {
                PaymentData.map(item => (
                  <Grid item key={item.title} xs={12}>
                    <Grid container justify="space-between">
                      <Grid item><StyledText fontSize="18" lineHeight="1.5em">{item.title}</StyledText></Grid>
                      <Grid item><StyledText fontSize="18" lineHeight="1.5em">{selectedData[item.data]}</StyledText></Grid>
                    </Grid>
                  </Grid>
                ))
              }
            </Grid>
            <Box mt={4}>
              <StyledText fontSize="15" lineHeight="1.5em">
                *24시간 이내 입금 정보를 확인하고 확인 한 다음에 INFLAI 서비스를 이용하실 수 있을겁니다.
              </StyledText>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={2}>
              <Grid item xs={3}>
                <StyledButton
                  background="#ff005b"
                  hoverBackground="#e00452"
                  height="36px"
                  fontSize="16px"
                  padding="0 20px"
                  onClick={handleClose}
                >
                취소
                </StyledButton>
              </Grid>
              <Grid item xs={3}>
                <StyledButton
                  height="36px"
                  fontSize="16px"
                  padding="0 20px"
                  onClick={onConfirm}
                >
                  신청
                </StyledButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
