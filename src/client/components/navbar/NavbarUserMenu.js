import React, { useContext } from 'react';
import { Box, Grid, Hidden } from '@material-ui/core';
import { Link } from 'react-router-dom';
import MobileUserMenu from './MobileView/MobileUserMenu';
import UserMenuPopper from './UserMenuPopper';
import AuthContext from '../../context/AuthContext';


function NavbarUserMenu(props) {
  const { user } = props;
  const { isAuthenticated } = useContext(AuthContext);

  function UserMenu() {
    return (
      <Hidden smDown>
        {
          isAuthenticated ? (
            <UserMenuPopper {...props} />
          ) : (
            <Link
              className="link"
              to="/Join/Type"
            >
                  로그인 | 회원가입
            </Link>
          )
        }
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
