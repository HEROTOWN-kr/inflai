import React from 'react';
import {
  Grid
} from '@material-ui/core';

function OnGoing() {
  return (
    <React.Fragment>
      <Grid container justify="space-between" className="campaign-card">
        <Grid item md={3}>
          <Grid container spacing={2}>
            <Grid item md={12}>선발 1명</Grid>
            <Grid item md={12}>파스타</Grid>
            <Grid item md={12}>18,000원(VAT 별도)</Grid>
          </Grid>
        </Grid>
        <Grid item md={3}>
          <Grid container spacing={2} style={{textAlign: 'right'}}>
            <Grid item md={12}>delete button</Grid>
            <Grid item md={12}>결제</Grid>
            <Grid item md={12}>요청일: 2020.04.02</Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default OnGoing;
