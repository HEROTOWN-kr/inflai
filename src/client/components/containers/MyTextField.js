import React from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import '../../css/sub.scss';
import { useField } from 'formik';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


function MyTextField(props) {
  const theme = createMuiTheme({
    overrides: {
      // Style sheet name ⚛️
      MuiOutlinedInput: {
        // Name of the rule
        input: {
          // Some CSS
          padding: '10.5px 14px',
        },
      },
    },
  });

  const {
    name, label, ph, sA, eA
  } = props;
  const [field, meta, helpers] = useField(name);

  const adornments = {};
  if (sA) adornments.startAdornment = <InputAdornment disablePointerEvents position="start">{sA}</InputAdornment>;
  if (eA) adornments.endAdornment = <InputAdornment disablePointerEvents position="end">{eA}</InputAdornment>;


  return (
    <React.Fragment>
      <div className="label-holder">
        <label htmlFor={label}>{label}</label>
      </div>
      <ThemeProvider theme={theme}>
        <TextField
          error={meta.touched && meta.error}
          name={field.name}
          id={label}
                // className={classes.textField}
          placeholder={ph || null}
          value={meta.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          fullWidth
          variant="outlined"
          InputProps={adornments}
          helperText={meta.touched && meta.error ? (
            <span className="error-message">{meta.error}</span>
          ) : null}
        />
      </ThemeProvider>

    </React.Fragment>
  );
}

export default MyTextField;
