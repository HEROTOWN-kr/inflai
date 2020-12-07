import React, { useContext } from 'react';
import { Box, Grid } from '@material-ui/core';
import axios from 'axios';
import { Colors } from '../../lib/Сonstants';
import MainBlock from '../containers/MainBlock';
import StyledText from '../containers/StyledText';
import TestPage from '../../img/detail-page.jpg';
import StyledImage from '../containers/StyledImage';
import defaultAccountImage from '../../img/default_account_image.png';
import WhiteBlock from '../containers/WhiteBlock';
import AuthContext from '../../context/AuthContext';
import StyledButton from '../containers/StyledButton';

function ProfileMenu(props) {
  const { history, match, userInfo } = props;
  const { userRole, token } = useContext(AuthContext);

  const links = [
    { text: '내정보 관리', link: '/UserInfo' },
    { text: '캠페인 관리', link: '/CampaignInfo' },
  ];

  if (userRole === '1') links.push({ text: '멤버십 관리', link: '/MembershipInfo' });
  if (userRole === '2') links.push({ text: '랭킹 정보', link: '/Rank' });

  function checkSubscription() {
    axios.get('/api/TB_SUBSCRIPTION/check', {
      params: { token }
    }).then((res) => {
      if (res.status === 201) {
        history.push('/Profile/MembershipInfo');
      } else if (res.status === 200) {
        history.push('/Campaign');
      }
    }).catch(err => alert(err));
  }

  return (
    <Box width={250}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <WhiteBlock p={4}>
            <Box py={5} borderBottom={`1px solid ${Colors.grey4}`} textAlign="center">
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <StyledText fontWeight="500" fontSize="24">
                          마이페이지
                  </StyledText>
                </Grid>
                <Grid item xs={12}>
                  <Box py={1}>
                    <StyledImage width="110px" height="110px" borderRadius="100%" src={userInfo.INF_PHOTO || userInfo.ADV_PHOTO || defaultAccountImage} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <StyledText fontSize="16" fontWeight="600">
                    {userInfo.INF_NAME || userInfo.ADV_NAME }
                  </StyledText>
                </Grid>
                <Grid item xs={12}>
                  <StyledText fontSize="14">
                    {`${userInfo.INF_BLOG_TYPE || userInfo.ADV_BLOG_TYPE} 로그인`}
                  </StyledText>
                </Grid>
              </Grid>
            </Box>
            <Box p={2}>
                  받은쪽지
            </Box>
          </WhiteBlock>
        </Grid>
        <Grid item xs={12}>
          <WhiteBlock>
            {links.map((item, index) => (
              <Box
                key={item.text}
                py={2}
                px={3}
                borderTop={index !== 0 ? `1px solid ${Colors.grey4}` : null}
                onClick={event => history.push(match.path + item.link)}
                className="profile-menu-link"
              >
                <StyledText fontSize="18">
                  {item.text}
                </StyledText>
              </Box>
            ))}
          </WhiteBlock>
        </Grid>
        {
          userRole === '1' ? (
            <Grid item xs={12}>
              <StyledButton borderRadius="7px" onClick={() => checkSubscription()}>캠페인 등록</StyledButton>
            </Grid>
          ) : null
        }
      </Grid>
    </Box>
  );
}

export default ProfileMenu;
