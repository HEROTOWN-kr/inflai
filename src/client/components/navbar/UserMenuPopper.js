import React, { useContext } from 'react';
import {
  Box, ClickAwayListener, Divider, Grid, Popper, IconButton
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Search } from '@material-ui/icons';
import LogOutButton from '../login/LogOutButton';
import UserMenuItems from './UserMenuItems';
import AuthContext from '../../context/AuthContext';
import defaultAccountImage from '../../img/default_account_image.png';
import StyledImage from '../containers/StyledImage';

function UserMenuPopper(props) {
  const { history, user } = props;
  const { userName, userPhoto } = useContext(AuthContext);


  const [userMenu, setUserMenu] = React.useState(null);

  const open = Boolean(userMenu);
  const id = open ? 'simple-popover' : undefined;

  function openUserMenu(event) {
    setUserMenu(userMenu ? null : event.currentTarget);
  }

  const handleClose = () => {
    setUserMenu(null);
  };

  history.listen((location) => {
    handleClose();
  });

  return (
    <React.Fragment>
      <div>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <div onClick={openUserMenu} className="right-side">
              <StyledImage
                width="40px"
                height="40px"
                borderRadius="100%"
                src={userPhoto || defaultAccountImage}
                className="navbarProfileImage"
              />
            </div>
          </Grid>
          <Grid item>
            <IconButton aria-label="delete">
              <Search fontSize="large" />
            </IconButton>
            {/* <StyledImage
              width="40px"
              height="40px"
              src={defaultAccountImage}
            /> */}
          </Grid>
        </Grid>

        <Popper
          id={id}
          open={open}
          anchorEl={userMenu}
          onClose={handleClose}
          modifiers={{
            offset: {
              enabled: true,
              offset: '0, 22'
            }
          }}
          className="popper-main"
        >
          <ClickAwayListener onClickAway={handleClose}>
            <div>
              <UserMenuItems {...props} />
            </div>
          </ClickAwayListener>
        </Popper>
      </div>

      {/* <Grid container item aria-describedby={id} className="name-holder" onClick={openUserMenu}>
        <Grid item>
          <div className="name-text">{userName}</div>
        </Grid>
        <Grid item>
          <ExpandMoreIcon />
        </Grid>
      </Grid> */}


    </React.Fragment>
  );
}

export default UserMenuPopper;
