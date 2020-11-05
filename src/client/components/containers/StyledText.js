import React from 'react';
import { makeStyles } from '@material-ui/core';
import { textAlign } from '@material-ui/system';
import { Colors } from '../../lib/Сonstants';

const useStyles = makeStyles({
  common: ({
    fontSize, lineHeight, color, fontWeight, textAlign, overflowHidden, cursor
  }) => ({
    fontSize: fontSize ? `${fontSize}px` : '14px',
    lineHeight: lineHeight || '1em',
    color: color || Colors.black,
    fontWeight: fontWeight || 'normal',
    textAlign: textAlign || 'inherit',
    overflow: overflowHidden ? 'hidden' : 'visible',
    whiteSpace: overflowHidden ? 'nowrap' : 'normal',
    textOverflow: overflowHidden ? 'ellipsis' : 'clip',
    cursor: cursor || 'auto'
  }),
});

/* overflow: hidden !important;
white-space: nowrap;
text-overflow: ellipsis; */

function StyledText(props) {
  const {
    className, children, onClick
  } = props;
  const classes = useStyles(props);

  return (
    <div className={`${classes.common} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

export default StyledText;
