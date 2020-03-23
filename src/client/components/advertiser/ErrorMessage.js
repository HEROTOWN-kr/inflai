import React from 'react';
import { connect, getIn } from 'formik';

// This component renders an error message if a field has
// an error and it's already been touched.
const ErrorMessage = (props) => {
  // All FormikProps available on props.formik!
  const error = getIn(props.formik.errors, props.name);
  const touch = getIn(props.formik.touched, props.name);
  return (
    <div className="category-error">
      {touch && error ? error : null}
    </div>
  );
};

export default connect(ErrorMessage);
