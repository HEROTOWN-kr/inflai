import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Route, Switch } from 'react-router-dom';
import ProductRequest from './ProductRequest';
import ProductEstimate from './ProductEstimate';
import ProductWrite from './write/ProductWrite';
import ProductCreate from './ProductCreate';
import ProductMix from './ProductMix';


function Product(props) {
  const [productInfo, setProductInfo] = useState({});

  function saveProductInfo(data) {
    setProductInfo({ ...productInfo, ...data });
  }

  return (
    <React.Fragment>
      <Switch>
        <Route
          path={`${props.match.path}/mix`}
          render={renderProps => <ProductMix {...renderProps} saveProductInfo={saveProductInfo} />}
        />
        <Route
          path={`${props.match.path}/`}
          render={renderProps => <ProductCreate {...renderProps} productInfo={productInfo} />}
        />
        {/* <Route
              path={`${props.match.path}/write/:id`}
              render={renderProps => <ProductWrite {...renderProps} />}
            /> */}
      </Switch>
    </React.Fragment>
  );
}

export default Product;
