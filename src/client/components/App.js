import React from 'react';
import NaverLogin from 'react-naver-login';
import Main from './main/Main';
import CustomNavBar from './navbar/Navbar';
import Footer from './footer/Footer';
import Common from '../lib/common';

import axios from 'axios';


function App(props) {
  const [user, setUser] = React.useState(Common.getUserInfo());

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
    <div>
      <CustomNavBar user={user} changeUser={changeUser} />
      {/*<NaverLogin
        clientId="4rBF5bJ4y2jKn0gHoSCf"
        callbackUrl="http://127.0.0.1:3000/login"
        render={props => <div onClick={props.onClick}>Naver Login</div>}
        onSuccess={result => responseNaver(result)}
        isPopup="true"
        // onSuccess={result => console.log(result)}
        onFailure={result => responseNaver(result)}
      />*/}
      <Main />
      <Footer />
      {/* <CustomNavBar user={user} changeUser={changeUser} />
      <Main />
      <Footer /> */}
    </div>
  );
}

export default App;
