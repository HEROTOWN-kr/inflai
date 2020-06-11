import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CampaignAll from './CampaignAll';
import CampaignDetail from './CampaignDetail';


function СampaignList(props) {
  return (
    <Switch>
      <Route
        path={`${props.match.path}/:id`}
        render={renderProps => <CampaignDetail {...renderProps} />}
      />
      <Route
        path={`${props.match.path}/`}
        render={renderProps => <CampaignAll {...props} />}
      />
    </Switch>
  );
}

export default СampaignList;
