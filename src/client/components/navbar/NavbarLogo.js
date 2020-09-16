import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
// import Logo from '../../img/logo.png';
import Logo from '../../img/logo_blue.png';

function NavbarLogo() {
  const styles = {
    width: '255px',
    height: '41px',
    overflow: 'hidden',
    backgroundImage: `url(${Logo})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <Box my={3} className="logo">
      <Link
        to="/"
      >
        <div style={styles} />
      </Link>
    </Box>
  );
}

export default NavbarLogo;
