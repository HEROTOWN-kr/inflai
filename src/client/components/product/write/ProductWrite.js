import React, { useState } from 'react';
import 'date-fns';
import 'moment';
import {
  Grid, Divider, Button, TextField, Radio, RadioGroup, FormControlLabel, FormHelperText, FormControl, CheckboxGroup
} from '@material-ui/core';
import MomentUtils from '@date-io/moment';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';
import RequiredInfo from './RequiredInfo';
import DetailInfo from './DetailInfo';
import PostGuide from './PostGuide';

function ProductWrite() {
  const [currentStep, setCurrentStep] = useState(1);

  function nextStep() {
    setCurrentStep(currentStep + 1);
  }

  const category = {
    content: [
      { val: 1, text: '상관없음' },
      { val: 2, text: '이미지' },
      { val: 3, text: '동영상' }
    ],
    videoType: [
      { val: 1, text: '셀카와 함께 ∙ 제품을 부각시키는 촬영' },
      { val: 2, text: '전신샷과 함께 ∙ 제품을 부각시키는 촬영' },
      { val: 3, text: '제품 위주로 촬영' },
      { val: 4, text: '직접입력' }
    ]
  };

  return (
    <div className="write">
      <div className="title">
        <div className="main">캠페인 요청서 작성</div>
      </div>
      <Grid container className="step-holder" spacing={5}>
        <Grid item md={4}>필수정보 입력</Grid>
        <Grid item md={4}>상세정보 입력</Grid>
        <Grid item md={4}>포스팅가이드 입력</Grid>
      </Grid>
      {
        {
          1: <RequiredInfo nextStep={nextStep} />,
          2: <DetailInfo nextStep={nextStep} />,
          3: <PostGuide nextStep={nextStep} />
        }[currentStep]
      }
    </div>


  );
}

export default ProductWrite;
