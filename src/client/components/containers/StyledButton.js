import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Colors } from '../../lib/Сonstants';

const useStyles = makeStyles({
  root: ({
    background, border, borderRadius, boxShadow, color, height, padding, hoverBackground
  }) => ({
    background: background || Colors.blue2,
    border: border || 0,
    borderRadius: borderRadius || 3,
    boxShadow: boxShadow || 'none',
    color: color || 'white',
    height: height || 48,
    padding: padding || '0 30px',
    '&:hover': {
      background: hoverBackground || Colors.blue2Hover
    }
  }),
});

function StyledButton(props) {
  const {
    className,
    children,
    onClick,
    disabledObj,
  } = props;
  const classes = useStyles(props);

  return (
    <Button
      variant="contained"
      fullWidth
      className={`${classes.root} ${className}`}
      onClick={onClick}
      disabled={disabledObj}
    >
      {children}
    </Button>
  );
}

export default StyledButton;
