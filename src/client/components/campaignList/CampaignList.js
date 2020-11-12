import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Box, Snackbar } from '@material-ui/core';
import CampaignAll from './CampaignAll';
import CampaignDetail from './CampaignDetail';
import CampaignApply from './CampaignApply';
import Alert from '../containers/Alert';


function СampaignList(props) {
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
    <div>
      <Switch>
        <Route
          path={`${props.match.path}/apply/:id`}
          render={renderProps => <CampaignApply {...renderProps} setMessage={setMessage} />}
        />
        <Route
          path={`${props.match.path}/:id`}
          render={renderProps => <CampaignDetail {...renderProps} />}
        />
        <Route
          path={`${props.match.path}/`}
          render={renderProps => <CampaignAll {...props} />}
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
    </div>
  );
}

export default СampaignList;
