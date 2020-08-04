import React, { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@material-ui/core';
import axios from 'axios';
import InfoAdvertiser from './InfoAdvertiser';
import InfoInfluencer from './InfoInfluencer';
import Common from '../../lib/common';

function InfoMain(props) {
  const {
    user, history, match, changeEditCol
  } = props;
  const { token } = Common.getUserInfo();
  const [userData, setUserData] = useState({});
  const [process, setProcess] = useState(true);


  useEffect(() => {
    if (user.type === '1') {
      axios.get('/api/TB_ADVERTISER/userInfo', {
        params: { token }
      }).then((res) => {
        // console.log(res);
        const { data } = res.data;
        setUserData(data);
        setProcess(false);
      });
    } else {
      axios.get('/api/TB_INFLUENCER/userInfo', {
        params: { token }
      }).then((res) => {
        // console.log(res);
        const { data, instaInfo } = res.data;
        if (instaInfo) {
          setUserData({ ...data, INF_BLOG_URL: instaInfo.username });
        } else {
          setUserData({ ...data });
        }
        setProcess(false);
      });
    }
  }, []);

  function editProfile(colName) {
    changeEditCol(colName);
    if (user.type == '1') {
      history.push(`${match.path}editProfile`);
    } else {
      history.push(`${match.path}edit`);
    }
  }

  return (
    <React.Fragment>
      {
        process ? (
          <CircularProgress />
        ) : (
          <React.Fragment>
            <div className="title">
              계정정보
            </div>
            {
              {
                1: <InfoAdvertiser editProfile={editProfile} userData={userData} setUserData={setUserData} />,
                2: <InfoInfluencer editProfile={editProfile} userData={userData} setUserData={setUserData} />
              }[user.type]
            }
          </React.Fragment>
        )
      }
    </React.Fragment>
  );
}

export default InfoMain;
