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
import { Route, Switch } from 'react-router-dom';
import AdvertiserDetail from '../advertiser/AdvertiserDetail';
import ProductRequest from './ProductRequest';
import ProductEstimate from './ProductEstimate';
import ProductWrite from './ProductWrite';


function Product(props) {
  return (
    <React.Fragment>
      <div className="product wraper vertical3">
        <Grid container justify="center">
          <Grid item md={12} lg={10} xl={7}>
            <Route
              path={`${props.match.path}/request`}
              render={renderProps => <ProductRequest {...props} />}
            />
            <Route
              path={`${props.match.path}/estimate`}
              render={renderProps => <ProductEstimate {...props} />}
            />
            <Route
              path={`${props.match.path}/write`}
              render={renderProps => <ProductWrite {...props} />}
            />
          </Grid>
        </Grid>
      </div>
      <Switch />
    </React.Fragment>
  );
}

export default Product;
