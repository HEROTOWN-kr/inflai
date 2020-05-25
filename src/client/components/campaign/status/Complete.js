import React from 'react';
import { Box, Grid } from '@material-ui/core';

function Complete() {
  return (
    <Grid container spacing={2} className="influencer-select">
      <Grid item xs={12}>
        <Grid container spacing={2} justify="space-between">
          <Grid item xs={4}>
            {/* <img src="https://images.unsplash.com/photo-1548946526-f69e2424cf45?ixlib=rb-1.2.1&auto=format&fit=crop&w=564&q=80" alt="" style={{width: '100%'}} /> */}
            <div style={{ margin: '0 auto' }}>text</div>
          </Grid>
          <Grid item xs={4}>
            {/* <img src="https://images.unsplash.com/photo-1548946526-f69e2424cf45?ixlib=rb-1.2.1&auto=format&fit=crop&w=564&q=80" alt="" style={{width: '100%'}} /> */}
            <div style={{ margin: '0 auto' }}>text</div>
          </Grid>
          <Grid item xs={4}>
            {/* <img src="https://images.unsplash.com/photo-1548946526-f69e2424cf45?ixlib=rb-1.2.1&auto=format&fit=crop&w=564&q=80" alt="" style={{width: '100%'}} /> */}
            <div style={{ margin: '0 auto' }}>text</div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Complete;
