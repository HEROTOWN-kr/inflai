import React, { useEffect } from 'react';
import * as Scroll from 'react-scroll';
import '../../css/sub.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  Box, Button, Hidden, Divider, Grid, Paper
} from '@material-ui/core';
import categoryOne from '../../img/icons/one.png';
import categoryTwo from '../../img/icons/two.png';
import categoryThree from '../../img/icons/three.png';
import categoryFour from '../../img/icons/four.png';
import categoryFive from '../../img/icons/five.png';
import categorySix from '../../img/icons/six.png';
import categorySeven from '../../img/icons/seven.png';
import categoryEight from '../../img/icons/eight.png';
import categoryNine from '../../img/icons/nine.png';
import categoryTen from '../../img/icons/ten.png';
import categoryEleven from '../../img/icons/eleven.png';
import categoryTwelve from '../../img/icons/twelve.png';
import categoryThirteen from '../../img/icons/thirteen.png';
import categoryFourteen from '../../img/icons/fourteen.png';
import categoryFifteen from '../../img/icons/fifteen.png';
import categorySixteen from '../../img/icons/sixteen.png';
import categorySeventeen from '../../img/icons/seventeen.png';
import categoryEighteen from '../../img/icons/eighteen.png';
import categoryNineteen from '../../img/icons/nineteen.png';
import categoryTwenty from '../../img/icons/twenty.png';
import categoryTwentyOne from '../../img/icons/twentyOne.png';
import SlideImage1 from '../../img/slider/beauty.png';
import SlideImage2 from '../../img/slider/fashion.png';
import SlideImage3 from '../../img/slider/food.png';
import Instagram from '../../img/slider/instagram.png';
import Youtube from '../../img/slider/youtube.png';
import Naver from '../../img/slider/naver.png';
import SimpleSlider from './SimpleSlider';
import CampaignAll from '../campaignList/CampaignAll';
import RegisterLink from './RegisterLink';
import About from './About';
import Profit from './Profit';
import Rating from './Rating';
import Service from './Service';
import InfluencerList from './InfluencerList';

// import NaverLogin from 'react-naver-login';

const ElementLink = Scroll.Element;

const $colorBg = '#fefefe'; const $colorBlue = '#093c5e'; const $aqua = '#23c9cf'; const
  $white = '#ffffff';

const FontSettings = {
  first: {
    fontSize: '30px',
    color: $aqua
  },
  second: {
    position: 'absolute',
    right: '10px',
    top: '50px',
    fontWeight: 'bold',
    fontSize: '72px',
    color: $aqua
  },
  third: {
    fontSize: '18px',
    color: $white,
    fontWeight: 'bold',
    lineHeight: '180%',
    paddingTop: '100px'
  },
  fourth: {
    width: '178px',
    height: '50px',
    border: '2px solid #23c9cf',
    fontSize: '20px',
    color: $white,
    borderRadius: '25px'
  },
  fifth: {
    fontWeight: 'bold',
    fontSize: '58px',
    color: $colorBlue
  },
  sixth: {
    fontSize: '36px',
    color: '#454545'
  },
  seventh: {
    fontSize: '15px',
    color: '#454545'
  },
  eights: {
    fontSize: '55px',
    color: $aqua,
    margin: '40px 0',
    textAlign: 'center'
  },
  ninth: {
    fontSize: '19px',
    color: $white,
    textAlign: 'center',
    marginBottom: '123px'
  },
  tenth: {
    position: 'relative',
    width: 'inherit',
    fontSize: '30px',
    fontWeight: 'bold'
  },
  eleventh: {
    color: $white
  },
  twelfth: {
    fontSize: '77px',
    color: $aqua,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '60px 0'
  },
  thirteen: {
    textAlign: 'center',
    fontSize: '21px'
  },
  triangle: {
    zIndex: '0',
    position: 'absolute',
    top: 0,
    right: '510px',
    width: 0,
    height: 0,
    borderBottom: '1039px solid #fefefe',
    borderLeft: '577px solid transparent'
  },
  aqua: {
    color: $aqua
  },
  white: {
    color: $white
  },
  blue: {
    color: $colorBlue
  },
  textRight: {
    textAlign: 'right'
  },
  textLeft: {
    textAlign: 'left'
  }

};

const CategoryIcons = {
  firstRow: [categoryOne, categoryTwo, categoryThree],
  secondRow: [categoryFour, categoryFive, categorySix],
  thirdRow: [categorySeven, categoryEight, categoryNine],
};

const InfluenserIcons = {
  firstRow: [categoryTen, categoryEleven, categoryTwelve, categoryThirteen],
  secondRow: [categoryFourteen, categoryFifteen, categorySixteen, categorySeventeen],
  thirdRow: [categoryEighteen, categoryNineteen, categoryTwenty, categoryTwentyOne],
};

const Profits = {
  leftCategory: [
    {
      name: '효율성',
      desc: '한번에 광고하려는 브랜드에 맞게 인플루언서를 찾아 추천하고 관리합니다.'
    },
    {
      name: '직접 소통',
      desc: '대행사를 통하지 않고 직접 소통하여 빠른처리 및 정확한 지침을 알려줍니다.'
    },
    {
      name: '저렴한 매칭비용',
      desc: '우리는 저렴한 매칭비용으로 보다 효과적인 광고효율을 제공합니다.'
    },
  ],
  rightCategory: [
    {
      name: '편한 관리',
      desc: '쉬운 광고관리자 모드를 통해 여러분의 캠페인을 관리하세요.'
    },
    {
      name: '이벤트',
      desc: '광고주를 위한 풍부한 이벤트를 놓치지 마세요. 교육부터 마일리지 프로모션까지!'
    },
    {
      name: '광고주맞춤형 서비스',
      desc: '맞춤형패키지로 광고비를 절약하세요. 가장 효율적인 마케팅서비스.'
    },
  ],
};

function Home(props) {
  useEffect(() => {
    // window.scrollTo(0, 0);
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    // autoplay: true,
    dots: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1, infinite: false }
      },
      /* {
        breakpoint: 960,
        settings: { slidesToShow: 2, slidesToScroll: 2, infinite: false }
      }, */
      /* {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 3, infinite: false }
      } */
    ]
    // centerMode: true
  };

  const influencers = [
    {
      url: SlideImage1,
      name: 'INSTAGRAM',
      type: '푸드',
      socialImage: Instagram,
      tags: '#둘둘치킨 #맛집 #일상'
    },
    {
      url: SlideImage2,
      name: 'YOUTUBE',
      type: '뷰티',
      socialImage: Youtube,
      tags: '#디올 #입생로랑 #수분크림 #립스틱'
    },
    {
      url: SlideImage3,
      name: 'BLOG',
      type: '패션',
      socialImage: Naver,
      tags: '#랄프로렌 #핸드메이드코트 #캐시미어'
    },
    {
      url: SlideImage1,
      name: 'INSTAGRAM',
      type: '푸드',
      socialImage: Instagram,
      tags: '#둘둘치킨 #맛집 #일상'
    },
    {
      url: SlideImage2,
      name: 'YOUTUBE',
      type: '뷰티',
      socialImage: Youtube,
      tags: '#디올 #입생로랑 #수분크림 #립스틱'
    },
    {
      url: SlideImage3,
      name: 'BLOG',
      type: '패션',
      socialImage: Naver,
      tags: '#랄프로렌 #핸드메이드코트 #캐시미어'
    },
  ];

  return (
    <div className="home">
      {/* <Greeting /> */}
      <CampaignAll history={props.history} />
      <Divider variant="middle" />
      <RegisterLink />
      <Divider variant="middle" />
      <ElementLink name="target" />
      <About FontSettings={FontSettings} />
      <Profit FontSettings={FontSettings} Profits={Profits} />
      <Rating FontSettings={FontSettings} />
      <Divider variant="middle" />
      <Service CategoryIcons={CategoryIcons} InfluenserIcons={InfluenserIcons} />
      <Divider variant="middle" />
      <InfluencerList FontSettings={FontSettings} settings={settings} influencers={influencers} />
    </div>
  );
}


export default Home;
