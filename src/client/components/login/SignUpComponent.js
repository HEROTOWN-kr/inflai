import React, { useState } from 'react';
import { Button, Divider, TextField } from '@material-ui/core';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';

import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import UserType from './UserType';
import SocialNetworks from './SocialNetworks';


function SignUpComponent(props) {
  const [openDialog, setOpenDialog] = React.useState(false);

  function toggleLoginDialog() {
    setOpenDialog(!openDialog);
  }
  return (
    <div>
      <SignUpDialog {...props} openDialog={openDialog} closeDialog={toggleLoginDialog} />
      <Button onClick={toggleLoginDialog} className="login-button">회원가입</Button>
    </div>
  );
}

function SignUpDialog({
  openDialog,
  closeDialog,
  user,
  changeUser
}) {
  const [userType, setUserType] = useState('');
  const [mainError, setMainError] = useState({});

  function closeDialogButton() {
    setMainError({});
    closeDialog();
  }

  function signUp(values) {
    axios.post('/api/TB_ADVERTISER/signup', values)
      .then((res) => {
        if (res.data.code === 200) {
          closeDialog();
        } else if (res.data.code === 401) {
          setMainError({ message: res.data.message });
        } else {
          console.log(res);
        }
      })
      .catch(error => (error));
  }


  const SignupSchema = Yup.object().shape({
    type: Yup.string()
      .required('직군을 입력해주세요'),
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
    <Dialog open={openDialog} className="new-login-dialog">
      <button onClick={closeDialogButton} type="button" aria-label="Close" className="modal-close">
        <span className="modal-close-x">
          <CloseIcon />
        </span>
      </button>
      <DialogTitle className="title">회원가입</DialogTitle>
      <DialogContent className="content">
        <div className="error-message">{mainError.message ? mainError.message : null}</div>
        <Formik
          initialValues={{
            type: '',
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
            <Form className="userInfo-form">

              <Grid container justify="space-between" xs={12}>
                <Grid item xs={5}>
                  <Button variant="outlined" color="primary" className={`job-type-button ${values.type === '1' ? 'checked' : ''}`} onClick={() => { setFieldValue('type', '1'); setUserType('1'); }}>관고주</Button>
                </Grid>
                <Grid item xs={5}>
                  <Button variant="outlined" color="primary" className={`job-type-button ${values.type === '2' ? 'checked' : ''}`} onClick={() => { setFieldValue('type', '2'); setUserType('1'); }}>인플루언서</Button>
                </Grid>
              </Grid>
              {errors.type && touched.type ? <span className="error-message">{errors.type}</span> : null}
              <Divider variant="middle" />
              <Grid container xs={12}>
                <TextField
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
              <Grid container xs={12}>
                <TextField
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
              <Grid container xs={12}>
                <TextField
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
              <Grid container xs={12}>
                <TextField
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
              <Grid container xs={12}>
                <Button type="submit" variant="contained" color="secondary" className="login-button">
                      회원가입
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}


export default SignUpComponent;
