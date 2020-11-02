import React from 'react';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const theme = createMuiTheme({
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    values: {
      xs: 0, sm: 600, md: 960, lg: 1280, xl: 1600, xxl: 1920
    }
  }
});

const styles = theme => ({
  root: {
    backgroundColor: 'blue',
    [theme.breakpoints.down('md')]: {
      backgroundColor: 'red',
    },
  },
  item: {

  }
});

export default function StyledGrid({ xxl, ...other }) {
  // const classes =

  return (
    <Grid {...other} />
  );
}
