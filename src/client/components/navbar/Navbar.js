import React, { useCallback, useEffect, useState } from 'react';
import {
  Redirect, Link, withRouter, browserHistory
} from 'react-router-dom';
import * as Scroll from 'react-scroll';
import axios from 'axios';
import {
  makeStyles,
  AppBar,
  Grid,
  Divider,
  Button,
  Popper,
  ClickAwayListener, Box
} from '@material-ui/core';


import LogOutButton from '../login/LogOutButton';
import NavbarLinks from './NavbarLinks';
import NavbarLogo from './NavbarLogo';

const ScrollLink = Scroll.Link;
const ElementLink = Scroll.Element;
const Scroller = Scroll.scroller;

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

function CustomNavbar(props) {
  const classes = useStyles();

  const [openMenu, setOpenMenu] = React.useState(false);
  const [userMenu, setUserMenu] = React.useState(null);


  function openUserMenu(event) {
    setUserMenu(userMenu ? null : event.currentTarget);
  }

  const handleClose = () => {
    setUserMenu(null);
  };

  props.history.listen((location) => {
    handleClose();
  });

  const open = Boolean(userMenu);
  const id = open ? 'simple-popover' : undefined;

  const userMenuCat = [
    {
      text: '계정정보',
      link: '/Info'
    },
    {
      text: '마이 캠페인',
      link: '/Campaign/ongoing'
    },
    {
      text: '알림',
      link: '/Notifications'
    },
    {
      text: '소셜계정',
      link: '/Social'
    },
  ];

  function UserMenuItems() {
    return (
      <div className="user-popmenu">
        {props.user.type === '1'
          ? (
            <React.Fragment>
              <Link
                to="/Product"
              >
                <div className="pop-item"> 마케팅 요청</div>
              </Link>
              <Divider />
            </React.Fragment>
          )
          : null
        }
        {userMenuCat.map(item => (
          <div key={item.text}>
            <Link
              to={item.link}
            >
              <div className="pop-item">{item.text}</div>
            </Link>
            <Divider />
          </div>
        ))}
        <Grid container justify="center" className="logout">
          <Grid item>
            <Box my={2}>
              <LogOutButton {...props} />
            </Box>
          </Grid>
        </Grid>
      </div>
    );
  }


  function parseParms(str) {
    const pieces = str.split('&'); const data = {}; let i; let
      parts;
    // process each query pair
    for (i = 0; i < pieces.length; i++) {
      parts = pieces[i].split('=');
      if (parts.length < 2) {
        parts.push('');
      }
      data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    }
    return data;
  }

  const toggleDrawer = open => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenMenu(open);
  };




  return (
    <Box className="navbar">
      <AppBar position="static" color="transparent" className="navbar-content">
        <Grid container alignItems="center" className="bar">
          <Grid item>
            <NavbarLogo />
            <NavbarLinks history={props.history} />
          </Grid>
          <Grid item />
        </Grid>
      </AppBar>
    </Box>
  );
}

export default withRouter(CustomNavbar);
