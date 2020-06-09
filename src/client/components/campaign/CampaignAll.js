import React from 'react';
import { Grid, Divider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import NameArray from '../../lib/nameArray';

const theme = createMuiTheme({
  spacing: 1,
});


function CampaignAll() {
  return (
    <Grid container justify="center">
      <Grid item className="campaign-list">
        <Grid container spacing={5}>
          {NameArray.testData().map(item => (
            <Grid key={item.INF_ID} item xs={3}>
              <Grid container spacing={theme.spacing(1)}>
                <Grid item xs={12}>
                  <img src={item.picture_url} alt="" />
                </Grid>
                <Grid item xs={12} className="tags">
                  {item.tags}
                </Grid>
                <Grid item xs={12} className="title">
                  {item.title}
                </Grid>
                <Grid item xs={12} className="text">
                  {item.text}
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} className="count">
                  <Grid container justify="space-between">
                    <Grid item>{`D-${item.requests_count}`}</Grid>
                    <Grid item>{`신청 ${item.requests_count}/모집 ${item.requests_count}`}</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>

  );
}

export default CampaignAll;
