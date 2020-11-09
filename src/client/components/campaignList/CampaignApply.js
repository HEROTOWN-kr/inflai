import React, { useEffect, useState } from 'react';
import {
  Box, CircularProgress, Divider, Grid, TextareaAutosize
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import StyledText from '../containers/StyledText';
import { Colors } from '../../lib/Сonstants';
import Common from '../../lib/common';
import ReactFormText from '../containers/ReactFormText';
import DaumPostCode from '../containers/DaumPostCode';
import StyledImage from '../containers/StyledImage';
import noImage from '../../img/noImage.png';
import Sns from '../profile/pages/Sns';
import StyledButton from '../containers/StyledButton';

function CampaignApply(props) {
  const applyConstant = {
    INF_DETAIL_ADDR: '502호',
    INF_EMAIL: 'andriantsoy@gmail.com',
    INF_EXTR_ADDR: ' (대조동)',
    INF_NAME: 'Andrian',
    INF_POST_CODE: '03387',
    INF_ROAD_ADDR: '서울 은평구 연서로20길 25',
    INF_TEL: '01026763937',
    TB_INSTum: null,
    TB_NAVER: null,
    TB_YOUTUBE: null,
  };

  const { match, history } = props;
  const [applyData, setApplyData] = useState({});
  const [addData, setAddData] = useState({ TB_PHOTO_ADs: [] });
  const [isSticky, setSticky] = useState(false);
  const theme = useTheme();
  const { token } = Common.getUserInfo();

  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  const is1600 = useMediaQuery('(min-width:1600px)');
  const isLG = useMediaQuery(theme.breakpoints.up('lg'));
  const isMD = useMediaQuery(theme.breakpoints.up('md'));

  const schema2 = Yup.object().shape({});

  const {
    register, handleSubmit, handleBlur, watch, errors, setValue, control, getValues
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema2),
    shouldUnregister: false
  });

  function getWidth() {
    if (isXl) {
      return '800px';
    } if (isLG) {
      return '800px';
    }
    return '100%';
  }
  const fixedStyles = {
    boxSizing: 'border-box',
    width: '359px',
    position: 'fixed',
    left: '1173px',
    zIndex: '1039',
    marginTop: '0px',
    top: '0px',
  };

  const handleScroll = () => {
    setSticky(window.pageYOffset > 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);

  async function getAddInfo() {
    try {
      const response = await axios.get('/api/TB_AD/campaignDetail', { params: { id: match.params.id, } });
      const { data } = response.data;
      if (data) {
        console.log(data);
        setAddData(data);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async function getApplicantInfo() {
    try {
      const response = await axios.get('/api/TB_INFLUENCER/getApplicant', { params: { token } });
      const { data } = response.data;
      if (data) {
        console.log(data);
        setApplyData(data);
        const {
          INF_NAME, INF_EMAIL, INF_TEL, INF_POST_CODE, INF_ROAD_ADDR, INF_DETAIL_ADDR,
          INF_EXTR_ADDR
        } = data;
        setValue('name', INF_NAME);
        setValue('receiverName', INF_NAME);
        setValue('phone', INF_TEL);
        setValue('email', INF_EMAIL);
        setValue('postcode', INF_POST_CODE);
        setValue('roadAddress', INF_ROAD_ADDR);
        setValue('detailAddress', INF_DETAIL_ADDR);
        setValue('extraAddress', INF_EXTR_ADDR);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  const onSubmit2 = (data) => {
    console.log(data);
  };

  useEffect(() => {
    getAddInfo();
    getApplicantInfo();
  }, []);

  function ApplyFormComponent(props) {
    const { title, children } = props;
    return (
      <Grid container alignItems="center">
        <Grid item xs={3}>
          <Box py={5}>
            <StyledText fontWeight="bold" fontSize="16">
              {title}
            </StyledText>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <Box py={5} borderBottom={`1px solid ${Colors.grey7}`}>
            {children}
          </Box>
        </Grid>
      </Grid>
    );
  }

  function SnsBlock(props) {
    const { color, text } = props;

    return (
      <Box p={1} border={`1px solid ${color}`}>
        <StyledText textAlign="center" fontSize="13" color={color} fontWeight="bold">{text}</StyledText>
      </Box>
    );
  }

  return (
    <Box width="1160px" margin="0 auto" className="campaign-detail">
      <Grid container>
        <Grid item style={{ width: getWidth() }}>
          <Box py={6} pr={6}>
            <StyledText fontSize="28" fontWeight="bold">캠페인 신청하기</StyledText>
            <Box mt={3} mb={2}>
              <Divider />
            </Box>
            <ApplyFormComponent title="SNS">

            </ApplyFormComponent>
            <ApplyFormComponent title="이름">
              <ReactFormText register={register} errors={errors} name="name" />
            </ApplyFormComponent>
            <ApplyFormComponent title="신청한마디">
              <TextareaAutosize ref={register} rowsMin={8} style={{ width: '99%' }} placeholder="신청한마디" name="message" />
              {
                errors.shortDisc ? (
                  <div className="error-message">{errors.message.message}</div>
                ) : null
              }
            </ApplyFormComponent>
            {addData.AD_DELIVERY ? (
              <React.Fragment>
                <ApplyFormComponent title="제공상품 수령인">
                  <ReactFormText register={register} errors={errors} name="receiverName" />
                </ApplyFormComponent>
                <ApplyFormComponent title="제공상품 배송지">
                  <DaumPostCode setValue={setValue} register={register} errors={errors} />
                </ApplyFormComponent>
              </React.Fragment>
            ) : null}
            <ApplyFormComponent title="연락처">
              <ReactFormText register={register} errors={errors} name="phone" />
            </ApplyFormComponent>
            <ApplyFormComponent title="메일주소">
              <ReactFormText register={register} errors={errors} name="email" />
            </ApplyFormComponent>
          </Box>
        </Grid>
        <Grid item style={{ width: '360px', borderLeft: '1px solid #eee' }}>
          <Box py={6} pl={6} style={isSticky ? fixedStyles : {}}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledImage width="100%" height="300px" src={addData.TB_PHOTO_ADs.length > 0 ? addData.TB_PHOTO_ADs[0].PHO_FILE : noImage} />
                <Box py={3}><StyledText overflowHidden fontSize="20" fontWeight="bold">{addData.AD_NAME}</StyledText></Box>
                <StyledText overflowHidden fontSize="15">{addData.AD_SHRT_DISC}</StyledText>
                <Box pt={2}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <SnsBlock color={Colors.pink} text="Instagram" />
                    </Grid>
                    <Grid item xs={4}>
                      <SnsBlock color="red" text="Youtube" />
                    </Grid>
                    <Grid item xs={4}>
                      <SnsBlock color="#00cdc5" text="Blog" />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <StyledText fontSize="14" fontWeight="bold">리뷰어 신청  2020-11-01 ~ 2020-11-30</StyledText>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <StyledButton background={Colors.pink3} hoverBackground={Colors.pink} fontWeight="bold" fontSize="20px" onClick={handleSubmit(onSubmit2)}>
                  캠페인 신청하기
                </StyledButton>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>


      {/* {Object.keys(applyData).length ? (
        <Grid container>
          <Grid item style={{ width: getWidth() }}>
            <Box py={6} pr={6}>
              test
            </Box>
          </Grid>
          <Grid item style={{ width: '360px', borderLeft: '1px solid #eee' }}>
            <Box py={6} pl={6} style={isSticky ? fixedStyles : {}} />
          </Grid>
        </Grid>
      ) : (
        <Grid container justify="center">
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      )} */}
    </Box>
  );
}

export default CampaignApply;
