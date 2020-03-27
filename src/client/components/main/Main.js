import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../home/home';
import Influencer from '../influencer/Influencer';
import Advertiser from '../advertiser/Advertiser';
import Contact from '../contact/Contact';
import AdvertiserDetail from '../advertiser/AdvertiserDetail';
import Product from '../product/Product';


function Main({
  user,
  changeUser
}) {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/Advertiser" component={Advertiser} />
      <Route path="/Influencer" component={Influencer} />
      <Route path="/Contact" component={Contact} />
      <Route
        path="/regDetail"
        render={props => <AdvertiserDetail {...props} user={user} changeUser={changeUser} />}
      />
      <Route
        path="/Product"
        render={props => <Product {...props} user={user} changeUser={changeUser} />}
      />
    </Switch>
  );
}

export default Main;
