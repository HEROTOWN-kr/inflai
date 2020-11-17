import React from 'react';
import { Box } from '@material-ui/core';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Colors } from '../../lib/Сonstants';
import WhiteBlock from '../containers/WhiteBlock';
import NotFound from '../main/NotFound';
import Rank from './pages/Rank';
import UserInfo from './pages/UserInfo/UserInfo';
import CampaignInfo from './pages/CampaignInfo';

function ProfileContent(props) {
  const { match } = props;

  return (
    <Box width={{
      xs: 200, md: 600, lg: 975
    }}
    >
      <Switch>
        <Route
          path={`${match.path}/CampaignInfo`}
          render={props => <CampaignInfo {...props} />}
        />
        <Route
          path={`${match.path}/Rank`}
          render={props => <Rank {...props} />}
        />
        <Route
          path={`${match.path}/UserInfo`}
          render={renderProps => <UserInfo {...props} />}
        />
        <Route
          exact
          path={`${match.path}/`}
          render={() => (
            <Redirect to={`${match.path}/UserInfo`} />
          )}
        />
        <Route
          component={NotFound}
        />
      </Switch>
    </Box>
  );
}

export default ProfileContent;
