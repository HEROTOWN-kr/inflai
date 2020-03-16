import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
// import Link from '@material-ui/core/Link';
import { Link } from 'react-router-dom';

import { Drawer, Hidden } from '@material-ui/core';
import KakaoLogin from 'react-kakao-login';
import Logo from '../../img/logo.png';
import LogInComponent from '../login/LogInComponent';
import SignUpComponent from '../login/SignUpComponent';
// import NaverLogin from "react-naver-login";


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
  },

  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}));

export default function CustomNavbar(props) {
  const classes = useStyles();

  const [openMenu, setOpenMenu] = React.useState(false);

  const menuLinks = [
    {
      text: '홈',
      link: '/'
    },
    {
      text: '광고주',
      link: '/Advertiser'
    },
    {
      text: '인플루언서',
      link: '/Influencer'
    },
    {
      text: '서비스1',
      link: '/Service1'
    },
    {
      text: '서비스2',
      link: '/Service2'
    },
  ];

  const toggleDrawer = open => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpenMenu(open);
  };

  const sideList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuLinks.map((link, index) => (
          <ListItem button key={link.text} component={props => <Link to={link.link} {...props} />}>
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className="navbar">
      <AppBar position="static" color="transparent">
        <Grid container className="bar" alignItems="center">
          <Grid container xs={5} md={2} justify="center" className="nav-logo">
            <Grid item>
              <Link
                className="link"
                to="/"
              >
                <img src={Logo} />
              </Link>
            </Grid>
          </Grid>
          <Hidden mdDown>
            <Grid container xs={4} justify="space-between">
              {menuLinks.map(link => (
                <Link
                  className="link"
                  key={link.text}
                  to={link.link}
                >
                  {link.text}
                </Link>
              ))}
              <LogInComponent {...props} />
              <SignUpComponent {...props} />

            </Grid>
            <Grid container xs={4} justify="flex-end">
              <Grid item xs={6} className="name-holder">{props.user.name ? props.user.name : null}</Grid>
            </Grid>
            <Grid container xs={2} justify="center">
              <Link
                className="link"
                to="/Contact"
              >
                CONTACT US
              </Link>
            </Grid>
          </Hidden>
          <Hidden mdUp>
            <Grid container xs={6} justify="flex-end">
              <div onClick={toggleDrawer(true)} className="menu-icon">
                <MenuIcon />
              </div>
            </Grid>
          </Hidden>
          <Drawer anchor="right" open={openMenu} onClose={toggleDrawer(false)}>
            {sideList()}
          </Drawer>
        </Grid>
      </AppBar>
    </div>
  );
}
