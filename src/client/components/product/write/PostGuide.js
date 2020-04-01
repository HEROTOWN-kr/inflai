import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  FormControl, FormControlLabel, FormHelperText, Grid, Radio, RadioGroup, Divider, TextareaAutosize, TextField
} from '@material-ui/core';
import axios from 'axios';
import Common from '../../../lib/common';

function PostGuide({
  history,
  saveProductData,
  productData,
  match
}) {
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const apiObj = { ...productData, id: match.params.id };

    axios.post('/api/TB_AD/updateAd', apiObj)
      .then((res) => {
        if (res.data.code === 200) {
          // history.push('/');
          console.log(res);
        } else if (res.data.code === 401) {
          console.log(res);
        } else {
          console.log(res);
        }
      })
      .catch(error => (error));
  }, [productData]);

  /*useEffect(() => {
    console.log('render');
    const apiObj = { ...productData, id: match.params.id };

    axios.post('/api/TB_AD/updateAd', apiObj)
      .then((res) => {
        if (res.data.code === 200) {
          // history.push('/');
          console.log(res);
        } else if (res.data.code === 401) {
          console.log(res);
        } else {
          console.log(res);
        }
      })
      .catch(error => (error));
  }, [productData]);*/

  const mySchema = Yup.object().shape({
    content: Yup.string()
      .required('콘텐츠 유형을 선택하세요'),
    videoType: Yup.string()
      .required('원하시는 촬영방법을 선택하세요'),
    publicText: Yup.string()
      .required('필수 작성 내용과 예시를 넣어주세요'),
    tags: Yup.string()
      .required('필수 해시태그를 2개 입력하세요'),
  });

  const category = {
    content: [
      { val: '1', text: '상관없음' },
      { val: '2', text: '이미지' },
      { val: '3', text: '동영상' }
    ],
    videoType: [
      { val: '1', text: '셀카와 함께 ∙ 제품을 부각시키는 촬영' },
      { val: '2', text: '전신샷과 함께 ∙ 제품을 부각시키는 촬영' },
      { val: '3', text: '제품 위주로 촬영' },
      { val: '4', text: '직접입력' }
    ]
  };

  return (
    <Formik
      initialValues={{
        content: '',
        videoType: '',
        publicText: '',
        tags: '',
        anotherTags: '',
        productLink: '',
      }}
      enableReinitialize
      validationSchema={mySchema}
      onSubmit={(values) => {
        saveProductData(values);
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
                <div className="step">미디어 가이드</div>
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <div className="step-title">콘텐츠 유형을 선택하세요</div>
                  </Grid>
                  <Grid item md={12}>
                    <RadioGroup row aria-label="gender" name="gender1" value={values.content} onChange={event => setFieldValue('content', event.target.value)}>
                      <Grid container className="category-cards" spacing={3}>
                        {category.content.map(item => (
                          <Grid item md={4}>
                            <label htmlFor={item.text} className="category-item">
                              <div className="category-name">
                                <Radio value={item.val} id={item.text} />
                                <span>{item.text}</span>
                              </div>
                            </label>
                          </Grid>
                        ))}
                      </Grid>
                    </RadioGroup>
                  </Grid>
                  <Grid item md={12}>
                    {errors.content && touched.content ? (
                      <div className="error-message">{errors.content}</div>
                    ) : null}
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="wraper vertical2 only-top">
                  <Grid item md={12}>
                    <div className="step-title">원하시는 촬영방법을 선택하세요</div>
                  </Grid>
                  <Grid item md={12}>
                    <RadioGroup row aria-label="gender" name="gender1" value={values.videoType} onChange={event => setFieldValue('videoType', event.target.value)}>
                      <Grid container className="category-cards" spacing={3}>
                        {category.videoType.map(item => (
                          <Grid item md={12}>
                            <label htmlFor={item.text} className="category-item">
                              <div className="category-name">
                                <Radio value={item.val} id={item.text} />
                                <span>{item.text}</span>
                              </div>
                            </label>
                          </Grid>
                        ))}
                      </Grid>
                    </RadioGroup>
                  </Grid>
                  <Grid item md={12}>
                    {errors.videoType && touched.videoType ? (
                      <div className="error-message">{errors.videoType}</div>
                    ) : null}
                  </Grid>
                </Grid>
                <div style={{ marginBottom: '50px' }} />
              </Grid>
            </Grid>
            <Divider />
            <Grid container className="wraper vertical2">
              <Grid item md={3}>
                <div className="step">텍스트 가이드</div>
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <div className="step-title">포스팅 시 필수 작성 내용과 예시를 넣어주세요</div>
                  </Grid>
                  <Grid item md={12}>
                    <TextareaAutosize
                      name="publicText"
                      rowsMax={4}
                      value={values.publicText}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="4줄 이하로 간단하게 입력하세요"
                    />
                  </Grid>
                  <Grid item md={12}>
                    {errors.publicText && touched.publicText ? (
                      <div className="error-message">{errors.publicText}</div>
                    ) : null}
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="wraper vertical2 only-top">
                  <Grid item md={12}>
                    <div className="step-title">필수 해시태그를 2개 입력하세요</div>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      name="tags"
                      placeholder="#인플라이 #인플루언서마케팅"
                      value={values.tags}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      variant="outlined"
                      helperText={errors.tags && touched.tags ? (
                        <span className="error-message">{errors.tags}</span>
                      ) : null}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="wraper vertical2 only-top">
                  <Grid item md={12}>
                    <div className="step-title">[선택사항] 해시태그를 5개 이하로 입력하세요</div>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      name="anotherTags"
                      placeholder="#인플라이 #인플루언서마케팅"
                      value={values.anotherTags}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      variant="outlined"
                      helperText={errors.anotherTags && touched.anotherTags ? (
                        <span className="error-message">{errors.anotherTags}</span>
                      ) : null}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            <Grid container className="wraper vertical2 only-top">
              <Grid item md={3}>
                <div className="step">선택 가이드</div>
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <div className="step-title">[선택사항]캠페인 이해를 도울 수 있는 콘텐츠를 등록하세요</div>
                  </Grid>
                  <Grid item md={12}>
                    <Grid container spacing={3} className="category-cards">
                      <Grid item md={3}>
                        <label htmlFor="" className="category-item">
                          <div className="category-name image">
                                            이미지 등록
                          </div>
                        </label>
                      </Grid>
                      <Grid item md={3}>
                        <label htmlFor="" className="category-item">
                          <div className="category-name image">
                              동영상 URL 등록
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
                </Grid>
                <Grid container spacing={2} className="wraper vertical3 only-top">
                  <Grid item md={12}>
                    <div className="step-title">[선택사항]제품에 대해 알 수 있는 페이지 링크를 등록하세요(홈페이지 또는 SNS)</div>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      name="productLink"
                      placeholder="www.inflai.com"
                      value={values.productLink}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      variant="outlined"
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
                                캠페인
                    <br />
                                승인 요청
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

export default PostGuide;
