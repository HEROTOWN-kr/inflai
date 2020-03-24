import React, { useState } from 'react';
import axios from 'axios';
import '../../css/sub.scss';

import { Button, TextField, Divider } from '@material-ui/core';


import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


import CloseIcon from '@material-ui/icons/Close';

import * as Yup from 'yup';
import { Form, Formik } from 'formik';

import SocialNetworks from './SocialNetworks';
import LogOutButton from './LogOutButton';


function LogInComponent(props) {
  const [openDialog, setOpenDialog] = React.useState(false);

  function toggleLoginDialog() {
    setOpenDialog(!openDialog);
  }
  return (
    <div>
      <LoginDialog {...props} openDialog={openDialog} closeDialog={toggleLoginDialog} />
      {props.user.token
        ? (
          <LogOutButton {...props} />
        )
        : <Button onClick={toggleLoginDialog} className="login-button">로그인</Button>
        }
    </div>
  );
}


function LoginDialog({
  openDialog,
  closeDialog,
  changeUser,
}) {
  const [userType, setUserType] = useState('');
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
          });
          closeDialog();
        } else if (res.data.code === 401) {
          setMainError({ message: res.data.message });
        } else {
          setMainError({ message: res.data.message });
        }
      })
      .catch(error => (error));
  }

  function closeDialogButton() {
    setMainError({});
    closeDialog();
  }

  const SignupSchema = Yup.object().shape({
    type: Yup.string()
      .required('직군을 입력해주세요'),
    email: Yup.string()
      .email('잘못된 이메일 형식 입니다.')
      .required('이메일을 입력해주세요'),
    password: Yup.string()
      .required('비밀번호를 입력해주세요'),
  });


  return (
    <Dialog open={openDialog} className="new-login-dialog">
      <button onClick={closeDialogButton} type="button" aria-label="Close" className="modal-close">
        <span className="modal-close-x">
          <CloseIcon />
        </span>
      </button>
      <DialogTitle className="title">로그인</DialogTitle>
      <DialogContent className="content">
        <div className="error-message">{mainError.message ? mainError.message : null}</div>
        <Formik
          initialValues={{
            type: '',
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
            <Form className="userInfo-form">

              <Grid container justify="space-between" xs={12}>
                <Grid item xs={5}>
                  <Button variant="outlined" color="primary" className={`job-type-button ${values.type === '1' ? 'checked' : ''}`} onClick={() => { setFieldValue('type', '1'); setUserType('1'); }}>관고주</Button>
                </Grid>
                <Grid item xs={5}>
                  <Button variant="outlined" color="primary" className={`job-type-button ${values.type === '2' ? 'checked' : ''}`} onClick={() => { setFieldValue('type', '2'); setUserType('1'); }}>인플루언서</Button>
                </Grid>
              </Grid>
              {errors.type && touched.type ? <div className="error-message">{errors.type}</div> : null}
              <Divider variant="middle" />
              <Grid container xs={12}>
                <TextField
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
              <Grid container xs={12}>
                <TextField
                  placeholder="비밀번호"
                  name="password"
                  className="text-field"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={errors.password && touched.password ? <div className="error-message">{errors.password}</div> : null}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid container xs={12}>
                <Button type="submit" variant="contained" color="secondary" className="login-button">
                      로그인
                </Button>
              </Grid>

              <Divider variant="middle" />

              <div className="social-networks">
                <SocialNetworks userType={userType} changeUser={changeUser} closeDialog={closeDialog} />
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default LogInComponent;
