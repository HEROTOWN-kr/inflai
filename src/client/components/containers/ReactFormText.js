import React from 'react';
import { useForm } from 'react-hook-form';
import { Checkbox } from '@material-ui/core';
import StyledTextField from './StyledTextField';


function ReactFormText(props) {
  const {
    name, errorMessage, register, errors, placeholder, disabled, inputProps
  } = props;

  return (
    <StyledTextField
      variant="outlined"
      fullWidth
      name={name}
      disabled={disabled}
      placeholder={placeholder || ''}
      // defaultValue={UserInfo.INF_NAME || ''}
      inputRef={register}
      error={!!errors[name]}
      helperText={<span className="error-message">{errors[name]?.message}</span>}
      css={{ transition: 'all 1s ease-out' }}
      inputProps={inputProps || {}}
    />
  );
}


export default ReactFormText;
