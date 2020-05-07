import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import UserType from '../UserType';
import AdvertiserJoin from '../adv-join/AdvertiserJoin';
import Influencer from '../../influencer/Influencer';
import InfluencerSns from './InfluencerSns';

import Common from '../../../lib/common';
import InfluencerDetail from './InfluencerDetail';

function InfluencerJoin(props) {
  const [userData, setUserData] = useState({
    jobType: '',
    snsType: '',
    igAccounts: Common.getIgAccounts(),
    detailInfo: {}
  });

  function changeUserData(data) {
    const newUser = { ...userData, ...data };
    setUserData(newUser);
  }

  function goTo(url) {
    props.history.push(props.match.path + url);
  }

  return (
    <div className="join">
      <Switch>
        <Route
          path={`${props.match.path}/sns`}
          render={renderProps => <InfluencerSns {...renderProps} goTo={goTo} userData={userData} changeUserData={changeUserData} changeUser={props.changeUser} />}
        />
        <Route
          path={`${props.match.path}/detail/:id`}
          render={renderProps => <InfluencerDetail {...renderProps} userData={userData} changeUserData={changeUserData} changeUser={props.changeUser} />}
        />
        <Route
          path={`${props.match.path}/youtube`}
          render={renderProps => <AdvertiserJoin {...renderProps} />}
        />
        <Route
          path={`${props.match.path}/blog`}
          render={renderProps => <AdvertiserJoin {...renderProps} />}
        />
      </Switch>
    </div>
  );
}

export default InfluencerJoin;
