import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Colors } from '../../../../lib/Сonstants';

function AgeGraph(props) {
  const [statistics, setStatistics] = useState({
    likeStats: [],
    commentsStats: []
  });
  const [process, setProcess] = useState(false);
  const { INS_ID } = props;

  async function getStatistics() {
    setProcess(true);
    const InstaData = await axios.get('/api/TB_INSTA/statsAge', {
      params: { INS_ID }
    });
    // const { data } = InstaData.data;
    /* console.log(data);
    setStatistics(data); */
    setProcess(false);
  }

  useEffect(() => {
    if (INS_ID) {
      getStatistics();
    }
  }, [INS_ID]);

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: Colors.orange,
        borderColor: Colors.orange,
        borderWidth: 1,
        // hoverBackgroundColor: Colors.blue2,
        // hoverBorderColor: Colors.blue2,
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

  return (
    <div>
      <button onClick={() => getStatistics()}>refresh</button>
      {
        process ? <CircularProgress /> : (
        // <Box width="500px" height="250px">
          <Bar
            data={data}
            width={500}
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
