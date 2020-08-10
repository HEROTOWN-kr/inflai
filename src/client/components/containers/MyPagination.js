import React from 'react';
import { Pagination } from '@material-ui/lab';

function MyPagination(props) {
  const { page, changePage, perPage, itemCount } = props;
  const getPageCount = () => Math.ceil(itemCount / perPage);
  return (
    <Pagination
      variant="outlined"
      shape="rounded"
      color="primary"
      count={getPageCount()}
      page={page}
      onChange={changePage}
    />
  );
}

export default MyPagination;
