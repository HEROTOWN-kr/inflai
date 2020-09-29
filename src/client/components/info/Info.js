import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Box } from '@material-ui/core';
import Advertiser from '../advertiser/Advertiser';
import InfoMain from './InfoMain';
import InfoChange from './InfoChange';
import Complete from '../campaign/status/Complete';
import Combined from '../campaign/status/Combined';
import InfoChangeAdvertiser from './InfoChangeAdvertiser';
import Profile from '../profile/Profile';
import { Colors } from '../../lib/Сonstants';


function Info({
  user,
  match
}) {
  const [editCol, setEditCol] = useState('');
  function changeEditCol(colName) {
    setEditCol(colName);
  }

  return (
    <div className="profile-info">
      <Box px={{ xs: 3, md: 10 }} pt={{ md: 6 }} pb={{ md: 30 }} className="form-container">
        <Switch>
          <Route
            path={`${match.path}/editProfile`}
            render={props => <InfoChangeAdvertiser {...props} editCol={editCol} />}
          />
          <Route
            path={`${match.path}/edit`}
            render={props => <InfoChange {...props} editCol={editCol} />}
          />
          <Route
            path={`${match.path}/`}
            render={props => (
              <InfoMain
                {...props}
                user={user}
                changeEditCol={changeEditCol}
              />
            )}
          />
        </Switch>
      </Box>
    </div>
  );
}

export default Info;
