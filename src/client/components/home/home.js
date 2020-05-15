import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { boxSizing, height, spacing } from '@material-ui/system';
import '../../css/sub.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Button, Hidden } from '@material-ui/core';
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
import Influencer from '../../img/influencer.png';
import Advertiser from '../../img/advertiser.png';
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

function Home(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
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
      <div className="wraper one">
        <Grid className="about" container alignItems="center">
          <Grid container xs={12} md={8} className="image">
            <img src={AboutImage} />
          </Grid>
          <Grid container xs={12} md={4} className="text">
            <Grid container alignContent="baseline" className="title">
INFL
              <span style={FontSettings.aqua}>Ai</span>
?
            </Grid>
            <Hidden smDown>
              <Grid container className="main-text">
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
              <Grid container className="main-text">
                아직도 팔로워나 좋아요 숫자에 연연하시나요? 구매전환율이 높은 인플루언서를 매칭해드립니다.
              </Grid>
            </Hidden>

            <Grid container alignContent="flex-end" className="text-footer">
AI 분석결과 추천된 인플루언서들은 다음과 같은 이유로
              <br />
              INFLAI 의 우수성을 증명해줍니다.
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className="profit" style={FontSettings.white}>
        <div className="wraper two">
          <Grid container style={{ height: 'inherit' }} alignItems="center">
            <div className="content">
              <Grid container justify="center">
                <Grid container xs={12} md={3} justify="space-between">
                  <Button variant="outlined" className="func-button" onClick={() => console.log(props)}>광고주</Button>
                  <Button variant="outlined" className="func-button">인플루언서</Button>
                </Grid>
              </Grid>
              <div className="title">
데이터 기반 정보마케팅
                <span style={FontSettings.white}>을 통한 ROI 상승</span>
              </div>
              <div className="main-text">
                우리의 알고리즘은 당신의 제품을 가장 우수하고 가장 관련성이 높은 인플루언서와 매칭시켜,
                <br />
                결과적으로 최종 소비자에게 좋은 영향을 주게됩니다.
                <br />
                인플루언서들에게 우리는 그들의 팔로워들이 좋아할 서비스나 제품을 제공합니다.
              </div>
              <Grid container className="detail">
                <Grid container xs={12} md={3} style={FontSettings.textRight}>
                  <Grid container alignContent="flex-start">
                    <div className="profit-name">
                      효율성
                      <img src={Dot} />
                    </div>
                    <div className="profit-desc">
                      한번에 광고하려는 브랜드에 맞게
                      인플루언서를 찾아 추천하고 관리합니다.
                    </div>
                  </Grid>
                  <Grid container alignContent="center">
                    <div className="profit-name">
                      효율성
                      <img src={Dot} />
                    </div>
                    <div className="profit-desc">
                      한번에 광고하려는 브랜드에 맞게
                      인플루언서를 찾아 추천하고 관리합니다.
                    </div>
                  </Grid>
                  <Grid container alignContent="flex-end">
                    <div className="profit-name">
                      효율성
                      <img src={Dot} />
                    </div>
                    <div className="profit-desc">
                      한번에 광고하려는 브랜드에 맞게
                      인플루언서를 찾아 추천하고 관리합니다.
                    </div>
                  </Grid>
                </Grid>
                <Grid container xs={12} md={6} className="laptop" justify="center" alignItems="flex-end">
                  <Grid container xs={10} className="laptop-image" />
                </Grid>
                <Grid container xs={12} md={3} style={FontSettings.textLeft}>
                  <Grid container alignContent="flex-start">
                    <div className="profit-name">
                      편한 관리
                      <img src={Dot} className="left" />
                    </div>
                    <div className="profit-desc">
                      쉬운 광고관리자 모드를 통해
                      여러분의 캠페인을 관리하세요.
                    </div>
                  </Grid>
                  <Grid container alignContent="center">
                    <div className="profit-name">
                      이벤트
                      <img src={Dot} className="left" />
                    </div>
                    <div className="profit-desc">
                      광고주를 위한 풍부한 이벤트를 놓치지 마세요.
                      교육부터 마일리지 프로모션까지!
                    </div>
                  </Grid>
                  <Grid container alignContent="flex-end">
                    <div className="profit-name">
                      광고주맞춤형 서비스
                      <img src={Dot} className="left" />
                    </div>
                    <div className="profit-desc">
                      맞춤형패키지로 광고비를 절약하세요.
                      가장 효율적인 마케팅서비스.
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container alignContent="flex-end" justify="center">
                <Button variant="outlined" className="func-button">Read More</Button>
              </Grid>
            </div>
          </Grid>
        </div>
      </div>
      <div className="rating">
        <Grid container justify="center">
          <Grid item xs={8}>
            <Grid container justify="center">
              <Grid item>
                <img src={RatingImage} />
              </Grid>
              <Grid item xs={12}>
                <div className="title">
                  서비스 후 상호별점을 통한
                  {' '}
                  <br />
                  <span style={FontSettings.blue}>사후체크 효과</span>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="main-text">
                  광고주는 인플루언서의 마케팅효과에 대해 별점을 표시하게 되고 또한 인플루언서도
                  <br />
                  광고주의 별점을 통해 서로 보완하여 지속적인 사후체크 및 효과상승을 유도합니다
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <div className="wraper four">
          <Grid container justify="center" alignItems="center">
             <Grid container justify="center">
              <img src={RatingImage} />
            </Grid>
            <div className="rating-image">
              <img src={RatingImage} />
            </div>
            <div className="title">
              서비스 후 상호별점을 통한
              {' '}
              <br />
              <span style={FontSettings.blue}>사후체크 효과</span>
            </div>
            <div className="main-text">
              광고주는 인플루언서의 마케팅효과에 대해 별점을 표시하게 되고 또한 인플루언서도
              <br />
              광고주의 별점을 통해 서로 보완하여 지속적인 사후체크 및 효과상승을 유도합니다
            </div>
          </Grid>
        </div> */}
      </div>
      <hr align="center" width="90%" color="#454545" />
      <div className="service">
        <div className="main-text">INFLAi</div>
        {/* <Grid container>
          <Grid container xs={12} md={5} style={{ height: '102px' }}>
            <Grid only={['md', 'lg', 'xl']} md={2} lg={4} xl={6} />
            <Grid container xs={12} md={10} lg={8} xl={6} justify="center" className="category-name">
              <div>
                <img src={Rectangle} />
                  인플루언서로 최적의 효과를
                <br />
                  보는 카테고리
              </div>
            </Grid>
          </Grid>
          <Grid container md={2} />
          <Grid container md={5} style={{ height: '102px' }}>
            <Grid container xs={12} md={10} lg={8} xl={6} justify="center" className="category-name">
              <div>
                <img src={Rectangle} />
                  우리 플랫폼의 인플루언서들
              </div>
            </Grid>
            <Grid only={['md', 'lg', 'xl']} md={2} lg={4} xl={6} />
          </Grid>
          <Grid container xs={12} md={5} style={{ height: '318px' }}>
            <Grid container only={['md', 'lg', 'xl']} md={2} lg={4} xl={6} />
            <Grid container xs={12} md={10} lg={8} xl={6}>
              <Grid container justify="space-between">
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryOne})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryTwo})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryThree})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
              </Grid>
              <Grid container alignContent="center" justify="space-between">
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryFour})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryFive})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categorySix})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
              </Grid>
              <Grid container alignContent="flex-end" justify="space-between">
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categorySeven})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryEight})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryNine})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid md={2} />
          <Grid container xs={12} md={5} style={{ height: '318px' }}>
            <Grid container xs={12} md={10} lg={8} xl={6}>
              <Grid container justify="space-between">
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryTen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryEleven})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryTwelve})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryThirteen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
              </Grid>
              <Grid container alignContent="center" justify="space-between">
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryFourteen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryFifteen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categorySixteen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categorySeventeen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
              </Grid>
              <Grid container alignContent="flex-end" justify="space-between">
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryEighteen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryNineteen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryTwenty})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
                <div style={{
                  height: '80px', width: '80px', backgroundImage: `url(${categoryTwentyOne})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                }}
                />
              </Grid>
            </Grid>
            <Grid container only={['md', 'lg', 'xl']} md={2} lg={4} xl={6} />
          </Grid>
        </Grid> */}
        <div className="wraper five">
          <Grid container justify="space-between">
            <Grid item md={5} lg={4}>
              <Grid container justify="center">
                <Grid item lg={12}>
                  <div className="category-name">
                    <img src={Rectangle} />
                    인플루언서로 최적의 효과를
                    <br />
                    보는 카테고리
                  </div>
                </Grid>
                <Grid />
                <Grid container xs={12} md={12} style={{ height: '318px' }}>
                  <Grid container justify="space-between">
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryOne})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryTwo})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryThree})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                  </Grid>
                  <Grid container alignContent="center" justify="space-between">
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryFour})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryFive})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categorySix})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                  </Grid>
                  <Grid container alignContent="flex-end" justify="space-between">
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categorySeven})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryEight})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryNine})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={5} lg={4}>
              <Grid container justify="center">
                <Grid item lg={12}>
                  <div className="category-name left">
                    <img src={Rectangle} />
                    우리 플랫폼의 인플루언서들
                  </div>
                </Grid>
                <Grid />
                <Grid container xs={12} md={12} style={{ height: '318px' }}>
                  <Grid container justify="space-between">
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryTen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryEleven})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryTwelve})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryThirteen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                  </Grid>
                  <Grid container alignContent="center" justify="space-between">
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryFourteen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryFifteen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categorySixteen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categorySeventeen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                  </Grid>
                  <Grid container alignContent="flex-end" justify="space-between">
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryEighteen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryNineteen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryTwenty})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                    <div style={{
                      height: '80px', width: '80px', backgroundImage: `url(${categoryTwentyOne})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'
                    }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className="influencer-list">
        <div className="main-title">
          <Grid container justify="center">
            <span style={FontSettings.aqua}>#</span>
INFLAi Influencers
          </Grid>
        </div>
        {/* <Grid container justify="center">
          <Grid item sm={2} lg={7}>
            <div className="carousel-zone">
              <Slider {...settings}>
                {influencers.map(person => (
                  <div>
                    <div style={{ height: '142px' }} />
                    <Paper className="paper">
                      <div style={{ position: 'relative' }}>
                        <div className="paper-content">
                          <Grid container justify="center">
                            <Grid container justify="center">
                              <img src={person.url} className="avatar" />
                            </Grid>
                            <Grid container justify="center">
                              <div className="social-name">{person.name}</div>
                            </Grid>
                            <Grid container justify="center">
                              <div className="social-type">{person.type}</div>
                            </Grid>
                            <Grid container justify="center">
                              <img src={person.socialImage} className="social-image" />
                            </Grid>
                            <Grid container justify="center">
                              <div className="social-tags">{person.tags}</div>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Paper>
                  </div>
                ))}
              </Slider>
            </div>
          </Grid>
        </Grid> */}

        <div className="container">
          <SimpleSlider settings={settings} influencers={influencers} />
        </div>
      </div>
    </div>
  );
}


export default Home;
