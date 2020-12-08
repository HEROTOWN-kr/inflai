import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Link, Redirect, Route, Switch
} from 'react-router-dom';
import Home from '../home/home';
import Advertiser from '../advertiser/Advertiser';
import Influencer from '../influencer/Influencer';
import Contact from '../contact/Contact';
import AdvertiserDetail from '../advertiser/AdvertiserDetail';
import ProductMix from '../product/ProductMix';
import OnGoing from './status/OnGoing';
import Complete from './status/Complete';
import Combined from './status/Combined';
import InfluencerList from './status/InfluencerList';
import CampaignCreate from './CampaignCreate';
import NotFound from '../main/NotFound';
import ProductCreate from '../product/ProductCreate';
import ProductAgency from '../product/ProductAgency';

function Campaign(props) {
  const { match } = props;
  const menuLinks = [
    {
      text: '나의 캠페인',
      link: '/ongoing'
    },
    {
      text: '완료 캠페인',
      link: '/complete'
    },
    {
      text: '통합 캠페인',
      link: '/combine'
    },
  ];


  return (
    <React.Fragment>
      <Switch>
        <Route
          path={`${match.path}/Create`}
          render={renderProps => <CampaignCreate {...renderProps} />}
        />
        <Route
          path={`${match.path}/Agency`}
          render={renderProps => <ProductAgency {...renderProps} />}
        />
        <Route
          path={`${match.path}/type`}
          render={renderProps => <ProductCreate {...renderProps} />}
        />
        <Route
          exact
          path={`${match.path}/`}
          render={() => (
            <Redirect to={`${match.path}/type`} />
          )}
        />
        <Route
          component={NotFound}
        />
        {/* <Route
          path={`${match.path}/ongoing`}
          render={renderProps => <OnGoing {...props} />}
        />
        <Route
          path={`${match.path}/complete`}
          render={renderProps => <Complete {...props} />}
        />
        <Route
          path={`${match.path}/combine`}
          render={renderProps => <Combined {...props} />}
        />
        <Route
          path={`${match.path}/influencers/:id`}
          render={renderProps => <InfluencerList {...props} />}
        /> */}
      </Switch>
    </React.Fragment>
  );
}

export default Campaign;
