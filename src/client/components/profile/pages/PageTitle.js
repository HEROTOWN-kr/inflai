import React from 'react';
import { Box } from '@material-ui/core';
import { Colors } from '../../../lib/Сonstants';

function PageTitle(props) {
  const { className, children } = props;

  return (
    <Box py={4} px={4} borderBottom={`1px solid ${Colors.grey4}`}>{children}</Box>
  );
}

export default PageTitle;
