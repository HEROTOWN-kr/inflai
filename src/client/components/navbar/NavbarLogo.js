import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Logo from '../../img/logo.png';

function NavbarLogo() {
  const styles = {
    width: '80px',
    height: '60px',
    overflow: 'hidden',
    backgroundImage: `url(${Logo})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <Box my={2} className="logo">
      <Link
        to="/"
      >
        <div style={styles} />
      </Link>
    </Box>
  );
}

export default NavbarLogo;
