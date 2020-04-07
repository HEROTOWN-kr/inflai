import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Route, Switch } from 'react-router-dom';
import ProductRequest from './ProductRequest';
import ProductEstimate from './ProductEstimate';
import ProductWrite from './write/ProductWrite';
import ProductCreate from './ProductCreate';
import ProductMix from './ProductMix';
import ProductAgency from './ProductAgency';


function Product(props) {
  const [productInfo, setProductInfo] = useState({});

  function saveProductInfo(data) {
    setProductInfo({ ...productInfo, ...data });
  }

  function goTo(url) {
    props.history.push(`${props.match.path}/${url}`);
  }

  return (
    <React.Fragment>
      <Switch>
        <Route
          path={`${props.match.path}/mix`}
          render={renderProps => <ProductMix {...renderProps} saveProductInfo={saveProductInfo} />}
        />
        <Route
          path={`${props.match.path}/agency`}
          render={renderProps => <ProductAgency {...renderProps} />}
        />
        <Route
          path={`${props.match.path}/`}
          render={renderProps => <ProductCreate {...renderProps} productInfo={productInfo} goTo={goTo} />}
        />
      </Switch>
    </React.Fragment>
  );
}

export default Product;
