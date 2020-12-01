import React, { useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import WhiteBlock from '../../containers/WhiteBlock';
import PageTitle from './PageTitle';
import StyledText from '../../containers/StyledText';

const cardInfo = [
  { name: '플랜', data: 'planName' },
  { name: '시작 날짜', data: 'startDate' },
  { name: '마감 날짜', data: 'finishDate' },
  { name: '상태', data: 'state' },
];

function MembershipInfo(props) {
  const [subscribeData] = useState({
    planName: 'test',
    startDate: 'test',
    finishDate: 'test',
    state: 'test'
  });

  return (
    <div>
      <WhiteBlock>
        <PageTitle>
          <StyledText fontSize="24">
            멤버십 관리
          </StyledText>
        </PageTitle>
        <Box py={4} px={6}>
          <Box p={4} border="1px solid #e9ecef">
            <Grid container>
              {
                cardInfo.map(item => (
                  <Grid item xs={3}>
                    <Grid container>
                      <Grid item xs={12}>{item.name}</Grid>
                      <Grid item xs={12}>{subscribeData[item.data]}</Grid>
                    </Grid>
                  </Grid>
                ))
              }
            </Grid>
          </Box>
        </Box>
      </WhiteBlock>
    </div>
  );
}

export default MembershipInfo;
