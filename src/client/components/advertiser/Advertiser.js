import React, { useState } from 'react';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Slider from 'react-slick';
import SimpleSlider from '../home/SimpleSlider';
import IphoneImage from '../../img/iphone.png';
import SlideImage1 from '../../img/build1.jpg';
import Instagram from '../../img/slider/instagram.png';
import SlideImage2 from '../../img/build2.jpg';
import Youtube from '../../img/slider/youtube.png';
import SlideImage3 from '../../img/build3.jpg';
import Naver from '../../img/slider/naver.png';

import '../../css/sub.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import * as Yup from 'yup';
import {
  Field, FieldArray, Form, Formik, getIn
} from 'formik';
import YouTube from 'react-youtube';
import { Button } from '@material-ui/core';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import AdvertiserForm from './AdvertiserForm';


const AdvertiserStyles = {
  phone: {
    background: 'blue'
  },
  phoneImage: {
    width: '400px',
    height: '600px',
    position: 'absolute',
    top: '-16px',
    right: '-70px'
  }
};

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  dots: false,
  autoplaySpeed: 2000
};

function Advertiser() {
  /* return (
    <div className="advertiser-page">
      <Grid container justify="center">
        <Grid item xs={6}>
          <div className="container">
            <Slider {...settings}>
              <div>
                <div className="card">
                  <img src={SlideImage1} />
                </div>
              </div>
              <div>
                <div className="card">
                  <img src={SlideImage2} />
                </div>
              </div>
              <div>
                <div className="card">
                  <img src={SlideImage3} />
                </div>
              </div>
              <div>
                <div className="card">
                  <img src={SlideImage1} />
                </div>
              </div>
            </Slider>
            <img src={IphoneImage} style={AdvertiserStyles.phoneImage} />
          </div>
        </Grid>
      </Grid>
    </div>
  ); */


  const opts = {
    height: '390',
    // maxWidth: '3000px',
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
    jobType: Yup.string()
      .required('Job type is required'),
    companyName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Company name is required'),
    budget: Yup.string()
      .required('Influencer Marketing Budjet is required'),
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
      .required('Product is required')
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

  // Input feedback
  const InputFeedback = ({ error }) => (error ? <div className={classNames('input-feedback')}>{error}</div> : null);

  // Radio input
  const RadioButton = ({
    field: {
      name, value, onChange, onBlur
    },
    id,
    label,
    className,
    ...props
  }) => (
    <div>
      <input
        name={name}
        id={id}
        type="radio"
        value={id} // could be something else for output?
        checked={id === value}
        onChange={onChange}
        onBlur={onBlur}
        className={classNames('radio-button')}
        {...props}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );

  // Radio group
  const RadioButtonGroup = ({
    value,
    error,
    touched,
    id,
    label,
    className,
    children
  }) => {
    const classes = classNames(
      'input-field',
      {
        'is-success': value || (!error && touched), // handle prefilled or user-filled
        'is-error': !!error && touched
      },
      className
    );

    return (
      <div className={classes}>
        {/* <fieldset>
          <legend>{label}</legend>
          {children}
          {touched && <InputFeedback error={error} />}
        </fieldset> */}
        {children}
        {touched && <InputFeedback error={error} />}
      </div>
    );
  };


  return (
    <Grid container className="influencer-page advertiser-page wraper three">
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
          {/* <Formik
            initialValues={{
              jobType: '',
              companyName: '',
              budget: '',
              instagram: '',
              youtube: '',
              blog: '',
              email: '',
              country: '',
              region: '',
              blogType: '',
              phone: '',
              product: '',
              agreement: false
            }}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
              // same shape as initial values
              console.log(values);
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
              <Form className="userInfo-form">
                <label htmlFor="country" style={{ display: 'block' }}>
                  Job type
                </label>
                <Field name="jobType" as="select" placeholder="select job type">
                  <option value="advertiser">Advertiser</option>
                  <option value="agency">Agency</option>
                  <option value="" label="Select job type" />
                </Field>
                {errors.jobType && touched.jobType ? <div className="error-message">{errors.jobType}</div> : null}


                <label htmlFor="companyName" style={{ display: 'block' }}>
                      Company Name*
                </label>
                <Field name="companyName" type="text" id="companyName" />
                {errors.companyName && touched.companyName ? (
                  <div className="error-message">{errors.companyName}</div>
                ) : null}

                <label htmlFor="budget" style={{ display: 'block' }}>
                      Budget
                </label>
                <RadioButtonGroup
                  id="budget"
                  label="Budget"
                  value={values.budget}
                  error={errors.budget}
                  touched={touched.budget}
                >
                  <Field
                    component={RadioButton}
                    name="budget"
                    id="radioOption1"
                    label="~ 500.000"
                  />
                  <Field
                    component={RadioButton}
                    name="budget"
                    id="radioOption2"
                    label="500.000 ~ 1.000.000"
                  />
                  <Field
                    component={RadioButton}
                    name="budget"
                    id="radioOption3"
                    label="1.000.000 ~ 5.000.000"
                  />
                  <Field
                    component={RadioButton}
                    name="budget"
                    id="radioOption4"
                    label="5.000.000 ~"
                  />
                </RadioButtonGroup>
                <label htmlFor="budget" style={{ display: 'block' }}>
                      몇 명의 인플루언서가 팔요한가요?
                </label>
                <Grid container>
                  <Grid container direction="column" justify="center" xs={3}>
                    <Grid item>
                          인스타그램
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Field name="instagram" type="email" className="social-count" />
                  </Grid>
                  <Grid container xs={5} direction="column" justify="center">
                    <Grid item>
                            명
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid container direction="column" justify="center" xs={3}>
                    <Grid item>
                            유튜브
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Field name="youtube" type="email" className="social-count" />
                  </Grid>
                  <Grid container xs={5} direction="column" justify="center">
                    <Grid item>
                            명
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid container direction="column" justify="center" xs={3}>
                    <Grid item>
                            블로거
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Field name="blog" type="email" className="social-count" />
                  </Grid>
                  <Grid container xs={5} direction="column" justify="center">
                    <Grid item>
                            명
                    </Grid>
                  </Grid>
                </Grid>

                <label htmlFor="email" style={{ display: 'block' }}>
                      Email
                </label>
                <Field name="email" type="email" />
                {errors.email && touched.email ? <div className="error-message">{errors.email}</div> : null}

                <label htmlFor="country" style={{ display: 'block' }}>
                      Country
                </label>
                 <Field name="country" as="select" placeholder="Favorite Color">
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="" label="Select a country" />
                </Field>
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
                <Button variant="outlined" color="primary">선택</Button>

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
          </Formik> */}
          <AdvertiserForm />
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


    </Grid>
  );
}

export default Advertiser;
