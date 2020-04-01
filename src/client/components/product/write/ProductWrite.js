import React, { useEffect, useState } from 'react';
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

function ProductWrite({
  history,
  match
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [productData, setProductData] = useState({});

  function nextStep() {
    setCurrentStep(currentStep + 1);
  }

  function saveProductData(data) {
    setProductData({ ...productData, ...data });
  }

  return (
    <div className="write">
      <div className="title">
        <div className="main">캠페인 요청서 작성</div>
      </div>
      <Grid container className="step-holder" spacing={5}>
        <Grid item md={4} className={currentStep === 1 ? 'red' : null}>필수정보 입력</Grid>
        <Grid item md={4} className={currentStep === 2 ? 'red' : null}>상세정보 입력</Grid>
        <Grid item md={4} className={currentStep === 3 ? 'red' : null}>포스팅가이드 입력</Grid>
      </Grid>
      {
        {
          1: <RequiredInfo nextStep={nextStep} saveProductData={saveProductData} />,
          2: <DetailInfo nextStep={nextStep} saveProductData={saveProductData} />,
          3: <PostGuide match={match} history={history} saveProductData={saveProductData} productData={productData} />
        }[currentStep]
      }
    </div>


  );
}

export default ProductWrite;
