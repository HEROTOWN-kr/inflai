import React from 'react';
import Main from './main/Main';
import CustomNavBar from './navbar/Navbar';
import Footer from './footer/Footer';
import Common from '../lib/common';

function App(props) {
  const [user, setUser] = React.useState(Common.getUserInfo());

  function changeUser(data) {
    const newUser = { ...user, ...data };
    setUser(newUser);
    Common.saveUserInfo(newUser);
  }

  return (
    <div>
      <CustomNavBar user={user} changeUser={changeUser} />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
