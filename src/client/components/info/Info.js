import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button, Divider, FormControlLabel, Radio, RadioGroup, TextField, Grid
} from '@material-ui/core';
import Common from '../../lib/common';

function Info() {
  const [data, setData] = useState({});

  useEffect(() => {
    const { token } = Common.getUserInfo();
    axios.get('/api/TB_INFLUENCER/getInstaInfo', {
      params: {
        token,
      }
    }).then((res) => {
      console.log(res.data);
      setData({ ...res.data.data });
    });
  }, []);

  return (
    <div>
      <Grid container justify="center" className="info-insta">
        <Grid item md={4}>
          <Grid container>
            <Grid item md={12}>
              <Grid container>
                <Grid item md={6}>folower count</Grid>
                <Grid item md={6}>{data.followers_count}</Grid>
              </Grid>
            </Grid>
            <Grid item md={12}>
              <Grid container>
                <Grid item md={6}>follows_count</Grid>
                <Grid item md={6}>{data.follows_count}</Grid>
              </Grid>
            </Grid>
            <Grid item md={12}>
              <Grid container>
                <Grid item md={6}>media_count</Grid>
                <Grid item md={6}>{data.media_count}</Grid>
              </Grid>
            </Grid>
            <Grid item md={12}>
              <Grid container>
                <Grid item md={6}>name</Grid>
                <Grid item md={6}>{data.name}</Grid>
              </Grid>
            </Grid>
            <Grid item md={12}>
              <Grid container>
                <Grid item md={6}>username</Grid>
                <Grid item md={6}>{data.username}</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

    </div>
  );
}

export default Info;
