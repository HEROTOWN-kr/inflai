import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import {
  Box, Button, Divider, TextField
} from '@material-ui/core';
import axios from 'axios';
import * as Yup from 'yup';
import SocialNetworks from '../../login/SocialNetworks';

function AdvertiserSignUp({
  changeUser,
  history,
  match
}) {
  const [mainError, setMainError] = useState({});

  function signUp(values) {
    axios.post('/api/TB_ADVERTISER/signup', values)
      .then((res) => {
        if (res.data.code === 200) {
          // console.log(res.data);
          history.push(`${match.path}/Detail/${res.data.userId}`);
        } else if (res.data.code === 401) {
          setMainError({ message: res.data.message });
        } else {
          console.log(res);
        }
      })
      .catch(error => (error));
  }

  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email('잘못된 이메일 형식 입니다.')
      .required('이메일을 입력해주세요'),
    password: Yup.string()
      .required('비밀번호를 입력해주세요'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), null], '비밀번호가 일치해야합니다')
      .required('비밀번호 확인해주세요'),
    name: Yup.string()
      .required('이름을 입력해주세요'),
  });

  return (
    <div className="login-dialog">
      <Formik
        initialValues={{
          type: '1',
          email: '',
          password: '',
          passwordConfirm: '',
          name: ''
        }}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          signUp(values);
        }}
      >
        {({
          values, errors, touched, handleChange, handleBlur, setFieldValue
        }) => (
          <Box py={6} px={{ xs: 4, md: 6 }} className="signUpForm">
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} className="title">
                  <h2>회워가입</h2>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    placeholder="이메일"
                    name="email"
                    className="text-field"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.email && touched.email ? <span className="error-message">{errors.email}</span> : null}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    placeholder="비밀번호"
                    type="password"
                    name="password"
                    className="text-field"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.password && touched.password ? <span className="error-message">{errors.password}</span> : null}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    placeholder="비밀번호 확인"
                    type="password"
                    name="passwordConfirm"
                    className="text-field"
                    value={values.passwordConfirm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.passwordConfirm && touched.passwordConfirm ? <span className="error-message">{errors.passwordConfirm}</span> : null}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    placeholder="이름"
                    name="name"
                    className="text-field"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.name && touched.name ? <span className="error-message">{errors.name}</span> : null}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                {mainError.message
                  ? (
                    <Grid item xs={12}>
                      <Grid container justify="center">
                        <Grid item>
                          <div className="error-message">{mainError.message ? mainError.message : null}</div>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null
                    }

                <Grid item xs={12}>
                  <Button fullWidth type="submit" variant="contained" color="secondary" className="login-button">
                              회원가입
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Divider variant="middle" />
                </Grid>
                <Grid item xs={12} className="social-networks">
                  <SocialNetworks changeUser={changeUser} history={history} />
                </Grid>
              </Grid>
            </Form>
          </Box>
        )}
      </Formik>
    </div>
  );
}

export default AdvertiserSignUp;
