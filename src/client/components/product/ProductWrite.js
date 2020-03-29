import React from 'react';
import {Grid, Divider, Button, TextField} from '@material-ui/core';

function ProductWrite() {
  return (
    <div className="write">
      <div className="title">
        <div className="main">캠페인 예상 견적</div>
      </div>
      <Grid container className="step-holder" spacing={5}>
        <Grid item md={4}>필수정보 입력</Grid>
        <Grid item md={4}>상세정보 입력</Grid>
        <Grid item md={4}>포스팅가이드 입력</Grid>
      </Grid>
      <div className="wraper vertical2">
        <Grid container>
          <Grid item md={3}>필수정보 입력</Grid>
          <Grid item md={9}>
            <Grid container spacing={3}>
              <Grid item md={12}>홍보하실 제품명/브랜드명/서비스명을 입력하세요.</Grid>
              <Grid item md={12}>
                <TextField
                    fullWidth
                    variant="outlined"
                >

                </TextField>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default ProductWrite;
