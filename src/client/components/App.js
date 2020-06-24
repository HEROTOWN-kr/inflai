import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import NaverLogin from 'react-naver-login';
import axios from 'axios';
import Main from './main/Main';
import CustomNavBar from './navbar/Navbar';
import Footer from './footer/Footer';
import Common from '../lib/common';


function App(props) {
  const [user, setUser] = React.useState(Common.getUserInfo());
  const [activeClass, setActiveClass] = useState('');

  useEffect(() => {
    if (!window.location.host.startsWith('www') && window.location.host === 'inflai.com') {
      window.location = `${window.location.protocol}//www.${window.location.host}${window.location.pathname}`;
    }
  });

  /* function logit() {
    if (props.history.location.pathname !== '/') {
      setActiveClass(' active');
    } else {
      setActiveClass('');
    }
  }
  useEffect(() => {
    logit();
  }); */

  /* useEffect(() => {
    if (user.regState && user.regState === 'N') {
      props.history.push('/regDetail');
    }
  }, [user]); */

  function changeUser(data) {
    const newUser = { ...user, ...data };
    setUser(newUser);
    Common.saveUserInfo(newUser);
  }

  function responseNaver(response) {
    console.log(response);
    if (response) {
      axios.get('/api/TB_ADVERTISER/loginNaver', {
        params: {
          id: response.id,
          email: response.email,
          name: response.name,
          type: '2',
          social_type: 'naver'
        }
      }).then((res) => {
        changeUser({
          social_type: res.data.social_type,
          type: '2',
          token: res.data.userToken,
          name: res.data.userName,
        });
      });
    }
  }

  return (
    <div className="app-block">
      <div className="app-header">
        <CustomNavBar user={user} changeUser={changeUser} />
      </div>
      {/* <div className={`app-body${activeClass}`}> */}
      <div className="app-body">
        <Main user={user} changeUser={changeUser} />
      </div>
      <div className="app-footer">
        <Footer />
      </div>
      {/* <CustomNavBar user={user} changeUser={changeUser} /> */}
      {/* <NaverLogin
        clientId="4rBF5bJ4y2jKn0gHoSCf"
        callbackUrl="http://127.0.0.1:3000/login"
        render={props => <div onClick={props.onClick}>Naver Login</div>}
        onSuccess={result => responseNaver(result)}
        isPopup="true"
        // onSuccess={result => console.log(result)}
        onFailure={result => responseNaver(result)}
      /> */}
      {/* <Main user={user} changeUser={changeUser} /> */}
      {/* <Footer /> */}
      {/* <CustomNavBar user={user} changeUser={changeUser} />
      <Main />
      <Footer /> */}
    </div>
  );
}

export default withRouter(App);
