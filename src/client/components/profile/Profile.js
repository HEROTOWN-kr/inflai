import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { Colors } from '../../lib/Сonstants';
import MainBlock from '../containers/MainBlock';
import ProfileMenu from './ProfileMenu';
import ProfileContent from './ProfileContent';

function Profile(props) {
  return (
    <Box
      css={{ background: Colors.grey3 }}
      py={6}
      px={1}
    >
      <MainBlock width={1500}>
        <Grid container justify="space-between">
          <Grid item>
            <ProfileMenu {...props} />
          </Grid>
          <Grid item>
            <ProfileContent {...props} />
          </Grid>
        </Grid>
      </MainBlock>
    </Box>
  );
}

export default Profile;
