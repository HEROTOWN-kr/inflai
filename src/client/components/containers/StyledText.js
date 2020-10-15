import React from 'react';
import { makeStyles } from '@material-ui/core';
import { textAlign } from '@material-ui/system';
import { Colors } from '../../lib/Сonstants';

const useStyles = makeStyles({
  common: ({
    fontSize, lineHeight, color, fontWeight, textAlign
  }) => ({
    fontSize: `${fontSize}px` || '14px',
    lineHeight: lineHeight || '1em',
    color: color || Colors.black,
    fontWeight: fontWeight || 'normal',
  }),
});

function StyledText(props) {
  const {
    className, children
  } = props;
  const classes = useStyles(props);

  return (
    <div className={`${classes.common} ${className}`}>
      {children}
    </div>
  );
}

export default StyledText;
