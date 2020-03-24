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
      .required('직종이 필요합니다'),
    companyName: Yup.string()
      .min(2, '너무 짧습니다!')
      .max(50, 'Too Long!')
      .required('회사 명은 필수입니다'),
    budget: Yup.string()
      .required('마케팅 예산이 필요합니다'),
    email: Yup.string()
      .email('Invalid email')
      .required('이메일이 필요합니다'),
    country: Yup.string()
      .required('국가는 필수입니다'),
    region: Yup.string()
      .required('지역이 필요합니다'),
    phone: Yup.string()
      .required('전화가 필요합니다'),
    product: Yup.string()
      .required('제품이 필요합니다')
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
