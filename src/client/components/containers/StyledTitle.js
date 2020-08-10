import React from 'react';
import { Box } from '@material-ui/core';

function StyledTitle(props) {
  const { title } = props;

  return (
    <Box mb={1} component="h2">{title}</Box>
  );
}

export default StyledTitle;
