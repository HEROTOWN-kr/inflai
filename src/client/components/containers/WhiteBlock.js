import { Box } from '@material-ui/core';
import React from 'react';
import { Colors } from '../../lib/Сonstants';

function WhiteBlock(props) {
  const {
    children, borderRadius, height
  } = props;
  return (
    <Box
      css={{ background: Colors.white }}
      border="1px solid #e9ecef"
      borderRadius={borderRadius || '7px'}
      height={height || 'auto'}
    >
      {children}
    </Box>
  );
}

export default WhiteBlock;
