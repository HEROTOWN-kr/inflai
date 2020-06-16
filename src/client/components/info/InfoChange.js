import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid, TextField } from '@material-ui/core';
import {
  Field, FieldArray, Form, Formik, getIn, useField
} from 'formik';
import axios from 'axios';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import * as Yup from 'yup';
import Common from '../../lib/common';
import NameArray from '../../lib/nameArray';

function InfoChange({
  history,
  editCol
}) {
  const fieldData = {
    nickName: {
      name: 'nickName',
      label: '이름'
    },
    phone: {
      name: 'phone',
      label: '전화번호'
    },
    country: {
      name: 'country',
      label: '시/도'
    },
    region: {
      name: 'region',
      label: '구/군'
    },
    product: {
      name: 'product',
      label: '제품, 서비스'
    },
  };

  const [changeData, setChangeData] = useState({});
  const [process, setProcess] = useState(true);
  const { token } = Common.getUserInfo();

  useEffect(() => {
    if (!editCol) {
      history.push('/Info');
    }

    axios.get('/api/TB_INFLUENCER/', {
      params: {
        token,
        col: editCol,
      }
    }).then((res) => {
      // console.log(res.data);
      const { data } = res.data;
      if (data) {
        setChangeData(data);
        setProcess(false);
      }
    });
  }, []);

  const SignupSchema = Yup.object().shape({
    nickName: Yup.string()
      .when(['fields'], {
        is: fields => fields.indexOf('nickName') > -1,
        then: Yup.string().required('닉네임을 입력해주세요'),
      }),
    email: Yup.string()
      .when(['fields'], {
        is: fields => fields.indexOf('email') > -1,
        then: Yup.string()
          .email('Invalid email')
          .required('이메일을 입력해주세요'),
      }),
    country: Yup.number()
      .when(['fields'], {
        is: fields => fields.indexOf('country') > -1,
        then: Yup.number().min(1, '시/도 을 선택해주세요'),
      }),
    region: Yup.number()
      .when(['fields'], {
        is: fields => fields.indexOf('region') > -1,
        then: Yup.number().required('구/군 을 선택해주세요'),
      }),
    phone: Yup.string()
      .when(['fields'], {
        is: fields => fields.indexOf('phone') > -1,
        then: Yup.string().required('전화번호를 입력해주세요'),
      }),
    product: Yup.string()
      .when(['fields'], {
        is: fields => fields.indexOf('product') > -1,
        then: Yup.string().required('제품, 서비스를 입력해주세요')
      }),
  });

  function MyTextField(props) {
    const [field, meta, helpers] = useField(props.name);

    return (
      <React.Fragment>
        <div className="label">
          <label htmlFor={props.label}>{props.label}</label>
        </div>
        <TextField
          name={field.name}
          id={props.label}
          placeholder=""
          value={meta.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          fullWidth
          variant="outlined"
          disabled={field.name === 'email'}
          helperText={meta.touched && meta.error ? (
            <span className="error-message">{meta.error}</span>
          ) : null}
        />
      </React.Fragment>
    );
  }

  function MySelect(props) {
    const [field, meta, helpers] = useField(props.name);
    const renderArray = props.name === 'country' ? NameArray.city() : NameArray.area()[props.countryIndex];

    return (
      <React.Fragment>
        <div className="label-holder">
          <label htmlFor={props.label}>{props.label}</label>
        </div>
        <FormControl variant="outlined" className="select-field" fullWidth>
          <Select
            id={props.label}
            value={meta.value}
            onChange={(event => helpers.setValue(event.target.value))}
          >
            {renderArray.map((item, index) => (
              <MenuItem key={item} value={index}>{item}</MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {meta.touched && meta.error ? (
              <span className="error-message">{meta.error}</span>
            ) : null}
          </FormHelperText>
        </FormControl>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {
            process ? (
              <div>
                <CircularProgress />
              </div>
            ) : (
              <div className="form-container">
                <div className="title">
                        계정정보 수정
                </div>
                <Formik
                  initialValues={{
                    nickName: changeData.INF_NAME,
                    email: changeData.INF_EMAIL,
                    country: changeData.INF_CITY,
                    region: changeData.INF_AREA,
                    phone: changeData.INF_TEL,
                    product: changeData.INF_PROD,
                    fields: editCol.split(' ')
                  }}
                  enableReinitialize
                  validationSchema={SignupSchema}
                  onSubmit={(values) => {
                    // same shape as initial values
                    const apiObj = { ...values, token };

                    // console.log(apiObj);
                    axios.post('/api/TB_INFLUENCER/updateInfo', apiObj).then((res) => {
                      if (res.data.code === 200) {
                        history.push('Info');
                      } else if (res.data.code === 401) {
                        alert(res.data);
                      } else {
                        alert(res.data);
                      }
                    }).catch(error => (error));
                  }}
                >
                  {({
                    values, submitForm
                  }) => (
                    <Grid container justify="center" spacing={3} className="form-text">
                      <Grid container spacing={2} justify="center" item xs={12}>
                        {values.fields.map(item => (
                          <Grid key={item} item xs={6}>
                            {item === 'country' || item === 'region' ? (
                              <MySelect name={fieldData[item].name} type="select" label={fieldData[item].label} countryIndex={values.country} />
                            ) : (
                              <MyTextField name={fieldData[item].name} label={fieldData[item].label} />
                            )}
                          </Grid>
                        ))}
                      </Grid>
                      <Grid container justify="center" item xs={12}>
                        <Grid item xs={3} className="change-button edit" onClick={submitForm}>저장</Grid>
                      </Grid>
                    </Grid>
                  )}
                </Formik>
              </div>
            )
        }

    </React.Fragment>
  );
}

export default InfoChange;
