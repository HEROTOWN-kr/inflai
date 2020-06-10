import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CampaignAll from './CampaignAll';
import CampaignDetail from './CampaignDetail';


function СampaignList(props) {
  console.log(props.match.path);

  return (
    <Switch>
      <Route
        path={`${props.match.path}/:id`}
        render={renderProps => <CampaignDetail {...props} />}
      />
      <Route
        path={`${props.match.path}/`}
        render={renderProps => <CampaignAll {...props} />}
      />
    </Switch>
  );
}

export default СampaignList;
