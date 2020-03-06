import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import Logo from '../../img/logo.png'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,

  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    bottom: 'auto',
    top: 0,

  },
  bar: {
    background: 'unset'
  }
}));

export default function CustomNavbar() {
  return (
    <div className="navbar">
      <AppBar position="fixed" color="transparent">
          <Grid container className="bar" alignItems="center">
            <Grid container xs={2} justify="center">
              <Grid item>
                <img src={Logo} />
              </Grid>
            </Grid>
            <Grid container xs={4} justify="space-between">
              <div className="link">홈</div>
              <div className="link">광고주</div>
              <div className="link">인플루어너</div>
              <div className="link">서비스1</div>
              <div className="link">서비스2</div>
            </Grid>
            <Grid container xs={4}></Grid>
            <Grid container xs={2} justify="center">
              <div className="link contactUs">CONTACT US</div>
            </Grid>
          </Grid>
      </AppBar>
    </div>
  );
}
