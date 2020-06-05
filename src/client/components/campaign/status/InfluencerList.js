import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Grid } from '@material-ui/core';
import Common from '../../../lib/common';

function InfluencerList({
  history,
  match
}) {
  const [selected, setSelected] = useState({
    nano: [],
    micro: [],
    macro: [],
    mega: [],
    celebrity: []
  });
  const [counter, setCounter] = useState({});
  const [influencers, setInfluencers] = useState([]);
  const [list, setList] = useState([]);
  const [type, setType] = useState('nano');

  function getCampaign() {
    const { token } = Common.getUserInfo();
    axios.get('/api/TB_AD/getAdInfluencers', {
      params: {
        token,
        adId: match.params.id
      }
    }).then((res) => {
      const {
        AD_INF_NANO, AD_INF_MICRO, AD_INF_MACRO, AD_INF_MEGA, AD_INF_CELEB
      } = res.data.data;
      const obj = {
        nano: AD_INF_NANO,
        micro: AD_INF_MICRO,
        macro: AD_INF_MACRO,
        mega: AD_INF_MEGA,
        celebrity: AD_INF_CELEB
      };

      setCounter(obj);
    });
  }

  function createInfluencers(data) {
    const array = [];
    const blogType = '1';

    data.map((item) => {
      console.log(item);
      return (
        blogType === '1'
          ? array.push({
            id: item.id,
            name: item.name,
            username: item.username,
            subscribers: item.followers_count,
            imgUrl: item.profile_picture_url,
            INF_ID: item.INF_ID
          })
          : array.push({
            // id: item.id,
            name: item.snippet.title,
            // username: item.username,
            subscribers: item.statistics.subscribersCount,
          })
      );
    });

    setInfluencers(array);
  }

  function loadList(influencerType) {
    const range = {
      nano: { a: 0, b: 10000 },
      micro: { a: 10000, b: 30000 },
      macro: { a: 30000, b: 50000 },
      mega: { a: 50000, b: 100000 },
      celebrity: { a: 100000, b: 99999999 },
    };

    const filtered = influencers.filter(value => parseInt(value.subscribers, 10) >= range[influencerType].a && parseInt(value.subscribers, 10) < range[influencerType].b);
    setList(filtered);
  }

  function filterSelected(influencerList) {
    const range = {
      nano: { a: 0, b: 10000 },
      micro: { a: 10000, b: 30000 },
      macro: { a: 30000, b: 50000 },
      mega: { a: 50000, b: 100000 },
      celebrity: { a: 100000, b: 99999999 },
    };

    const obj = {};

    const asyncFunc = Object.keys(range).map((key) => {
      const filtered = influencerList.filter(value => parseInt(value.followers_count, 10) >= range[key].a && parseInt(value.followers_count, 10) < range[key].b && value.NOTI_STATE === '4');
      const array = [];
      filtered.map(item => array.push(item.INF_ID));
      obj[key] = array;
      return 'ok';
    });

    Promise.all(asyncFunc).then((res) => {
      // console.log(res);
      setSelected({ ...obj });
    });
  }

  function getInfluencers() {
    const blogType = '1';

    if (blogType === '1') {
      axios.get('/api/TB_INFLUENCER/getInstagramRequests', {
        params: {
          type: blogType,
          adId: match.params.id
        }
      }).then((res) => {
        console.log(res);
        filterSelected((res.data.data));
        createInfluencers(res.data.data);
      });
    } else {
      axios.get('/api/TB_INFLUENCER/rankYoutube', {
        params: {
          type: blogType
        }
      }).then((res) => {
        createInfluencers(res.data.data);
      });
    }
  }

  useEffect(() => {
    getCampaign();
    getInfluencers();
  }, []);

  useEffect(() => {
    if (influencers.length > 0) {
      loadList(type);
    }
  }, [influencers]);

  function selectInfluencer(influencerType, id) {
    let newArray;

    if (selected[influencerType].indexOf(id) !== -1) {
      newArray = selected[type].filter(value => value !== id);
    } else {
      newArray = selected[influencerType];
      newArray.push(id);
    }

    setSelected({ ...selected, [influencerType]: newArray });
  }

  function selectInfluencer2(influencerType, id) {
    const apiObj = {
      INF_ID: id,
      adId: match.params.id
    };

    axios.post('/api/TB_NOTIFICATION/changeState2', apiObj).then((res) => {
      if (res.data.code === 200) {
        getInfluencers();
      } else if (res.data.code === 401) {
        console.log(res);
      } else {
        console.log(res);
      }
    }).catch(error => (error));
  }

  function changeType(influencerType) {
    setType(influencerType);
    loadList(influencerType);
  }

  function sendRequest() {
    const apiObj = {
      list: selected,
      adId: match.params.id
    };

    axios.post('/api/TB_NOTIFICATION/', apiObj).then((res) => {
      if (res.data.code === 200) {
        console.log(res);
      } else if (res.data.code === 401) {
        console.log(res);
      } else {
        console.log(res);
      }
    }).catch(error => (error));
  }

  return (
    <Grid container spacing={2} className="influencer-select">
      <Grid item xs={12}>
        <Grid container justify="space-between">
          <Grid item>
            <div className={`type ${type === 'nano' ? 'selected' : ''}`} onClick={() => changeType('nano')}>
              {`나노 ${selected.nano.length}/${counter.nano}`}
            </div>
          </Grid>
          <Grid item>
            <div className={`type ${type === 'micro' ? 'selected' : ''}`} onClick={() => changeType('micro')}>
              {`마이크로 ${selected.micro.length}/${counter.micro}`}
            </div>
          </Grid>
          <Grid item>
            <div className={`type ${type === 'macro' ? 'selected' : ''}`} onClick={() => changeType('macro')}>
              {`메크로 ${selected.macro.length}/${counter.macro}`}
            </div>
          </Grid>
          <Grid item>
            <div className={`type ${type === 'mega' ? 'selected' : ''}`} onClick={() => changeType('mega')}>
              {`메가 ${selected.mega.length}/${counter.mega}`}
            </div>
          </Grid>
          <Grid item>
            <div className={`type ${type === 'celebrity' ? 'selected' : ''}`} onClick={() => changeType('celebrity')}>
              {`셀럽 ${selected.celebrity.length}/${counter.celebrity}`}
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {
            list.map(item => (
              <Grid key={item.INF_ID} item xs={4}>
                <Box p={2} className={`influencer-card ${selected[type].indexOf(item.INF_ID) !== -1 ? 'selected' : null} ${selected[type].indexOf(item.INF_ID) === -1 && selected[type].length == counter[type] ? 'disabled' : ''}`}>
                  <a href={`https://www.instagram.com/${item.username}/`} target="_blank">
                    <img src={item.imgUrl} alt="photo" />
                  </a>

                  <div>{item.name || item.username}</div>
                  <div>{item.subscribers}</div>
                  <Button variant="contained" color="primary" onClick={() => selectInfluencer2(type, item.INF_ID)}>
                    {
                      selected[type].indexOf(item.INF_ID) !== -1 ? '선택 해지' : '인플루언서 선택'
                    }
                  </Button>
                </Box>
              </Grid>
            ))
          }
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid item xs={3}>
            <Button fullWidth variant="contained" color="primary" onClick={sendRequest}>저장</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default InfluencerList;
