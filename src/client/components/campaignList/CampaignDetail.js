import React, { useEffect, useState } from 'react';
import {
  Grid, Divider, CircularProgress, Button, Box
} from '@material-ui/core';
import axios from 'axios';
import Common from '../../lib/common';
import MainBlock from '../containers/MainBlock';
import StyledButton from '../containers/StyledButton';
import { Colors } from '../../lib/Сonstants';
import StyledText from '../containers/StyledText';

function CampaignDetail({
  match
}) {
  const [productData, setProductData] = useState({});
  const [currentImage, setCurrentImage] = useState('');
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
      // console.log(res.data);
      const { data } = res.data;
      setProductData(data);
      setCurrentImage(data.TB_PHOTO_ADs[0].PHO_FILE);
    });
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
    <MainBlock width="980">
      <Box my={4} p={6} className="campaign-detail">
        {Object.keys(productData).length
          ? (
            <Grid container justify="space-between">
              <Grid item>
                <div className="product-image">
                  <Grid container>
                    <Grid item xs={12} className="main-img">
                      <img src={currentImage ? `https://www.inflai.com${currentImage}` : testImage} alt="nofoto" />
                    </Grid>
                    <Grid item xs={12} className="img-slider">
                      <Grid container spacing={1}>
                        {productData.TB_PHOTO_ADs.map(item => (
                          <Grid item key={item.PHO_FILE}>
                            <img src={`https://www.inflai.com${item.PHO_FILE}`} alt="noFoto" onMouseOver={() => setCurrentImage(item.PHO_FILE)} />
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
                        <StyledText fontSize="16">{productData.AD_SPON_ITEM}</StyledText>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1} className="date">
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={5}>
                                캠페인 신청
                          </Grid>
                          <Grid item xs={7}>
                            {productData.AD_DT}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={5}>
                                블로거 신청 마감
                          </Grid>
                          <Grid item xs={7}>
                            {productData.AD_SRCH_END}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={5}>
                                캠페인 완료
                          </Grid>
                          <Grid item xs={7}>
                            {productData.AD_POST_END}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={5}>
                            제공 내역
                          </Grid>
                          <Grid item xs={7}>
                            {productData.AD_POST_END}
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
                          {/* 캠페인 싱청하기 */}
                        </StyledButton>
                      </Grid>
                      <Grid item xs={6}>
                        <StyledButton
                          // onClick={sendRequest}
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
    </MainBlock>
  );
}

export default CampaignDetail;
