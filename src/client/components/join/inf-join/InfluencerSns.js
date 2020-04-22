import React from 'react';
import * as Yup from 'yup';
import {
  Box, Button, FormControl, FormControlLabel, FormHelperText, Grid, Radio, RadioGroup, SvgIcon, Icon
} from '@material-ui/core';
import { Formik } from 'formik';
import YouTubeIcon from '@material-ui/icons/YouTube';
import InstagramIcon from '@material-ui/icons/Instagram';
import AssessmentIcon from '@material-ui/icons/Assessment';
import NaverIcon from '../../../img/icons/naver.png';
import Influencer from '../../../img/influencer.png';
import Advertiser from '../../../img/advertiser.png';

function InfluencerSns() {
  const types = [
    {
      text: 'Youtube',
      value: '1',
      icon: YouTubeIcon
    },
    {
      text: 'Instagram',
      value: '2',
      icon: InstagramIcon
    },
    {
      text: 'Blog',
      value: '3',
      icon: AssessmentIcon
    }
  ];

  const mySchema = Yup.object().shape({
    type: Yup.string()
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

  return (
    <div className="join-sns">
      <Grid container justify="center">
        <Grid item md={6}>
          <Box py={4}>
            <Formik
              initialValues={{
                type: '',
              }}
              enableReinitialize
              validationSchema={mySchema}
              onSubmit={(values) => {
                // changeUserData({ type: values.type });
                // goTo(values.type === '1' ? '/Advertiser' : '/Influencer/sns');
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
                  <Grid item md={12} className="title">블로그 유형을 선택주세요</Grid>

                  <Grid item md={12}>
                    <FormControl>
                      <RadioGroup row aria-label="type" name="type" value={values.type} onChange={event => setFieldValue('type', event.target.value)}>
                        <Grid container spacing={5}>
                          {types.map(item => (
                            <Grid item md={4} key={item.value}>
                              <FormControlLabel value="1" control={<StyledRadio item={item} selected={values.type} />} />
                            </Grid>
                          ))}
                        </Grid>
                      </RadioGroup>
                      <FormHelperText id="my-helper-text">{errors.type && touched.type ? <span className="error-message">{errors.type}</span> : null}</FormHelperText>
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
