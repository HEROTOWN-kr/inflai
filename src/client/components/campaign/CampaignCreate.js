import React, { useState } from 'react';
import {
  Box, Grid, Paper, FormControlLabel, Checkbox, RadioGroup, Radio
} from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import StyledText from '../containers/StyledText';
import ReactFormDatePicker from '../containers/ReactFormDatePicker';
import ReactFormText from '../containers/ReactFormText';
import StyledSelect from '../containers/StyledSelect';
import { AdvertiseTypes, Colors } from '../../lib/Сonstants';
import DaumPostCode from '../containers/DaumPostCode';

function CampaignCreate() {
  const [campaignData, setCampaignData] = useState({
    AD_INSTA: false,
    AD_YOUTUBE: false,
    AD_NAVER: false,
    AD_DELIVERY: false
  });

  const schema2 = Yup.object().shape({});

  const {
    register, handleSubmit, handleBlur, watch, errors, setValue, control, getValues
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema2),
    defaultValues: { RadioGroup: '0', visible: '0' }
  });

  const getType = watch('type');

  const snsTypes = [
    { name: 'insta', text: '인스타', dbValue: 'AD_INSTA' },
    { name: 'naver', text: '네이버', dbValue: 'AD_NAVER' },
    { name: 'youtube', text: '유튜브', dbValue: 'AD_YOUTUBE' },
  ];

  return (
    <Box my={4} p={4} width={1200} css={{ margin: '0 auto' }} component={Paper}>
      <Box component="h1" css={{ textAlign: 'center' }}>캠페인 정보</Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box mb={1}><StyledText color="#3f51b5">모집희망SNS</StyledText></Box>
          {snsTypes.map(item => (
            <FormControlLabel
              control={(
                <Checkbox checked={!!campaignData[item.dbValue]} onChange={event => setCampaignData({ ...campaignData, [item.dbValue]: event.target.checked })} />
                  )}
              key={item.name}
              label={item.text}
            />
          ))}
          {
            errors.insta ? (
              <div className="error-message">{errors.insta.message}</div>
            ) : null
          }
        </Grid>
        <Grid item xs={12}>
          <Box mb={1}><StyledText color="#3f51b5">모집인원</StyledText></Box>
          <ReactFormText register={register} errors={errors} name="influencerCount" />
        </Grid>
        <Grid item xs={12}>
          <Box mb={1}><StyledText color="#3f51b5">리뷰어 신청기간</StyledText></Box>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <ReactFormDatePicker
                name="searchStart"
                control={control}
                setValue={setValue}
                handleBlur={handleBlur}
                getValues={getValues}
              />
            </Grid>
            <Grid item>~</Grid>
            <Grid item>
              <ReactFormDatePicker
                name="searchFinish"
                control={control}
                setValue={setValue}
                handleBlur={handleBlur}
                getValues={getValues}
              />
            </Grid>
          </Grid>
          {
            errors.searchFinish ? (
              <div className="error-message">{errors.searchFinish.message}</div>
            ) : null
          }
        </Grid>
        <Grid item xs={12}>
          <Box mb={1}><StyledText color="#3f51b5">제공상품 배송여부</StyledText></Box>
          <FormControlLabel
            control={(
              <Checkbox checked={!!campaignData.AD_DELIVERY} onChange={event => setCampaignData({ ...campaignData, AD_DELIVERY: event.target.checked })} />
              )}
            label="배송형 상품"
          />
        </Grid>
        <Grid item xs={12}>
          <Box mb={1}><StyledText color="#3f51b5">캠페인 출력상태</StyledText></Box>
          <Controller
            as={(
              <RadioGroup row aria-label="gender">
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="대기상태"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="노출상태"
                />
              </RadioGroup>
              )}
            name="visible"
            control={control}
          />
        </Grid>
        <Grid item xs={12}>
          <Box mb={1}><StyledText color="#3f51b5">카테고리</StyledText></Box>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Controller
                render={controllerProps => (
                  <StyledSelect
                    native
                    {...controllerProps}
                    variant="outlined"
                    fullWidth
                  >
                    {AdvertiseTypes.mainType.map((item, index) => <option key={index} value={index}>{item}</option>)}
                  </StyledSelect>
                )}
                defaultValue={0}
                name="type"
                control={control}
              />
            </Grid>
            {
              AdvertiseTypes.subType[getType] ? (
                <Grid item xs={2}>
                  <Controller
                    render={controllerProps => (
                      <StyledSelect
                        native
                        {...controllerProps}
                        variant="outlined"
                        fullWidth
                      >
                        {AdvertiseTypes.subType[getType].map((item, index) => <option key={index} value={index}>{item}</option>)}
                      </StyledSelect>
                    )}
                    defaultValue={0}
                    name="subtype"
                    control={control}
                  />
                </Grid>
              ) : null
            }
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box mb={1}><StyledText color="#3f51b5">주소</StyledText></Box>
          <DaumPostCode setValue={setValue} register={register} errors={errors} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default CampaignCreate;
