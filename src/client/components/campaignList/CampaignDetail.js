import React, { useEffect, useState } from 'react';
import {
  Grid, Divider, CircularProgress, Button, Box
} from '@material-ui/core';
import axios from 'axios';
import {
  Sync, Favorite, Print, Share, Error, SupervisorAccount
} from '@material-ui/icons';
import Common from '../../lib/common';
import MainBlock from '../containers/MainBlock';
import StyledButton from '../containers/StyledButton';
import { Colors, campaignSteps } from '../../lib/Сonstants';
import StyledText from '../containers/StyledText';
import BlogerList from './BlogerList';
import TestPage from '../../img/detail-page.jpg';
import StyledImage from '../containers/StyledImage';
import StyledSvg from '../containers/StyledSvg';

function CampaignDetail({
  match
}) {
  const [productData, setProductData] = useState({});
  const [currentImage, setCurrentImage] = useState('');
  const [subMenu, setSubMenu] = useState(1);
  const testImage = 'https://www.inflai.com/attach/portfolio/33/1yqw1whkavscxke.PNG';
  const { token, type } = Common.getUserInfo();

  function getDetailData() {
    const apiObj = {
      id: match.params.id,
    };
    if (token && type === '2') apiObj.token = token;

    axios.get('/api/TB_AD/campaignDetail', {
      params: apiObj
    }).then((res) => {
      const { data } = res.data;
      setProductData(data);
      setCurrentImage(data.TB_PHOTO_ADs[0].PHO_FILE);
    }).catch(err => alert(err.response.data.message));
  }

  useEffect(() => {
    getDetailData();
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

  return (
    <Box p={6} width="1160px" margin="0 auto" className="campaign-detail">
      {Object.keys(productData).length
        ? (
          <Grid container>
            <Grid item xs={8}>
              <StyledText fontSize="33">{productData.AD_NAME}</StyledText>
              <Box mt={3} mb={5}>
                <StyledText fontSize="16" color={Colors.grey2}>{productData.AD_SHRT_DISC}</StyledText>
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
                  <Box border={`1px solid ${Colors.grey7}`} borderRadius="5px" p={3}>
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
                            <StyledText overflowHidden fontSize="13" color={Colors.grey5}>
                              <span style={{ color: Colors.pink }}>{`${productData.TB_PARTICIPANTs.length}`}</span>
                              {`/${productData.AD_INF_CNT}명`}
                            </StyledText>
                          </div>
                        </Grid>
                        <Grid item>
                          <StyledText overflowHidden fontSize="13" color={Colors.grey5}>
                            {`${productData.proportion}%`}
                          </StyledText>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box mt={1} height="5px" borderRadius="50px" overflow="hidden" css={{ background: Colors.grey6 }}>
                      <Box height="4px" width={`${productData.proportion}%`} css={{ background: Colors.pink2 }} />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box border={`1px solid ${Colors.grey7}`} p={3}>
                    <StyledText>test</StyledText>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>dates</Grid>

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
