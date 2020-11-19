import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box, Divider, Grid, InputBase, MenuItem
} from '@material-ui/core';
import axios from 'axios';
import StyledText from '../../../containers/StyledText';
import StyledTextField from '../../../containers/StyledTextField';
import { area, city, Colors } from '../../../../lib/Сonstants';
import StyledButton from '../../../containers/StyledButton';
import StyledImage from '../../../containers/StyledImage';
import defaultAccountImage from '../../../../img/default_account_image.png';
import Sns from '../Sns';
import DaumPostCode from '../../../containers/DaumPostCode';
import AuthContext from '../../../../context/AuthContext';

function ImageActionButton(props) {
  const {
    children, color, background, onClick
  } = props;

  const styles = {
    cursor: 'pointer',
    background: background || 'red',
    color: color || '#ffffff',
    borderRadius: '12px',
    fontSize: '14px',
    padding: '3px 16px'
  };

  return (
    <div style={styles} onClick={onClick}>
      {children}
    </div>
  );
}

function InfluencerInfo(props) {
  const {
    userInfo, setUserInfo, getUserInfo, setMessage
  } = props;
  const [imageUrl, setImageUrl] = useState('');
  const [noticeCheck, setNoticeCheck] = useState(false);
  const {
    register, handleSubmit, watch, errors, setValue, control, getValues
  } = useForm();
  const { token, userDataUpdate } = useContext(AuthContext);

  useEffect(() => {
    register({ name: 'photo' }, {});
  }, [register]);

  useEffect(() => {
    const {
      INF_NAME, INF_TEL, INF_POST_CODE, INF_ROAD_ADDR, INF_DETAIL_ADDR,
      INF_EXTR_ADDR, INF_AREA, INF_PROD, INF_PHOTO, INF_MESSAGE
    } = userInfo;

    setValue('nickName', INF_NAME);
    setValue('phone', INF_TEL);
    setValue('postcode', INF_POST_CODE);
    setValue('roadAddress', INF_ROAD_ADDR);
    setValue('detailAddress', INF_DETAIL_ADDR);
    setValue('extraAddress', INF_EXTR_ADDR);
    setValue('region', INF_AREA || '0');
    setValue('product', INF_PROD);
    setNoticeCheck(INF_MESSAGE === 1);

    userDataUpdate(INF_NAME, INF_PHOTO);
  }, [userInfo]);


  const updateProfile = async (data) => {
    try {
      const apiObj = { ...data, token };
      apiObj.message = noticeCheck ? 1 : 0;

      await axios.post('/api/TB_INFLUENCER/updateInfo', apiObj);

      console.log(data.photo);
      if (data.photo) {
        const { photo } = data;
        const formData = new FormData();
        formData.append('file', photo);
        formData.append('token', token);
        return axios.post('/api/TB_INFLUENCER/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(async (response) => {
          await getUserInfo();
          setMessage({ type: 'success', open: true, text: '신청되었습니다' });
        }).catch(err => alert('photo upload error'));
      }
      await getUserInfo();
      setMessage({ type: 'success', open: true, text: '저장되었습니다' });
    } catch (err) {
      alert(err.message);
    }
  };

  function addPicture(event) {
    setValue('photo', event.target.files[0]);

    const picture = event.target.files[0];
    const picUrl = URL.createObjectURL(picture);
    setImageUrl(picUrl);
  }

  async function deletePicture() {
    await axios.post('/api/TB_INFLUENCER/delete', { token }).catch(err => alert('pic delete error'));
    setImageUrl(null);
    setValue('photo', null);
    getUserInfo();
  }

  function onCheckboxClick(checked) {
    setNoticeCheck(checked);
  }

  return (
    <Box py={4} px={6}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box py={1}>
                <Grid container alignItems="center">
                  <Grid item xs={2}>
                    <StyledText fontSize="15">
                                          이메일 아이디
                    </StyledText>
                  </Grid>
                  <Grid item xs={10}>
                    <StyledText fontSize="15">
                      {userInfo.INF_EMAIL || ''}
                    </StyledText>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center">
                <Grid item xs={2}>
                  <StyledText fontSize="15">
                    이름
                  </StyledText>
                </Grid>
                <Grid item xs={10}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <StyledTextField
                        fullWidth
                        name="nickName"
                        defaultValue={userInfo.INF_NAME || ''}
                        inputRef={register({ required: true })}
                        error={!!errors.nickName}
                        variant="outlined"
                        helperText={errors.nickName ? (
                          <span className="error-message">이름을 입력해주세요</span>
                        ) : null}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center">
                <Grid item xs={2}>
                  <StyledText fontSize="15">
                                      전화번호
                  </StyledText>
                </Grid>
                <Grid item xs={10}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <StyledTextField
                        fullWidth
                        name="phone"
                        defaultValue={userInfo.INF_TEL || ''}
                        inputRef={register({ required: true })}
                        error={!!errors.phone}
                        variant="outlined"
                        helperText={errors.phone ? (
                          <span className="error-message">전화번호를 입력해주세요</span>
                        ) : null}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center">
                <Grid item xs={2}>
                  <StyledText fontSize="15">
                                      주소
                  </StyledText>
                </Grid>
                <Grid item xs={10}>
                  <DaumPostCode setValue={setValue} register={register} errors={errors} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box py={2}>
                <Grid container alignItems="center">
                  <Grid item xs={2}>
                    <StyledText fontSize="15">
                                          사진
                    </StyledText>
                  </Grid>
                  <Grid item xs={10}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                        <StyledImage
                          width="110px"
                          height="110px"
                          borderRadius="100%"
                          src={imageUrl || userInfo.INF_PHOTO || defaultAccountImage}
                        />
                      </Grid>
                      <Grid item>
                        <label htmlFor="picAdd">
                          <ImageActionButton background="#00a1ff">
                                                      이미지 등록
                            <input
                              id="picAdd"
                              name="photo"
                              type="file"
                              style={{ display: 'none' }}
                                                          // multiple
                              accept="image/*"
                              onChange={(event => addPicture(event))}
                            />
                          </ImageActionButton>
                        </label>
                        {userInfo.INF_PHOTO ? (
                          <Box pt={1}>
                            <ImageActionButton onClick={() => deletePicture(token)}>
                                                          이미지 삭제
                            </ImageActionButton>
                          </Box>
                        ) : null}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center">
                <Grid item xs={2}>
                  <StyledText fontSize="15">
                                      카카오수신동의
                  </StyledText>
                </Grid>
                <Grid item xs={10}>
                  <input id="kakaoCheck" type="checkbox" checked={noticeCheck} onChange={e => onCheckboxClick(e.target.checked)} />
                  <label htmlFor="kakaoCheck">
                    {' 카카오톡 통한 캠페인 모집 및 추천, 이벤트 정보 등의 수신에 동의합니다.'}
                  </label>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box pt={4}>
            <Grid container justify="center">
              <Grid item xs={3}>
                <StyledButton
                  onClick={handleSubmit(updateProfile)}
                  background={Colors.skyBlue}
                  hoverBackground="#1c4dbb"
                >
                  저장
                </StyledButton>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Box pb={4}>
            <StyledText fontSize="19" fontWeight="600">SNS</StyledText>
          </Box>
          <Sns userInfo={userInfo} getUserInfo={getUserInfo} />
        </Grid>
      </Grid>
      <Box px={2} />
    </Box>
  );
}

export default InfluencerInfo;
