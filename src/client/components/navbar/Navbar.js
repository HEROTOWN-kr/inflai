import React, { useCallback, useEffect, useState } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {
  AppBar,
  Grid,
  Box, Hidden
} from '@material-ui/core';

import NavbarLinks from './NavbarLinks';
import NavbarLogo from './NavbarLogo';
import NavbarUserMenu from './NavbarUserMenu';
import NavbarMobileMenu from './MobileView/NavbarMobileMenu';

function CustomNavbar(props) {
  return (
    <Box px={{ xs: 2, sm: 4, md: 8 }} className="navbar">
      <AppBar position="static" color="transparent" className="navbar-content">
        <Grid container alignItems="center" justify="space-between" className="bar">
          <Grid item className="left-side" container alignItems="center" justify="space-between">
            <Grid item>
              <NavbarLogo />
            </Grid>
            <Grid item>
              <NavbarLinks {...props} />
            </Grid>
          </Grid>
          <Grid item className="right-side">
            <Grid container justify="flex-end" alignItems="center">
              <Grid item>
                <NavbarUserMenu {...props} />
              </Grid>
              {props.user.type === '1' ? (
                <Hidden smDown>
                  <Grid item>
                    <Link
                      className="link"
                      to="/Product"
                    >
                        마케팅 요청
                    </Link>
                  </Grid>
                </Hidden>
              ) : null }
            </Grid>
          </Grid>
          <NavbarMobileMenu {...props} />
        </Grid>
      </AppBar>
    </Box>
  );
}

export default withRouter(CustomNavbar);
