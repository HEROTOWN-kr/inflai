import React from 'react';
import { Box, Grid } from '@material-ui/core';

function NotFound() {
  return (
    <Box pt={6} className="not-found-page">
      <div className="title1">페이지가 존재하지 않습니다.</div>
      <div className="title2">관리자에게 문의하시기 바랍니다.</div>
      <div className="title3">An error 404 occurred on server</div>
    </Box>
  );
}

export default NotFound;
