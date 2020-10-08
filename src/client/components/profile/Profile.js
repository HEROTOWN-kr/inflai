import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import axios from 'axios';
import { Colors } from '../../lib/Сonstants';
import MainBlock from '../containers/MainBlock';
import ProfileMenu from './ProfileMenu';
import ProfileContent from './ProfileContent';
import Common from '../../lib/common';

function Profile(props) {
  const { token } = Common.getUserInfo();

  const [userInfo, setUserInfo] = useState({});

  async function getUserInfo() {
    try {
      const response = await axios.get('/api/TB_INFLUENCER/', { params: { token } });
      const { data } = response.data;
      if (data) {
        console.log(data);
        setUserInfo(data);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Box
      css={{ background: Colors.grey3 }}
      py={6}
      px={1}
    >
      <MainBlock width={1500}>
        <Grid container justify="space-between">
          <Grid item>
            <ProfileMenu {...props} userInfo={userInfo} />
          </Grid>
          <Grid item>
            <ProfileContent {...props} userInfo={userInfo} setUserInfo={setUserInfo} getUserInfo={getUserInfo} />
          </Grid>
        </Grid>
      </MainBlock>
    </Box>
  );
}

export default Profile;
