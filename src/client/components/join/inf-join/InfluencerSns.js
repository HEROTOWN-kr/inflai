import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
  Box, Button, FormControl, FormControlLabel, FormHelperText, Grid, Radio, RadioGroup, SvgIcon, Icon
} from '@material-ui/core';
import { Formik } from 'formik';
import YouTubeIcon from '@material-ui/icons/YouTube';
import InstagramIcon from '@material-ui/icons/Instagram';
import AssessmentIcon from '@material-ui/icons/Assessment';
import axios from 'axios';
import NaverIcon from '../../../img/icons/naver.png';
import Influencer from '../../../img/influencer.png';
import Advertiser from '../../../img/advertiser.png';
import Common from '../../../lib/common';

function InfluencerSns({
  changeUser,
  userData,
  changeUserData,
  goTo
}) {
  // const [igId, setIgId] = useState([]);
  const myArray = [];

  const types = [
    {
      text: 'Youtube',
      value: '1',
      icon: YouTubeIcon
    },
    {
      text: 'Instagram',
      value: '2',
      icon: InstagramIcon,
      addClass: 'instagram'
    },
    {
      text: 'Blog',
      value: '3',
      icon: AssessmentIcon,
      addClass: 'blog'
    }
  ];

  const mySchema = Yup.object().shape({
    snsType: Yup.string()
      .required('직군을 선택주세요'),
  });

  function StyledRadio({
    item,
    selected
  }) {
    return (
      <Grid container className={`card ${item.addClass ? item.addClass : null} ${item.value === selected ? 'selected' : null}`} justify="center">
        <Grid item>
          <Box>
            <SvgIcon component={item.icon} htmlColor="#ffffff" />
          </Box>
        </Grid>
        <Grid item md={12}>
          <p>{item.text}</p>
        </Grid>
        <Radio value={item.value} style={{ display: 'none' }} />
      </Grid>
    );
  }

  function facebookLogin() {
    window.FB.login((loginRes) => {
      if (loginRes.status === 'connected') {
        const { accessToken, userID } = loginRes.authResponse;

        axios.post('/api/TB_INFLUENCER/instaSignUp', { facebookToken: accessToken })
          .then((res) => {
            if (res.data.code === 200) {
              changeUser({
                social_type: res.data.social_type,
                type: '1',
                token: res.data.userToken,
                name: res.data.userName,
                regState: res.data.regState
              });
              goTo(`/instagram/${res.data.userId}`);
              // props.history.push(`${props.match.path}/instagram/${res.data.userId}`);
            } else if (res.data.code === 401) {
              console.log(res);
            } else {
              console.log(res);
            }
          })
          .catch(error => (error));

        /* window.FB.api('/me/accounts', (accountRes) => {
          const pages = accountRes.data;
          if (pages.length > 0) {
            pages.map(item => (
              window.FB.api(
                item.id,
                {
                  access_token: accessToken,
                  fields: 'instagram_business_account'
                },
                (pageRes) => {
                  if (pageRes.instagram_business_account) {
                    myArray.push(pageRes.instagram_business_account.id);
                  }
                }
              )
            ));

            const timer = setTimeout(() => {
              changeUserData({ igAccounts: myArray });
              Common.saveIgAccounts(myArray);
              goTo('/instagram');
            }, 500);


            return () => clearTimeout(timer);
          }
        }); */
      } else {
        console.log('not connected');
      }
    }, { scope: 'public_profile, email, pages_show_list, instagram_manage_insights' });
  }

  async function facebookLogin2() {
    window.FB.login((loginRes) => {
      if (loginRes.status === 'connected') {
        const { accessToken, userID } = loginRes.authResponse;

        window.FB.api('/me/accounts', (accountRes) => {
          const pages = accountRes.data;
          if (pages.length > 0) {
            pages.forEach(async (item) => {
              window.FB.api(
                item.id,
                {
                  access_token: accessToken,
                  fields: 'instagram_business_account'
                },
                (pageRes) => {
                  if (pageRes.instagram_business_account) {
                    myArray.push('2');
                  }
                }
              );
            });

            console.log(myArray);

            // changeUserData({ igAccounts: ['1', '2'] });
            // changeUserData({ jobType: 'changed' });
          }
        });
      } else {
        console.log('not connected');
      }
    }, { scope: 'public_profile, email, pages_show_list, instagram_manage_insights' });
  }


  function goNext(snsType) {
    let url;
    switch (snsType) {
      case '1':
        url = '/youtube';
        break;
      case '2':
        url = '/instagram';
        facebookLogin();
        break;
      case '3':
        url = '/blog';
        break;
    }
  }

  return (
    <div className="join-sns">
      <Grid container justify="center">
        <Grid item md={6}>
          <Box py={4}>
            <Formik
              initialValues={{
                snsType: '',
              }}
              enableReinitialize
              validationSchema={mySchema}
              onSubmit={(values) => {
                changeUserData({ snsType: values.snsType });
                goNext(values.snsType);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
                setFieldTouched,
                submitForm
              }) => (
                <Grid container spacing={5} justify="center">
                  <Grid item md={12} className="title">블로그 유형을 선택해주세요</Grid>
                  <Grid item md={12}>
                    <FormControl>
                      <RadioGroup row aria-label="type" name="snsType" value={values.snsType} onChange={event => setFieldValue('snsType', event.target.value)}>
                        <Grid container spacing={5}>
                          {types.map(item => (
                            <Grid item md={4} key={item.value}>
                              <FormControlLabel value="1" control={<StyledRadio item={item} selected={values.snsType} />} />
                            </Grid>
                          ))}
                        </Grid>
                      </RadioGroup>
                      <FormHelperText id="my-helper-text">{errors.snsType && touched.snsType ? <span className="error-message">{errors.snsType}</span> : null}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item md={3}>
                    <Button variant="contained" color="primary" fullWidth onClick={submitForm}>
                                            다음
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Formik>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default InfluencerSns;
