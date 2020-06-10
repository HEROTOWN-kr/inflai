import React from 'react';
import { Grid } from '@material-ui/core';

function CampaignDetail() {
  return (
    <Grid container justify="center">
      <Grid item className="campaign-detail">
        <Grid container>
          <Grid item xs={5}>
            content
          </Grid>
          <Grid item xs={4}>
            content
          </Grid>
          <Grid item xs={3}>
            content
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CampaignDetail;
