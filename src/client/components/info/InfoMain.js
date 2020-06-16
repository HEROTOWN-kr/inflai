import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import InfoAdvertiser from './InfoAdvertiser';
import InfoInfluencer from './InfoInfluencer';
import Home from '../home/home';
import Advertiser from '../advertiser/Advertiser';

function InfoMain({
  user,
  history,
  match,
  changeEditCol
}) {
  function editProfile(colName) {
    changeEditCol(colName);
    if (user.type == '1') {
      history.push(`${match.path}editProfile`);
    } else {
      history.push(`${match.path}edit`);
    }
  }

  return (
    <div className="form-container">
      {
                    {
                      1: <InfoAdvertiser editProfile={editProfile} />,
                      2: <InfoInfluencer editProfile={editProfile} />
                    }[user.type]
                    /* {
                      facebook: <InfoInstagram />,
                      google: <InfoYoutube />
                    }[socialType] */
                }
    </div>
  );
}

export default InfoMain;
