import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid } from '@material-ui/core';
import { PieChart } from 'react-minimal-pie-chart';
import axios from 'axios';

function GoogleVisionGraph(props) {
  const [detectData, setDetectData] = useState([]);
  const [process, setProcess] = useState(false);
  const { INS_ID } = props;


  async function getGoogleVisionData(INS_ID) {
    setProcess(true);
    const isLocal = window.location.host !== 'admin.inflai.com';

    const googleData = await axios.get('/api/TB_INSTA/getGoogleData', {
      params: { INS_ID, isLocal }
    });
    setDetectData(googleData.data.statistics);
    setProcess(false);
  }

  useEffect(() => {
    if (INS_ID) {
      getGoogleVisionData(INS_ID);
    }
  }, [INS_ID]);


  return (
    <React.Fragment>
      {
              process ? <CircularProgress /> : (
                <div>
                  {detectData && detectData.length ? (
                    <Box
                      maxWidth="800px"
                      height="200px"
                      margin="0 auto"
                    >
                      <PieChart
                        data={detectData}
                        animate="true"
                        animationDuration="800"
                        label={({ dataEntry }) => `${dataEntry.description} : ${dataEntry.value}%`}
                        labelStyle={index => ({
                          fill: detectData[index].color,
                          // fill: 'red',
                          fontSize: '10px',
                          fontFamily: 'sans-serif',
                        })}
                        radius={35}
                        labelPosition={120}
                      />
                    </Box>
                  ) : (
                    <Grid container justify="center">
                      <Grid item>
                                  Google Vision Data
                      </Grid>
                    </Grid>
                  )
                      }
                </div>
              )
          }
    </React.Fragment>
  );
}

export default GoogleVisionGraph;
