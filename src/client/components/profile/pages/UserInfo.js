import React, { useEffect, useState } from 'react';
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


function UserInfo() {
  const [userInfo, setUserInfo] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const {
    register, handleSubmit, watch, errors, setValue, control, getValues
  } = useForm();
  const { token } = Common.getUserInfo();
  const watchCountry = watch('city');

  function ImageActionButton(props) {
    const { children, color, background } = props;

    const styles = {
      cursor: 'pointer',
      background: background || 'red',
      color: color || '#ffffff',
      borderRadius: '12px',
      fontSize: '14px',
      padding: '3px 16px'
    };

    return (
      <div style={styles}>
        {children}
      </div>
    );
  }

  const onSubmit = data => console.log(data);

  async function getUserInfo() {
    try {
      const response = await axios.get('/api/TB_INFLUENCER/', {
        params: {
          token
        }
      });
      const { data } = response.data;
      if (data) {
        console.log(data);
        setValue('name', data.INF_NAME);
        setValue('phone', data.INF_TEL);
        setValue('city', data.INF_CITY);
        setUserInfo(data);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  function addPicture(event) {
    const picture = event.target.files[0];
    const picUrl = URL.createObjectURL(picture);
    // setImageUrl(picUrl);
    // setUserInfo({ ...userInfo, INF_PHOTO: picUrl });
    // setValue('photo', picture);
    /* const newPics = [];
    const pictures = event.target.files;

    Object.keys(pictures).map((key, i) => {
      const picUrl = URL.createObjectURL(pictures[key]);
      newPics.push({ file: pictures[key], picUrl });
    });

    // setFieldValue('photo', photo.concat(newPics));

    // input same pictures multiple times
    event.target.value = ''; */
  }

  function updateData(checked) {
    const apiObj = { token };
    apiObj.message = checked ? 1 : 0;
    setUserInfo({ ...userInfo, INF_MESSAGE: apiObj.message });
    axios.post('/api/TB_INFLUENCER/updateInfo', apiObj).then((res) => {
      if (res.data.code === 200) {

      } else if (res.data.code === 401) {
        alert(res.data);
      } else {
        alert(res.data);
      }
    }).catch(error => (error));
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                            {userInfo.INF_EMAIL}
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
                          <Grid item xs={3}>
                            <StyledTextField
                              fullWidth
                              name="name"
                              defaultValue={userInfo.INF_NAME || ''}
                              inputRef={register({ required: true })}
                              error={!!errors.name}
                              variant="outlined"
                              helperText={errors.name ? (
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
                          <Grid item xs={3}>
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
                        <Grid container spacing={2}>
                          <Grid item xs={3}>
                            <ReactHookFormSelect
                              name="city"
                              control={control}
                              error={!!errors.city}
                              errorMessage="주소를 선택해주세요"
                              defaultValue={userInfo.INF_CITY || 0}
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
                            <Grid item xs={3}>
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
                                {area[getValues('city')].map((item, index) => (
                                  <MenuItem key={item} value={index}>{item}</MenuItem>
                                ))}
                              </ReactHookFormSelect>
                            </Grid>
                          ) : null}
                        </Grid>
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
                              <StyledImage width="110" height="110" borderRadius="100%" src={imageUrl || userInfo.INF_PHOTO || defaultAccountImage} />
                            </Grid>
                            <Grid item>
                              <label htmlFor="picAdd">
                                <ImageActionButton background="#00a1ff">
                                  이미지 등록
                                  <input
                                    id="picAdd"
                                    name="photo"
                                    ref={register}
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
                                  <ImageActionButton>
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
                        <input id="kakaoCheck" type="checkbox" checked={userInfo.INF_MESSAGE} onChange={e => updateData(e.target.checked)} />
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
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container alignItems="center">
                      <Grid item xs={2}>
                        <StyledText fontSize="15">
                          인스타
                        </StyledText>
                      </Grid>
                      <Grid item xs={3}>
                        <Box py={2} px={4} border="1px solid #e9ecef">
                          <Grid container justify="center" spacing={1}>
                            <Grid item>
                              <StyledImage width="18" height="18" src={instagramIcon} />
                            </Grid>
                            <Grid item>
                              <StyledText>인스타그램 연결하기</StyledText>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center">
                      <Grid item xs={2}>
                        <StyledText fontSize="15">
                          유튜브
                        </StyledText>
                      </Grid>
                      <Grid item xs={3}>
                        <Box py={2} px={4} border="1px solid #e9ecef">
                          <Grid container justify="center" spacing={1}>
                            <Grid item>
                              <StyledImage width="24" height="18" src={youtubeIcon} />
                            </Grid>
                            <Grid item>
                              <StyledText>유튜브 연결하기</StyledText>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center">
                      <Grid item xs={2}>
                        <StyledText fontSize="15">
                          네이버
                        </StyledText>
                      </Grid>
                      <Grid item xs={4}>
                        <Box py={1} px={2} border="1px solid #e9ecef">
                          <InputBase
                            fullWidth
                            placeholder="http://블로그주소 또는 https://블로그주소"
                            inputProps={{ 'aria-label': 'naked', style: { padding: '0' } }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Grid container justify="center">
                  <Grid item xs={3}>
                    <StyledButton
                      onClick={handleSubmit(onSubmit)}
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
      </form>
    </div>
  );
}

export default UserInfo;
