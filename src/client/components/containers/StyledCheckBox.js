import { Checkbox, withStyles } from '@material-ui/core';

const StyledCheckBox = withStyles(theme => ({
  root: {
    /*'& .PrivateSwitchBase-root-16': {
      padding: '0'
    },*/
    padding: '0'
  },
}))(Checkbox);

export default StyledCheckBox;
