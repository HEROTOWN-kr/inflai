import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Colors } from '../../../../lib/Сonstants';

function MapGraph(props) {
  const [statistics, setStatistics] = useState({
    color: [],
    country: [],
    count: []
  });
  const [process, setProcess] = useState(false);
  const { INS_ID } = props;

  async function getStatistics() {
    setProcess(true);
    const InstaAgeInsights = await axios.get('/api/TB_INSTA/statsMap', {
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
    labels: statistics.country,
    datasets: [{
      data: statistics.count,
      backgroundColor: statistics.color,
      hoverBackgroundColor: statistics.color
    }]
  };

  return (
    <div>
      {
        process ? <CircularProgress /> : (
          <Doughnut
            data={data}
            width={500}
            height={250}
            options={{
              maintainAspectRatio: false,
              legend: {
                position: 'bottom',
              },
            }}
          />
        )
      }
    </div>
  );
}

export default MapGraph;
