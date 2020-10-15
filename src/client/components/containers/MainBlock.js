import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  common: ({ maxWidth }) => ({
    maxWidth: `${maxWidth}px` || '300px',
    margin: '0 auto'
  }),
});

function MainBlock(props) {
  const { className, children } = props;
  const classes = useStyles(props);

  return (
    <div className={`${classes.common} ${className}`}>
      {children}
    </div>
  );
}

export default MainBlock;
