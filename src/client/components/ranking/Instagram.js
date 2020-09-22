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

function Instagram(props) {
  const [influencers, setInfluencers] = useState([]);
  const { userId } = props;

  const tableRows = {
    title: [
      {
        text: '#',
        align: 'center',
        isRank: true
      },
      {
        text: '이름',
        align: 'left'
      },
      {
        text: '구독수',
        align: 'right'
      }
    ],
    body: ['rownum', 'INF_NAME', 'INS_FLWR']
  };

  function getInfluencers() {
    axios.get('/api/TB_INSTA/', {
      params: {
        orderBy: 'INS_FLWR',
        direction: 'desc'
      }
    }).then(
      (res) => {
        const { list } = res.data.data;
        setInfluencers(list);
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
              tableRows.title.map((item, index) => (
                <StyledTableCell
                  key={item.text}
                  align={item.align}
                  className={item.isRank ? 'number' : null}
                >
                  {item.text}
                </StyledTableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {influencers.map(row => (
            <StyledTableRow hover key={row.INS_ID}>
              {
                tableRows.body.map((item, index) => (
                  <StyledTableCell
                    key={item}
                    component={index === 1 ? 'th' : ''}
                    scope={index === 1 ? 'row' : ''}
                    align={index === 1 ? 'left' : 'right'}
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

export default Instagram;
