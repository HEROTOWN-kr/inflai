import React, { useEffect, useState } from 'react';
import {
  Grid, Divider, CircularProgress, Button, Box
} from '@material-ui/core';
import axios from 'axios';
import {
  Sync, Favorite, Print, Share, Error, SupervisorAccount
} from '@material-ui/icons';
import ReactHtmlParser from 'react-html-parser';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import * as Scroll from 'react-scroll';
import Common from '../../lib/common';
import { Colors, campaignSteps, AdvertiseTypes } from '../../lib/Сonstants';
import IconYoutube from '../../img/icon_youtube_url.png';
import IconInsta from '../../img/icon_instagram_url.png';
import IconBlog from '../../img/icon_blog_url.png';
import StyledText from '../containers/StyledText';
import StyledImage from '../containers/StyledImage';
import StyledSvg from '../containers/StyledSvg';
import StyledButton from '../containers/StyledButton';

function CampaignDetail({
  match
}) {
  const JsonTest = {
    AD_ID: 56,
    AD_INSTA: 1,
    AD_YOUTUBE: 1,
    AD_NAVER: 1,
    AD_SRCH_START: '2020-10-28',
    AD_SRCH_END: '2020-10-30',
    AD_CTG: '0',
    AD_CTG2: '0',
    AD_NAME: '[배송형]패브릭 Cozy 컬러쿠션 20종',
    AD_SHRT_DISC: '인스타 감성 낭낭한 색감 예쁜 쿠션으로 인테리어 효과 up!',
    AD_INF_CNT: '5',
    AD_DELIVERY: 0,
    AD_POST_CODE: '03387',
    AD_ROAD_ADDR: '서울 은평구 연서로20길 25',
    AD_DETAIL_ADDR: '5증',
    AD_EXTR_ADDR: ' (대조동)',
    AD_TEL: '01026763937',
    AD_EMAIL: 'andriantsoy@gmail.com',
    AD_SEARCH_KEY: '원룸인테리어,인테리어쿠션,소파쿠션,쿠션인테리어,패브릭쿠션,거실쿠션,침대쿠션',
    AD_DISC: '*제공되는 가이드라인에 맞추어 리뷰를 등록해주세요<br>*게시물 유지기간은 6개월입니다<br>*제품 제공 후, 리뷰 미 이행 시, 제품값이 청구됩니다.',
    AD_DETAIL: '<p style="margin-left:0px;text-align:center;">의정부 다이닝카페 투앤디!</p><p style="margin-left:0px;text-align:center;">어디서 찍어도 인생사진 건질 수 있는 인스타감성 맛집</p><figure class="image"><img src="/attach/campaign/detailPage/2ya5cg38kgvwrmew.jpg"></figure><p style="text-align:center;"><span style="color:rgb(34,34,34);">적외선램프 온열찜질기(유럽산/필립스전구)</span></p><p style="text-align:center;"><span style="color:rgb(0,0,0);">야외 테라스도 마련되어있고 정원도 있어서 애견동반이 가능한곳!!</span></p>',
    AD_PROVIDE: '<p style="margin-left:0px;">●오전타임</p><p style="margin-left:0px;">*낮12시~오후3시반</p><p style="margin-left:0px;">2인: 3만원 제공 (브런치 or 와플 택1 필수)</p><p style="margin-left:0px;">3~4인: 4만5천원 제공 (빵 or 와플 택1 포함 필수)</p>',
    TB_PHOTO_ADs: [
      {
        PHO_ID: 37,
        PHO_FILE: '/attach/campaign/56/2ya5cl6wkgw37lnx.jpg'
      },
      {
        PHO_ID: 38,
        PHO_FILE: '/attach/campaign/56/2ya5cl6wkgw37lny.jpg'
      },
      {
        PHO_ID: 39,
        PHO_FILE: '/attach/campaign/56/2ya5cl6wkgw37lnz.jpg'
      }
    ],
    TB_PARTICIPANTs: [],
    proportion: 0
  };

  const [productData, setProductData] = useState(JsonTest);
  const [currentImage, setCurrentImage] = useState('');
  const [isSticky, setSticky] = useState(false);
  const testImage = 'https://www.inflai.com/attach/portfolio/33/1yqw1whkavscxke.PNG';
  const { token, type } = Common.getUserInfo();
  const theme = useTheme();
  const Scroller = Scroll.scroller;
  const ElementLink = Scroll.Element;

  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  const is1600 = useMediaQuery('(min-width:1600px)');
  const isLG = useMediaQuery(theme.breakpoints.up('lg'));
  const isMD = useMediaQuery(theme.breakpoints.up('md'));

  const fixedStyles = {
    boxSizing: 'border-box',
    width: '359px',
    position: 'fixed',
    left: '1173px',
    zIndex: '1039',
    marginTop: '0px',
    top: '0px',
  };

  const handleScroll = () => {
    setSticky(window.pageYOffset > 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);

  function getWidth() {
    if (isXl) {
      return '800px';
    } if (isLG) {
      return '800px';
    }
    return '100%';
  }

  function scrollTo(target) {
    setTimeout(() => {
      Scroller.scrollTo(target, {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        ignoreCancelEvents: true
      });
    }, 1);
  }


  function getDetailData() {
    const apiObj = {
      id: match.params.id,
    };
    if (token && type === '2') apiObj.token = token;

    axios.get('/api/TB_AD/campaignDetail', {
      params: apiObj
    }).then((res) => {
      const { data } = res.data;
      console.log(data);
      setProductData(data);
      setCurrentImage(data.TB_PHOTO_ADs[0].PHO_FILE);
    }).catch(err => alert(err.response.data.message));
  }

  useEffect(() => {
    // getDetailData();
  }, []);

  function sendRequest() {
    const { token } = Common.getUserInfo();
    if (token) {
      const apiObj = {
        AD_ID: match.params.id,
        token
      };

      axios.post('/api/TB_NOTIFICATION/createRequest', apiObj).then((res) => {
        if (res.data.code === 200) {
          getDetailData();
        } else if (res.data.code === 401) {
          console.log(res);
        } else {
          console.log(res);
        }
      }).catch(error => (error));
    } else {
      alert('인플루언서로 로그인 해 주세요');
    }
  }

  function checkIsRequested() {
    if (productData.TB_NOTIFICATIONs && productData.TB_NOTIFICATIONs.length > 0) {
      return true;
    }
    return false;
  }

  function calculateDates(date) {
    const currentDate = new Date();
    const lastDate = new Date(date);
    const daysLag = Math.ceil(Math.abs(lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    return daysLag;
  }

  return (
    <Box width="1160px" margin="0 auto" className="campaign-detail">
      {Object.keys(productData).length
        ? (
          <Grid container>
            <Grid item style={{ width: getWidth() }}>
              <Box py={6} pr={6}>
                <StyledText fontSize="33">{productData.AD_NAME}</StyledText>
                <Box mt={3} mb={5}>
                  <StyledText fontSize="16" color={Colors.grey2}>{ReactHtmlParser(productData.AD_SHRT_DISC)}</StyledText>
                </Box>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Box width="130px" mb={2}>
                      <Grid container justify="space-between">
                        <Grid item>
                          <Favorite />
                        </Grid>
                        <Grid item>
                          <Share />
                        </Grid>
                        <Grid item>
                          <Print />
                        </Grid>
                        <Grid item>
                          <Error />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
                <StyledImage width="100%" height="435px" src={currentImage || testImage} />
                <Box mt={1} mb={5}>
                  <Grid container spacing={1}>
                    {productData.TB_PHOTO_ADs.map(item => (
                      <Grid item xs={2} key={item.PHO_FILE}>
                        <StyledImage width="100%" src={item.PHO_FILE} alt="noFoto" onMouseOver={() => setCurrentImage(item.PHO_FILE)} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Grid container justify="flex-end" spacing={1}>
                  <Grid item xs={7}>
                    <Box border={`1px solid ${Colors.grey7}`} borderRadius="5px" p={3} pb={6}>
                      <StyledText fontSize="16px" fontWeight="bold">리뷰어 신청현황</StyledText>
                      <Box mt={3}>
                        <Grid container alignItems="center" justify="space-between">
                          <Grid item>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <StyledSvg
                                component={SupervisorAccount}
                                color={Colors.grey5}
                                fontSize="20px"
                              />
                              <StyledText overflowHidden fontSize="15" color={Colors.grey5}>
                                <span style={{ color: Colors.pink, margin: '2px', fontWeight: 'bold' }}>{`${productData.TB_PARTICIPANTs.length} `}</span>
                                명
                              </StyledText>
                            </div>
                          </Grid>
                          <Grid item>
                            <StyledText overflowHidden fontSize="15" color={Colors.grey5}>
                              <span style={{ color: Colors.black, fontWeight: 'bold' }}>{`${productData.AD_INF_CNT} `}</span>
                              명
                            </StyledText>
                          </Grid>
                        </Grid>
                      </Box>
                      <Box mt={1} height="5px" borderRadius="50px" overflow="hidden" css={{ background: Colors.grey6 }}>
                        <Box height="4px" width={`${productData.proportion}%`} css={{ background: Colors.pink2 }} />
                      </Box>
                      <div style={{ position: 'relative', top: '9px', left: '-23px' }}>
                        <div
                          className="percent_bubble_layer"
                          style={{
                            position: 'absolute', top: '10', left: productData.proportion > 100 ? '100%' : `${productData.proportion}%`, padding: '5px 0'
                          }}
                        >
                          <StyledText fontSize="12" color={Colors.pink}>{`${productData.proportion}%`}</StyledText>
                        </div>
                      </div>
                    </Box>
                  </Grid>
                  <Grid item xs={5}>
                    <Box border={`1px solid ${Colors.grey7}`} borderRadius="5px" p={3}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Grid container justify="space-between">
                            <Grid item><StyledText fontWeight="bold">카테고리</StyledText></Grid>
                            <Grid item><StyledText>{`${AdvertiseTypes.mainType[productData.AD_CTG]}/${AdvertiseTypes.subType[productData.AD_CTG][productData.AD_CTG2]}`}</StyledText></Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container justify="space-between">
                            <Grid item><StyledText fontWeight="bold">진행상태</StyledText></Grid>
                            <Grid item>
                              <StyledText color={Colors.pink}>
                                {`리뷰어신청 D-${calculateDates(productData.AD_SRCH_END)}`}
                              </StyledText>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container justify="space-between" alignItems="center">
                            <Grid item><StyledText fontWeight="bold">모집희망SNS</StyledText></Grid>
                            <Grid item>
                              <Grid container spacing={1}>
                                <Grid item><StyledImage width="21px" height="21px" src={IconInsta} /></Grid>
                                <Grid item><StyledImage width="21px" height="21px" src={IconYoutube} /></Grid>
                                <Grid item><StyledImage width="21px" height="21px" src={IconBlog} /></Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
                <Box mt={10} borderBottom={`1px solid ${Colors.grey7}`}>
                  <Grid container>
                    <Grid item>
                      <ElementLink name="detail" />
                      <Box padding="13px 20px">
                        <StyledText fontSize="16">상세정보</StyledText>
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box padding="13px 20px">
                        <StyledText fontSize="16">{`신청한 리뷰어 ${productData.TB_PARTICIPANTs.length}`}</StyledText>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                {ReactHtmlParser(productData.AD_DETAIL)}
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      <ElementLink name="provide" />
                      <Grid item xs={2}>
                        <Box fontWeight="bold" component="p">제공내역</Box>
                      </Grid>
                      <Grid item xs={10} className="provide-info">
                        {ReactHtmlParser(productData.AD_PROVIDE)}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      <ElementLink name="search" />
                      <Grid item xs={2}>
                        <StyledText fontWeight="bold" fontSize="16">검색 키워드</StyledText>
                      </Grid>
                      <Grid item xs={10} className="provide-info">
                        <StyledText fontSize="16">{productData.AD_SEARCH_KEY}</StyledText>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      <ElementLink name="discription" />
                      <Grid item xs={2}>
                        <StyledText fontWeight="bold" fontSize="16" lineHeight="2">참여 안내 사항</StyledText>
                      </Grid>
                      <Grid item xs={10} className="provide-info" style={{ lineHeight: '2' }}>
                        {ReactHtmlParser(productData.AD_DISC)}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      <ElementLink name="info" />
                      <Grid item xs={2}>
                        <StyledText fontWeight="bold" fontSize="16">업체 정보</StyledText>
                      </Grid>
                      <Grid item xs={10} className="provide-info">
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Grid container>
                              <Grid item xs={2}><StyledText fontSize="16">주소</StyledText></Grid>
                              <Grid item xs={10}>
                                <StyledText fontSize="16">
                                  {`(${productData.AD_POST_CODE}) ${productData.AD_ROAD_ADDR} ${productData.AD_DETAIL_ADDR} ${productData.AD_EXTR_ADDR}`}
                                </StyledText>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container>
                              <Grid item xs={2}><StyledText fontSize="16">연락처</StyledText></Grid>
                              <Grid item xs={10}>
                                <StyledText fontSize="16">{productData.AD_TEL}</StyledText>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container>
                              <Grid item xs={2}><StyledText fontSize="16">이메일</StyledText></Grid>
                              <Grid item xs={10}>
                                <StyledText fontSize="16">{productData.AD_EMAIL}</StyledText>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item style={{ width: '360px', borderLeft: '1px solid #eee' }}>
              <Box py={6} pl={6} style={isSticky ? fixedStyles : {}}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledText fontSize="16" fontWeight="bold">리뷰어 신청  2020-11-01 ~ 2020-11-30</StyledText>
                  </Grid>
                  <Grid item xs={12}><Divider /></Grid>
                  <Grid item xs={12}>
                    <StyledText fontSize="18" cursor="pointer" onClick={() => scrollTo('detail')}>캠페인 상세정보</StyledText>
                  </Grid>
                  <Grid item xs={12}><Divider /></Grid>
                  <Grid item xs={12}>
                    <StyledText fontSize="18" cursor="pointer" onClick={() => scrollTo('provide')}>제공내역</StyledText>
                  </Grid>
                  <Grid item xs={12}><Divider /></Grid>
                  <Grid item xs={12}>
                    <StyledText fontSize="18" cursor="pointer" onClick={() => scrollTo('search')}>검색 키워드</StyledText>
                  </Grid>
                  <Grid item xs={12}><Divider /></Grid>
                  <Grid item xs={12}>
                    <StyledText fontSize="18" cursor="pointer" onClick={() => scrollTo('discription')}>참여 안내 사항</StyledText>
                  </Grid>
                  <Grid item xs={12}><Divider /></Grid>
                  <Grid item xs={12}>
                    <StyledText fontSize="18" cursor="pointer" onClick={() => scrollTo('info')}>업체 정보</StyledText>
                  </Grid>
                  <Grid item xs={12}><Divider /></Grid>
                  <Grid item xs={12}>
                    <StyledButton background={Colors.pink3} hoverBackground={Colors.pink}>
                      <StyledText fontWeight="bold" fontSize="20" color={Colors.white}>
                          리뷰어 신청하기
                      </StyledText>
                    </StyledButton>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
      /* <Grid container spacing={8}>
            <Grid item xs={12}>
              <Grid container justify="space-between">
                <Grid item>
                  <div className="product-image">
                    <Grid container>
                      <Grid item xs={12} className="main-img">
                        <img src={currentImage || testImage} alt="nofoto" />
                      </Grid>
                      <Grid item xs={12} className="img-slider">
                        <Grid container spacing={1}>
                          {productData.TB_PHOTO_ADs.map(item => (
                            <Grid item key={item.PHO_FILE}>
                              <img src={item.PHO_FILE} alt="noFoto" onMouseOver={() => setCurrentImage(item.PHO_FILE)} />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item className="product-info">
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Grid item>
                        <span className="channel">
                          {productData.AD_CHANNEL}
                        </span>
                        <span className="category">
                          {productData.AD_CTG}
                        </span>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <Box mb={1}>
                            <StyledText fontSize="26" fontWeight="700">{productData.AD_PROD_NAME}</StyledText>
                          </Box>
                          <Box mb={1}>
                            <StyledText fontSize="16">{productData.AD_ABOUT}</StyledText>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2} className="date">
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={5}>
                              <StyledText>캠페인 기간</StyledText>
                            </Grid>
                            <Grid item xs={7}>
                              <StyledText>{`${productData.AD_DT} ~ ${productData.AD_SRCH_END}`}</StyledText>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={5}>
                              <StyledText>블로거 신청 마감</StyledText>
                            </Grid>
                            <Grid item xs={7}>
                              <StyledText>{productData.AD_SRCH_END}</StyledText>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={5}>
                              <StyledText>지원내역</StyledText>
                            </Grid>
                            <Grid item xs={7}>
                              <StyledText>{productData.AD_SPON_ITEM}</StyledText>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={5}>
                              <StyledText>공유하기</StyledText>
                            </Grid>
                            <Grid item xs={7}>
                              <StyledText>{productData.AD_POST_END}</StyledText>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <StyledButton
                            onClick={sendRequest}
                            disabledObj={type === '1' || checkIsRequested()}
                            background={Colors.skyBlue}
                            hoverBackground="#1c4dbb"
                          >
                            {checkIsRequested() ? '캠페인 신청됨' : '캠페인 신청하기'}
                            {/!* 캠페인 싱청하기 *!/}
                          </StyledButton>
                        </Grid>
                        <Grid item xs={6}>
                          <StyledButton
                            onClick={() => setSubMenu(2)}
                            background={Colors.skyBlue}
                            hoverBackground="#1c4dbb"
                          >
                              신청자 확인
                          </StyledButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {
                    campaignSteps.map(item => (
                      <Grid key={item.value} item xs={3}>
                        <Box py={2} className="step-card">
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <StyledText
                                fontSize="19"
                                fontWeight="bold"
                              >
                                {`Stage ${item.value}`}
                              </StyledText>
                            </Grid>
                            <Grid item xs={12}>
                              <StyledText fontSize="13">{item.text}</StyledText>
                            </Grid>
                            <Grid item xs={12}>
                              <Box>
                                <StyledText>{productData.AD_DT}</StyledText>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    ))
                  }
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item className={`submenu${subMenu === 1 ? ' active' : ''}`} xs={4} onClick={() => setSubMenu(1)}>
                  <Box py={2}><StyledText>체험단 상세정보</StyledText></Box>
                </Grid>
                <Grid item className={`submenu${subMenu === 2 ? ' active' : ''}`} xs={4} onClick={() => setSubMenu(2)}>
                  <Box py={2}><StyledText>신청자(16)</StyledText></Box>
                </Grid>
                <Grid item className="submenu three" xs={4} />
              </Grid>
              <Box py={4}>
                {subMenu === 1
                  ? (
                    <div>
                      <StyledImage width="720px" src={TestPage} />
                    </div>
                  ) : (
                    <BlogerList />
                  )
                  }
              </Box>
            </Grid>

          </Grid> */
        )
        : (
          <Grid container justify="center">
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        )
        }
    </Box>
  );
}

export default CampaignDetail;
