import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';


function Influencer() {
  const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    country: Yup.string()
      .required('Country is required'),
    phone: Yup.string()
      .required('Phone is required'),
    product: Yup.string()
      .required('Product is required')
  });


  return (
    <Grid container className="influencer-page wraper three">
      {/* <Grid item md={9} className="greeting-content2">
        <div style={{margin: '600px 0'}}></div>
      </Grid> */}
      <Grid container className="main-title wraper five">
        <Grid container justify="center" className="first-title">Request demo</Grid>
        <Grid container justify="center" className="second-title">Let's get started together and see what we can do for you</Grid>
      </Grid>

      <Grid container xs={6} />
      <Grid container xs={6}>
        <Grid container xs={4}>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              country: '',
              blogType: '',
              phone: '',
              product: '',
              agreement: ''
            }}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
              // same shape as initial values
              console.log(values);
            }}
          >
            {({ errors, touched }) => (
              <Form className="userInfo-form">
                <label htmlFor="firstName" style={{ display: 'block' }}>
                              FirstName*
                </label>
                <Field name="firstName" type="text" id="firstName" />
                {errors.firstName && touched.firstName ? (
                  <div className="error-message">{errors.firstName}</div>
                ) : null}
                <label htmlFor="lastName" style={{ display: 'block' }}>
                              LastName*
                </label>
                <Field name="lastName" type="text" />
                {errors.lastName && touched.lastName ? (
                  <div className="error-message">{errors.lastName}</div>
                ) : null}
                <label htmlFor="email" style={{ display: 'block' }}>
                              Email
                </label>
                <Field name="email" type="email" />
                {errors.email && touched.email ? <div className="error-message">{errors.email}</div> : null}
                <label htmlFor="country" style={{ display: 'block' }}>
                              Country
                </label>
                <Field name="country" as="select" placeholder="Favorite Color">
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="" label="Select a country" />
                </Field>
                <label htmlFor="phone" style={{ display: 'block' }}>
                              Phone
                </label>
                <Field name="phone" type="text" />
                {errors.phone && touched.phone ? <div className="error-message">{errors.phone}</div> : null}
                <label htmlFor="product" style={{ display: 'block' }}>
                              Product
                </label>
                <Field name="product" type="text" />
                {errors.product && touched.product ? <div className="error-message">{errors.product}</div> : null}

                <label className="agreement-label">
                  <Field type="checkbox" name="isAwesome" />
                              I agree to receive communication from Matchmade
                </label>


              </Form>
            )}
          </Formik>
        </Grid>
        <Grid container xs={12}>
          <div className="policy">
              You may unsubscribe from these communications at any time. For more infomation see our <span>Privacy policy</span>
            <br />
                  By clicking submit below, you consent to allow Matchmade to store and process the personal information submitted above to provide you the content requested.
          </div>
        </Grid>
        <Grid container xs={12}>
          <button className="submit-button" type="submit">Submit</button>
        </Grid>
      </Grid>


    </Grid>
  );
}

export default Influencer;
