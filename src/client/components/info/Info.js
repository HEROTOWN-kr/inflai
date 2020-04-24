import React, { useEffect } from 'react';
import axios from 'axios';
import Common from '../../lib/common';

function Info() {
  useEffect(() => {
    const { token } = Common.getUserInfo();
    axios.get('/api/TB_INFLUENCER/getInstaInfo', {
      params: {
        token,
      }
    }).then((res) => {
      console.log(res.data);
    });
  }, []);

  return (
    <div>Info</div>
  );
}

export default Info;
