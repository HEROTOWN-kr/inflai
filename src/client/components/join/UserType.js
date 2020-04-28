import React from 'react';
import {
  Box, Button, FormControl, FormControlLabel, FormHelperText, Grid, Radio, RadioGroup
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Influencer from '../../img/influencer.png';
import Advertiser from '../../img/advertiser.png';

function UserType({
  goTo,
  changeUserData
}) {
  const types = [
    {
      text: '광고주',
      value: '1',
      image: Advertiser
    },
    {
      text: '인플루언서',
      value: '2',
      addClass: 'blue',
      image: Influencer
    }
  ];

  const mySchema = Yup.object().shape({
    /*type: Yup.string()
      .required('직군을 선택주세요'),*/
  });

  function StyledRadio({
    item,
    selected
  }) {
    return (
      <Grid container className={`card ${item.addClass ? item.addClass : null} ${item.value === selected ? 'selected' : null}`} justify="center">
        <Grid item>
          <Box component="img" src={item.image} />
        </Grid>
        <Grid item md={12}>
          <p>{item.text}</p>
        </Grid>
        <Radio value={item.value} style={{ display: 'none' }} />
      </Grid>
    );
  }

  function selectType(value, setFieldValue, submitForm) {
    setFieldValue('type', value);
    submitForm();
  }

  return (
    <div className="join-type">
      <Grid container justify="center">
        <Grid item md={6}>
          <Box py={4}>
            <Formik
              initialValues={{
                type: '',
              }}
              enableReinitialize
              validationSchema={mySchema}
              onSubmit={(values) => {
                changeUserData({ type: values.type });
                goTo(values.type === '1' ? '/Advertiser' : '/Influencer/sns');
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
                setFieldTouched,
                submitForm
              }) => (
                <Grid container spacing={5} justify="center">
                  <Grid item md={12} className="title">직군을 선택주세요</Grid>

                  <Grid item md={12}>
                    <FormControl>
                      <RadioGroup row aria-label="type" name="type" value={values.type} onChange={event => selectType(event.target.value, setFieldValue, submitForm)}>
                        <Grid container spacing={5}>
                          {types.map(item => (
                            <Grid item md={6} key={item.value}>
                              <FormControlLabel value="1" control={<StyledRadio item={item} selected={values.type} />} />
                            </Grid>
                          ))}
                        </Grid>
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </Formik>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default UserType;
