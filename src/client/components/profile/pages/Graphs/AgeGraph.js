import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Colors } from '../../../../lib/Сonstants';
import StyledText from '../../../containers/StyledText';

function AgeGraph(props) {
  const [statistics, setStatistics] = useState({
    interval: [],
    age: []
  });
  const [process, setProcess] = useState(false);
  const { INS_ID } = props;

  async function getStatistics() {
    setProcess(true);
    const InstaAgeInsights = await axios.get('/api/TB_INSTA/statsAge', {
      params: { INS_ID }
    });
    const { data } = InstaAgeInsights.data;
    setStatistics(data);
    setProcess(false);
  }

  useEffect(() => {
    if (INS_ID) {
      getStatistics();
    }
  }, [INS_ID]);

  const data = {
    labels: statistics.interval,
    datasets: [
      {
        label: '팔로워 수',
        backgroundColor: Colors.orange,
        borderColor: Colors.orange,
        borderWidth: 1,
        // hoverBackgroundColor: Colors.blue2,
        // hoverBorderColor: Colors.blue2,
        data: statistics.age
      }
    ]
  };

  return (
    <div>
      {
        process ? <CircularProgress /> : (
          <React.Fragment>
            {
              statistics.age && statistics.age.length > 0 ? (
                <Bar
                  data={data}
                  width={400}
                  height={250}
                  options={{
                    maintainAspectRatio: false
                  }}
                />
              ) : (
                <StyledText fontSize="14" textAlign="center">
                      팔로워가 100명 미만인 데이터가 제공되지 않습니다.
                </StyledText>
              )
              }
          </React.Fragment>
        )
      }
    </div>
  );
}

export default AgeGraph;
