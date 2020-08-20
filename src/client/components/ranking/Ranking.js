import React, { useEffect, useState } from 'react';
import {
  Grid,
  MenuItem,
} from '@material-ui/core';
import axios from 'axios';
import StyledSelect from '../containers/StyledSelect';
import StyledTitle from '../containers/StyledTitle';
import Instagram from './Instagram';
import Youtube from './Youtube';
import Common from '../../lib/common';

function Ranking() {
  const [blogType, setBlogType] = useState('2');
  const [userId, setUserId] = useState(0);

  function getUser() {
    const { token } = Common.getUserInfo();
    if (token) {
      axios.get('/api/TB_INFLUENCER/userId', {
        params: {
          token
        }
      }).then((res) => {
        const {
          userId
        } = res.data.data;
        setUserId(userId);
      });
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="ranking">
      <Grid container justify="center">
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item sm={12}>
              <StyledTitle title="인플루언서 랭킹" />
            </Grid>
            <Grid item sm={12}>
              <StyledSelect
                value={blogType}
                variant="outlined"
                onChange={(event => setBlogType(event.target.value))}
              >
                <MenuItem value="1">Instagram</MenuItem>
                <MenuItem value="2">Youtube</MenuItem>
              </StyledSelect>
            </Grid>
            <Grid item sm={12}>
              {
                  blogType === '1' ? <Instagram userId={userId} /> : <Youtube userId={userId} />
                }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Ranking;
