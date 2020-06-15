import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Advertiser from '../advertiser/Advertiser';
import InfoMain from './InfoMain';
import InfoChange from './InfoChange';
import Complete from '../campaign/status/Complete';
import Combined from '../campaign/status/Combined';

function Info({
  user,
  match
}) {
  return (
    <div className="profile-info">
      <Switch>
        <Route
          path={`${match.path}/edit`}
          render={props => <InfoChange {...props} />}
        />
        <Route
          path={`${match.path}/`}
          render={props => <InfoMain {...props} user={user} />}
        />
      </Switch>
    </div>
  );
}

export default Info;
