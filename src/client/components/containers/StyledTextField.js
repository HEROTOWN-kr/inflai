import React from 'react';
import { TextField, InputAdornment, withStyles } from '@material-ui/core';
import '../../css/sub.scss';
import { useField } from 'formik';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


const StyledTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-input': {
      padding: '10.5px 14px',
    }
  },
})(TextField);

export default StyledTextField;
