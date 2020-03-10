import React from 'react';
import Main from './main/Main';
import CustomNavBar from './navbar/Navbar';
import Footer from './footer/Footer';

function App(props) {
  return (
    <div>
      <CustomNavBar />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
