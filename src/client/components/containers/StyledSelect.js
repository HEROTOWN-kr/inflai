import { Select, withStyles } from '@material-ui/core';

const StyledSelect = withStyles(theme => ({
  root: {
    '&.MuiOutlinedInput-input': {
      padding: '10px 14px',
      paddingRight: '32px'
    },
  },
}))(Select);

export default StyledSelect;
