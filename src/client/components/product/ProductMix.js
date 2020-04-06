import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Route, Switch } from 'react-router-dom';
import ProductRequest from './ProductRequest';
import ProductEstimate from './ProductEstimate';
import ProductWrite from './write/ProductWrite';


function ProductMix(props) {
  const [productInfo, setProductInfo] = useState({});

  useEffect(() => {
    console.log('render');
  }, []);

  function saveProductInfo(data) {
    setProductInfo({ ...productInfo, ...data });
  }

  return (
    <React.Fragment>
      <div className="product wraper vertical3">
        <Grid container justify="center">
          <Grid item md={12} lg={10} xl={7}>
            <Switch>
              <Route
                path={`${props.match.path}/request`}
                render={renderProps => <ProductRequest {...props} saveProductInfo={saveProductInfo} />}
              />
              <Route
                path={`${props.match.path}/estimate`}
                render={renderProps => <ProductEstimate {...props} productInfo={productInfo} />}
              />
              <Route
                path={`${props.match.path}/write/:id`}
                render={renderProps => <ProductWrite {...renderProps} />}
              />
            </Switch>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}

export default ProductMix;
