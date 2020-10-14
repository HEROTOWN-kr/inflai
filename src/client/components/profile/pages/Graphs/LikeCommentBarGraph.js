import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Colors } from '../../../../lib/Сonstants';

function LikeCommentBarGraph(props) {
  const [statistics, setStatistics] = useState({
    likeStats: [],
    commentsStats: []
  });
  const [process, setProcess] = useState(false);
  const { INS_ID } = props;

  async function getStatistics() {
    setProcess(true);
    const InstaData = await axios.get('/api/TB_INSTA/detail', {
      params: { INS_ID }
    });
    const { data } = InstaData.data;
    console.log(data);
    setStatistics(data);
    setProcess(false);
  }

  useEffect(() => {
    if (INS_ID) {
      getStatistics();
    }
  }, [INS_ID]);

  const data = {
    datasets: [{
      label: 'Likes',
      type: 'line',
      data: statistics.likeStats,
      fill: false,
      borderColor: Colors.orange,
      backgroundColor: Colors.orange,
      pointBorderColor: Colors.orange,
      pointBackgroundColor: Colors.orange,
      pointHoverBackgroundColor: Colors.orange,
      pointHoverBorderColor: Colors.orange,
      yAxisID: 'y-axis-2'
    }, {
      label: 'Replies',
      type: 'bar',
      data: statistics.commentsStats,
      fill: false,
      backgroundColor: Colors.blue2,
      borderColor: Colors.blue2,
      hoverBackgroundColor: Colors.blue2,
      hoverBorderColor: Colors.blue2,
      yAxisID: 'y-axis-1'
    }]
  };

  const options = {
    responsive: true,
    tooltips: {
      mode: 'label'
    },
    elements: {
      line: {
        fill: false
      }
    },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            display: false
          },
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
        }
      ],
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
          gridLines: {
            display: false
          },
          labels: {
            show: true
          }
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-2',
          gridLines: {
            display: false
          },
          labels: {
            show: true
          }
        }
      ]
    }
  };

  const plugins = [{
    afterDraw: (chartInstance, easing) => {
      const { ctx } = chartInstance.chart;
      // ctx.fillText('This text drawn by a plugin', 100, 100);
    }
  }];

  return (
    <div>
      {
        process ? <CircularProgress /> : (
          <Bar
            width={500}
            height={250}
            data={data}
            options={options}
          />
        )
      }
    </div>
  );
}

export default LikeCommentBarGraph;
