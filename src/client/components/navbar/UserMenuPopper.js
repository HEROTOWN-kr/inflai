import React, { useContext } from 'react';
import {
  Box, ClickAwayListener, Divider, Grid, Popper
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LogOutButton from '../login/LogOutButton';
import UserMenuItems from './UserMenuItems';
import AuthContext from '../../context/AuthContext';

function UserMenuPopper(props) {
  const { history, user } = props;
  const { userName } = useContext(AuthContext);


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
      <Grid container item aria-describedby={id} className="name-holder" onClick={openUserMenu}>
        <Grid item>
          <div className="name-text">{userName}</div>
        </Grid>
        <Grid item>
          <ExpandMoreIcon />
        </Grid>
      </Grid>

      <Popper id={id} open={open} anchorEl={userMenu} onClose={handleClose} className="popper-main">
        <ClickAwayListener onClickAway={handleClose}>
          <div>
            <UserMenuItems {...props} />
          </div>
        </ClickAwayListener>
      </Popper>
    </React.Fragment>
  );
}

export default UserMenuPopper;
