import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { boxSizing, height, spacing } from '@material-ui/system';
import * as Scroll from 'react-scroll';
import '../../css/sub.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Button, Hidden } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Slider from 'react-slick';
import axios from 'axios';
import TitleImage from '../../img/home-title.png';
import AboutImage from '../../img/home-about.png';
import RatingImage from '../../img/rating.png';

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

import Arrow from '../../img/arrow.png';
import Laptop from '../../img/Laptop3.png';
import Influencer from '../../img/influencer.png';
import Advertiser from '../../img/advert.png';
import SlideImage1 from '../../img/slider/beauty.png';
import SlideImage2 from '../../img/slider/fashion.png';
import SlideImage3 from '../../img/slider/food.png';
import Instagram from '../../img/slider/instagram.png';
import Youtube from '../../img/slider/youtube.png';
import Naver from '../../img/slider/naver.png';
import Dot from '../../img/dot.png';
import Rectangle from '../../img/rectangle.png';
import Greeting from './Greeting';
import SimpleSlider from './SimpleSlider';

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
    autoplay: true,
    dots: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 500,
        settings: { slidesToShow: 1, slidesToScroll: 1, infinite: false }
      },
      /* {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 2, infinite: false }
      },
      {
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
      <Greeting />
      <div className="register-link">
        <div className="title-holder">
          <Grid container justify="center">
            <div className="main-title">서비스 둘러보기</div>
          </Grid>
          <Grid container justify="center">
            <div className="second-title">INFLAi로 최적의 효과를 누려보세요</div>
          </Grid>
          <Grid container justify="center">
            <img src={Arrow} className="arrow-image" />
          </Grid>
        </div>
        <Grid container className="link-field">
          <Grid xs={12} md={6} className="advertiser">
            <div className="y-wrap">
              <Grid container justify="center">
                <img src={Advertiser} />
              </Grid>
              <Grid container justify="center">
                <div className="job-type">광고주</div>
              </Grid>
              <Grid container justify="center" alignContent="flex-end">
                <Button variant="outlined" className="func-button">Request demo</Button>
              </Grid>
            </div>
          </Grid>
          <Grid xs={12} md={6} className="influencer">
            <div className="y-wrap">
              <Grid container justify="center">
                <img src={Influencer} />
              </Grid>
              <Grid container justify="center">
                <div className="job-type">인플루언서</div>
              </Grid>
              <Grid container justify="center">
                <Button variant="outlined" className="func-button">Sign Up</Button>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
      <ElementLink name="target" />
      <Box py={32} className="about">
        <Grid container justify="center">
          <Grid item className="about-container">
            <Grid container justify="space-between" alignItems="center">
              <Grid item md={8} className="about-image">
                <img src={AboutImage} />
              </Grid>
              <Grid item md={3}>
                <Grid container className="text" spacing={3}>
                  <Grid item xs={12} className="title">
                    INFL
                    <span style={FontSettings.aqua}>Ai</span>
                  </Grid>
                  <Hidden smDown>
                    <Grid item xs={12} className="main-text">
                      아직도 팔로워나
                      <br />
                      좋아요 숫자에 연연하시나요?
                      <br />
                      구매전환율이 높은
                      <br />
                      인플루언서를 매칭해드립니다.
                    </Grid>
                  </Hidden>
                  <Hidden smUp>
                    <Grid item xs={12} className="main-text">
                      아직도 팔로워나 좋아요 숫자에 연연하시나요? 구매전환율이 높은 인플루언서를 매칭해드립니다.
                    </Grid>
                  </Hidden>
                  <Grid item xs={12} className="text-footer">
                    AI 분석결과 추천된 인플루언서들은 다음과 같은 이유로
                    <br />
                    INFLAI 의 우수성을 증명해줍니다.
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box py={28} className="profit">
        <Grid container justify="center">
          <Grid item className="profit-container">
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <div className="title">
                  데이터 기반 정보마케팅
                  <span>을 통한 ROI 상승</span>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="main-text">
                  우리의 알고리즘은 당신의 제품을 가장 우수하고 가장 관련성이 높은 인플루언서와 매칭시켜,
                  <br />
                  결과적으로 최종 소비자에게 좋은 영향을 주게됩니다.
                  <br />
                  인플루언서들에게 우리는 그들의 팔로워들이 좋아할 서비스나 제품을 제공합니다.
                </div>
              </Grid>
              <Grid item xs={12} className="detail">
                <Box py={6}>
                  <Grid container justify="space-between">
                    <Grid item xs={3}>
                      <Grid container spacing={4} style={FontSettings.textRight}>
                        {Profits.leftCategory.map(item => (
                          <Grid key={item.name} item xs={12}>
                            <div className="profit-name">
                              {item.name}
                              <img src={Dot} />
                            </div>
                            <div className="profit-desc">
                              {item.desc}
                            </div>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                    <Grid item xs={5} className="laptop">
                      <Grid container alignItems="center" style={{ height: '100%' }}>
                        <img src={Laptop} alt="" />
                      </Grid>
                    </Grid>
                    <Grid item xs={3}>
                      <Grid container spacing={4}>
                        {Profits.rightCategory.map(item => (
                          <Grid key={item.name} item xs={12}>
                            <div className="profit-name">
                              {item.name}
                              <img className="left" src={Dot} />
                            </div>
                            <div className="profit-desc">
                              {item.desc}
                            </div>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid container justify="center">
                  <Grid item>
                    <Button variant="outlined" className="func-button">Read More</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box py={30} className="rating">
        <Grid container justify="center">
          <Grid container spacing={3} item className="rating-container">
            <Grid item xs={12}>
              <img src={RatingImage} />
            </Grid>
            <Grid item xs={12}>
              <div className="title">
                마케팅이 끝나고
                <br />
                <span style={FontSettings.blue}>인플루언서 활동 만족도 체크</span>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="main-text">
                별점만족도조사를 통하여 지속적인 사후체크 및 마케팅효과 상승을 유도합니다
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <hr align="center" width="90%" color="#454545" />
      <Box py={16} className="service">
        <Grid container justify="center">
          <Grid item className="service-container">
            <div className="main-text">INFLAi</div>
            <Grid container justify="space-between">
              <Grid item sm={10} md={5}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <div className="category-name">
                      <img src={Rectangle} />
                      인플루언서로 최적의 효과를
                      <br />
                      보는 카테고리
                    </div>
                  </Grid>
                  {
                    Object.keys(CategoryIcons).map(Row => (
                      <Grid key={Row} item xs={12}>
                        <Grid container justify="space-between">
                          {CategoryIcons[Row].map(i => (
                            <Grid key={i} item className="category-image">
                              <img src={i} alt="image" />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    ))
                  }
                </Grid>
              </Grid>
              <Grid item sm={10} md={5}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <div className="category-name">
                      <img src={Rectangle} />
                      우리 플랫폼의 인플루언서들
                    </div>
                  </Grid>
                  {
                    Object.keys(InfluenserIcons).map(Row => (
                      <Grid key={Row} item xs={12}>
                        <Grid container justify="space-between">
                          {InfluenserIcons[Row].map(i => (
                            <Grid key={i} item className="category-image">
                              <img src={i} alt="image" style={{ height: '65px', width: '80px' }} />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    ))
                  }
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <div className="influencer-list">
        <div className="main-title">
          <Grid container justify="center">
            <span style={FontSettings.aqua}>#</span>
INFLAi Influencers
          </Grid>
        </div>
        <div className="container">
          <SimpleSlider settings={settings} influencers={influencers} />
        </div>
      </div>
    </div>
  );
}


export default Home;
