import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Field, Form, Formik, FormikProps, getIn, FieldProps, ErrorMessage, useField
} from 'formik';
import {
  Grid,
  Button,
  TextField,
  Box,
  FormHelperText,
  FormControl,
  Select,
  MenuItem,
  InputAdornment
} from '@material-ui/core';

function AdvertiserDetail({
  // user,
  location,
  history,
  match,
  changeUser
}) {
  const [userData, setUserData] = useState({});
  const [finishSign, setFinishSign] = useState(false);

  useEffect(() => {
    axios.get('/api/TB_ADVERTISER/', {
      params: {
        // token: user.token
        id: match.params.id,
      }
    }).then((res) => {
      setUserData({
        ...userData,
        email: res.data.data.ADV_EMAIL,
        name: res.data.data.ADV_NAME
      });
    });
    return () => {
      if (finishSign === 0) {
        axios.get('/api/TB_ADVERTISER/delete', {
          params: {
            id: match.params.id,
          }
        }).then((res) => {

        });
      }
    };
  }, []);

  React.useEffect(() => {
    if (finishSign) {
      history.push('/');
    }
  }, [finishSign]);

  /* history.block(({ pathname }) => {
    if (!finishSign && (pathname.indexOf('/Detail') === -1) && location.pathname.indexOf('/Join/Advertiser/SignUp/Detail/') !== -1) return '가입이 마무리하지 않으시면 모두 데이터는 삭제됩니다. 나가시겠습니까?';
  }); */

  const categories = {
    classification: [{ value: '1', text: '국내사업자' }, { value: '2', text: '해외사업자' }],
    jobType: [{ value: '1', text: '일반' }, { value: '2', text: '에이전시' }, { value: '3', text: '소상공인' }],
    subscribeAim: [{ value: '1', text: '인터넷 검색' }, { value: '2', text: '기사(보도자료)' }, { value: '3', text: '소셜미디어 광고' }, { value: '4', text: '지인추천' }, { value: '5', text: '이메일' }, { value: '6', text: '직접입력' }]
  };

  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email('잘못된 이메일 형식 입니다')
      .required('이메일을 입력해주세요'),
    classification: Yup.string()
      .required('사업자 구분을 입력해주세요'),
    /*registerNumber: Yup.string()
      .required('사업자 등록번호를 입력해주세요'),*/
    jobType: Yup.string()
      .required('직종을 입력해주세요'),
    name: Yup.string()
      .required('이름을 입력해주세요'),
    phone: Yup.string()
      .required('전화번호를 입력해주세요'),
    companyName: Yup.string()
      .min(2, '너무 짧습니다!')
      .max(50, '너무 김니다')
      .required('회사 명을 입력해주세요'),
  });

  const MySelect = ({
    label, ...props
  }) => {
    const [field, meta, helpers] = useField(props);

    return (
      <React.Fragment>
        <label htmlFor={label} style={{ display: 'block' }}>
          {label}
        </label>
        <FormControl variant="outlined" className="select-field">
          <Select
            value={meta.value}
            onChange={(event => helpers.setValue(event.target.value))}
          >
            {categories[props.name].map(item => (
              <MenuItem key={item.text} value={item.value}>{item.text}</MenuItem>
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
  };

  const MyTextField = ({
    label, ...props
  }) => {
    const [field, meta, helpers] = useField(props);
    const addProps = props.name === 'registerNumber'
      ? {
        endAdornment: (
          <InputAdornment position="end">
            {/* <AccountCircle /> */}
            <Button variant="contained" color="primary" className="registerNumber">인증</Button>
          </InputAdornment>
        ),
      } : {};


    return (
      <React.Fragment>
        <label htmlFor="jobType" style={{ display: 'block' }}>
          {label}
        </label>
        <TextField
          name={props.name}
          disabled={props.name === 'email'}
          className="text-field"
          value={meta.value}
          onChange={event => helpers.setValue(event.target.value)}
          onBlur={event => field.onBlur(event)}
          helperText={meta.touched && meta.error ? (
            <span className="error-message">{meta.error}</span>
          ) : null}
          margin="normal"
          variant="outlined"
          InputProps={addProps}
        />
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={{
          email: userData.email || '',
          classification: '',
          registerNumber: '',
          jobType: '',
          name: userData.name || '',
          phone: '',
          companyName: '',
          companyUrl: '',
          subscribeAim: '',
          agreement: false
        }}
        enableReinitialize
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          // same shape as initial values
          // console.log(values);
          const apiObj = { ...values, id: match.params.id };

          axios.post('/api/TB_ADVERTISER/update', apiObj)
            .then((res) => {
              if (res.data.code === 200) {
                changeUser({
                  social_type: res.data.social_type,
                  type: '1',
                  token: res.data.userToken,
                  name: res.data.userName,
                });
                setFinishSign(true);
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
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
        }) => (
          <Form>
            <Box p={{ xs: 5, md: 9 }} className="register-detail">
              <div className="main-title">회원가입</div>
              <div className="title">서비스 이용을 위해 회원정보를 입력해주세요.</div>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <MyTextField name="email" type="text" label="이메일 아이디" />
                  <MySelect name="classification" type="select" label="사업자 구분" />
                  <MyTextField name="registerNumber" type="text" label="사업자 등록번호" />
                  <MySelect name="jobType" type="select" label="기업구분" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MyTextField name="name" type="text" label="담당자 성함 / 직함" />
                  <MyTextField name="phone" type="text" label="담당자 연락처 (번호만 입력)" />
                  <MyTextField name="companyName" type="text" label="회사명" />
                  <MyTextField name="companyUrl" type="text" label="회사 홈페이지 (선택)" />
                  <MySelect name="subscribeAim" type="select" label="가입경로 (선택)" />
                </Grid>
              </Grid>
              <Grid container justify="center">
                <Grid item xs={12}>
                  <div className="agreement">
                              INFLAI의
                    {' '}
                    <span>이용약관</span>
                    {' '}
                              및
                    {' '}
                    <span>개인정보취급방침에</span>
                    {' '}
                              동의합니다.
                  </div>
                </Grid>
                <button className="submit-button" type="submit">무료가입</button>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
}

export default AdvertiserDetail;
