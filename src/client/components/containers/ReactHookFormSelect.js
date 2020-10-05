import React, { useRef } from 'react';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import { Controller } from 'react-hook-form';
import FormHelperText from '@material-ui/core/FormHelperText';
import StyledSelect from './StyledSelect';

const ReactHookFormSelect = ({
  name,
  label,
  control,
  defaultValue,
  children,
  rules,
  error,
  errorMessage,
  ...props
}) => {
  const selectEl = useRef(null);

  return (
    <FormControl {...props}>
      <Controller
        as={(
          <StyledSelect
            error={error}
            inputProps={{
              ref: selectEl
            }}
          >
            {children}
          </StyledSelect>
)}
        name={name}
        control={control}
        rules={rules}
        onFocus={() => {
          selectEl.current.focus();
        }}
        defaultValue={defaultValue}
      />
      <FormHelperText>
        {error ? (
          <span className="error-message">{errorMessage}</span>
        ) : null}
      </FormHelperText>
    </FormControl>
  );
};
export default ReactHookFormSelect;
