import React from 'react';
import { Grid } from '@material-ui/core';
import { Link, Route, Switch } from 'react-router-dom';
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

function Campaign(props) {
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
      <div className="campaign wraper vertical3">
        <Grid container justify="center">
          <Grid item md={12} lg={10} xl={5}>
            <Grid container spacing={2}>
              <Grid item md={5}>
                <Grid container className="campaign-step">
                  {menuLinks.map(link => (
                    <Grid item md={4} key={link.text} className="link-container">
                      <Link
                        id={link.text}
                        className="link"
                        to={props.match.path + link.link}
                      >
                        {link.text}
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item md={12}>
                <Switch>
                  <Route
                    path={`${props.match.path}/ongoing`}
                    render={props => <OnGoing {...props} />}
                  />
                  <Route
                    path={`${props.match.path}/complete`}
                    render={props => <Complete {...props} />}
                  />
                  <Route
                    path={`${props.match.path}/combine`}
                    render={props => <Combined {...props} />}
                  />
                  <Route
                    path={`${props.match.path}/influencers/:id`}
                    render={props => <InfluencerList {...props} />}
                  />
                </Switch>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}

export default Campaign;
