import React from 'react';
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
  return (
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
  );
}

export default Advertiser;
