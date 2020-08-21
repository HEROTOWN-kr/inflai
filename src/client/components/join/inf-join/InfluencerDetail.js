import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import YouTube from 'react-youtube';
import {
  Field, FieldArray, Form, Formik, getIn, useField
} from 'formik';
import axios from 'axios';
import {
  Box,
  Button, CircularProgress, Divider, FormControlLabel, Radio, RadioGroup, TextField
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import * as Yup from 'yup';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import { city, area } from '../../../lib/Сonstants';
import Common from '../../../lib/common';


function InfluencerDetail({
  userData,
  changeUserData,
  changeUser,
  match,
  history
}) {
  const [userInfo, setUserInfo] = useState({});
  const [igData, setIgData] = useState([]);

  useEffect(() => {
    axios.get('/api/TB_INFLUENCER/getInstaAccounts', {
      params: {
        id: match.params.id,
      }
    }).then((res) => {
      console.log(res.data);
      setUserInfo(res.data.info);
      if (res.data.data) {
        setIgData(res.data.data);
      }
    });
  }, []);

  const SignupSchema = Yup.object().shape({
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
    instaAccount: Yup.string()
      .when(['instaList'], {
        is: instaList => instaList.length,
        then: Yup.string().required('인스타 계정을 선택해주세요'),
      }),
    blogUrl: Yup.string()
      .when(['blogType'], {
        is: blogType => blogType === '3',
        then: Yup.string().required('블로그 URL을 입력해주세요'),
      }),
    product: Yup.string()
      .required('제품, 서비스를 입력해주세요')
  });

  function MySelect(props) {
    const [field, meta, helpers] = useField(props.name);
    const renderArray = props.name === 'country' ? city : area[props.countryIndex];

    return (
      <React.Fragment>
        <div className="label-holder">
          <label htmlFor={props.label}>{props.label}</label>
        </div>
        <FormControl error={meta.touched && meta.error} variant="outlined" className="select-field" fullWidth>
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
          error={meta.touched && meta.error}
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

  function StyledRadio({
    item,
    selected
  }) {
    return (
      <Grid container className={`card ${item.id === selected ? 'selected' : null}`}>
        <Grid item xs={12} className="card-avatar">
          <Box pt={3}>
            <img src={item.picture} alt="avatar" />
          </Box>
        </Grid>
        <Grid item xs={12} className="cart-text">
          <p>{item.username}</p>
        </Grid>
        <Radio value={item.id} style={{ display: 'none' }} />
      </Grid>
    );
  }

  return (
    <div container className="influencer-page">
      <div className="second-title">상세 정보 입력</div>
      <Formik
        initialValues={{
          instaAccount: '',
          instaList: igData,
          nickName: userInfo.name,
          email: userInfo.email,
          country: 0,
          region: '',
          phone: '',
          product: '',
          blogUrl: '',
          blogType: userInfo.blogType,
          message: 0
        }}
        enableReinitialize
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          // same shape as initial values
          // console.log(values);
          const apiObj = { ...values, id: match.params.id };

          axios.post('/api/TB_INFLUENCER/instaUpdate', apiObj)
            .then((res) => {
              if (res.data.code === 200) {
                changeUser({
                  social_type: res.data.social_type,
                  type: '2',
                  token: res.data.userToken,
                  name: res.data.userName
                });
                history.push('/');
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
          <React.Fragment>
            <Box px={{ xs: 3, md: 6 }} py={{ md: 8 }} className="form">
              {
                userInfo.name
                  ? (
                    <Form>
                      <Grid container spacing={5}>
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <MyTextField name="nickName" label="닉네임" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <MyTextField name="email" label="이메일" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <MyTextField name="phone" label="전화번호" />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <MySelect name="country" type="select" label="시/도" countryIndex={values.country} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              {
                                                values.country
                                                  ? <MySelect name="region" type="select" countryIndex={values.country} label="구/군" />
                                                  : null
                                            }
                            </Grid>
                          </Grid>
                        </Grid>

                        {
                              igData.length > 0
                                ? (
                                  <React.Fragment>
                                    <Grid item xs={12}>
                                      <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <div className="label-holder">
                                        <label htmlFor="인스타 계정">인스타 계정</label>
                                      </div>
                                      <FormControl fullWidth>
                                        <RadioGroup row aria-label="instaAccount" name="instaAccount" value={values.instaAccount} onChange={event => setFieldValue('instaAccount', event.target.value)}>
                                          <Grid container spacing={2}>
                                            {igData.map(item => (
                                              <Grid item xs={6} sm={4} key={item.id}>
                                                {/* <FormControlLabel value="1" control={<StyledRadio item={item} selected={values.instaAccount} />} style={{ margin: '0' }} /> */}
                                                <label>
                                                  <StyledRadio item={item} selected={values.instaAccount} />
                                                </label>
                                              </Grid>
                                            ))}
                                          </Grid>
                                        </RadioGroup>
                                        <FormHelperText id="my-helper-text">{errors.instaAccount && touched.instaAccount ? <span className="error-message">{errors.instaAccount}</span> : null}</FormHelperText>
                                      </FormControl>
                                    </Grid>
                                  </React.Fragment>
                                )
                                : null
                          }
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        {
                              values.blogType === '3' ? (
                                <Grid item xs={12}>
                                  <MyTextField name="blogUrl" label="블로그 URL" />
                                </Grid>
                              ) : null
                          }
                        <Grid item xs={12}>
                          <MyTextField name="product" label="제품, 서비스" />
                        </Grid>
                        <Grid item xs={12}>
                          <input id="kakaoCheck" type="checkbox" checked={values.message} style={{ margin: '0' }} onChange={e => setFieldValue('message', e.target.checked ? 1 : 0)} />
                          <label htmlFor="kakaoCheck">
                            {' 카카오톡 통한 캠페인 모집 및 추천, 이벤트 정보 등의 수신에 동의합니다.'}
                          </label>
                        </Grid>
                      </Grid>
                    </Form>
                  )
                  : (
                    <Grid container justify="center">
                      <Grid item>
                        <CircularProgress />
                      </Grid>
                    </Grid>
                  )
                }
            </Box>
            <Grid container justify="center">
              <Grid item xs={6}>
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
          </React.Fragment>
        )}
      </Formik>
    </div>
  );
}

export default InfluencerDetail;
