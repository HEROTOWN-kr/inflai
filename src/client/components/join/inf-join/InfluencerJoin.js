import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import UserType from '../UserType';
import AdvertiserJoin from '../adv-join/AdvertiserJoin';
import Influencer from '../../influencer/Influencer';
import InfluencerSns from './InfluencerSns';
import InstagramUser from './InstagramUser';

function InfluencerJoin(props) {
  const [userData, setUserData] = useState({
    jobType: '',
    snsType: '',
    igAccounts: [],
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
          render={props => <InfluencerSns {...props} goTo={goTo} userData={userData} changeUserData={changeUserData} />}
        />
        <Route
          path={`${props.match.path}/instagram`}
          render={props => <InstagramUser {...props} userData={userData} changeUserData={changeUserData} />}
        />
        <Route
          path={`${props.match.path}/youtube`}
          render={props => <AdvertiserJoin {...props} />}
        />
        <Route
          path={`${props.match.path}/blog`}
          render={props => <AdvertiserJoin {...props} />}
        />
      </Switch>
    </div>
  );
}

export default InfluencerJoin;
