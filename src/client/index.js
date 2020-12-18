import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import './css/common.scss';

/* export default (() => {
  if (!global || !global._babelPolyfill) {
    require('babel-polyfill');
  }
})(); */

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
