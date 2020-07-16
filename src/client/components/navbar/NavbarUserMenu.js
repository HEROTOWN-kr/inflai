import React from 'react';
import {
  Box, ClickAwayListener, Drawer, Grid, Hidden, Popper
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuIcon from '@material-ui/icons/Menu';

function NavbarUserMenu(props) {
  return (
    <Grid item xs={6} className="right-panel">
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
                                                  마케팅 요청
                                  </Link>
                                </Grid>
                              )
                              : null
                                  }

                            <Popper id={id} open={open} anchorEl={userMenu} onClose={handleClose} className="popper-main">
                              <ClickAwayListener onClickAway={handleClose}>
                                <div>
                                  <UserMenuItems />
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
        <Hidden lgUp>
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
      </Box>
    </Grid>
  );
}

export default NavbarUserMenu;
