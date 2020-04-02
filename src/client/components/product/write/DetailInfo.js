import React from 'react';
import { FieldArray, Form, Formik } from 'formik';
import {
  Button,
  Divider, Grid, InputAdornment, Radio, RadioGroup, TextareaAutosize, TextField
} from '@material-ui/core';
import * as Yup from 'yup';
import Common from '../../../lib/common';

function DetailInfo({
  nextStep,
  saveProductData
}) {
  const mySchema = Yup.object().shape({
    presidentName: Yup.string()
      .required('캠페인 제목을 입력하세요'),
    photo: Yup.array()
      .of(Yup.string().required('제품 카테고리를 선택하세요'))
      .min(1, '캠페인 대표 이미지를 올려주세요'),
    about: Yup.string()
      .required('캠페인 제목을 업력하세요'),
    sponsoredItem: Yup.string()
      .required('협찬품목을 입력하세요'),
  });

  function addPicture(event, photo, setFieldValue) {
    const newPics = [];
    const pictures = event.target.files;

    Object.keys(pictures).map((key, i) => {
      const picUrl = URL.createObjectURL(pictures[key]);
      newPics.push({ file: pictures[key], picUrl });
    });

    setFieldValue('photo', photo.concat(newPics));

    // input same pictures multiple times
    event.target.value = '';
  }

  return (
    <Formik
      initialValues={{
        presidentName: '',
        photo: [],
        about: '',
        price: '1000',
        sponsoredItem: '',
        itemCheck: ''
      }}
      enableReinitialize
      validationSchema={mySchema}
      onSubmit={(values) => {
        saveProductData(values);
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
          <div className="detail wraper vertical2">
            <Grid container>
              <Grid item md={3}>
                <div className="step">캠페인 정보</div>
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <div className="step-title">캠페인 제목을 입력하세요 (25자 이하).</div>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      name="presidentName"
                      placeholder="캠페인을 대표하는 이름을 짧게 입력하세요"
                      value={values.presidentName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      variant="outlined"
                      helperText={errors.presidentName && touched.presidentName ? (
                        <span className="error-message">{errors.presidentName}</span>
                      ) : null}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} style={{ margin: '60px 0' }}>
                  <Grid item md={12}>
                    <div className="step-title">
                        캠페인 대표 이미지를 올려주세요
                    </div>
                  </Grid>
                  <Grid item md={12}>
                    <Grid container className="category-cards">
                      <Grid item md={3}>
                        <label htmlFor="picAdd" className="category-item">
                          <div className="category-name image">
                            이미지 등록
                            <input
                              id="picAdd"
                              type="file"
                              style={{ display: 'none' }}
                              multiple
                              accept="image/*"
                              onChange={(event => addPicture(event, values.photo, setFieldValue))}
                            />
                          </div>
                        </label>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={12}>
                    <div>
                      - 이미지 권장 사이즈 700*700
                      <br />
                      - 여러장 올리실 수 있으며 파일크기는 최대 10MB까지 가능해요
                    </div>
                  </Grid>
                  <Grid item md={12}>
                    <FieldArray
                      name="photo"
                      render={arrayHelpers => (
                        <Grid container spacing={2}>
                          {values.photo.map((file, index) => (
                            <Grid item key={file.picUrl} md={3} className="image-holder">
                              <div>
                                <img
                                  className=""
                                  alt="img"
                                  src={file.picUrl}
                                />
                                <span onClick={() => arrayHelpers.remove(index)}>button</span>
                              </div>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    />
                  </Grid>
                  <Grid item md={12}>
                    {errors.photo && touched.photo ? (
                      <div className="error-message">{errors.photo}</div>
                    ) : null}
                  </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginBottom: '50px' }}>
                  <Grid item md={12}>
                    <div className="step-title">캠페인에 대해 소개해주세요</div>
                  </Grid>
                  <Grid item md={12}>
                    {/* <TextField
                      name="about"
                      value={values.about}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      variant="outlined"
                      helperText={errors.about && touched.about ? (
                        <span className="error-message">{errors.about}</span>
                      ) : null}
                    /> */}
                    <TextareaAutosize
                      name="about"
                      rowsMax={4}
                      value={values.about}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="4줄 이하로 간단하게 입력하세요"
                    />
                  </Grid>
                  <Grid item md={12}>
                    {errors.about && touched.about ? (
                      <div className="error-message">{errors.about}</div>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            <Grid container className="wraper vertical2 only-top">
              <Grid item md={3}>
                <div className="step">협찬품 정보</div>
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={2}>
                  <Grid item md={12} className="price-holder">
                    <TextField
                      name="price"
                      disabled
                      fullWidth
                      value={values.price}
                      onChange={handleChange}
                      id="outlined-start-adornment"
                      className="counter"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">입력하신 협찬품 가격</InputAdornment>,
                        endAdornment: <InputAdornment position="end">원</InputAdornment>
                      }}
                      placeholder="0"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="wraper vertical2 only-top">
                  <Grid item md={12}>
                    <div className="step-title">협찬품목을 입력하세요</div>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      name="sponsoredItem"
                      value={values.sponsoredItem}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      placeholder="인플루언서 1인당 제공되는 협찬품"
                      variant="outlined"
                      helperText={errors.sponsoredItem && touched.sponsoredItem ? (
                        <span className="error-message">{errors.sponsoredItem}</span>
                      ) : null}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="wraper vertical2 only-top">
                  <Grid item md={12}>
                    <div className="step-title">
                      <span>[선택사항] </span>
                      <span>협찬품 제공시 확인이 필요한 사항을 입력하세요</span>
                    </div>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      name="itemCheck"
                      value={values.itemCheck}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      placeholder="예) 신발 상즈를 입력해주세요/피부타입을 알려주세요.
                       (지성, 건성, 중성, 복합성, 민감성 등)"
                      variant="outlined"
                      helperText={errors.itemCheck && touched.itemCheck ? (
                        <span className="error-message">{errors.itemCheck}</span>
                      ) : null}
                    />
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
                                포스팅
                    <br />
                                가이드입력
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

export default DetailInfo;
