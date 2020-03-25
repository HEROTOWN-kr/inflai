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
import AdvertiserForm from './AdvertieserFormNew';


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

  function youTubeOnReady(event) {
    // event.target.pauseVideo();
  }

  return (
    <Grid container className="influencer-page advertiser-page wraper three">
      <Grid container className="main-title wraper five">
        <Grid container justify="center" className="first-title">회원가입</Grid>
        <Grid container justify="center" className="second-title">서비스 이용을 위해 회원정보를 입력해주세요.</Grid>
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
              {list.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </Grid>
      </Grid>
      <Grid container xs={6}>
        <AdvertiserForm />
        {/*<Grid container xs={6}>
          <AdvertiserForm />
        </Grid>*/}
        {/*<Grid container xs={12}>
          <div className="policy">
              You may unsubscribe from these communications at any time. For more infomation see our
            {' '}
            <span>Privacy policy</span>
            <br />
              By clicking submit below, you consent to allow Matchmade to store and process the personal information submitted above to provide you the content requested.
          </div>
        </Grid>*/}
      </Grid>
    </Grid>
  );
}

export default Advertiser;
