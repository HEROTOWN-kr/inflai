import React, { useContext, useEffect, useState } from 'react';
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
import CampaignApplyDialog from '../dialog/CampaignApplyDialog';
import defaultAccountImage from '../../img/default_account_image.png';
import AuthContext from '../../context/AuthContext';

function TabComponent(props) {
  const {
    tab, setTab, text, tabNumber
  } = props;
  const styles = tab === tabNumber ? {
    border: `3px solid ${Colors.pink2}`,
    fontWeight: 'bold'
  } : {
    border: '0',
    fontWeight: '400'
  };


  return (
    <Box
      padding="13px 20px"
      borderBottom={styles.border}
      css={{ cursor: 'pointer' }}
      onClick={() => setTab(tabNumber)}
    >
      <StyledText fontSize="16" fontWeight={styles.fontWeight}>{text}</StyledText>
    </Box>
  );
}

function ParticipantList(props) {
  const { adId } = props;
  const [participants, setParticipants] = useState([]);

  function getParticipants() {
    axios.get('/api/TB_PARTICIPANT/getList', {
      params: { adId }
    }).then((res) => {
      const { data } = res.data;
      console.log(data);
      setParticipants(data);
    }).catch(err => alert(err.response.data.message));
  }

  useEffect(() => {
    getParticipants();
  }, []);

  return (
    <>
      {participants.map(item => (
        <Box key={item.PAR_ID} py={2} borderBottom={`1px solid ${Colors.grey7}`}>
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <StyledImage borderRadius="100%" width="90px" height="90px" src={item.INF_PHOTO || defaultAccountImage} />
            </Grid>
            <Grid item xs={10}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <StyledText fontSize={16} fontWeight="bold">{item.PAR_NAME}</StyledText>
                    </Grid>
                    {item.PAR_INSTA ? (
                      <Grid item><StyledImage width="21px" height="21px" src={IconInsta} /></Grid>
                    ) : null}
                    {item.PAR_YOUTUBE ? (
                      <Grid item><StyledImage width="21px" height="21px" src={IconYoutube} /></Grid>
                    ) : null}
                    {item.PAR_NAVER ? (
                      <Grid item><StyledImage width="21px" height="21px" src={IconBlog} /></Grid>
                    ) : null}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <StyledText fontSize={15} lineHeight="1.3em">{item.PAR_MESSAGE}</StyledText>
                </Grid>
                <Grid item xs={12}>
                  <StyledText fontSize={15}>
                    {item.PAR_DT}
                  </StyledText>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ))}
    </>
  );
}

function CampaignDetail(props) {
  const { match, history } = props;
  const adId = match.params.id;
  const [productData, setProductData] = useState({
    TB_PHOTO_ADs: [],
    TB_PARTICIPANTs: [],
    AD_CTG: 0
  });
  const [currentImage, setCurrentImage] = useState('');
  const [isSticky, setSticky] = useState(false);
  const [tab, setTab] = useState(2);
  const testImage = 'https://www.inflai.com/attach/portfolio/33/1yqw1whkavscxke.PNG';
  const { token } = useContext(AuthContext);
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

    axios.get('/api/TB_AD/campaignDetail', {
      params: apiObj
    }).then((res) => {
      const { data } = res.data;
      console.log(data);
      setProductData(data);
      setCurrentImage(data.TB_PHOTO_ADs[0].PHO_FILE);
    }).catch(err => alert(err.response.data.message));
  }

  function sendRequest() {
    if (token) {
      // history.push(`/CampaignList/apply/${adId}`);

      axios.get('/api/TB_PARTICIPANT/checkParticipant', {
        params: {
          adId,
          token
        }
      }).then((res) => {
        if (res.status === 201) {
          alert(res.data.data.message);
        } else {
          history.push(`/CampaignList/apply/${adId}`);
        }
      }).catch(error => (error.response.data.message));
    } else {
      alert('인플루언서로 로그인 해 주세요');
    }
  }

  function calculateDates(date) {
    const currentDate = new Date();
    const lastDate = new Date(date);
    const daysLag = Math.ceil(Math.abs(lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    return daysLag;
  }

  useEffect(() => {
    getDetailData();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);


  return (
    <Box width="1160px" margin="0 auto" className="campaign-detail">
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
            <Box mt={10} borderBottom={`2px solid ${Colors.grey7}`}>
              <Grid container>
                <ElementLink name="detail" />
                <Grid item>
                  <TabComponent tab={tab} setTab={setTab} text="상세정보" tabNumber={1} />
                </Grid>
                <Grid item>
                  <TabComponent tab={tab} setTab={setTab} text={`신청한 리뷰어 ${productData.TB_PARTICIPANTs.length}`} tabNumber={2} />
                </Grid>
              </Grid>
            </Box>
            {tab === 1 ? (
              <>
                {ReactHtmlParser(productData.AD_DETAIL)}
              </>
            ) : (
              <ParticipantList adId={adId} />
            )}

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
                <StyledText fontSize="16" fontWeight="bold">{`리뷰어 신청  ${productData.AD_SRCH_START} ~ ${productData.AD_SRCH_END}`}</StyledText>
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
                <StyledButton background={Colors.pink3} hoverBackground={Colors.pink} fontWeight="bold" fontSize="20px" onClick={sendRequest}>
                  리뷰어 신청하기
                </StyledButton>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {/* {Object.keys(productData).length
        ? (

        )
        : (
          <Grid container justify="center">
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        )
        } */}
    </Box>
  );
}

export default CampaignDetail;
