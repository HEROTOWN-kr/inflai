import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Main from './main/Main';
import CustomNavBar from './navbar/Navbar';
import Footer from './footer/Footer';
import Common from '../lib/common';
import useAuth from '../hooks/auth.hook';
import AuthContext from '../context/AuthContext';


function App() {
  const {
    token, login, logout, userRole, socialType, userName, ready
  } = useAuth();
  const isAuthenticated = !!token;

  const [user, setUser] = React.useState(Common.getUserInfo());

  useEffect(() => {
    if (!window.location.host.startsWith('www') && window.location.host === 'inflai.com') {
      window.location = `${window.location.protocol}//www.${window.location.host}${window.location.pathname}`;
    }
  });

  function changeUser(data) {
    const newUser = { ...user, ...data };
    setUser(newUser);
    Common.saveUserInfo(newUser);
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userRole, socialType, userName, isAuthenticated
    }}
    >
      <div className="app-block">
        <div className="app-header">
          <CustomNavBar user={user} changeUser={changeUser} />
        </div>
        <div className="app-body">
          <Main user={user} changeUser={changeUser} />
        </div>
        <div className="app-footer">
          <Footer />
        </div>
      </div>
    </AuthContext.Provider>

  );
}

export default withRouter(App);
