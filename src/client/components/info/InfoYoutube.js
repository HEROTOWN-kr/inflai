import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Box, CircularProgress, Grid} from '@material-ui/core';
import Common from '../../lib/common';

function InfoYoutube() {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const { token } = Common.getUserInfo();
    axios.get('/api/TB_INFLUENCER/getYoutubeInfo', {
      params: {
        token,
      }
    }).then((res) => {
      console.log(res);
      setInfo(res.data.data.items[0]);
    });
  }, []);
  return (
    <div>
      <Grid container justify="center" className="info-insta">
        <Grid item md={6}>
          <Grid container justify="center">
            {
              info.id
                ? (
                  <React.Fragment>
                    <Grid item md={8}>
                      <Box py={4}>
                        <Grid container spacing={4}>
                          <Grid item md={4} className="profile-image">
                            <img src={info.snippet.thumbnails.high.url} alt="avatar" />
                          </Grid>
                          <Grid item md={8} className="profile-info">
                            <Grid container spacing={2}>
                              <Grid item md={12} className="username">{info.snippet.title}</Grid>
                              <Grid item md={12}>
                                <Grid container>
                                  <Grid item md={4}>
                                    {'게시물 '}
                                    <span className="count">{info.statistics.videoCount}</span>
                                  </Grid>
                                  <Grid item md={4}>
                                    {'구독 '}
                                    <span className="count">{info.statistics.subscriberCount}</span>
                                  </Grid>
                                  <Grid item md={4}>
                                    {'조회수 '}
                                    <span className="count">{info.statistics.viewCount}</span>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item md={12}>{info.snippet.description}</Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </React.Fragment>
                ) : (
                  <Grid item>
                    <CircularProgress />
                  </Grid>
                )
            }
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default InfoYoutube;
