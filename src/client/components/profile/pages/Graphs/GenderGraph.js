import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid } from '@material-ui/core';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Colors } from '../../../../lib/Сonstants';
import StyledText from '../../../containers/StyledText';

function GenderGraph(props) {
  const [statistics, setStatistics] = useState(0);
  const [process, setProcess] = useState(false);
  const { INS_ID } = props;

  async function getStatistics() {
    setProcess(true);
    const InstaData = await axios.get('/api/TB_INSTA/statsGender', {
      params: { INS_ID }
    });
    const { data } = InstaData.data;
    setStatistics(data);
    setProcess(false);
  }

  useEffect(() => {
    if (INS_ID) {
      getStatistics();
    }
  }, [INS_ID]);


  return (
    <React.Fragment>
      {
            process ? <CircularProgress /> : (
              <Grid container spacing={1}>
                <Grid item xs={12} container justify="space-between">
                  <Grid item>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <Box
                          width="10px"
                          height="10px"
                          css={{
                            backgroundColor: Colors.orange,
                            borderRadius: '100%'
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <StyledText>
                          {`남성 ${statistics}%`}
                        </StyledText>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <Box
                          width="10px"
                          height="10px"
                          css={{
                            backgroundColor: Colors.blue2,
                            borderRadius: '100%'
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <StyledText>
                          {`여성 ${100 - statistics}%`}
                        </StyledText>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    height="24px"
                    css={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: Colors.blue2
                    }}
                  >
                    <Box
                      height="inherit"
                      width={`${statistics}%`}
                      css={{
                        backgroundColor: Colors.orange,
                        overflow: 'hidden'
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            )
        }

    </React.Fragment>
  );
}

export default GenderGraph;
