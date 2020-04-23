import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import YouTube from 'react-youtube';
import {
  Field, FieldArray, Form, Formik, getIn, useField
} from 'formik';
import axios from 'axios';
import {
  Box,
  Button, Divider, FormControlLabel, Radio, RadioGroup, TextField
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import * as Yup from 'yup';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import NameArray from '../../../lib/nameArray';
import Common from '../../../lib/common';


function InstagramUser({
  userData,
  changeUserData
}) {
  const [fbPages, setFbPages] = useState([]);
  const [igData, setIgData] = useState([
    { id: '1', picture: 'https://scontent-ssn1-1.xx.fbcdn.net/v/t51.2885-15/10268830_1413710172239476_417695121_a.jpg?_nc_cat=100&_nc_sid=86c713&_nc_eui2=AeEenkc9hRXDsONeiLnC6S7HnbIOy0F_CVKdsg7LQX8JUnQaLmQ6Dk0967wX7pZu6tFFlnumvW3AMqiT5yCoChuD&_nc_ohc=dcWdY6-WKZ0AX_sjKCk&_nc_ht=scontent-ssn1-1.xx&oh=e83324ccb0c4f904c711e937cc61fa15&oe=5EC507C5', username: 'andrian_tsoy' },
    { id: '2', picture: 'https://scontent-ssn1-1.xx.fbcdn.net/v/t51.2885-15/10268830_1413710172239476_417695121_a.jpg?_nc_cat=100&_nc_sid=86c713&_nc_eui2=AeEenkc9hRXDsONeiLnC6S7HnbIOy0F_CVKdsg7LQX8JUnQaLmQ6Dk0967wX7pZu6tFFlnumvW3AMqiT5yCoChuD&_nc_ohc=dcWdY6-WKZ0AX_sjKCk&_nc_ht=scontent-ssn1-1.xx&oh=e83324ccb0c4f904c711e937cc61fa15&oe=5EC507C5', username: 'andrian_tsoy' },
    { id: '3', picture: 'https://scontent-ssn1-1.xx.fbcdn.net/v/t51.2885-15/10268830_1413710172239476_417695121_a.jpg?_nc_cat=100&_nc_sid=86c713&_nc_eui2=AeEenkc9hRXDsONeiLnC6S7HnbIOy0F_CVKdsg7LQX8JUnQaLmQ6Dk0967wX7pZu6tFFlnumvW3AMqiT5yCoChuD&_nc_ohc=dcWdY6-WKZ0AX_sjKCk&_nc_ht=scontent-ssn1-1.xx&oh=e83324ccb0c4f904c711e937cc61fa15&oe=5EC507C5', username: 'andrian_tsoy' },
  ]);

  /* useEffect(() => {
    const igArray = userData.igAccounts;
    if (igArray && igArray.length > 0) {
      igArray.map((item) => {
        window.FB.getLoginStatus((loginRes) => {
          if (loginRes.status === 'connected') {
            const { accessToken, userID } = loginRes.authResponse;
            window.FB.api(
              item,
              {
                access_token: accessToken,
                fields: 'username, profile_picture_url'
              },
              (getDataRes) => {
                console.log(getDataRes);
                setIgData([...igData, { id: getDataRes.id, picture: getDataRes.profile_picture_url, username: getDataRes.username }]);
              }
            );
          } else {
            console.log('not connected');
          }
        });
      });
    }
  }, [userData]); */

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
      .required('인스타 계정을 선택해주세요'),
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

  function instagramLongToken() {
    // console.log(window.FB);

    window.FB.api(
      '17841401425431236',
      {
        access_token: 'EAABZBmHw3RHwBAEVGw8VLdNx9YvKSAZAT7HxBPmU2Qma1pJouF8GizmSMwAZAWRTCH3OHIGw4CiZBWFU0IkQgAotcdLKsKg6SX3AdewZCb45GLLKESj0aKmiYzVkFKZClZAdQeexzFRhMHE5ortLRslzdaqfM7sLSn9K4ZApa7HwZCqVkwDKwleZCB',
        // access_token: 'EAABZBmHw3RHwBAEMBmfZAgMZAUSVSeqEUNbSWwOMG5ZCEmZBHPEeMwl6kyHndjZC6bvPMwpQR93fYr96Oj7hslHuzgAp9G2cZA6e7JzQV3YXyctv2R6vAMZCexR9Kp2BhZCjdKjZCdZBRci4T1x4LTVtZAQPPUogiSGSJTtRykZAwPB5cuAZDZD',
        fields: 'ig_id, followers_count, follows_count, media_count, username, media'
        // 'EAABZBmHw3RHwBAEVGw8VLdNx9YvKSAZAT7HxBPmU2Qma1pJouF8GizmSMwAZAWRTCH3OHIGw4CiZBWFU0IkQgAotcdLKsKg6SX3AdewZCb45GLLKESj0aKmiYzVkFKZClZAdQeexzFRhMHE5ortLRslzdaqfM7sLSn9K4ZApa7HwZCqVkwDKwleZCB'
      },
      (response) => {
        console.log(response);
      }
    );


    /* window.FB.getLoginStatus((response) => {
          if (response.status === 'connected') {
            console.log(response);
            const { accessToken, userID } = response.authResponse;
            const { token } = Common.getUserInfo();


            axios.get('/api/TB_INFLUENCER/getLongLivedToken', {
              params: {
                facebookToken: accessToken,
                facebookUserId: userID,
                token
              }
            })
              .then((res) => {
                console.log(res);
              });
          } else {
            console.log('not connected');
          }
        }); */
  }

  function instagramGetData() {
    window.FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        const { accessToken, userID } = response.authResponse;
        window.FB.api('/me/accounts', (res) => {
          const pages = res.data;
          setFbPages([...pages]);
        });
      } else {
        console.log('not connected');
      }
    });


    // check accounts
    /* window.FB.api('/me/accounts', (response) => {
            console.log(response);
          }); */

    // check insta business account
    /* window.FB.api(
            '107978017554043',
            {
              access_token: 'EAABZBmHw3RHwBAFOi9MQZAkWomjwjOAqHUyEUDaPU0MFXPDFxM5dZCoCi35Fr5VYTKEBZA7G7LZCHZBF1p7IsUAQPpmDMZApt2FM5mZAqbhZCqrP1uEjUmvIQNCqGUKLxOq609SFhHTQyMUCaXPaOuLUYW2EbaGEVDxRZB8kCOmZBLe6eHNfMbfanqWw39zl5MliWevOxZCejgNmoQZDZD',
              fields: 'instagram_business_account'
            },
            (response) => {
              console.log(response);
            }
          ); */

    // get instagram data
    /* window.FB.api(
            '17841401425431236',
            {
              access_token: 'EAABZBmHw3RHwBAFOi9MQZAkWomjwjOAqHUyEUDaPU0MFXPDFxM5dZCoCi35Fr5VYTKEBZA7G7LZCHZBF1p7IsUAQPpmDMZApt2FM5mZAqbhZCqrP1uEjUmvIQNCqGUKLxOq609SFhHTQyMUCaXPaOuLUYW2EbaGEVDxRZB8kCOmZBLe6eHNfMbfanqWw39zl5MliWevOxZCejgNmoQZDZD',
              fields: 'ig_id, followers_count, follows_count, media_count, username, media'
            },
            (response) => {
              console.log(response);
            }
          ); */
  }

  function instagramGetId(pageId) {
    const { token } = Common.getUserInfo();

    window.FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        const { accessToken, userID } = response.authResponse;

        window.FB.api(
          pageId,
          {
            access_token: accessToken,
            fields: 'instagram_business_account'
          },
          (response) => {
            const instagramBusinessId = response.instagram_business_account.id;
            // console.log(response.instagram_business_account.id);

            axios.get('/api/TB_INFLUENCER/getLongLivedToken', {
              params: {
                facebookToken: accessToken,
                facebookUserId: userID,
                instagramBusinessId,
                token
              }
            })
              .then((res) => {
                console.log(res);
              });
          }
        );
      } else {
        console.log('not connected');
      }
    });
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

  function StyledRadio({
    item,
    selected
  }) {
    return (
      <Grid container className={`card ${item.id === selected ? 'selected' : null}`} justify="center">
        <Grid item>
          <Box component="img" src={item.picture} pt={3} />
        </Grid>
        <Grid item>
          <p>{item.username}</p>
        </Grid>
        <Radio value={item.id} style={{ display: 'none' }} />
      </Grid>
    );
  }

  return (
    <Grid container className="influencer-page wraper three">

      <Grid item xs={12} className="second-title">
              상세 정보 입력
      </Grid>

      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid item md={5}>
            <Formik
              initialValues={{
                channel: [
                  {
                    type: '',
                    link: ''
                  }
                ],
                instaAccount: '',
                nickName: userData.name,
                email: userData.email,
                country: 0,
                region: '',
                phone: '',
                product: '',
                agreement: false,
                fbPageId: '',
                instId: ''
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
                  <Grid item md={12}>
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
                            <div className="label-holder">
                              <label htmlFor="인스타 계정">인스타 계정</label>
                            </div>
                            <FormControl fullWidth>
                              <RadioGroup row aria-label="instaAccount" name="instaAccount" value={values.instaAccount} onChange={event => setFieldValue('instaAccount', event.target.value)}>
                                <Grid container spacing={2}>
                                  {igData.map(item => (
                                    <Grid item md={4} key={item.id}>
                                      <FormControlLabel value="1" control={<StyledRadio item={item} selected={values.instaAccount} />} style={{ margin: '0' }} />
                                    </Grid>
                                  ))}
                                </Grid>
                              </RadioGroup>
                              <FormHelperText id="my-helper-text">{errors.instaAccount && touched.instaAccount ? <span className="error-message">{errors.instaAccount}</span> : null}</FormHelperText>
                            </FormControl>
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
                  <Grid item md={12}>
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

export default InstagramUser;
