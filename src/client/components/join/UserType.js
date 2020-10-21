import React from 'react';
import {
  Box, Button, FormControl, FormControlLabel, FormHelperText, Grid, Radio, RadioGroup
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Influencer from '../../img/influencer.png';
import Advertiser from '../../img/advert2.png';

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
    /* type: Yup.string()
      .required('직군을 선택주세요'), */
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
        <Grid item xs={12}>
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
      <Box py={4}>
        <Formik
          initialValues={{
            type: '',
          }}
          enableReinitialize
          validationSchema={mySchema}
          onSubmit={(values) => {
            changeUserData({ type: values.type });
            // goTo(values.type === '1' ? '/Advertiser/Login' : '/Influencer/sns');
            goTo(values.type === '1' ? '/Advertiser/Login' : '/Influencer/Login');
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
            <div>
              <div className="title">직군을 선택주세요</div>
              <RadioGroup row aria-label="type" name="type" value={values.type} onChange={event => selectType(event.target.value, setFieldValue, submitForm)}>
                <Grid container spacing={1}>
                  {types.map(item => (
                    <Grid item xs={12} md={6} key={item.value}>
                      <label>
                        <StyledRadio item={item} selected={values.type} />
                      </label>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </div>
          )}
        </Formik>
      </Box>
    </div>
  );
}

export default UserType;
