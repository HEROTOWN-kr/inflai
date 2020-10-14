import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid } from '@material-ui/core';
import axios from 'axios';
import { PieChart } from 'react-minimal-pie-chart';
import {
  ChatBubble, Favorite, Image, CompareArrows, ImportExportOutlined, CalendarToday
} from '@material-ui/icons';
import WhiteBlock from '../../containers/WhiteBlock';
import StyledImage from '../../containers/StyledImage';
import Common from '../../../lib/common';
import defaultAccountImage from '../../../img/default_account_image.png';
import StyledText from '../../containers/StyledText';
import StyledSvg from '../../containers/StyledSvg';
import GoogleVisionGraph from './Graphs/GoogleVisionGraph';
import LikeCommentBarGraph from './Graphs/LikeCommentBarGraph';
import { Colors } from '../../../lib/Сonstants';
import AgeGraph from './Graphs/AgeGraph';

function InstagramInfo(props) {
  const [instaData, setInstaData] = useState({});
  const { token } = Common.getUserInfo();

  async function getInstaInfo() {
    try {
      const InstaData = await axios.get('/api/TB_INSTA/rankingInfo', {
        params: {
          token
        }
      });
      console.log(InstaData);
      const { data } = InstaData.data;
      setInstaData(data);
    } catch (err) {
      alert(err.response.data.message);
    }
  }

  useEffect(() => {
    getInstaInfo();
  }, []);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WhiteBlock borderRadius="25px">
                <Box px={3} py={3}>
                  <Grid container alignItems="center" spacing={3}>
                    <Grid item>
                      <StyledImage width="130" height="130" borderRadius="100%" src={instaData.INS_PROFILE_IMG || defaultAccountImage} />
                    </Grid>
                    <Grid item>
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <StyledText fontSize="20" fontWeight="bold">{instaData.INS_NAME || instaData.INS_USERNAME}</StyledText>
                        </Grid>
                        <Grid item>
                          <Grid container spacing={4}>
                            <Grid item>
                              <Grid container direction="column" alignItems="center" spacing={1}>
                                <Grid item><StyledText fontWeight="bold">{instaData.INS_MEDIA_CNT}</StyledText></Grid>
                                <Grid item>
                                  <StyledText fontSize="14">개시물 수</StyledText>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item>
                              <Grid container direction="column" alignItems="center" spacing={1}>
                                <Grid item><StyledText fontWeight="bold">{instaData.INS_FLWR}</StyledText></Grid>
                                <Grid item>
                                  <StyledText fontSize="14">팔로워 수</StyledText>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item>
                              <Grid container direction="column" alignItems="center" spacing={1}>
                                <Grid item><StyledText fontWeight="bold">{instaData.INS_FLW}</StyledText></Grid>
                                <Grid item>
                                  <StyledText fontSize="14">팔로잉 수</StyledText>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <StyledText fontSize="14" fontWeight="bold">{instaData.INS_USERNAME}</StyledText>
                        </Grid>
                        <Grid item>
                          <StyledText fontSize="14">{instaData.biography}</StyledText>
                        </Grid>
                        <Grid item>
                          <StyledText fontSize="14" color="#409CFF" fontWeight="bold">{instaData.website}</StyledText>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </WhiteBlock>
            </Grid>
            <Grid item xs={6}>
              <WhiteBlock borderRadius="25px">
                <Box px={2} pt={2} pb={5}>
                  <Grid container direction="column" spacing={2} alignItems="center">
                    <Grid item container justify="space-between" alignItems="center">
                      <Grid item><StyledText fontSize="14">좋아요 수</StyledText></Grid>
                      <StyledSvg
                        component={Favorite}
                        color={Colors.orange}
                        fontSize="14px"
                        padding="8px"
                        background={Colors.orangeBack}
                        borderRadius="100%"
                      />
                    </Grid>
                    <Grid item><StyledText fontSize="30" fontWeight="900">{instaData.INS_LIKES}</StyledText></Grid>
                  </Grid>
                </Box>
              </WhiteBlock>
            </Grid>
            <Grid item xs={6}>
              <WhiteBlock borderRadius="25px">
                <Box px={2} pt={2} pb={5}>
                  <Grid container direction="column" spacing={2} alignItems="center">
                    <Grid item container justify="space-between" alignItems="center">
                      <Grid item><StyledText fontSize="14">댓글 수</StyledText></Grid>
                      <StyledSvg
                        component={ChatBubble}
                        color={Colors.blue2}
                        fontSize="14px"
                        padding="8px"
                        background={Colors.blue2Back}
                        borderRadius="100%"
                      />
                    </Grid>
                    <Grid item><StyledText fontSize="30" fontWeight="900">{instaData.INS_CMNT}</StyledText></Grid>
                  </Grid>
                </Box>
              </WhiteBlock>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <WhiteBlock borderRadius="25px" height="100%">
            <Box px={2} py={2}>
              <Grid container direction="column" spacing={2} alignItems="center">
                <Grid item container justify="space-between" alignItems="center">
                  <Grid item><StyledText fontSize="14">콘텐츠 카테고리</StyledText></Grid>
                  <StyledSvg
                    component={Image}
                    color={Colors.orange}
                    fontSize="14px"
                    padding="8px"
                    background={Colors.orangeBack}
                    borderRadius="100%"
                  />
                </Grid>
                <Grid item>
                  <GoogleVisionGraph INS_ID={instaData.INS_ID} />
                </Grid>
              </Grid>
            </Box>
          </WhiteBlock>
        </Grid>
        <Grid item xs={6}>
          <WhiteBlock borderRadius="25px">
            <Box px={2} py={2}>
              <Grid container direction="column" spacing={2} alignItems="center">
                <Grid item container justify="space-between" alignItems="center">
                  <Grid item><StyledText fontSize="14">인플루언서 계정의 각 게시물마다 (좋아요, 댓글) 수 비교</StyledText></Grid>
                  <StyledSvg
                    component={ImportExportOutlined}
                    color={Colors.orange}
                    fontSize="14px"
                    padding="8px"
                    background={Colors.orangeBack}
                    borderRadius="100%"
                  />
                </Grid>
                <Grid item>
                  <LikeCommentBarGraph INS_ID={instaData.INS_ID} />
                </Grid>
              </Grid>
            </Box>
          </WhiteBlock>
        </Grid>
        <Grid item xs={6}>
          <WhiteBlock borderRadius="25px">
            <Box px={2} py={2}>
              <Grid container direction="column" spacing={2} alignItems="center">
                <Grid item container justify="space-between" alignItems="center">
                  <Grid item><StyledText fontSize="14">나이</StyledText></Grid>
                  <StyledSvg
                    component={CalendarToday}
                    color={Colors.blue2}
                    fontSize="14px"
                    padding="8px"
                    background={Colors.blue2Back}
                    borderRadius="100%"
                  />
                </Grid>
                <Grid item>
                  <AgeGraph INS_ID={instaData.INS_ID} />
                </Grid>
              </Grid>
            </Box>
          </WhiteBlock>
        </Grid>
      </Grid>
    </div>
  );
}

export default InstagramInfo;
