import React, { useState } from 'react';
import { Box, Snackbar } from '@material-ui/core';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Colors } from '../../lib/Сonstants';
import WhiteBlock from '../containers/WhiteBlock';
import NotFound from '../main/NotFound';
import Rank from './pages/Rank';
import UserInfo from './pages/UserInfo/UserInfo';
import CampaignInfo from './pages/CampaignInfo';
import Alert from '../containers/Alert';

function ProfileContent(props) {
  const { match } = props;
  const [message, setMessage] = useState({
    open: false,
    text: '',
    type: 'success'
  });

  const messageClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessage({ ...message, open: false });
  };

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
          render={renderProps => <UserInfo {...props} setMessage={setMessage} />}
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
      <Snackbar
        open={message.open}
        autoHideDuration={4000}
        onClose={messageClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={messageClose} severity={message.type}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProfileContent;
