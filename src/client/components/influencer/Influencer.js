import React from 'react';
import YouTube from 'react-youtube';
import Grid from '@material-ui/core/Grid';
import {
  Formik, Form, Field, FieldArray, getIn, FastField
} from 'formik';
import * as Yup from 'yup';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { Button, TextField } from '@material-ui/core';

import axios from 'axios';
import Plus from '../../img/plus.svg';
import Minus from '../../img/minus.svg';
import Common from '../../lib/common';


function Influencer() {
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
    channel: Yup.array().of(Yup.string().required('Blog type is required')),
    nickName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Nickname is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    country: Yup.string()
      .required('Country is required'),
    region: Yup.string()
      .required('Region is required'),
    phone: Yup.string()
      .required('Phone is required'),
    product: Yup.string()
      .required('ProductMix is required')
  });

  function youTubeOnReady(event) {
    // event.target.pauseVideo();
  }

  const ErrorMessage = ({ name }) => (
    <Field
      name={name}
      type="text"
      render={({ form }) => {
        const error = getIn(form.errors, name);
        const touch = getIn(form.touched, name);
        return touch && error ? error : null;
      }}
    />
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
                  onReady={youTubeOnReady}
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
                channel: [''],
                nickName: '',
                email: '',
                country: '',
                region: '',
                phone: '',
                product: '',
                agreement: false
              }}
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
                values, errors, touched, handleChange, handleBlur
              }) => (
                <Grid container>
                  <Grid item md={10}>
                    <div className="form">
                      <Form>
                        <Grid container spacing={5}>
                          <Grid item md={12}>
                            <Grid container spacing={2}>
                              <Grid item md={6}>
                                <div className="label-holder">
                                  <label htmlFor="companyName">업체명</label>
                                </div>
                                <TextField
                                  name="companyName"
                                  id="companyName"
                                  placeholder=""
                                  value={values.companyName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  fullWidth
                                  variant="outlined"
                                  helperText={errors.companyName && touched.companyName ? (
                                    <span className="error-message">{errors.companyName}</span>
                                  ) : null}
                                />
                              </Grid>
                              <Grid item md={6}>
                                <div className="label-holder">
                                  <label htmlFor="name">담당자명</label>
                                </div>
                                <TextField
                                  name="name"
                                  id="name"
                                  placeholder=""
                                  value={values.name}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  fullWidth
                                  variant="outlined"
                                  helperText={errors.name && touched.name ? (
                                    <span className="error-message">{errors.name}</span>
                                  ) : null}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Form>
                    </div>
                  </Grid>
                </Grid>
              )}
            </Formik>

          </Grid>
        </Grid>
      </Grid>

      <Grid container xs={6}>

        <Grid container xs={12}>
          <div className="policy">
              You may unsubscribe from these communications at any time. For more infomation see our
            {' '}
            <span>Privacy policy</span>
            <br />
                  By clicking submit below, you consent to allow Matchmade to store and process the personal information submitted above to provide you the content requested.
          </div>
        </Grid>

      </Grid>


    </Grid>
  );
}

export default Influencer;
