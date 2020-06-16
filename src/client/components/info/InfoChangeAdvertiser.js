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

function InfoChangeAdvertiser({
  history,
  editCol
}) {
  const fieldData = {
    name: {
      name: 'name',
      label: '이름'
    },
    companyName: {
      name: 'companyName',
      label: '회사명'
    },
    phone: {
      name: 'phone',
      label: '담당자 연락처'
    },
    registerNumber: {
      name: 'registerNumber',
      label: '사업자 등록번호'
    },
    classification: {
      name: 'classification',
      label: '사업자구분'
    },
    jobType: {
      name: 'jobType',
      label: '기업구분'
    }
  };

  const [changeData, setChangeData] = useState({});
  const [process, setProcess] = useState(true);
  const { token } = Common.getUserInfo();

  useEffect(() => {
    if (!editCol) {
      history.push('/Info');
    }

    axios.get('/api/TB_ADVERTISER/', {
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
    name: Yup.string()
      .when(['fields'], {
        is: fields => fields.indexOf('name') > -1,
        then: Yup.string().required('담당자 이름을 입력해주세요'),
      }),
    companyName: Yup.string()
      .when(['fields'], {
        is: fields => fields.indexOf('companyName') > -1,
        then: Yup.string().required('회사명을 입력해주세요'),
      }),
    phone: Yup.string()
      .when(['fields'], {
        is: fields => fields.indexOf('phone') > -1,
        then: Yup.string().required('담당자 연락처를 입력해주세요'),
      }),
    registerNumber: Yup.string()
      .when(['fields'], {
        is: fields => fields.indexOf('registerNumber') > -1,
        then: Yup.string().required('사업자 등록번호를 입력해주세요'),
      }),
    classification: Yup.string()
      .when(['fields'], {
        is: fields => fields.indexOf('classification') > -1,
        then: Yup.string().required('기업구분을 선택해주세요')
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
    const renderArray = props.name === 'classification' ? NameArray.classification() : NameArray.jobType();

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
              <MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>
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
        process
          ? (
            <div>
              <CircularProgress />
            </div>
          )
          : (
            <div className="form-container">
              <div className="title">
                    계정정보 수정
              </div>
              <Formik
                initialValues={{
                  name: changeData.ADV_NAME,
                  companyName: changeData.ADV_COM_NAME,
                  phone: changeData.ADV_TEL,
                  registerNumber: changeData.ADV_REG_NUM,
                  jobType: changeData.ADV_TYPE,
                  classification: changeData.ADV_CLASS,
                  fields: editCol.split(' ')
                }}
                enableReinitialize
                validationSchema={SignupSchema}
                onSubmit={(values) => {
                  // same shape as initial values
                  const apiObj = { ...values, token };

                  // console.log(apiObj);
                  axios.post('/api/TB_ADVERTISER/update', apiObj).then((res) => {
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
                          {item === 'classification' || item === 'jobType' ? (
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

export default InfoChangeAdvertiser;
