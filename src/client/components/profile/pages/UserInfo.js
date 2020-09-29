import React from 'react';
import { Box } from '@material-ui/core';
import WhiteBlock from '../../containers/WhiteBlock';
import PageTitle from './PageTitle';
import StyledText from '../../containers/StyledText';
import { Colors } from '../../../lib/Сonstants';

function UserInfo() {
  return (
    <div>
      <WhiteBlock>
        <PageTitle>
          <StyledText fontSize="24">
            회원정보수정
          </StyledText>
        </PageTitle>
        <Box p={4}>
          <Box p={3}>
            <StyledText fontSize="15">
              이메일 아이디
            </StyledText>
          </Box>
          <Box p={3}>
            <StyledText fontSize="15">
              전화번호
            </StyledText>
          </Box>
          <Box p={3}>
            <StyledText fontSize="15">
              주소
            </StyledText>
          </Box>
          <Box p={3}>
            <StyledText fontSize="15">
              사진
            </StyledText>
          </Box>
          <Box p={3}>
            <StyledText fontSize="15">
              인스타
            </StyledText>
          </Box>
          <Box p={3}>
            <StyledText fontSize="15">
              유튜브
            </StyledText>
          </Box>
          <Box p={3}>
            <StyledText fontSize="15">
              네이버
            </StyledText>
          </Box>
          <Box p={3}>
            <StyledText fontSize="15">
              카카오수신동의
            </StyledText>
          </Box>
        </Box>
      </WhiteBlock>
    </div>
  );
}

export default UserInfo;
