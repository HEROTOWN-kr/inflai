import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  common: ({
    width, margin, height
  }) => ({
    display: 'block',
    margin: margin || '0 auto',
    width: `${width}px` || 'auto',
    height: `${height}px` || 'auto',
  }),
});

function StyledImage(props) {
  const {
    className, src
  } = props;
  const classes = useStyles(props);

  return (
    <img src={src} className={`${classes.common} ${className}`} alt="noImage" />
  );
}

export default StyledImage;
