import { FieldArray, Form, Formik } from 'formik';
import {
  Divider, Grid, Radio, RadioGroup, TextField
} from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import React from 'react';
import * as Yup from 'yup';

function RequiredInfo({
  nextStep
}) {
  const category = [
    {
      name: '뷰티',
      count: '18,710'
    },
    {
      name: '여성패션',
      count: '15,819'
    },
    {
      name: '남성패션',
      count: '5,370'
    },
    {
      name: '육아',
      count: '3,739'
    },
    {
      name: '맛집/요리',
      count: '18,170'
    },
    {
      name: '커피/음료',
      count: '16,650'
    },
    {
      name: '아트/디자인',
      count: '6,431'
    },
    {
      name: 'IT/전자기기',
      count: '6,744'
    },
    {
      name: '게임',
      count: '3,812'
    },
    {
      name: '스포츠',
      count: '4,502'
    },
    {
      name: '여행/레저',
      count: '10,436'
    },
    {
      name: '라이프스타일',
      count: '9,384'
    },
    {
      name: '반려동물',
      count: '5,648'
    },
    {
      name: '쥬얼리',
      count: '10,424'
    },
    {
      name: '자동차',
      count: '1,979'
    }
  ];
  const ageCategory = [
    '상관없음', '10대', '20대', '30대', '40대', '50대', '60대 이상'
  ];

  const mySchema = Yup.object().shape({
    name: Yup.string()
      .required('홍보하실 제품명/브랜드명/서비스명을 입력해주세요'),
    typeCategory: Yup.array()
      .of(Yup.string().required('제품 카테고리를 선택하세요'))
      .min(1, '제품 카테고리를 선택하세요'),
    searchDate: Yup.string()
      .required('인플루언서 모집 기간을 입력하세요'),
    finishDate: Yup.string()
      .required('캠페인 종료일(포스팅 마감일)을 입력하세요'),
    sex: Yup.string()
      .required('캠페인 종료일(포스팅 마감일)을 입력하세요'),
    age: Yup.array()
      .of(Yup.string().required('모집하실 인플루언서의 연령대를 선택하세요'))
      .min(1, '모집하실 인플루언서의 연령대를 선택하세요'),
    channel: Yup.array()
      .of(Yup.string().required('원하시는 채널을 선택하세요'))
      .min(1, '원하시는 채널을 선택하세요'),
  });

  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
  }

  return (
    <Formik
      initialValues={{
        name: '',
        typeCategory: [],
        searchDate: '2019-10-24T22:00:00.000Z',
        finishDate: '2019-10-24T22:00:00.000Z',
        sex: '',
        age: [],
        channel: [],
      }}
      enableReinitialize
      validationSchema={mySchema}
      onSubmit={(values) => {
        console.log(values);
        nextStep();
        // props.history.push(`${props.match.path}/estimate`);
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
        submitForm
      }) => (
        <Form>
          <div className="wraper vertical2">
            <Grid container>
              <Grid item md={3}>
                <div className="step">필수정보 입력</div>
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <div className="step-title">홍보하실 제품명/브랜드명/서비스명을 입력하세요.</div>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      variant="outlined"
                      helperText={errors.name && touched.name ? (
                        <span className="error-message">{errors.name}</span>
                      ) : null}
                    />
                  </Grid>
                </Grid>
                <div style={{ marginBottom: '50px' }} />
                <Grid container spacing={3}>
                  <Grid item md={12}>
                    <div className="step-title">
                                            제품 카테고리를 선택하세요
                      <br />
                                            제품/서비스 카테고리에 맞는 인플루언서를 추천해드립니다. (중복 선택 가능)
                    </div>
                  </Grid>
                  <Grid item md={12}>
                    <FieldArray
                      name="typeCategory"
                      render={arrayHelpers => (
                        <Grid container className="category-cards" spacing={3}>
                          {category.map(item => (
                            <Grid item md={3} key={item.name}>
                              <label htmlFor={item.name} className="category-item">
                                <input
                                  type="checkbox"
                                  name="typeCategory"
                                  value={item.name}
                                  checked={values.typeCategory.includes(item.name)}
                                  id={item.name}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      arrayHelpers.push(item.name);
                                    } else {
                                      const idx = values.typeCategory.indexOf(item.name);
                                      arrayHelpers.remove(idx);
                                    }
                                  }}
                                />
                                <div className="category-name">
                                  <Grid container>
                                    <Grid item md={7}>{item.name}</Grid>
                                    <Grid item md={5} className="count">
                                      {item.count}
                                                                            명
                                    </Grid>
                                  </Grid>
                                </div>
                              </label>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    />
                  </Grid>
                  <Grid item md={12}>
                    {errors.typeCategory && touched.typeCategory ? (
                      <div className="error-message">{errors.typeCategory}</div>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <Divider />
          <div className="wraper vertical2">
            <Grid container className="calendar">
              <Grid item md={3}>
                <div className="step">진행일정</div>
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={8}>
                  <Grid item md={12}>
                    <div className="step-title">인플루언서 모집 기간을 입력하세요</div>
                    <div className="date collect">
                      <Grid container>
                        <Grid item md={6}>최대 7일까지 설정 가능</Grid>
                        <Grid item md={3} className="calendar-item-3">{getCurrentDate()}</Grid>
                        <Grid item md={3} className="calendar-item-3">
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              autoOk
                              name="searchDate"
                              disableToolbar
                              variant="inline"
                              format="yyyy/MM/dd"
                              margin="normal"
                              id="date-picker-inline"
                              value={values.searchDate}
                              onChange={(value) => {
                                setFieldValue('searchDate', value);
                              }}
                              KeyboardButtonProps={{
                                'aria-label': 'change date',
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                  <Grid item md={12}>
                    {errors.searchDate && touched.searchDate ? (
                      <div className="error-message">{errors.searchDate}</div>
                    ) : null}
                  </Grid>
                  <Grid item md={12}>
                    <div className="step-title">캠페인 종료일(포스팅 마감일)을 입력하세요</div>
                    <div className="date collect">
                      <Grid container>
                        <Grid item md={6}>최대 7일까지 설정 가능</Grid>
                        <Grid item md={3} className="calendar-item-3" />
                        <Grid item md={3} className="calendar-item-3">
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              autoOk
                              name="finishDate"
                              disableToolbar
                              variant="inline"
                              format="yyyy/MM/dd"
                              margin="normal"
                              id="date-picker-inline"
                              value={values.finishDate}
                              onChange={(value) => {
                                setFieldValue('finishDate', value);
                              }}
                              KeyboardButtonProps={{
                                'aria-label': 'change date',
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                  <Grid item md={12}>
                    {errors.finishDate && touched.finishDate ? (
                      <div className="error-message">{errors.finishDate}</div>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <Divider />
          <div className="wraper vertical2">
            <Grid container className="influencer-info">
              <Grid item md={3}>
                <div className="step">인플루언서 정보</div>
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={9}>
                  <Grid item md={12}>
                    <Grid container spacing={3}>
                      <Grid item md={12}>
                        <div className="step-title">모집하실 인플루언서의 성별을 선택하세요</div>
                      </Grid>
                      <Grid item md={12}>
                        <RadioGroup row aria-label="gender" name="gender1" value={values.sex} onChange={event => setFieldValue('sex', event.target.value)}>
                          <Grid container className="category-cards" spacing={3}>
                            <Grid item md={3}>
                              <label htmlFor="radio1" className="category-item">
                                <div className="category-name">
                                  <Radio value="0" id="radio1" />
                                  <span>상광없음</span>
                                </div>
                              </label>
                            </Grid>
                            <Grid item md={3}>
                              <label htmlFor="radio2" className="category-item">
                                <div className="category-name">
                                  <Radio value="1" id="radio2" />
                                  <span>여성</span>
                                </div>
                              </label>
                            </Grid>
                            <Grid item md={3}>
                              <label htmlFor="radio3" className="category-item">
                                <div className="category-name">
                                  <Radio value="2" id="radio3" />
                                  <span>남성</span>
                                </div>
                              </label>
                            </Grid>
                          </Grid>
                        </RadioGroup>
                        {/* <FormHelperText id="my-helper-text">{errors.type && touched.type ? <span className="error-message">{errors.type}</span> : null}</FormHelperText> */}
                      </Grid>
                      <Grid item md={12}>
                        {errors.sex && touched.sex ? (
                          <div className="error-message">{errors.sex}</div>
                        ) : null}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={12}>
                    <Grid container spacing={3}>
                      <Grid item md={12}>
                        <div className="step-title">모집하실 인플루언서의 연령대를 선택하세요</div>
                      </Grid>
                      <Grid item md={12}>
                        <FieldArray
                          name="age"
                          render={arrayHelpers => (
                            <Grid container className="category-cards" spacing={3}>
                              {ageCategory.map(item => (
                                <Grid item md={3} key={item}>
                                  <label htmlFor={item} className="category-item">
                                    <input
                                      type="checkbox"
                                      name="age"
                                      value={item}
                                      id={item}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(item);
                                        } else {
                                          const idx = values.age.indexOf(item);
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    <div className="category-name age">
                                      {item}
                                    </div>
                                  </label>
                                </Grid>
                              ))}
                            </Grid>
                          )}
                        />
                      </Grid>
                      <Grid item md={12}>
                        {errors.age && touched.age ? (
                          <div className="error-message">{errors.age}</div>
                        ) : null}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={12}>
                    <Grid container spacing={3}>
                      <Grid item md={12}>
                        <div className="step-title">원하시는 채널을 선택하세요</div>
                      </Grid>
                      <Grid item md={12}>
                        <FieldArray
                          name="channel"
                          render={arrayHelpers => (
                            <Grid container className="category-cards" spacing={3}>
                              <Grid item md={3}>
                                <label htmlFor="social1" className="category-item">
                                  <input
                                    type="checkbox"
                                    name="channel"
                                    value="instagram"
                                    id="social1"
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        arrayHelpers.push('instagram');
                                      } else {
                                        const idx = values.channel.indexOf('instagram');
                                        arrayHelpers.remove(idx);
                                      }
                                    }}
                                  />
                                  <div className="category-name">
                                                                        Instagram
                                  </div>
                                </label>
                              </Grid>
                              <Grid item md={3}>
                                <label htmlFor="social2" className="category-item">
                                  <input
                                    type="checkbox"
                                    name="channel"
                                    value="youtube"
                                    id="social2"
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        arrayHelpers.push('youtube');
                                      } else {
                                        const idx = values.channel.indexOf('youtube');
                                        arrayHelpers.remove(idx);
                                      }
                                    }}
                                  />
                                  <div className="category-name">
                                                                        Youtube
                                  </div>
                                </label>
                              </Grid>
                            </Grid>
                          )}
                        />
                      </Grid>
                      <Grid item md={12}>
                        {errors.channel && touched.channel ? (
                          <div className="error-message">{errors.channel}</div>
                        ) : null}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <div className="next-button">

            <Grid container>
              <Grid item md={3} className="left-side" />
              <Grid item md={9} className="right-side" onClick={() => submitForm()}>
                <Grid container justify="flex-end">
                  <Grid item md={4}>
                                        상세
                    <br />
                                        정보입력
                    <span>&#62;</span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default RequiredInfo;
