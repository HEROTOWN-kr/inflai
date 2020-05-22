import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Grid } from '@material-ui/core';
import Common from '../../../lib/common';
import SlideImage1 from '../../../img/slider/beauty.png';
import SlideImage2 from '../../../img/slider/fashion.png';
import SlideImage3 from '../../../img/slider/food.png';

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
  const [type, setType] = useState('nano');

  /* const influencers = [
    {
      id: 1,
      imgUrl: SlideImage1,
      name: '홍동일',
      subscribers: '123'
    },
    {
      id: 2,
      imgUrl: SlideImage2,
      name: '최동일',
      subscribers: '456'
    },
    {
      id: 3,
      imgUrl: SlideImage3,
      name: '박은택',
      subscribers: '789'
    },
    {
      id: 4,
      imgUrl: SlideImage3,
      name: '박은택',
      subscribers: '789'
    },
    {
      id: 5,
      imgUrl: SlideImage3,
      name: '박은택',
      subscribers: '789'
    },
    {
      id: 6,
      imgUrl: SlideImage3,
      name: '박은택',
      subscribers: '789'
    },
  ]; */

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

    data.map(item => (
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
    ));

    setInfluencers(array);
  }

  function getInfluencers() {
    const blogType = '1';

    if (blogType === '1') {
      axios.get('/api/TB_INFLUENCER/rankInstagram', {
        params: {
          type: blogType
        }
      }).then((res) => {
        console.log(res);
        createInfluencers(res.data.data);
      });
    } else {
      axios.get('/api/TB_INFLUENCER/rankYoutube', {
        params: {
          type: blogType
        }
      }).then((res) => {
        console.log(res);
        createInfluencers(res.data.data);
      });
    }
  }

  useEffect(() => {
    getCampaign();
    getInfluencers();
  }, []);

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

  function changeType(influencerType) {
    setType(influencerType);
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
      <Grid item md={12}>
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
      <Grid item md={12}>
        <Grid container spacing={2}>
          {
            influencers.map(item => (
              <Grid key={item.INF_ID} item md={4}>
                <Box p={2} className={`influencer-card ${selected[type].indexOf(item.INF_ID) !== -1 ? 'selected' : null} ${selected[type].indexOf(item.INF_ID) === -1 && selected[type].length == counter[type] ? 'disabled' : ''}`}>
                  <img src={item.imgUrl} alt="photo" />
                  <div>{item.name}</div>
                  <div>{item.subscribers}</div>
                  <Button variant="contained" color="primary" onClick={() => selectInfluencer(type, item.INF_ID)}>
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
      <Grid item md={12}>
        <Grid container justify="center">
          <Grid item md={3}>
            <Button fullWidth variant="contained" color="primary" onClick={sendRequest}>저장</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default InfluencerList;
