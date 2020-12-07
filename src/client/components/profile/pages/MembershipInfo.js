import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import axios from 'axios';
import WhiteBlock from '../../containers/WhiteBlock';
import PageTitle from './PageTitle';
import StyledText from '../../containers/StyledText';
import AuthContext from '../../../context/AuthContext';
import { Colors } from '../../../lib/Сonstants';

const cardInfo = [
  { name: '플랜', data: 'PLN_NAME' },
  { name: '시작 날짜', data: 'SUB_START_DT' },
  { name: '마감 날짜', data: 'SUB_END_DT' },
  // { name: '상태', data: 'SUB_STATUS' },
];

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

function MembershipInfo(props) {
  const [subscribeData, setSubscribeData] = useState([
    {
      PLN_NAME: '',
      SUB_START_DT: '',
      SUB_END_DT: '',
      SUB_STATUS: ''
    }
  ]);
  const [tab, setTab] = useState(1);
  const { token } = useContext(AuthContext);

  function getSubscribtions() {
    axios.get('/api/TB_SUBSCRIPTION/', {
      params: { token, tab }
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
    if (token) getSubscribtions();
  }, [token]);

  useEffect(() => {
    if (token) getSubscribtions();
  }, [tab]);

  return (
    <WhiteBlock height="100%">
      <PageTitle>
        <StyledText fontSize="24">
            멤버십 관리
        </StyledText>
      </PageTitle>
      <Box py={4} px={6}>
        <Box borderBottom={`2px solid ${Colors.grey7}`}>
          <Grid container>
            <Grid item>
              <TabComponent tab={tab} setTab={setTab} text="진행중 서브스크립션" tabNumber={1} />
            </Grid>
            <Grid item>
              <TabComponent tab={tab} setTab={setTab} text="전체 서브스크립션" tabNumber={2} />
            </Grid>
          </Grid>
        </Box>
        <Box mt={4}>
          {
            subscribeData.length > 0 ? (
              <Grid container spacing={1}>
                {
                  subscribeData.map(sub => (
                    <Grid item xs={12}>
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
                          <Grid item xs={3}>
                            <Grid container direction="column" alignItems="center">
                              <Grid item><StyledText fontWeight="bold" lineHeight="1.5em">상태</StyledText></Grid>
                              <Grid item>
                                <StyledText
                                  color={sub.SUB_STATUS === '대기' ? Colors.red : Colors.green}
                                  lineHeight="1.5em"
                                >
                                  {sub.SUB_STATUS || '-'}
                                </StyledText>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  ))
                }
              </Grid>
            ) : (
              <React.Fragment>
                <Grid container justify="center">
                  <Grid item>
                    <StyledText fontSize="16">
                      진행중 서브스크립션이 없습니다.
                    </StyledText>
                  </Grid>
                </Grid>
              </React.Fragment>
            )
            }
        </Box>
      </Box>
    </WhiteBlock>
  );
}

export default MembershipInfo;
