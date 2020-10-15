import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Colors } from '../../../../lib/Сonstants';

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
        // <Box width="500px" height="250px">
          <Bar
            data={data}
            width={400}
            height={250}
            options={{
              maintainAspectRatio: false
            }}
          />
        // </Box>
        )
      }
    </div>
  );
}

export default AgeGraph;
