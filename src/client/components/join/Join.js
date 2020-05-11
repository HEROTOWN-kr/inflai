import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import Campaign from '../campaign/Campaign';
import Product from '../product/Product';
import UserType from './UserType';
import Common from '../../lib/common';
import InfluencerJoin from './inf-join/InfluencerJoin';
import AdvertiserJoin from './adv-join/AdvertiserJoin';


function Join(props) {
  const [userData, setUserData] = useState({
    jobType: '',
    snsType: ''
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
          path={`${props.match.path}/Type`}
          render={renderProps => <UserType {...renderProps} goTo={goTo} changeUserData={changeUserData} />}
        />
        <Route
          path={`${props.match.path}/Influencer`}
          render={renderProps => <InfluencerJoin {...renderProps} changeUser={props.changeUser} />}
        />
        <Route
          path={`${props.match.path}/Advertiser`}
          render={renderProps => <AdvertiserJoin {...renderProps} changeUser={props.changeUser} />}
        />
      </Switch>
    </div>
  );
}

export default Join;
