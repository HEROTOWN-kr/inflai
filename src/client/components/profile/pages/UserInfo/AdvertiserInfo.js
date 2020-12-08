import React, { useContext, useEffect, useState } from 'react';
import { Box, Divider, Grid } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import StyledText from '../../../containers/StyledText';
import StyledTextField from '../../../containers/StyledTextField';
import DaumPostCode from '../../../containers/DaumPostCode';
import StyledImage from '../../../containers/StyledImage';
import defaultAccountImage from '../../../../img/default_account_image.png';
import AuthContext from '../../../../context/AuthContext';
import StyledButton from '../../../containers/StyledButton';
import { Colors } from '../../../../lib/Сonstants';

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

function FieldInfoComponent(props) {
  const { title, children } = props;

  return (
    <Grid container alignItems="center">
      <Grid item xs={2}>
        <StyledText fontSize="15">
          {title}
        </StyledText>
      </Grid>
      <Grid item xs={10}>
        {children}
      </Grid>
    </Grid>
  );
}

function AdvertiserInfo(props) {
  const {
    userInfo, setUserInfo, getUserInfo, setMessage
  } = props;
  const {
    register, handleSubmit, watch, errors, setValue, control, getValues
  } = useForm();
  const [imageUrl, setImageUrl] = useState('');
  const { token, userDataUpdate } = useContext(AuthContext);
  const [noticeCheck, setNoticeCheck] = useState(false);

  useEffect(() => {
    register({ name: 'photo' }, {});
  }, [register]);

  useEffect(() => {
    const {
      ADV_NAME, ADV_TEL, ADV_POST_CODE, ADV_ROAD_ADDR, ADV_DETAIL_ADDR,
      ADV_EXTR_ADDR, ADV_REG_NUM, ADV_COM_NAME, ADV_PHOTO, ADV_MESSAGE
    } = userInfo;

    setValue('nickName', ADV_NAME);
    setValue('phone', ADV_TEL);
    setValue('postcode', ADV_POST_CODE);
    setValue('roadAddress', ADV_ROAD_ADDR);
    setValue('detailAddress', ADV_DETAIL_ADDR);
    setValue('extraAddress', ADV_EXTR_ADDR);
    setValue('registerNumber', ADV_REG_NUM);
    setValue('companyName', ADV_COM_NAME);
    setNoticeCheck(ADV_MESSAGE === 1);

    userDataUpdate(ADV_NAME, ADV_PHOTO);
  }, [userInfo]);

  const updateProfile = async (data) => {
    try {
      const apiObj = { ...data, token };
      apiObj.message = noticeCheck ? 1 : 0;

      await axios.post('/api/TB_ADVERTISER/update', apiObj);

      if (data.photo) {
        const { photo } = data;
        const formData = new FormData();
        formData.append('file', photo);
        formData.append('token', token);
        return axios.post('/api/TB_ADVERTISER/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(async (response) => {
          await getUserInfo();
          setMessage({ type: 'success', open: true, text: '저장되었습니다' });
        }).catch((err) => {
          console.log(err.response);
          alert('photo upload error');
        });
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
    await axios.post('/api/TB_ADVERTISER/delete', { token }).catch(err => alert('pic delete error'));
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
              <Box pt={1}>
                <FieldInfoComponent title="이름">
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <StyledTextField
                        fullWidth
                        name="nickName"
                        defaultValue={userInfo.ADV_NAME || ''}
                        inputRef={register({ required: true })}
                        error={!!errors.nickName}
                        variant="outlined"
                        helperText={errors.nickName ? (
                          <span className="error-message">이름을 입력해주세요</span>
                        ) : null}
                      />
                    </Grid>
                  </Grid>
                </FieldInfoComponent>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FieldInfoComponent title="전화번호">
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <StyledTextField
                      fullWidth
                      name="phone"
                      defaultValue={userInfo.ADV_TEL || ''}
                      inputRef={register({ required: true })}
                      error={!!errors.phone}
                      variant="outlined"
                      helperText={errors.phone ? (
                        <span className="error-message">전화번호를 입력해주세요</span>
                      ) : null}
                    />
                  </Grid>
                </Grid>
              </FieldInfoComponent>
            </Grid>
            <Grid item xs={12}>
              <FieldInfoComponent title="사업자번호">
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <StyledTextField
                      fullWidth
                      name="registerNumber"
                      defaultValue={userInfo.ADV_REG_NUM || ''}
                      inputRef={register({ required: true })}
                      error={!!errors.registerNumber}
                      variant="outlined"
                      helperText={errors.registerNumber ? (
                        <span className="error-message">사업자번호를 입력해주세요</span>
                      ) : null}
                    />
                  </Grid>
                </Grid>
              </FieldInfoComponent>
            </Grid>
            <Grid item xs={12}>
              <FieldInfoComponent title="회사명">
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <StyledTextField
                      fullWidth
                      name="companyName"
                      defaultValue={userInfo.ADV_COM_NAME || ''}
                      inputRef={register({ required: true })}
                      error={!!errors.companyName}
                      variant="outlined"
                      helperText={errors.companyName ? (
                        <span className="error-message">회사명을 입력해주세요</span>
                      ) : null}
                    />
                  </Grid>
                </Grid>
              </FieldInfoComponent>
            </Grid>
            <Grid item xs={12}>
              <FieldInfoComponent title="주소">
                <DaumPostCode setValue={setValue} register={register} errors={errors} />
              </FieldInfoComponent>
            </Grid>
            <Grid item xs={12}>
              <FieldInfoComponent title="사진">
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <StyledImage
                      width="110px"
                      height="110px"
                      borderRadius="100%"
                      src={imageUrl || userInfo.ADV_PHOTO || defaultAccountImage}
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
                    {userInfo.ADV_PHOTO ? (
                      <Box pt={1}>
                        <ImageActionButton onClick={() => deletePicture(token)}>
                            이미지 삭제
                        </ImageActionButton>
                      </Box>
                    ) : null}
                  </Grid>
                </Grid>
              </FieldInfoComponent>
            </Grid>
            <Grid item xs={12}>
              <Box py={2}>
                <FieldInfoComponent title="카카오수신동의">
                  <input id="kakaoCheck" type="checkbox" checked={noticeCheck} onChange={e => onCheckboxClick(e.target.checked)} />
                  <label htmlFor="kakaoCheck">
                    {' 카카오톡 통한 캠페인 모집 및 추천, 이벤트 정보 등의 수신에 동의합니다.'}
                  </label>
                </FieldInfoComponent>
              </Box>
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdvertiserInfo;
