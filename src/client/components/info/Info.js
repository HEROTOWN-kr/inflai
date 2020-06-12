import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Grid, CircularProgress, Button
} from '@material-ui/core';
import { GoogleLogout } from 'react-google-login';
import { concatSeries } from 'async';
import Common from '../../lib/common';
import InfoInstagram from './InfoInstagram';
import InfoYoutube from './InfoYoutube';
import InfoAdvertiser from './InfoAdvertiser';
import InfoInfluencer from './InfoInfluencer';

function Info({
  user
}) {
  const { socialType, token } = Common.getUserInfo();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (user.type === '1') {
      axios.get('/api/TB_ADVERTISER/userInfo', {
        params: { token }
      }).then((res) => {
        console.log(res);
        const { data } = res.data;
        setUserData(data);
      });
    } else {
      axios.get('/api/TB_ADVERTISER/userInfo', {
        params: { token }
      }).then((res) => {
        console.log(res);
        const { data } = res.data;
        setUserData(data);
      });
    }
  }, []);

  return (
    <div className="profile-info">
      <div className="form-container">
        <div className="title">
          계정정보
        </div>
        {
          {
            1: <InfoAdvertiser userData={userData} />,
            2: <InfoInfluencer userData={userData} />
          }[user.type]
          /* {
            facebook: <InfoInstagram />,
            google: <InfoYoutube />
          }[socialType] */
        }
      </div>
    </div>
  );
}

export default Info;
