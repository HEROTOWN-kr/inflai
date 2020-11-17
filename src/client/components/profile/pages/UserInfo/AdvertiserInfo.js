import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import StyledText from '../../../containers/StyledText';
import StyledTextField from '../../../containers/StyledTextField';

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
        <Grid container spacing={2}>
          <Grid item xs={4}>
            {children}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

function AdvertiserInfo(props) {
  const { userInfo, setUserInfo, getUserInfo } = props;
  const {
    register, handleSubmit, watch, errors, setValue, control, getValues
  } = useForm();

  return (
    <Box py={4} px={6}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box py={1}>
                <FieldInfoComponent title="이메일 아이디">
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
                </FieldInfoComponent>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdvertiserInfo;
