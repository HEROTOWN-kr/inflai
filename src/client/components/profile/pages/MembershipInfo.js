import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import axios from 'axios';
import WhiteBlock from '../../containers/WhiteBlock';
import PageTitle from './PageTitle';
import StyledText from '../../containers/StyledText';
import AuthContext from '../../../context/AuthContext';

const cardInfo = [
  { name: '플랜', data: 'PLN_NAME' },
  { name: '시작 날짜', data: 'SUB_START_DT' },
  { name: '마감 날짜', data: 'SUB_END_DT' },
  { name: '상태', data: 'SUB_STATUS' },
];

function MembershipInfo(props) {
  const [subscribeData, setSubscribeData] = useState([
    {
      PLN_NAME: '',
      SUB_START_DT: '',
      SUB_END_DT: '',
      SUB_STATUS: ''
    }
  ]);
  const { token } = useContext(AuthContext);

  function getSubscribtions() {
    axios.get('/api/TB_SUBSCRIPTION/', {
      params: { token }
    }).then((res) => {
      const { data } = res.data;
      const subscribeArray = data.map((item) => {
        const { PLN_NAME } = item.TB_PLAN;
        return { ...item, PLN_NAME };
      });
      setSubscribeData(subscribeArray);
    }).catch(err => alert(err));
  }

  useEffect(() => {
    if (token) getSubscribtions(null);
  }, [token]);

  return (
    <div>
      <WhiteBlock>
        <PageTitle>
          <StyledText fontSize="24">
            멤버십 관리
          </StyledText>
        </PageTitle>
        <Box py={4} px={6}>
          {
            subscribeData.map(sub => (
              <Box py={4} border="1px solid #e9ecef">
                <Grid container>
                  {
                      cardInfo.map(item => (
                        <Grid item xs={3}>
                          <Grid container direction="column" alignItems="center">
                            <Grid item><StyledText fontWeight="bold" lineHeight="1.5em">{item.name}</StyledText></Grid>
                            <Grid item><StyledText lineHeight="1.5em">{sub[item.data] || '-'}</StyledText></Grid>
                          </Grid>
                        </Grid>
                      ))
                    }
                </Grid>
              </Box>
            ))
          }
        </Box>
      </WhiteBlock>
    </div>
  );
}

export default MembershipInfo;
