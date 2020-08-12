import { TableCell, withStyles } from '@material-ui/core';

const StyledTableCell = withStyles(theme => ({
  root: {
    padding: '10px',
  },
  head: {
    backgroundColor: '#3f4b5c',
    // backgroundColor: 'theme.palette.common.black',
    color: theme.palette.common.white,
    '&.number': {
      width: '8px'
    }
  },
  body: {
    fontSize: 14,
    '&.current': {
      backgroundColor: '#39ca66',
      color: '#ffffff'
    }
  },

}))(TableCell);

export default StyledTableCell;
