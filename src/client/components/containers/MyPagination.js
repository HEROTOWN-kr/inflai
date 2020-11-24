import React from 'react';
import { Pagination } from '@material-ui/lab';

function MyPagination(props) {
  const {
    page, changePage, perPage, itemCount
  } = props;
  const pageCount = Math.ceil(itemCount / perPage);
  return (
    <Pagination
      variant="outlined"
      shape="rounded"
      color="primary"
      count={pageCount}
      page={page}
      onChange={changePage}
    />
  );
}

export default MyPagination;
