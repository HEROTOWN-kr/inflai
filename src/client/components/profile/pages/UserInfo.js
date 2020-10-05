import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Grid, MenuItem } from '@material-ui/core';
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

function UserInfo() {
  const [userInfo, setUserInfo] = useState({});
  const {
    register, handleSubmit, watch, errors, setValue, control, getValues
  } = useForm();
  const { token } = Common.getUserInfo();
  const watchCountry = watch('city');

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
    const newPics = [];
    const pictures = event.target.files;

    Object.keys(pictures).map((key, i) => {
      const picUrl = URL.createObjectURL(pictures[key]);
      newPics.push({ file: pictures[key], picUrl });
    });

    // setFieldValue('photo', photo.concat(newPics));

    // input same pictures multiple times
    event.target.value = '';
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
          <Box p={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box px={2} py={1}>
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
                <Box px={2}>
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
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box px={2}>
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
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box px={2}>
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
                              // margin="normal"
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
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box px={2}>
                  <Grid container alignItems="center">
                    <Grid item xs={2}>
                      <StyledText fontSize="15">
                          사진
                      </StyledText>
                    </Grid>
                    <Grid item xs={10}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                          <StyledImage width="110" src={userInfo.INF_PHOTO || defaultAccountImage} />
                        </Grid>
                        <Grid item>
                          <label htmlFor="picAdd">
                            <div>
                              이미지 등록
                              <input
                                id="picAdd"
                                type="file"
                                style={{ display: 'none' }}
                                multiple
                                accept="image/*"
                                onChange={(event => addPicture(event))}
                              />
                            </div>
                          </label>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box px={2}>
                  <Grid container alignItems="center">
                    <Grid item />
                    <Grid item />
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box px={2}>
                  <Grid container alignItems="center">
                    <Grid item />
                    <Grid item />
                  </Grid>
                </Box>
              </Grid>
            </Grid>


            <Box px={2}>
              <StyledText fontSize="15">
                인스타
              </StyledText>
            </Box>
            <Box px={2}>
              <StyledText fontSize="15">
                유튜브
              </StyledText>
            </Box>
            <Box px={2}>
              <StyledText fontSize="15">
                네이버
              </StyledText>
            </Box>
            <Box px={2}>
              <StyledText fontSize="15">
                카카오수신동의
              </StyledText>
            </Box>

            <div>
              <Box py={35} />
            </div>


            <Box px={2}>
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
            </Box>
          </Box>
        </WhiteBlock>
      </form>

    </div>
  );
}

export default UserInfo;
