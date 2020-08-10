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

function Youtube() {
  const [influencers, setInfluencers] = useState([]);

  const tableRows = {
    title: ['이름', '구독수', '보기수'],
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
                <StyledTableCell key={item}>{item}</StyledTableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {influencers.map(row => (
            <StyledTableRow hover key={row.id}>
              {
                tableRows.body.map((item, index) => (
                  <StyledTableCell
                    key={item}
                    component={index === 0 ? 'th' : ''}
                    scope={index === 0 ? 'row' : ''}
                    align={index > 0 ? 'right' : ''}
                  >
                    {row[item] || row.TB_INFLUENCER[item]}
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
