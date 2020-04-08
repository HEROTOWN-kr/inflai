import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import Grid from '@material-ui/core/Grid';
import {
  Formik, Form, Field, FieldArray, getIn, FastField, useField
} from 'formik';
import * as Yup from 'yup';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { Button, TextField, Divider } from '@material-ui/core';

import axios from 'axios';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import Common from '../../lib/common';
import NameArray from '../../lib/nameArray';


import Minus from '../../img/minus.svg';
import Plus from '../../img/plus.svg';


function Influencer({
  user
}) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (user.token) {
      axios.get('/api/TB_INFLUENCER/', {
        params: {
          token: user.token
        }
      })
        .then((res) => {
          setUserData({
            ...userData,
            email: res.data.data.INF_EMAIL,
            name: res.data.data.INF_NAME
          });
        });
    }
  }, []);

  const opts = {
    height: '390',
    width: '100%',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 0
    }
  };

  const list = [
    '15 - 30min chat about your product and marketing goals.',
    'Walk through of the most intelligent influencers marketing platform.',
    'Recommendations on which influencers to work with.',
    'Thorough advice on gow to use Matchmade most efficiently.',
    'Personal, human contact'
  ];

  const SignupSchema = Yup.object().shape({
    channel: Yup.array().of(Yup.object().shape({
      type: Yup.string().required('유형을 선택해주세요'),
      link: Yup.string().required('채널 주소를 입력해주세요')
    })),
    nickName: Yup.string()
      .required('닉네임을 입력해주세요'),
    email: Yup.string()
      .email('Invalid email')
      .required('이메일을 입력해주세요'),
    country: Yup.number()
      .min(1, '시/도 을 선택해주세요'),
    region: Yup.number()
      .required('구/군 을 선택해주세요'),
    phone: Yup.string()
      .required('전화번호를 입력해주세요'),
    product: Yup.string()
      .required('제품, 서비스를 입력해주세요')
  });

  function MySelect(props) {
    const [field, meta, helpers] = useField(props.name);
    const renderArray = props.name === 'country' ? NameArray.city() : NameArray.area()[props.countryIndex];

    return (
      <React.Fragment>
        <div className="label-holder">
          <label htmlFor={props.label}>{props.label}</label>
        </div>
        <FormControl variant="outlined" className="select-field" fullWidth>
          <Select
            id={props.label}
            value={meta.value}
            onChange={(event => helpers.setValue(event.target.value))}
          >
            {renderArray.map((item, index) => (
              <MenuItem key={item} value={index}>{item}</MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {meta.touched && meta.error ? (
              <span className="error-message">{meta.error}</span>
            ) : null}
          </FormHelperText>
        </FormControl>
      </React.Fragment>
    );
  }

  function MyTextField(props) {
    const [field, meta, helpers] = useField(props.name);

    return (
      <React.Fragment>
        <div className="label-holder">
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

  const ErrorMessage = ({ name }) => (
    <Field
      name={name}
      type="text"
    >
      {({ field, form, meta }) => {
        const error = getIn(form.errors, name);
        const touch = getIn(form.touched, name);
        return touch && error ? error : null;
      }}
    </Field>
  );

  return (
    <Grid container className="influencer-page wraper three">
      <Grid item xs={12} className="first-title">
          Request demo
      </Grid>
      <Grid item xs={12} className="second-title">
            Let's get started together and see what we can do for you
      </Grid>

      <Grid item xs={12}>
        <Grid container>
          <Grid item md={6}>
            <Grid container justify="center" spacing={4}>
              <Grid item md={8}>
                <YouTube
                  videoId="2g811Eo7K8U"
                  opts={opts}
                />
              </Grid>
              <Grid item md={8} className="youtube">
                <div className="youtube-title">By requesting a demo you get:</div>
                <ul>
                  {list.map(item => (
                    <li>{item}</li>
                  ))}
                </ul>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6}>
            <Formik
              initialValues={{
                channel: [
                  {
                    type: '',
                    link: ''
                  }
                ],
                nickName: userData.name,
                email: userData.email,
                country: 0,
                region: '',
                phone: '',
                product: '',
                agreement: false
              }}
              enableReinitialize
              validationSchema={SignupSchema}
              onSubmit={(values) => {
                // same shape as initial values
                // console.log(values);
                const apiObj = { ...values, token: Common.getUserInfo().token };

                axios.post('/api/TB_INFLUENCER/updateInfo', apiObj)
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
                <Grid container>
                  <Grid item md={10}>
                    <div className="form">
                      <Form>
                        <Grid container spacing={5}>
                          <Grid item md={12}>
                            <Grid container spacing={2}>
                              <Grid item md={6}>
                                <MyTextField name="nickName" label="닉네임" />
                              </Grid>
                              <Grid item md={6}>
                                <MyTextField name="email" label="이메일" />
                              </Grid>
                              <Grid item md={6}>
                                <MyTextField name="phone" label="전화번호" />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item md={12}>
                            <Divider />
                          </Grid>
                          <Grid item md={12}>
                            <Grid container spacing={2}>
                              <Grid item md={6}>
                                <MySelect name="country" type="select" label="시/도" countryIndex={values.country} />
                              </Grid>
                              <Grid item md={6}>
                                {
                                  values.country
                                    ? <MySelect name="region" type="select" countryIndex={values.country} label="구/군" />
                                    : null
                                }
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item md={12}>
                            <Divider />
                          </Grid>
                          <Grid item md={12}>
                            <Grid container spacing={2}>
                              <FieldArray
                                name="channel"
                                render={arrayHelpers => (
                                  <React.Fragment>
                                    {values.channel.map((ch, inx) => (
                                      <React.Fragment key={inx}>
                                        <Grid item md={3}>
                                          <div className="label-holder">
                                            <label htmlFor="채널">채널</label>
                                          </div>
                                          <FormControl variant="outlined" className="select-field" fullWidth>
                                            <Select
                                              id="채널"
                                              name={`channel.${inx}.type`}
                                              value={values.channel[inx].type}
                                              onChange={(event => setFieldValue(`channel.${inx}.type`, event.target.value))}
                                            >
                                              {NameArray.blog().map((item, index) => (
                                                <MenuItem key={item} value={index}>{item}</MenuItem>
                                              ))}
                                            </Select>
                                            <FormHelperText>
                                              {/* {errors.channel[inx].type && errors.channel[inx].type ? (
                                                <div className="error-message">{errors.channel[inx].type}</div>
                                              ) : null} */}
                                            </FormHelperText>
                                          </FormControl>
                                          <div className="error-message">
                                            <ErrorMessage name={`channel.${inx}.type`} />
                                          </div>
                                        </Grid>
                                        <Grid item md={6}>
                                          <MyTextField name={`channel.${inx}.link`} label="채널 주소" />
                                        </Grid>
                                        <Grid item md={3}>
                                          <div className="label-holder">
                                            <label htmlFor="채널" />
                                          </div>
                                          <div className="add">
                                            { values.channel.length > 1
                                              ? (
                                                <IndeterminateCheckBoxIcon onClick={() => arrayHelpers.remove(inx)} />
                                              ) : null
                                              }
                                            { values.channel.length < 3 && inx === 0
                                              ? (
                                                <AddBoxIcon onClick={() => arrayHelpers.push({ type: '', link: '' })} />
                                              ) : null
                                              }
                                          </div>
                                        </Grid>
                                      </React.Fragment>
                                    ))}
                                  </React.Fragment>
                                )}
                              />
                            </Grid>
                          </Grid>
                          <Grid item md={12}>
                            <Divider />
                          </Grid>
                          <Grid item md={12}>
                            <MyTextField name="product" label="제품, 서비스" />
                          </Grid>
                        </Grid>
                      </Form>
                    </div>
                  </Grid>
                  <Grid item md={10}>
                    <Grid container justify="center">
                      <Grid item md={6}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          className="submit-button"
                          onClick={submitForm}
                        >
                                  저장
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Influencer;
