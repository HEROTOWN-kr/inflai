import React, { useState } from 'react';
import {
  Field, Form, Formik, FormikProps, getIn, FieldProps, ErrorMessage, useField
} from 'formik';

import Grid from '@material-ui/core/Grid';
import {
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
  Divider,
  Input,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  TextField,
  Button
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/AssignmentTurnedInRounded';
import WarningIconOut from '@material-ui/icons/AssignmentTurnedInOutlined';
import * as Yup from 'yup';
import CheckWarning from './CheckWarning';


function ProductRequest(props) {
  const mySchema = Yup.object().shape({
    type: Yup.string()
      .required('캠페인 유형을 선택해주세요'),
    sumCount: Yup.string()
      .when(['nano', 'micro', 'macro', 'mega', 'celebrity'], {
        is: (nano, micro, macro, mega, celebrity) => !(parseInt(nano, 10)) && !(parseInt(micro, 10)) && !(parseInt(macro, 10)) && !(parseInt(mega, 10)) && !(parseInt(celebrity, 10)),
        then: Yup.string().required('진행하실 인플루언서 수를 입력하세요.'),
      }),
    price: Yup.string()
      .required('협찬품 가격을 입력하세요')
  });

  const counter = [
    {
      name: 'nano',
      level: '나노',
      count: '1,000~10,000',
      aim: '포스팅을 많이 생성하여 해시태그 점유율을 높이고 싶을 때! 다수 진행 추천!'
    },
    {
      name: 'micro',
      level: '마이크로',
      count: '10,000~30,000',
      aim: '영향력이 점점 커저가는 인플루언서! 소수팬으로 프로모션 효과 상승에 효과적!'
    },
    {
      name: 'macro',
      level: '메크로',
      count: '30,000~50,000',
      aim: '영향력, 전달력 상승기의 인플루언서! 전환율 상승, 프로모션 효과 상승에 최적!'
    },
    {
      name: 'mega',
      level: '메가',
      count: '50,000~100,000',
      aim: '신제품 컨셉 등 브랜드, 상품 인지도 상승을 위한 높은 전달력이 필요할 때 추천!'
    },
    {
      name: 'celebrity',
      level: '셀럽',
      count: '100,000+',
      aim: '신제품 컨셉 등 브랜드, 상품 인지도 상승 필수 보장!'
    }
  ];


  const StyledRadio = ({ value, selected }) => (
    <div className={`card ${value === selected ? 'red' : null}`}>
      <Grid container justify="center" spacing={1}>
        <Grid item md={12}>
          <div className="icon">
            {/* <img src={} alt="" /> */}
            <WarningIconOut />
          </div>
        </Grid>
        <Grid item md={12}>
          <div className="main-title">상품 리뷰</div>
        </Grid>
        <Grid item md={12}>
          <div className="secondary-title">무료 협찬 제품 배송형</div>
        </Grid>
        <Grid item md={12}>
          <div className="third-title">
                        크리에이터에게 무료 협찬 제붐을
            <br />
                        배송 제공하여 사용 후기 컨텐츠 제작
          </div>
        </Grid>
        <Grid item md={12}>
          <Radio value={value} />
        </Grid>
      </Grid>
    </div>
  );

  function sumCount(values) {
    let sum = 0;

    values.map((item) => {
      if (parseInt(item, 10)) {
        sum += parseInt(item, 10);
      }
      return sum;
    });

    return sum.toString();
  }

  const Counter = ({ data, ...props }) => {
    const [field, meta, helpers] = useField(props);

    const counterText = () => (
      <span className="counter-textHolder">
        <Grid container>
          <Grid item md={2}><span className="level">{data.level}</span></Grid>
          <Grid item md={3}><span className="count">{data.count}</span></Grid>
          <Grid item md={7}><span className="aim">{data.aim}</span></Grid>
        </Grid>
      </span>
    );

    return (
      <TextField
        name={props.name}
        value={meta.value}
        onChange={event => helpers.setValue(event.target.value)}
                // onBlur={event => field.onBlur(event)}
        id="outlined-start-adornment"
        className="counter"
        InputProps={{
          startAdornment: <InputAdornment position="start">{counterText()}</InputAdornment>,
          endAdornment: <InputAdornment position="end">명</InputAdornment>,
        }}
        inputProps={{
          maxLength: 5
        }}
        placeholder="0"
        variant="outlined"
      />
    );
  };


  return (
    <React.Fragment>
      <div className="title wraper vertical3">
        <div className="main">캠페인 예상 견적 요청하기</div>
        <div className="secondary">인플루언서 믹스</div>
      </div>
      <div className="tip">
        <div className="tip-main">
          <span>인플루언서 믹스</span>
         를 선택하셨네요!
        </div>
        <div className="tip-secondary">
         마케팅의 목적에 맞추어 인플루언서의 등급과 수를 Mix하여 진행해보세요.
          <br />
         타겟팅 된 인플루언서를 모집한 후에 원하는 분을 직접 선택할 수 있어서 만족도가 높아요!
        </div>
      </div>

      <Formik
        initialValues={{
          type: '',
          nano: '',
          micro: '',
          macro: '',
          mega: '',
          celebrity: '',
          sumCount: '',
          price: '',
          reuse: false
        }}
        enableReinitialize
        validationSchema={mySchema}
        onSubmit={(values) => {
          props.saveProductInfo(values);
          props.history.push(`${props.match.path}/estimate`);
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
          <Form>
            <div className="step-one wraper vertical2">
              <Grid container>
                <Grid item md={3}>
                  <div className="step">STEP 1</div>
                </Grid>
                <Grid item md={9}>
                  <Grid container spacing={3}>
                    <Grid item md={12}>
                      <div className="step-title">캠페인 유형을 선택하세요</div>
                    </Grid>
                    <Grid item md={12}>
                      <FormControl>
                        <RadioGroup row aria-label="gender" name="gender1" value={values.type} onChange={event => setFieldValue('type', event.target.value)}>
                          <Grid container spacing={3}>
                            {['1', '2', '3', '4', '5', '6'].map(item => (
                              <Grid item md={4}>
                                <FormControlLabel key={item} value="1" control={<StyledRadio value={item} selected={values.type} />} />
                              </Grid>
                            ))}
                          </Grid>
                        </RadioGroup>
                        <FormHelperText id="my-helper-text">{errors.type && touched.type ? <span className="error-message">{errors.type}</span> : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            <Divider />
            <div className="step-two wraper vertical2">
              <Grid container>
                <Grid item md={3}>
                  <div className="step">STEP 2</div>
                </Grid>
                <Grid item md={9}>
                  <Grid container spacing={3}>
                    <Grid item md={12}>
                      <div className="step-title">
                        <span>희망하는 인플루언서 등급별 인원 수를 설정하세요.</span>
                        <span className="grey">(등급 당 최대 10,000명까지 입력 가능합니다.)</span>
                      </div>
                    </Grid>
                    {counter.map(i => (
                      <Grid key={i.level} item md={12}>
                        <Counter data={i} name={i.name} />
                      </Grid>
                    ))}
                    {errors.sumCount && touched.sumCount ? <Grid item md={12} className="error-message">{errors.sumCount}</Grid> : null}
                    <Grid item md={12}>
                      <div className="counter-result">
                        <span className="result-text">총 모집인원</span>
                        <span className="inf-number">
                          {sumCount([values.nano, values.micro, values.macro, values.mega, values.celebrity])}
                           명
                        </span>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            <Divider />
            <div className="step-three wraper vertical2">
              <Grid container>
                <Grid item md={3}>
                  <div className="step">STEP 3</div>
                </Grid>
                <Grid item md={9}>
                  <Grid container spacing={3}>
                    <Grid item md={12}>
                      <div className="step-title">
                        <span>협찬품 가격을 입력하세요</span>
                      </div>
                    </Grid>

                    <Grid item md={12}>
                      <TextField
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                        id="outlined-start-adornment"
                        helperText={errors.price && errors.price ? (
                          <span className="error-message">{errors.price}</span>
                        ) : null}
                        className="counter"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">인플루언서 1인당 제공되는 협찬품의 시장가</InputAdornment>,
                          endAdornment: <InputAdornment position="end">원</InputAdornment>
                        }}
                        placeholder="0"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            <Divider />
            <div className="step-four wraper vertical2">
              <Grid container>
                <Grid item md={3}>
                  <div className="step">STEP 4</div>
                </Grid>
                <Grid item md={9}>
                  <Grid container spacing={3}>
                    <Grid item md={12}>
                      <div className="step-title">
                        <span>생성된 콘텐츠의 2차 활용 여부를 알려주세요</span>
                      </div>
                    </Grid>
                    <Grid item md={12} className="counter">
                      <label className={`checkbox-label ${values.reuse === true ? 'red' : null}`} htmlFor="r1">
                        <Grid container justify="space-between">
                          <Grid item md={3}>
                            <input type="checkbox" name="reuse" value={values.reuse} id="r1" onClick={handleChange} />
                            <CheckIcon />
                            <span>콘텐츠 2차 활용 예정</span>
                          </Grid>
                          <Grid item md={5} style={{ textAlign: 'right', paddingTop: '7px' }}>공식계정 리그램만 가능, 이외 마케팅은 불가</Grid>
                        </Grid>
                      </label>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            <div className="submit-button wraper vertical2">
              <Grid container justify="center">
                <Grid item md={3}>
                  <Button type="submit">캠페인 요청서 작성</Button>
                </Grid>
              </Grid>
              <Grid container justify="center">
                <Grid item md={5} className="submit-tip" style={{ position: 'relative' }}>
                  <div className="triangle" />
                  <div className="first-title">현재 페이지는 예상 견적 확인용 페이지입니다.</div>
                  <div className="second-title">
                     자세한 사항은 캠페인 상세 요청서를 작성 후 정확하게 받아보실 수 있으며
                    <br />
                     세부적인 내용에 따라 위 견적은 변동될 수 있습니다.
                  </div>
                </Grid>
              </Grid>
            </div>
          </Form>
        )}
      </Formik>
      <CheckWarning />
    </React.Fragment>

  );
}

export default ProductRequest;
