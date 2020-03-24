import React, { useState } from 'react';
import * as Yup from 'yup';
import classNames from 'classnames';
import {
  Field, FieldArray, Form, Formik, getIn, FieldProps, ErrorMessage
} from 'formik';
import Grid from '@material-ui/core/Grid';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import Common from '../../lib/common';

function AdvertiserForm() {
  const [categoryDialog, setCategoryDialog] = useState(false);

  const getMuiTheme = () => createMuiTheme({
    overrides: {
      MuiTableCell: {
        root: {

        },
        head: {
          background: '#9acea5 !important',
          color: '#2b699e'
        },
        body: {
          '&:hover': {
            backgroundColor: '#9acea5',
            cursor: 'pointer'
          }
        }
      }
    }
  });

  const columns = ['엔터테인먼트/예술', '생활/노하우/쇼핑', '취미/여가/여행', '지식/동향'];

  const data = [
    ['문학/책', '일상/생각', '게임', 'IT/컴퓨터'],
    ['영화', '육아/결혼', '스포츠', '사회/정치'],
    ['미술/디자인', '애완/반려동물', '사진', '건강/의학'],
    ['공연/전시', '좋은글/이미지', '자동차', '비즈니스/경제'],
    ['음악', '패션/미용', '취미/여가/여행', '어학/외국어'],
    ['드라마', '인테리어/DIY', '국내여행', '교육/학문'],
    ['스타/연예인', '요리/리세피', '세계여행', ''],
    ['만화/애니', '상품리뷰', '맛집', ''],
    ['방송', '원예/재배', '', ''],
  ];

  const SignupSchema = Yup.object().shape({
    category: Yup.array().of(Yup.string().required('카테고리 유형을 선택해주세요')),
    jobType: Yup.string()
      .required('직종이 입력해주세요'),
    companyName: Yup.string()
      .min(2, '너무 짧습니다!')
      .max(50, '너무 김니다')
      .required('회사 명을 입력해주세요'),
    budget: Yup.string()
      .required('마케팅 예산 입력해주세요'),
    email: Yup.string()
      .email('잘못된 이메일 형식 입니다')
      .required('이메일을 입력해주세요'),
    country: Yup.string()
      .required('국가를 선택해주세요'),
    region: Yup.string()
      .required('지역을 선택해주세요'),
    phone: Yup.string()
      .required('전화번호를 입력해주세요'),
  });

  function categoryToggle() {
    setCategoryDialog(!categoryDialog);
  }

  const options = {
    selectableRows: 'none',
    rowHover: false,
    sort: false,
    filter: false,
    search: false,
    print: false,
    download: false,
    viewColumns: false,
    pagination: false,
    sortFilterList: false,
    searchable: false,
  };

  // Input feedback
  const InputFeedback = ({ error }) => (error ? <div className={classNames('input-feedback')}>{error}</div> : null);

  // Radio input
  const RadioButton = ({
    field: {
      name, value, onChange, onBlur
    },
    id,
    label,
    className,
    ...props
  }) => (
    <div>
      <input
        name={name}
        id={id}
        type="radio"
        value={id} // could be something else for output?
        checked={id === value}
        onChange={onChange}
        onBlur={onBlur}
        className={classNames('radio-button')}
        {...props}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );

  // Radio group
  const RadioButtonGroup = ({
    value,
    error,
    touched,
    id,
    label,
    className,
    children
  }) => {
    const classes = classNames(
      'input-field',
      {
        'is-success': value || (!error && touched), // handle prefilled or user-filled
        'is-error': !!error && touched
      },
      className
    );

    return (
      <div className={classes}>
        {children}
        {touched && <InputFeedback error={error} />}
      </div>
    );
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={{
          category: [''],
          categoryIndex: 3,
          jobType: '',
          companyName: '',
          budget: '',
          instagram: '',
          youtube: '',
          blog: '',
          email: '',
          country: '',
          region: '',
          phone: '',
          agreement: false
        }}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          // same shape as initial values
          const apiObj = { ...values, token: Common.getUserInfo().token };

          axios.post('/api/TB_AD/saveAd', apiObj)
            .then((res) => {
              if (res.data.code === 200) {
                console.log(res);
              } else if (res.data.code === 401) {
                console.log(res);
              } else {
                console.log(res);
              }
            })
            .catch(error => (error));
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
        }) => (
          <Form className="userInfo-form">
            <label htmlFor="country" style={{ display: 'block' }}>
                          Job type
            </label>
            <Field name="jobType" as="select" placeholder="select job type">
              <option value="advertiser">Advertiser</option>
              <option value="agency">Agency</option>
              <option value="" label="Select job type" />
            </Field>
            {errors.jobType && touched.jobType ? <div className="error-message">{errors.jobType}</div> : null}


            <label htmlFor="companyName" style={{ display: 'block' }}>
                          Company Name*
            </label>
            <Field name="companyName" type="text" id="companyName" />
            {errors.companyName && touched.companyName ? (
              <div className="error-message">{errors.companyName}</div>
            ) : null}

            <label htmlFor="budget" style={{ display: 'block' }}>
                          Budget
            </label>
            <RadioButtonGroup
              id="budget"
              label="Budget"
              value={values.budget}
              error={errors.budget}
              touched={touched.budget}
            >
              <Field
                component={RadioButton}
                name="budget"
                id="1"
                label="~ 500.000"
              />
              <Field
                component={RadioButton}
                name="budget"
                id="2"
                label="500.000 ~ 1.000.000"
              />
              <Field
                component={RadioButton}
                name="budget"
                id="3"
                label="1.000.000 ~ 5.000.000"
              />
              <Field
                component={RadioButton}
                name="budget"
                id="4"
                label="5.000.000 ~"
              />
            </RadioButtonGroup>
            <label htmlFor="budget" style={{ display: 'block' }}>
                          몇 명의 인플루언서가 팔요한가요?
            </label>
            <Grid container>
              <Grid container direction="column" justify="center" xs={3}>
                <Grid item>
                                  인스타그램
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Field name="instagram" type="number" className="social-count" />
              </Grid>
              <Grid container xs={5} direction="column" justify="center">
                <Grid item>
                                  명
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid container direction="column" justify="center" xs={3}>
                <Grid item>
                                  유튜브
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Field name="youtube" type="number" className="social-count" />
              </Grid>
              <Grid container xs={5} direction="column" justify="center">
                <Grid item>
                                  명
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid container direction="column" justify="center" xs={3}>
                <Grid item>
                                  블로거
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Field name="blog" type="number" className="social-count" />
              </Grid>
              <Grid container xs={5} direction="column" justify="center">
                <Grid item>
                                  명
                </Grid>
              </Grid>
            </Grid>

            <label htmlFor="email" style={{ display: 'block' }}>
                          Email
            </label>
            <Field name="email" type="email" />
            {errors.email && touched.email ? <div className="error-message">{errors.email}</div> : null}

            <label htmlFor="country" style={{ display: 'block' }}>
                          Country
            </label>
            {/* <Field name="country" as="select" placeholder="Favorite Color">
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="" label="Select a country" />
                </Field> */}
            <CountryDropdown
              name="country"
              value={values.country}
              onChange={(_, e) => handleChange(e)}
              onBlur={handleBlur}
            />
            <RegionDropdown
              name="region"
              country={values.country}
              value={values.region}
              onChange={(_, e) => handleChange(e)}
              onBlur={handleBlur}
            />
            {errors.country && touched.country ? <div className="error-message">{errors.country}</div> : null}

            <label htmlFor="phone" style={{ display: 'block' }}>
                          Phone
            </label>
            <Field name="phone" type="text" />
            {errors.phone && touched.phone ? <div className="error-message">{errors.phone}</div> : null}

            <label htmlFor="category" style={{ display: 'block' }}>
                          Category
            </label>

            <FieldArray
              name="category"
              render={arrayHelpers => (
                <div>
                  <Dialog open={categoryDialog}>

                    <DialogContent>
                      <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                          title="내게 맞는 키테고리"
                          data={data}
                          columns={columns}
                          options={{
                            ...options,
                            onCellClick(colData, cellMeta) {
                              // values.category[values.categoryIndex] = colData;
                              setFieldValue(`category[${values.categoryIndex}]`, colData);
                              categoryToggle();
                            }
                          }}
                        />
                      </MuiThemeProvider>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={categoryToggle}>Close</Button>
                    </DialogActions>
                  </Dialog>
                  {
                      values.category.map((item, index) => (
                        <div key={index} className="field-item">
                          <Grid container={12}>
                            <div className="place">{`${index + 1} 순위`}</div>
                            <Grid container xs={6} justify="center">
                              <div className="category-name">{values.category[index] ? values.category[index] : '카테고리를 선택'}</div>
                            </Grid>
                            <Button variant="outlined" color="primary" onClick={() => { values.categoryIndex = index; categoryToggle(); }}>선택</Button>
                            { values.category.length > 1
                              ? (
                                <Button variant="outlined" color="primary" onClick={() => arrayHelpers.remove(index)} className="minus-button">
                                      -
                                </Button>

                              ) : null
                            }
                            { values.category.length < 3 && index === 0
                              ? (
                                <Button variant="outlined" color="primary" onClick={() => arrayHelpers.push('')} className="plus-button">
                                      +
                                </Button>
                              ) : null
                            }
                          </Grid>
                          <Grid style={{color: 'red'}}>
                            <ErrorMessage name={`category.${index}`} />
                          </Grid>
                        </div>
                      ))
                  }
                </div>
              )}
            />


            <div>
              <label className="agreement-label">
                <Field type="checkbox" name="agreement" />
                              I agree to receive communication from Matchmade
              </label>
            </div>


            <Grid container xs={12}>
              <button className="submit-button" type="submit">Submit</button>
            </Grid>
          </Form>
        )}

      </Formik>

    </React.Fragment>
  );
}

export default AdvertiserForm;
