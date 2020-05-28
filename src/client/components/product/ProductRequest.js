import React, { useState } from 'react';
import {
  Field, Form, Formik, FormikProps, getIn, FieldProps, ErrorMessage, useField
} from 'formik';

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
  Button, Paper, Grid, Box
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/AssignmentTurnedInRounded';
import WarningIconOut from '@material-ui/icons/AssignmentTurnedInOutlined';
import * as Yup from 'yup';
import axios from 'axios';
import CheckWarning from './CheckWarning';
import Common from '../../lib/common';


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
      .required('상품 가격을 입력하세요')
  });

  const counter = [
    {
      name: 'nano',
      level: '나노',
      count: '1,000~10,000',
      oneCoast: 10000,
      aim: '포스팅을 많이 생성하여 해시태그 점유율을 높이고 싶을 때! 다수 진행 추천!'
    },
    {
      name: 'micro',
      level: '마이크로',
      count: '10,000~30,000',
      oneCoast: 20000,
      aim: '영향력이 점점 커저가는 인플루언서! 소수팬으로 프로모션 효과 상승에 효과적!'
    },
    {
      name: 'macro',
      level: '메크로',
      count: '30,000~50,000',
      oneCoast: 30000,
      aim: '영향력, 전달력 상승기의 인플루언서! 전환율 상승, 프로모션 효과 상승에 최적!'
    },
    {
      name: 'mega',
      level: '메가',
      count: '50,000~100,000',
      oneCoast: 40000,
      aim: '신제품 컨셉 등 브랜드, 상품 인지도 상승을 위한 높은 전달력이 필요할 때 추천!'
    },
    {
      name: 'celebrity',
      level: '셀럽',
      count: '100,000+',
      oneCoast: 50000,
      aim: '신제품 컨셉 등 브랜드, 상품 인지도 상승 필수 보장!'
    }
  ];

  const campaignType = [
    {
      value: '1',
      name: '상품 리뷰',
      title: '무료 협찬 제품 배송형',
      desc: '크리에이터에게 무료 협찬 제품을 배송 제공하여 사용 후기 컨텐츠 제작',
      icon: ''
    },
    {
      value: '2',
      name: '방문 리뷰',
      title: '오프라인 매장 / 행사 방문형',
      desc: '크리에이터가 직접 매장 또는 행사장에 방문하여 방문 후기 컨텐츠 제작',
      icon: ''
    },
    {
      value: '3',
      name: '서비스 리뷰',
      title: '온라인 서비스 이용형',
      desc: '크리에이터가 온라인 서비스를 이용하고 서비스 체험 후기 컨텐츠 제작',
      icon: ''
    },
    {
      value: '4',
      name: '리그램',
      title: '포스팅 리그램형',
      desc: '원하는 이미지나 영상 가이드를 그대로 업로드, 리그램 컨텐츠 제작',
      icon: ''
    },
    /* {
      value: '5',
      name: '이벤트 바이럴',
      title: '이벤트 / 행사 홍보형',
      desc: '이벤트 부스팅을 위한 홍보/참여 후기 컨텐츠 제작',
      icon: ''
    },
    {
      value: '6',
      name: '대행 문의',
      title: '컨설팅 / 디지털 마케팅',
      desc: '브릭씨 전문 마케터에게 대행 / 컨설팅 문의하기',
      icon: ''
    }, */
  ];


  const StyledRadio = ({ item, selected }) => (
    /* <div className={`card ${item.value === selected ? 'red' : null}`}>
      <Grid container justify="center" spacing={1}>
        <Grid item md={12}>
          <div className="icon">
            {/!* <img src={} alt="" /> *!/}
            <WarningIconOut />
          </div>
        </Grid>
        <Grid item md={12}>
          <div className="main-title">{item.name}</div>
        </Grid>
        <Grid item md={12}>
          <div className="secondary-title">{item.title}</div>
        </Grid>
        <Grid item md={12}>
          <div className="third-title">
                        {item.desc}
          </div>
        </Grid>
        <Grid item md={12}>
          <Radio value={item.value} />
        </Grid>
      </Grid>
    </div> */

    <Paper className={`card-new ${item.value === selected ? 'red' : null}`}>
      <Grid container>
        <Grid item md={2} className="icon">
          <WarningIconOut />
        </Grid>
        <Grid item md={10} className="card-text">
          <div className="main-title">{item.name}</div>
          <div className="secondary-title">{item.title}</div>
          <div className="description">{item.desc}</div>
        </Grid>
        <Radio value={item.value} />
      </Grid>
    </Paper>
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

  function videoCheck(event, setFieldValue) {
    setFieldValue('videoCheck', event.target.checked);
    setFieldValue('videoPrice', event.target.checked ? 500000 : 0);
  }

  function CounterComponent({
    text,
    number,
    end
  }) {
    return (
      <Grid item md={12}>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <span className="result-text">{text}</span>
          </Grid>
          <Grid item>
            <span className="inf-sum">
              {number}
              {end}
            </span>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  const Counter = ({
    data, values, setFieldValue, ...props
  }) => {
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
        onChange={(event) => {
          helpers.setValue(event.target.value);
          setFieldValue(`${data.name}Sum`, parseInt(event.target.value ? event.target.value : 0, 10) * data.oneCoast);
        }}
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
          nanoSum: 0,
          microSum: 0,
          macroSum: 0,
          megaSum: 0,
          celebritySum: 0,
          servicePrice: 0,
          videoPrice: 0,
          sumCount: '',
          price: '',
          videoCheck: false,
          reuse: false
        }}
        enableReinitialize
        validationSchema={mySchema}
        onSubmit={(values) => {
          props.saveProductInfo(values);
          // props.history.push(`${props.match.path}/estimate`);

          const apiObj = { ...values, token: Common.getUserInfo().token };

          axios.post('/api/TB_AD/createAd', apiObj).then((res) => {
            if (res.data.code === 200) {
              // props.history.push(`${props.match.path}/write/${res.data.id}`);
              props.history.push(`${props.match.path}/write/${res.data.id}`);
              console.log(res);
            } else if (res.data.code === 401) {
              console.log(res);
            } else {
              console.log(res);
            }
          }).catch(error => (error));
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
                            {campaignType.map(item => (
                              <Grid item md={6} key={item.name}>
                                <FormControlLabel value="1" control={<StyledRadio item={item} selected={values.type} />} />
                              </Grid>
                            ))}
                          </Grid>
                        </RadioGroup>
                        <FormHelperText id="my-helper-text">{errors.type && touched.type ? <span className="error-message">{errors.type}</span> : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* <Grid item md={12}>
                      <Grid container spacing={3}>
                        <Grid item md={6}>
                          <Paper className="card-new">
                            <Grid container>
                              <Grid item md={2} className="icon">
                                <WarningIconOut />
                              </Grid>
                              <Grid item md={10} className="card-text">
                                <div className="main-title">상품 리뷰</div>
                                <div className="secondary-title">무료 협찬 제품 배송형</div>
                                <div className="description">크리에이터에게 무료 협찬 제품을 배송 제공하여 사용 후기 컨텐츠 제작</div>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                        <Grid item md={6}>card</Grid>
                      </Grid>
                    </Grid> */}
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
                        <span>상품 가격을 입력하세요</span>
                      </div>
                    </Grid>

                    <Grid item md={12}>
                      <TextField
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                        id="outlined-start-adornment"
                        /* helperText={errors.price && errors.price ? (
                          <span className="error-message">{errors.price}</span>
                        ) : null} */
                        className="counter"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">인플루언서 1인당 제공되는 상품의 시장가</InputAdornment>,
                          endAdornment: <InputAdornment position="end">원</InputAdornment>
                        }}
                        placeholder="0"
                        variant="outlined"
                      />
                    </Grid>
                    {errors.sumCount && touched.sumCount ? <Grid item md={12} className="error-message">{errors.sumCount}</Grid> : null}
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
                        <span>제품영상촬영 서비스</span>
                      </div>
                    </Grid>
                    <Grid item md={12} className="counter">
                      <label className={`checkbox-label ${values.videoCheck === true ? 'red' : null}`} htmlFor="r1">
                        <Grid container justify="space-between">
                          <Grid item md={3}>
                            <input type="checkbox" name="reuse" value={values.videoCheck} id="r1" onClick={event => videoCheck(event, setFieldValue)} />
                            <CheckIcon />
                            <span>제품영상촬영 필요</span>
                          </Grid>
                        </Grid>
                      </label>
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
                  <Grid container spacing={3} justify="flex-end">
                    <Grid item md={12}>
                      <div className="step-title">
                        <span>희망하는 인플루언서 등급별 인원 수를 설정하세요.</span>
                        <span className="grey">(등급 당 최대 10,000명까지 입력 가능합니다.)</span>
                      </div>
                    </Grid>
                    {counter.map(i => (
                      <Grid key={i.level} item md={12}>
                        <Counter data={i} values={values} setFieldValue={setFieldValue} name={i.name} />
                      </Grid>
                    ))}
                    {errors.sumCount && touched.sumCount ? <Grid item md={12} className="error-message">{errors.sumCount}</Grid> : null}
                    <Grid item md={6}>
                      <div className="counter-result">
                        <span className="result-text">총 모집인원</span>
                        <span className="inf-number">
                          {sumCount([values.nano, values.micro, values.macro, values.mega, values.celebrity])}
                          명
                        </span>
                      </div>
                      <Box pt={4}>
                        <Grid container spacing={1} className="counter-result">
                          {/* <CounterComponent text="총 모집인원" end="명" number={sumCount([values.nano, values.micro, values.macro, values.mega, values.celebrity])} /> */}
                          { values.nanoSum ? <CounterComponent text="총 나노 금액" end="원" number={values.nanoSum} /> : null}
                          { values.microSum ? <CounterComponent text="총 마이크로 금액" end="원" number={values.microSum} /> : null}
                          { values.macroSum ? <CounterComponent text="총 메크로 금액" end="원" number={values.macroSum} /> : null}
                          { values.megaSum ? <CounterComponent text="총 메가 금액" end="원" number={values.megaSum} /> : null}
                          { values.celebritySum ? <CounterComponent text="총 셀럽 금액" end="원" number={values.celebritySum} /> : null}
                          { values.videoPrice ? <CounterComponent text="제품영상촬영 금액" end="원" number={values.videoPrice} /> : null}
                          {/* <CounterComponent text="서비스 이용료" number="3000" end="원" /> */}
                          <Grid item md={12}>
                            <Divider />
                          </Grid>
                          <CounterComponent text="총 금액" end="원" number={`${values.nanoSum + values.microSum + values.macroSum + values.megaSum + values.celebritySum + values.videoPrice || 0}`} />
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            <Divider />
            {/* <div className="step-four wraper vertical2">
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
            </div> */}
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
