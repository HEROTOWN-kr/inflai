import React from 'react';
import { Route, Switch } from 'react-router-dom';
import InfluencerLogin from './InfluencerLogin';
import InfluencerSignUp from './InfluencerSignUp';

function InfluencerJoin(props) {
  return (
    <Switch>
      <Route
        path={`${props.match.path}/Login`}
        render={renderProps => <InfluencerLogin {...renderProps} changeUser={props.changeUser} />}
      />
      <Route
        path={`${props.match.path}/SignUp`}
        render={renderProps => <InfluencerSignUp {...renderProps} changeUser={props.changeUser} />}
      />
    </Switch>
  );
}

export default InfluencerJoin;
