import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../home/home';
import Influencer from '../influencer/Influencer';
import Advertiser from '../advertiser/Advertiser';
import Contact from '../contact/Contact';

function Main() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/Advertiser" component={Advertiser} />
      <Route path="/Influencer" component={Influencer} />
      <Route path="/Contact" component={Contact} />
    </Switch>
  );
}

export default Main;
