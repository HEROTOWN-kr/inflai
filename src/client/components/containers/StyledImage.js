import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  common: ({
    width, margin, height, borderRadius, border
  }) => ({
    display: 'block',
    margin: margin || '0 auto',
    width: `${width}` || 'auto',
    height: `${height}` || 'auto',
    borderRadius: borderRadius || 0,
    border: border || 'medium none color'
  }),
});

function StyledImage(props) {
  const {
    className, src, onMouseOver
  } = props;
  const classes = useStyles(props);

  return (
    <img src={src} className={`${classes.common} ${className}`} onMouseOver={onMouseOver} alt="noImage" />
  );
}

export default StyledImage;
