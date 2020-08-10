import { TableRow, withStyles } from '@material-ui/core';


const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

export default StyledTableRow;


/*.MuiTableCell-root {
    padding: 10px;
  }
  .MuiOutlinedInput-input {
    padding: 8px 14px;
  }*/