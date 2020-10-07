import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { Colors } from '../../lib/Сonstants';
import MainBlock from '../containers/MainBlock';
import StyledText from '../containers/StyledText';
import TestPage from '../../img/detail-page.jpg';
import StyledImage from '../containers/StyledImage';
import defaultAccountImage from '../../img/default_account_image.png';
import WhiteBlock from '../containers/WhiteBlock';

function ProfileMenu(props) {
  const { history, match, userInfo } = props;
  const links = [
    { text: '내정보 관리', link: '/UserInfo' },
    { text: '랭킹 정보', link: '/Rank' }];

  const styles = {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'red',
    }
  };

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
                  <StyledImage width="110" borderRadius="100%" src={userInfo.INF_PHOTO || defaultAccountImage} />
                </Grid>
                <Grid item xs={12}>
                  <StyledText fontSize="16">
                          Name
                  </StyledText>
                </Grid>
                <Grid item xs={12}>
                  <StyledText fontSize="14">
                          Type of Auth
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
      </Grid>
    </Box>
  );
}

export default ProfileMenu;
