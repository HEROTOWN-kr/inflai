import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import {
  Box, Button, Divider, TextField
} from '@material-ui/core';
import SocialNetworks from '../../login/SocialNetworks';

function AdvertiserLogin({
  changeUser,
  history
}) {
  const [mainError, setMainError] = useState({});

  function logIn(values) {
    axios.post('/api/auth/login', values)
      .then((res) => {
        if (res.data.code === 200) {
          changeUser({
            social_type: res.data.social_type,
            type: values.type,
            token: res.data.userToken,
            name: res.data.userName,
            regState: res.data.regState
          });
        } else if (res.data.code === 401) {
          setMainError({ message: res.data.message });
        } else {
          setMainError({ message: res.data.message });
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
  });

  return (
    <div className="login-dialog">
      <Formik
        initialValues={{
          type: '1',
          email: '',
          password: ''
        }}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          logIn(values);
        }}
      >
        {({
          values, errors, touched, handleChange, handleBlur, setFieldValue
        }) => (
          <Grid container justify="center" className="signUpContent">
            <Grid item md={3}>
              <Box p={8} my={6} className="signUpForm">
                <Form>
                  {errors.type && touched.type ? <div className="error-message">{errors.type}</div> : null}
                  <Grid container spacing={3}>
                    <Grid item md={12} className="title">
                      <h2>로그인</h2>
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        placeholder="이메일"
                        name="email"
                        className="text-field"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={errors.email && touched.email ? <div className="error-message">{errors.email}</div> : null}
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        placeholder="비밀번호"
                        name="password"
                        type="password"
                        className="text-field"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={errors.password && touched.password ? <div className="error-message">{errors.password}</div> : null}
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    {mainError.message
                      ? (
                        <Grid item md={12}>
                          <Grid container justify="center">
                            <Grid item>
                              <div className="error-message">{mainError.message ? mainError.message : null}</div>
                            </Grid>
                          </Grid>
                        </Grid>
                      ) : null
                    }
                    <Grid item md={12}>
                      <Button fullWidth type="submit" variant="contained" color="secondary" className="login-button">
                          로그인
                      </Button>
                    </Grid>
                    <Grid item md={12}>
                      <Divider variant="middle" />
                    </Grid>
                    <Grid item md={12} className="social-networks">
                      <SocialNetworks changeUser={changeUser} history={history} />
                    </Grid>
                    <Grid item md={12}>
                      <Divider variant="middle" />
                    </Grid>
                    <Grid item md={12}>
                      <Button fullWidth variant="contained" className="signup-button" onClick={() => history.push('SignUp')}>
                                회원가입하기
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              </Box>
            </Grid>
          </Grid>
        )}
      </Formik>
    </div>
  );
}

export default AdvertiserLogin;
