import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return (

  // Show the component only when the user is logged in
  // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={props => (
        isAuthenticated
          ? <Component {...props} />
          : <Redirect to="/Join/Type" />
      )}
    />
  );
};

export default PrivateRoute;
