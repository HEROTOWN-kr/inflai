import { Box } from '@material-ui/core';
import React from 'react';
import { Colors } from '../../lib/Сonstants';

function WhiteBlock(props) {
  const {
    children, py, px, p
  } = props;
  return (
    <Box
      css={{ background: Colors.white }}
      border="1px solid #e9ecef"
      borderRadius="7px"
    >
      {children}
    </Box>
  );
}

export default WhiteBlock;
