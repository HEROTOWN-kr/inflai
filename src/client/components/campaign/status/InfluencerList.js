import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Grid } from '@material-ui/core';
import Common from '../../../lib/common';

function InfluencerList({
  history,
  match
}) {
  const [selected, setSelected] = useState({
    nano: 0,
    micro: 0,
    macro: 0,
    mega: 0,
    celebrity: 0
  });
  const [counter, setCounter] = useState({});

  function getCampaign() {
    const { token } = Common.getUserInfo();
    axios.get('/api/TB_AD/getAdInfluencers', {
      params: {
        token,
        adId: match.params.id
      }
    }).then((res) => {
      setCounter({ ...res.data.data });
    });
  }

  useEffect(() => {
    getCampaign();
  }, []);

  function selectInfluencer(type) {
    setSelected({ ...selected, [type]: selected[type] + 1 });
  }

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Grid container spacing={1}>
          <Grid item md={2}>{`나노 ${selected.nano}/${counter.AD_INF_NANO}`}</Grid>
          <Grid item md={2}>{`마이크로 ${selected.micro}/${counter.AD_INF_MICRO}`}</Grid>
          <Grid item md={2}>{`메크로 ${selected.macro}/${counter.AD_INF_MACRO}`}</Grid>
          <Grid item md={2}>{`메가 ${selected.mega}/${counter.AD_INF_MEGA}`}</Grid>
          <Grid item md={2}>{`셀럽 ${selected.celebrity}/${counter.AD_INF_CELEB}`}</Grid>
        </Grid>
      </Grid>
      <Grid item md={12}>
        <Grid container>
          <Grid item md={4}>
            <Button variant="contained" color="primary" onClick={() => selectInfluencer('nano')}>Press button</Button>
          </Grid>
          <Grid item md={4}>
            <Button variant="contained" color="primary" onClick={() => selectInfluencer('micro')}>Press button</Button>
          </Grid>
          <Grid item md={4}>
            <Button variant="contained" color="primary" onClick={() => selectInfluencer('macro')}>Press button</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default InfluencerList;
