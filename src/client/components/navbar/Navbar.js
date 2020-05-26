import React, { useCallback, useEffect } from 'react';
import {
  Redirect, Link, withRouter, browserHistory
} from 'react-router-dom';
import axios from 'axios';
import MenuIcon from '@material-ui/icons/Menu';
import {
  makeStyles,
  AppBar,
  Grid,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Hidden,
  Popover,
  Divider,
  Button,
  Popper,
  ClickAwayListener, Box
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GoogleLogin from 'react-google-login';
import Logo from '../../img/logo.png';
import LogInComponent from '../login/LogInComponent';
import SignUpComponent from '../login/SignUpComponent';
import Common from '../../lib/common';
import SocialButton from '../login/SocialButton';
import GoogleIcon from '../../img/google-logo2.png';
import LogOutButton from '../login/LogOutButton';


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

  const googleLink = 'https://accounts.google.com'
      + '/o/oauth2/v2/auth?'
      + 'scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly '
      + 'https://www.googleapis.com/auth/userinfo.profile '
      + 'https://www.googleapis.com/auth/userinfo.email&'
      // + 'profile email&'
      + 'access_type=offline&redirect_uri=http://localhost:8080/TB_ADVERTISER/Googletest1&'
      + 'response_type=code&'
      + 'client_id=997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com';


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
      text: '다름',
      link: '/'
    },
  ];

  const { hash } = document.location;

  function getTwitchInfo(hash) {
    const decodedURL = decodeURIComponent(hash);
    const urlObj = parseParms(decodedURL.slice(1));
    // console.log(urlObj);
    const twitchToken = urlObj.access_token;
    Common.saveUserToken(twitchToken);
    const header = `Bearer ${twitchToken}`;

    axios.get('https://api.twitch.tv/helix/users', {
      headers: { Authorization: header }
    }).then((res) => {
      // console.log(res);
      if (res.data) {
        axios.get('/api/TB_ADVERTISER/loginTwitch', {
          params: {
            id: res.data.data[0].id,
            email: res.data.data[0].email,
            name: res.data.data[0].display_name,
            type: '2',
            social_type: 'twitch'
          }
        }).then((res) => {
          console.log(res);
          props.changeUser({
            social_type: res.data.social_type,
            type: '2',
            token: res.data.userToken,
            name: res.data.userName,
          });
          props.history.push('/');
        });
      }
    });
  }

  useEffect(() => {
    if (hash) {
      getTwitchInfo(hash);
    }
  }, []);

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


  const menuLinks = [
    {
      text: '인플라이소개',
      link: '/'
    },
    {
      text: '성공사례',
      link: '/'
    },
    {
      text: '촬영서비스',
      link: '/'
    },
    {
      text: '파트너',
      link: '/'
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

  function twitchLogin() {
    axios.get('https://id.twitch.tv/oauth2/authorize', {
      params: {
        client_id: 'hnwk0poqnawvjedf2nxzaaznj16e1g',
        redirect_uri: 'http://localhost:3000',
        response_type: 'token',
        scope: 'user:edit+user:read:email',
      }
    });
  }

  function testFunction() {
    axios.get('/api/TB_INFLUENCER/rankYoutube', {
      params: {
        type: '2'
      }
    }).then((res) => {
      console.log(res);
    });
  }


  function addChannel() {
    window.Kakao.Channel.addChannel({
      channelPublicId: '_lxmhexb',
    });
  }

  return (
    <div className="navbar">
      <AppBar position="static" color="transparent">
        <Grid container alignItems="center" className="bar">
          <Grid item xs={5} md={2}>
            <Grid container justify="center">
              <Grid item>
                <Box my={2}>
                  <Link
                    className="link"
                    to="/"
                  >
                    <img src={Logo} />
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Hidden mdDown>
            <Grid item md={4}>
              <Grid container spacing={5}>
                {menuLinks.map(link => (
                  <Grid item key={link.text}>
                    <Link
                      className="link"
                      to={link.link}
                    >
                      {link.text}
                    </Link>
                  </Grid>
                ))}
                {/*<Button variant="contained" color="secondary" onClick={testFunction}>test</Button>*/}
                {/*<Button variant="contained" color="secondary" onClick={addChannel}>addChanell</Button>*/}
              </Grid>
            </Grid>
            <Grid item md={6}>
              <Box mr={4}>
                <Grid container spacing={2} alignItems="center" justify="flex-end">
                  {
                    props.user.name
                      ? (
                        <React.Fragment>
                          <Grid item className="name-holder" onClick={openUserMenu}>
                            {props.user.name}
                            <ExpandMoreIcon />
                          </Grid>
                          {props.user.type === '1'
                            ? (
                              <Grid item>
                                <Link
                                  className="link"
                                  to="/Product"
                                >
                                      켐페인 요청
                                </Link>
                              </Grid>
                            )
                            : (
                              <Grid item>
                                <Link
                                  className="link"
                                  to="/Influencer"
                                >
                                    인플루언서
                                </Link>
                              </Grid>
                            )
                          }

                          <Popper id={id} open={open} anchorEl={userMenu} onClose={handleClose}>
                            <ClickAwayListener onClickAway={handleClose}>
                              <div className="user-popmenu">
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
                                      {/* <button>press</button> */}
                                      <LogOutButton {...props} />
                                    </Box>
                                  </Grid>
                                </Grid>
                              </div>
                            </ClickAwayListener>
                          </Popper>
                          {/* <LogOutButton {...props} /> */}

                        </React.Fragment>
                      )
                      : (
                        <Link
                          className="link"
                          to="/Join/Type"
                        >
                              로그인 | 회원가입
                        </Link>
                      )
                  }
                </Grid>
              </Box>
            </Grid>
          </Hidden>
          <Hidden mdUp>
            <Grid item xs={6}>
              <Grid container justify="flex-end">
                <Grid item>
                  <div onClick={toggleDrawer(true)} className="menu-icon">
                    <MenuIcon />
                  </div>
                </Grid>
              </Grid>
              <Drawer anchor="right" open={openMenu} onClose={toggleDrawer(false)}>
                {sideList()}
              </Drawer>
            </Grid>
            <Grid item xs={1} />

          </Hidden>
        </Grid>
        {/* <Grid container className="bar" alignItems="center">
          <Hidden mdDown>
            <Grid container xs={4} justify="flex-end" spacing={3}>
               <a
                href={googleLink}
              >
                Sign Google
              </a>
               <GoogleLogin
                clientId="997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com" // CLIENTID                buttonText="LOGIN WITH GOOGLE"
                scope="profile email https://www.googleapis.com/auth/youtube.readonly"
                responseType="code"
                accessType="offline"
                prompt="consent"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
              />
               <Button variant="contained" color="secondary" onClick={signGoogle}>Sign Google</Button>
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
        </Grid> */}
      </AppBar>
    </div>
  );
}

export default withRouter(CustomNavbar);

{ /* <Button onClick={twitchLogin}>TwitchLogin</Button> */ }
{ /* <a onClick={test} href="https://id.twitch.tv/oauth2/authorize?client_id=hnwk0poqnawvjedf2nxzaaznj16e1g&redirect_uri=http://localhost:8080/testRoute/twiterTest&response_type=code&scope=user:edit+user:read:email">
                Sign In
              </a> */ }

{ /* <a href="https://id.twitch.tv/oauth2/authorize?client_id=hnwk0poqnawvjedf2nxzaaznj16e1g&redirect_uri=http://localhost:3000&response_type=token&scope=user:edit+user:read:email&force_verify=true">
                SignInLocal
              </a> */ }
