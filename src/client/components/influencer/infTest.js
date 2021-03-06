import Grid from '@material-ui/core/Grid';
import YouTube from 'react-youtube';
import {
  Field, FieldArray, Form, Formik
} from 'formik';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import React from 'react';
import Common from '../../lib/common';

  <Grid container className="influencer-page wraper three">
    {/* <Grid item md={9} className="greeting-content2">
        <div style={{margin: '600px 0'}}></div>
      </Grid> */}
    <Grid container className="main-title wraper five">
      <Grid container justify="center" className="first-title">Request demo</Grid>
      <Grid container justify="center" className="second-title">Let's get started together and see what we can do for you</Grid>
    </Grid>

    <Grid container justify="center" xs={6} className="youtube">
      <Grid container justify="center" xs={8}>
        <YouTube
          videoId="2g811Eo7K8U"
          opts={opts}
          onReady={youTubeOnReady}
        />
      </Grid>
      <Grid container xs={8}>
        <div>
          <div className="youtube-title">By requesting a demo you get:</div>
          <ul>
            {list.map(item => (
              <li>{item}</li>
            ))}
          </ul>
        </div>
      </Grid>
    </Grid>
    <Grid container xs={6}>
      <Grid container xs={6}>
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
            <Form className="userInfo-form">
              <FieldArray
                name="channel"
                render={arrayHelpers => (
                  <div>
                  <label style={{ display: 'block' }}>
                                        Channel
                    </label>
                  {
                                        values.channel.map((item, index) => (
                                          <div key={index} className="field-item">
                                            <Grid container>
                                              <Field name={`channel.${index}`} type="text" />
                                              { values.channel.length > 1
                                                ? (
                                                  <Button variant="outlined" color="primary" onClick={() => arrayHelpers.remove(index)} className="minus-button">
                                                                -
                                                  </Button>

                                                ) : null
                                                    }
                                              { values.channel.length < 3 && index === 0
                                                ? (
                                                  <Button variant="outlined" color="primary" onClick={() => arrayHelpers.push('')} className="plus-button">
                                                                +
                                                  </Button>
                                                ) : null
                                                    }
                                            </Grid>
                                            <Grid container style={{ color: 'red', textAlign: 'center' }}>
                                              <ErrorMessage name={`channel.${index}`} />
                                            </Grid>
                                          </div>
                                        ))
                                    }
                </div>
                )}
              />

              <label htmlFor="nickName" style={{ display: 'block' }}>
                            Nickname*
              </label>
              <Field name="nickName" type="text" id="nickName" />
              {errors.nickName && touched.nickName ? (
                <div className="error-message">{errors.nickName}</div>
              ) : null}

              <label htmlFor="email" style={{ display: 'block' }}>
                            Email
              </label>
              <Field name="email" type="email" />
              {errors.email && touched.email ? <div className="error-message">{errors.email}</div> : null}

              <label htmlFor="country" style={{ display: 'block' }}>
                            Country
              </label>
              {/* <Field name="country" as="select" placeholder="Favorite Color">
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="" label="Select a country" />
                </Field> */}
              <CountryDropdown
                name="country"
                value={values.country}
                onChange={(_, e) => handleChange(e)}
                onBlur={handleBlur}
              />
              <RegionDropdown
                name="region"
                country={values.country}
                value={values.region}
                onChange={(_, e) => handleChange(e)}
                onBlur={handleBlur}
              />
              {errors.country && touched.country ? <div className="error-message">{errors.country}</div> : null}

              <label htmlFor="phone" style={{ display: 'block' }}>
                            Phone
              </label>
              <Field name="phone" type="text" />
              {errors.phone && touched.phone ? <div className="error-message">{errors.phone}</div> : null}

              <label htmlFor="product" style={{ display: 'block' }}>
                            Product
              </label>
              <Field name="product" type="text" />
              {errors.product && touched.product ? <div className="error-message">{errors.product}</div> : null}

              <div>
                <label className="agreement-label">
                  <Field type="checkbox" name="agreement" />
                                I agree to receive communication from Matchmade
                </label>
              </div>


              <Grid container xs={12}>
                <button className="submit-button" type="submit">Submit</button>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
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


  </Grid>;
