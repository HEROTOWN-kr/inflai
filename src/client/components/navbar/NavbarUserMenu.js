import React from 'react';
import { Box, Grid, Hidden } from '@material-ui/core';
import { Link } from 'react-router-dom';
import MobileUserMenu from './MobileView/MobileUserMenu';
import UserMenuPopper from './UserMenuPopper';


function NavbarUserMenu(props) {
  const { user } = props;

  function UserMenu() {
    return (
      <Hidden smDown>
        <Grid container alignItems="center" justify="flex-end">
          {
              user.name ? (
                <React.Fragment>
                  <UserMenuPopper {...props} />
                </React.Fragment>
              ) : (
                <Grid item>
                  <Link
                    className="link"
                    to="/Join/Type"
                  >
                          로그인 | 회원가입
                  </Link>
                </Grid>
              )
            }
        </Grid>
      </Hidden>
    );
  }


  return (
    <>
      <UserMenu />
      <MobileUserMenu {...props} />
    </>
  );
}

export default NavbarUserMenu;
