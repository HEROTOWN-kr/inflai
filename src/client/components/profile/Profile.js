import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import axios from 'axios';
import { Colors } from '../../lib/Сonstants';
import MainBlock from '../containers/MainBlock';
import ProfileMenu from './ProfileMenu';
import ProfileContent from './ProfileContent';
import Common from '../../lib/common';
import AuthContext from '../../context/AuthContext';

function Profile(props) {
  const { token } = useContext(AuthContext);

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
    if (token) {
      getUserInfo();
    }
  }, [token]);

  return (
    <Box
      css={{ background: Colors.grey3 }}
      py={6}
      px={1}
      className="profile"
    >
      <Box
        maxWidth={{
          xs: 500, md: 900, lg: 1250
        }}
        css={{ margin: '0 auto' }}
      >
        <Grid container justify="space-between">
          <Grid item>
            <ProfileMenu {...props} userInfo={userInfo} />
          </Grid>
          <Grid item>
            <ProfileContent {...props} userInfo={userInfo} setUserInfo={setUserInfo} getUserInfo={getUserInfo} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Profile;
