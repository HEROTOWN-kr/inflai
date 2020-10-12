import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import axios from 'axios';
import WhiteBlock from '../../containers/WhiteBlock';
import StyledImage from '../../containers/StyledImage';
import Common from '../../../lib/common';

function InstagramInfo(props) {
  const [instaData, setInstaData] = useState({});
  const { token } = Common.getUserInfo();

  async function getInstaInfo() {
    const InstaData = await axios.get('/api/TB_INSTA/', {
      params: {
        token
      }
    });
    const { list } = InstaData.data.data;
    // console.log(list);
    setInstaData(list);
  }

  useEffect(() => {
    getInstaInfo();
  }, []);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WhiteBlock>
                <Box px={3} py={2}>
                  <Grid container>
                    <Grid item>
                      <StyledImage />
                    </Grid>
                    <Grid item>test</Grid>
                  </Grid>
                </Box>
              </WhiteBlock>
            </Grid>
            <Grid item xs={6}>
              <WhiteBlock>test</WhiteBlock>
            </Grid>
            <Grid item xs={6}>
              <WhiteBlock>test</WhiteBlock>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <WhiteBlock>test</WhiteBlock>
        </Grid>
        <Grid item xs={6}>
          <WhiteBlock>test</WhiteBlock>
        </Grid>
        <Grid item xs={6}>
          <WhiteBlock>test</WhiteBlock>
        </Grid>
      </Grid>
    </div>
  );
}

export default InstagramInfo;
