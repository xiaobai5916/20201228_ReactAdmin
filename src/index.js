/*
 入口js
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// 将App组件标签渲染到index页面的div上
ReactDOM.render(<App />, document.getElementById('root'));