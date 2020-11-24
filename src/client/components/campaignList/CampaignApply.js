import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Checkbox, CircularProgress, Divider, Grid, Snackbar, TextareaAutosize, TextField
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Check, CheckBox } from '@material-ui/icons';
import StyledText from '../containers/StyledText';
import { blog, Colors } from '../../lib/Сonstants';
import Common from '../../lib/common';
import ReactFormText from '../containers/ReactFormText';
import DaumPostCode from '../containers/DaumPostCode';
import StyledImage from '../containers/StyledImage';
import noImage from '../../img/noImage.png';
import Sns from '../profile/pages/Sns';
import StyledButton from '../containers/StyledButton';
import instagramIcon from '../../img/instagram.png';
import youtubeIcon from '../../img/youtube.png';
import blogIcon from '../../img/icon_blog_url.png';
import StyledCheckBox from '../containers/StyledCheckBox';
import Alert from '../containers/Alert';
import AuthContext from '../../context/AuthContext';

function ApplyFormComponent(componentProps) {
  const { title, children } = componentProps;
  return (
    <Grid container alignItems="center">
      <Grid item xs={3}>
        <Box>
          <div fontWeight="bold" fontSize="16">
            {title}
          </div>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Box py={5}>{children}</Box>
      </Grid>
    </Grid>
  );
}

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

  const { match, history, setMessage } = props;
  const [applyData, setApplyData] = useState({});
  const [snsData, setSnsData] = useState({
    insta: false,
    youtube: false,
    naver: false
  });
  const [addData, setAddData] = useState({ TB_PHOTO_ADs: [] });
  const [isSticky, setSticky] = useState(false);

  const theme = useTheme();
  const { token } = useContext(AuthContext);

  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  const is1600 = useMediaQuery('(min-width:1600px)');
  const isLG = useMediaQuery(theme.breakpoints.up('lg'));
  const isMD = useMediaQuery(theme.breakpoints.up('md'));

  const schema = Yup.object().shape({
    sns: Yup.string()
      .when(['naver', 'youtube', 'insta'], {
        is: (naver, youtube, insta) => !naver && !youtube && !insta,
        then: Yup.string().required('SNS를 선택해주세요'),
      }),
    name: Yup.string()
      .required('이름을 입력해주세요'),
    message: Yup.string()
      .required('신청한마디를 입력해주세요'),
    receiverName: Yup.string()
      .when(['delivery'], {
        is: delivery => delivery,
        then: Yup.string().required('제공상품 수령인을 입력해주세요'),
      }),
    postcode: Yup.string()
      .when(['delivery'], {
        is: delivery => delivery,
        then: Yup.string().required('우편번호를 입력해주세요'),
      }),
    roadAddress: Yup.string()
      .when(['delivery'], {
        is: delivery => delivery,
        then: Yup.string().required('도로명주소를 입력해주세요'),
      }),
    detailAddress: Yup.string()
      .when(['delivery'], {
        is: delivery => delivery,
        then: Yup.string().required('상세주소를 입력해주세요'),
      }),
    phone: Yup.string()
      .required('연락처를 입력해주세요'),
    email: Yup.string()
      .email('잘못된 이메일 형식 입니다')
      .required('이메일을 입력해주세요'),
  });

  const {
    register, handleSubmit, handleBlur, watch, errors, setValue, control, getValues
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      insta: false,
      youtube: false,
      naver: false
    }
    // shouldUnregister: false
  });

  useEffect(() => {
    setValue('insta', snsData.insta);
    setValue('youtube', snsData.youtube);
    setValue('naver', snsData.naver);
  }, [snsData]);

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
        setValue('delivery', !!data.AD_DELIVERY);
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
        setValue('test', INF_POST_CODE);
        setValue('test2', INF_POST_CODE);
        setValue('roadAddress', INF_ROAD_ADDR);
        setValue('detailAddress', INF_DETAIL_ADDR);
        setValue('extraAddress', INF_EXTR_ADDR);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  const onSubmit = async (data) => {
    try {
      const apiObj = {
        ...data,
        adId: match.params.id,
        token
      };

      axios.post('/api/TB_PARTICIPANT/save', apiObj).then((res) => {
        setMessage({ type: 'success', open: true, text: '신청되었습니다' });
        history.push(`/CampaignList/${match.params.id}`);
      }).catch((err) => {
        alert(err.response.data.message);
      });
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    if (token) {
      getAddInfo();
      getApplicantInfo();
      register({ name: 'insta' });
      register({ name: 'youtube' });
      register({ name: 'naver' });
      register({ name: 'delivery' });
    }
  }, [token]);


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
            <Grid container alignItems="center">
              <Grid item xs={3}>
                <Box py={5}>
                  <StyledText fontWeight="bold" fontSize="16">
                    SNS
                  </StyledText>
                </Box>
              </Grid>
              <Grid item xs={9}>
                <Box py={5} borderBottom={`1px solid ${Colors.grey7}`}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12}>
                      <Grid container alignItems="center">
                        <Grid item>
                          <Box padding="12px" border="1px solid #e9ecef" borderRight="0">
                            <StyledCheckBox checked={snsData.insta} onChange={event => setSnsData({ ...snsData, insta: event.target.checked })} disabled={!applyData.instaUserName} />
                          </Box>
                        </Grid>
                        <Grid item xs={5}>
                          <Box py={2} px={4} border="1px solid #e9ecef">
                            <Grid container justify="center" spacing={1} alignItems="center">
                              <Grid item>
                                <StyledImage width="18px" height="18px" src={instagramIcon} />
                              </Grid>
                              <Grid item>
                                <StyledText>{applyData.instaUserName || '인스타그램'}</StyledText>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        {
                          applyData.instaUserName ? null : (
                            <Grid item>
                              <Box
                                padding="18px"
                                border="1px solid #e9ecef"
                                borderLeft="0"
                                css={{ cursor: 'pointer' }}
                                onClick={() => history.push('/Profile/UserInfo')}
                              >
                                <StyledText>연결하기</StyledText>
                              </Box>
                            </Grid>
                          )
                        }
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container alignItems="center">
                        <Grid item>
                          <Box padding="12px" border="1px solid #e9ecef" borderRight="0" borderRight="0">
                            <StyledCheckBox checked={snsData.youtube} onChange={event => setSnsData({ ...snsData, youtube: event.target.checked })} disabled={!applyData.youtubeChannelName} />
                          </Box>
                        </Grid>
                        <Grid item xs={5}>
                          <Box py={2} px={4} border="1px solid #e9ecef">
                            <Grid container justify="center" spacing={1} alignItems="center">
                              <Grid item>
                                <StyledImage width="18px" height="18px" src={youtubeIcon} />
                              </Grid>
                              <Grid item>
                                <StyledText>{applyData.youtubeChannelName || '유튜브'}</StyledText>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        {
                          applyData.youtubeChannelName ? null : (
                            <Grid item>
                              <Box
                                padding="18px"
                                border="1px solid #e9ecef"
                                borderLeft="0"
                                css={{ cursor: 'pointer' }}
                                onClick={() => history.push('/Profile/UserInfo')}
                              >
                                <StyledText>연결하기</StyledText>
                              </Box>
                            </Grid>
                          )
                        }
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container alignItems="center">
                        <Grid item>
                          <Box padding="12px" border="1px solid #e9ecef" borderRight="0">
                            <StyledCheckBox checked={snsData.naver} onChange={event => setSnsData({ ...snsData, naver: event.target.checked })} disabled={!applyData.naverChannelName} />
                          </Box>
                        </Grid>
                        <Grid item xs={5}>
                          <Box py={2} px={4} border="1px solid #e9ecef">
                            <Grid container justify="center" spacing={1} alignItems="center">
                              <Grid item>
                                <StyledImage width="18px" height="18px" src={blogIcon} />
                              </Grid>
                              <Grid item>
                                <StyledText overflowHidden>{applyData.naverChannelName || '블로그'}</StyledText>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        {
                          applyData.naverChannelName ? null : (
                            <Grid item>
                              <Box
                                padding="18px"
                                border="1px solid #e9ecef"
                                borderLeft="0"
                                css={{ cursor: 'pointer' }}
                                onClick={() => history.push('/Profile/UserInfo')}
                              >
                                <StyledText>연결하기</StyledText>
                              </Box>
                            </Grid>
                          )
                        }
                      </Grid>
                    </Grid>
                    {
                      errors.sns ? (
                        <div className="error-message">
                          {errors.sns.message}
                        </div>
                      ) : null
                    }
                    <input
                      type="text"
                      readOnly
                      name="sns"
                      ref={register}
                      style={{
                        opacity: '0', width: '0', padding: '0', border: '0', height: '0'
                      }}
                    />
                  </Grid>
                </Box>
              </Grid>
            </Grid>
            <ApplyFormComponent title="이름">
              <ReactFormText register={register} errors={errors} name="name" />
            </ApplyFormComponent>
            <ApplyFormComponent title="신청한마디">
              <TextareaAutosize ref={register} rowsMin={8} style={{ width: '99%' }} placeholder="신청한마디" name="message" />
              {
                errors.message ? (
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
                <StyledButton background={Colors.pink3} hoverBackground={Colors.pink} fontWeight="bold" fontSize="20px" onClick={handleSubmit(onSubmit)}>
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
