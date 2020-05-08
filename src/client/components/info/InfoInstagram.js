import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Grid, CircularProgress
} from '@material-ui/core';
import Common from '../../lib/common';

function InfoInstagram() {
  const [data, setData] = useState({});

  useEffect(() => {
    const { token } = Common.getUserInfo();
    axios.get('/api/TB_INFLUENCER/getInstaInfo', {
      params: {
        token,
      }
    }).then((res) => {
      console.log(res.data);
      setData({ ...res.data.data });
    });
  }, []);

  return (
    <div>
      <Grid container justify="center" className="info-insta">
        <Grid item md={6}>
          <Grid container justify="center">
            {
            data.media
              ? (
                <React.Fragment>
                  <Grid item md={8}>
                    <Box py={4}>
                      <Grid container spacing={4}>
                        <Grid item md={4} className="profile-image">
                          <img src={data.profile_picture_url} alt="avatar" />
                        </Grid>
                        <Grid item md={8} className="profile-info">
                          <Grid container spacing={2}>
                            <Grid item md={12} className="username">{data.username}</Grid>
                            <Grid item md={12}>
                              <Grid container>
                                <Grid item md={4}>
                                  {'게시물 '}
                                  <span className="count">{data.media_count}</span>
                                </Grid>
                                <Grid item md={4}>
                                  {'팔로워 '}
                                  <span className="count">{data.followers_count}</span>
                                </Grid>
                                <Grid item md={4}>
                                  {'팔로우 '}
                                  <span className="count">{data.follows_count}</span>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item md={12}>{data.name}</Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item md={12} className="media">
                    <Grid container spacing={2}>
                      {data.media
                        ? data.media.map(item => (
                          <Grid item md={4} key={item.id}>
                            <img src={item.thumbnail_url ? item.thumbnail_url : item.media_url} alt="" />
                          </Grid>
                        )) : null
                                }

                    </Grid>
                  </Grid>
                </React.Fragment>
              )
              : (
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

export default InfoInstagram;
