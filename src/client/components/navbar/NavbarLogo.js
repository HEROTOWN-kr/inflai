import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Logo from '../../img/logo.png';

function NavbarLogo() {
  return (
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
  );
}

export default NavbarLogo;
