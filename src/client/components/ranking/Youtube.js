import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import axios from 'axios';
import StyledTableCell from '../containers/StyledTableCell';
import StyledTableRow from '../containers/StyledTableRow';

function Youtube(props) {
  const [influencers, setInfluencers] = useState([]);
  const { userId } = props;

  const tableRows = {
    title: [
      {
        text: '이름',
        align: 'left'
      },
      {
        text: '구독수',
        align: 'right'
      },
      {
        text: '보기수',
        align: 'right'
      }
    ],
    body: ['INF_NAME', 'YOU_SUBS', 'YOU_VIEWS']
  };

  function getInfluencers() {
    axios.get('/api/TB_YOUTUBE/').then(
      (res) => {
        const { data } = res.data;
        setInfluencers(data);
      }
    );
  }

  useEffect(() => {
    getInfluencers();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            {
              tableRows.title.map(item => (
                <StyledTableCell key={item.text} align={item.align}>{item.text}</StyledTableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {influencers.map(row => (
            <StyledTableRow hover key={row.YOU_ID}>
              {
                tableRows.body.map((item, index) => (
                  <StyledTableCell
                    key={item}
                    component={index === 0 ? 'th' : ''}
                    scope={index === 0 ? 'row' : ''}
                    align={index > 0 ? 'right' : 'left'}
                    className={row.INF_ID === userId ? 'current' : null}
                  >
                    {row[item] >= 0 ? row[item] : row.TB_INFLUENCER[item]}
                  </StyledTableCell>
                ))
              }
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Youtube;
