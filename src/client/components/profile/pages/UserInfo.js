import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box, Divider, Grid, InputBase, MenuItem
} from '@material-ui/core';
import axios from 'axios';
import WhiteBlock from '../../containers/WhiteBlock';
import PageTitle from './PageTitle';
import StyledText from '../../containers/StyledText';
import StyledTextField from '../../containers/StyledTextField';
import { area, city, Colors } from '../../../lib/Сonstants';
import StyledButton from '../../containers/StyledButton';
import Common from '../../../lib/common';
import ReactHookFormSelect from '../../containers/ReactHookFormSelect';
import StyledImage from '../../containers/StyledImage';
import defaultAccountImage from '../../../img/default_account_image.png';
import instagramIcon from '../../../img/instagram.png';
import youtubeIcon from '../../../img/youtube.png';
import naverIcon from '../../../img/naver-icon.png';
import Sns from './Sns';
import DaumPostCode from '../../containers/DaumPostCode';
import AuthContext from '../../../context/AuthContext';


function UserInfo(props) {
  const { userInfo, setUserInfo, getUserInfo } = props;
  const [imageUrl, setImageUrl] = useState('');
  const {
    register, handleSubmit, watch, errors, setValue, control, getValues
  } = useForm();
  const { token } = useContext(AuthContext);
  const watchCountry = watch('country');

  useEffect(() => {
    register({ name: 'photo' }, {});
  }, [register]);

  useEffect(() => {
    setValue('nickName', userInfo.INF_NAME);
    setValue('phone', userInfo.INF_TEL);
    setValue('country', userInfo.INF_CITY || '0');
    setValue('postcode', userInfo.INF_POST_CODE);
    setValue('roadAddress', userInfo.INF_ROAD_ADDR);
    setValue('detailAddress', userInfo.INF_DETAIL_ADDR);
    setValue('extraAddress', userInfo.INF_EXTR_ADDR);
    setValue('region', userInfo.INF_AREA || '0');
    setValue('product', userInfo.INF_PROD);
  }, [userInfo]);


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

  const updateProfile = async (data) => {
    try {
      const apiObj = { ...data, token };
      await axios.post('/api/TB_INFLUENCER/updateInfo', apiObj);
      await getUserInfo();

      if (data.photo) {
        const { photo } = data;
        const formData = new FormData();
        formData.append('file', photo);
        formData.append('token', token);
        return axios.post('/api/TB_INFLUENCER/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).catch(err => alert('photo upload error'));
      }
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
    getUserInfo();
  }

  function updateData(checked) {
    const apiObj = { token };
    apiObj.message = checked ? 1 : 0;
    setUserInfo({ ...userInfo, INF_MESSAGE: apiObj.message });
    axios.post('/api/TB_INFLUENCER/updateInfo', apiObj).catch(error => alert(error));
  }

  return (
    <div>
      <WhiteBlock>
        <PageTitle>
          <StyledText fontSize="24">
              회원정보수정
          </StyledText>
        </PageTitle>
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
                      {/* <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <ReactHookFormSelect
                              name="country"
                              control={control}
                              error={!!errors.country}
                              errorMessage="주소를 선택해주세요"
                              defaultValue={userInfo.INF_CITY || '0'}
                              variant="outlined"
                              fullWidth
                              rules={{
                                required: true,
                                validate: (value) => {
                                  if (value === 0) {
                                    return 'Please provide input name';
                                  }
                                },
                              }}
                            >
                              {city.map((item, index) => (
                                <MenuItem key={item} value={index}>{item}</MenuItem>
                              ))}
                            </ReactHookFormSelect>
                          </Grid>
                          {watchCountry ? (
                            <Grid item xs={4}>
                              <ReactHookFormSelect
                                name="region"
                                control={control}
                                error={!!errors.region}
                                errorMessage="주소를 선택해주세요"
                                defaultValue={userInfo.INF_AREA || 0}
                                variant="outlined"
                                fullWidth
                                rules={{
                                  required: true,
                                }}
                              >
                                {area[getValues('country')].map((item, index) => (
                                  <MenuItem key={item} value={index}>{item}</MenuItem>
                                ))}
                              </ReactHookFormSelect>
                            </Grid>
                          ) : null}
                        </Grid> */}
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
                      <input id="kakaoCheck" type="checkbox" checked={userInfo.INF_MESSAGE || 0} onChange={e => updateData(e.target.checked)} />
                      <label htmlFor="kakaoCheck">
                        {' 카카오톡 통한 캠페인 모집 및 추천, 이벤트 정보 등의 수신에 동의합니다.'}
                      </label>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
          <Box px={2} />
        </Box>
      </WhiteBlock>
    </div>
  );
}

export default UserInfo;
