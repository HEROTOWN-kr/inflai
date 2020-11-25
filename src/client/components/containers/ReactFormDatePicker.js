import React from 'react';
import { Controller } from 'react-hook-form';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

function ReactFormDatePicker(props) {
  const {
    control, setValue, handleBlur, getValues, name
  } = props;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Controller
        as={(<KeyboardDatePicker />)}
        control={control}
        autoOk
        // disablePast
        name={name}
        defaultValue={new Date()}
        disableToolbar
        variant="inline"
        format="yyyy/MM/dd"
        margin="normal"
        id="date-picker-inline"
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        onChange={(date) => {
          setValue('receivedDate', date);
          handleBlur(getValues().id, 'receivedDate'); // Managing patch save at server
          return { value: date }; // important to update the controller value after change else state is updated and the controller will not render
        }}
      />
    </MuiPickersUtilsProvider>
  );
}


export default ReactFormDatePicker;
