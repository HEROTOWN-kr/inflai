import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AdvertiserLogin from './AdvertiserLogin';
import AdvertiserSignUp from './AdvertiserSignUp';
import AdvertiserDetail from '../../advertiser/AdvertiserDetail';

function AdvertiserJoin(props) {
  return (
    <Switch>
      <Route
        path={`${props.match.path}/Login`}
        render={renderProps => <AdvertiserLogin {...renderProps} changeUser={props.changeUser} />}
      />
      <Route
        path={`${props.match.path}/SignUp/Detail/:id`}
        render={renderProps => <AdvertiserDetail {...renderProps} changeUser={props.changeUser} />}
      />
      <Route
        path={`${props.match.path}/SignUp`}
        render={renderProps => <AdvertiserSignUp {...renderProps} changeUser={props.changeUser} />}
      />
    </Switch>
  );
}

export default AdvertiserJoin;
