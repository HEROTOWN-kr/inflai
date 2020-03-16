import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';

function UserType({
  userType,
  changeUserType
}) {
  return (
    <FormControl component="fieldset" className="">
      <FormLabel component="legend">회원 직무</FormLabel>
      <RadioGroup row aria-label="gender" name="gender1" value={userType} onChange={changeUserType}>
        <FormControlLabel value="1" control={<Radio />} label="광고주" />
        <FormControlLabel value="2" control={<Radio />} label="인플루언서" />
      </RadioGroup>
    </FormControl>
  );
}

export default UserType;
