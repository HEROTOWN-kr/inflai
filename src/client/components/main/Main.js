import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Home from '../home/home';
import Influencer from '../influencer/Influencer';
import Advertiser from '../advertiser/Advertiser';
import Contact from '../contact/Contact';
import AdvertiserDetail from '../advertiser/AdvertiserDetail';
import ProductMix from '../product/ProductMix';
import Campaign from '../campaign/Campaign';
import ProductCreate from '../product/ProductCreate';
import Product from '../product/Product';
import Join from '../join/Join';
import Info from '../info/Info';
import Privacy from '../footer/Privacy';
import Service from '../footer/Service';
import Notification from '../notification/Notification';
import CampaignList from '../campaignList/CampaignList';
import InfoYoutube from '../info/InfoYoutube';
import NotFound from './NotFound';
import Ranking from '../ranking/Ranking';
import Profile from '../profile/Profile';
import CampaignCreate from '../campaign/CampaignCreate';
import PrivateRoute from '../containers/PrivateRoute';
import Membership from '../membership/Membership';


function Main({
  user,
  changeUser
}) {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/Advertiser" component={Advertiser} />
      <Route
        path="/Influencer"
        render={props => <Influencer {...props} user={user} changeUser={changeUser} />}
      />
      <Route path="/Contact" component={Contact} />
      <Route
        path="/regDetail"
        render={props => <AdvertiserDetail {...props} user={user} changeUser={changeUser} />}
      />
      <Route
        path="/Product"
        render={props => <Product {...props} user={user} changeUser={changeUser} />}
      />
      <PrivateRoute
        path="/Campaign"
        component={Campaign}
        // render={props => <Campaign {...props} user={user} />}
      />
      <Route
        path="/Ranking"
        render={props => <Ranking {...props} user={user} />}
      />
      <Route
        path="/Join"
        render={props => <Join {...props} changeUser={changeUser} />}
      />
      <Route
        path="/Info"
        render={props => <Info {...props} user={user} />}
      />
      <Route
        path="/Profile"
        render={props => <Profile {...props} user={user} />}
      />
      <Route
        path="/Social"
        render={props => <InfoYoutube {...props} user={user} />}
      />
      <Route
        path="/Notifications"
        render={props => <Notification {...props} />}
      />
      <Route
        path="/Policy/Service"
        render={props => <Service {...props} />}
      />
      <Route
        path="/Policy/Privacy"
        render={props => <Privacy {...props} />}
      />
      <Route
        path="/CampaignList"
        render={props => <CampaignList {...props} />}
      />
      <Route
        path="/Membership"
        render={props => <Membership {...props} />}
      />
      <Route
        component={NotFound}
      />
    </Switch>
  );
}

export default Main;


/*
<Grid container>
    <Grid item md={12}>

    </Grid>
</Grid>
*/
