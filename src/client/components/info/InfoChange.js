import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import {
  Field, FieldArray, Form, Formik, getIn, useField
} from 'formik';
import axios from 'axios';
import NameArray from '../../lib/nameArray';

function InfoChange() {
  function MyTextField(props) {
    const [field, meta, helpers] = useField(props.name);

    return (
      <React.Fragment>
        <div className="label">
          <label htmlFor={props.label}>{props.label}</label>
        </div>
        <TextField
          name={field.name}
          id={props.label}
          placeholder=""
          value={meta.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          fullWidth
          variant="outlined"
          disabled={field.name === 'email'}
          helperText={meta.touched && meta.error ? (
            <span className="error-message">{meta.error}</span>
          ) : null}
        />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="form-container">
        <div className="title">
          계정정보 수정
        </div>
        <Formik
          initialValues={{
            instaAccount: '',
            instaList: '',
            nickName: '',
            email: '',
            country: 0,
            region: '',
            phone: '',
            product: ''
          }}
          enableReinitialize
          // validationSchema={SignupSchema}
          onSubmit={(values) => {
            // same shape as initial values
            // console.log(values);
            const apiObj = { ...values, id: match.params.id };

            axios.post('/api/TB_INFLUENCER/instaUpdate', apiObj)
              .then((res) => {
                if (res.data.code === 200) {
                  console.log(res);
                } else if (res.data.code === 401) {
                  console.log(res);
                } else {
                  console.log(res);
                }
              })
              .catch(error => (error));
          }}
        >
          {({
            values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm
          }) => (
            <Grid container justify="center" spacing={3} className="form-text">
              <Grid container justify="center" item xs={12}>
                <Grid item xs={6}>
                  <MyTextField name="nickName" label="이름" />
                </Grid>
              </Grid>
              <Grid container justify="center" item xs={12}>
                <Grid item xs={3} className="change-button edit">저장</Grid>
              </Grid>
            </Grid>
          )}
        </Formik>
      </div>
    </React.Fragment>
  );
}

export default InfoChange;
