import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Grid, CircularProgress, Button
} from '@material-ui/core';
import { GoogleLogout } from 'react-google-login';
import Common from '../../lib/common';
import InfoInstagram from './InfoInstagram';
import InfoYoutube from './InfoYoutube';

function Info() {
  const socialType = Common.getUserInfo().social_type;

  return (
    <React.Fragment>
      {
        {
          facebook: <InfoInstagram />,
          google: <InfoYoutube />
        }[socialType]
      }
    </React.Fragment>
  );
}

export default Info;
