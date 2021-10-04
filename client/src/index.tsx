import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './Routes';
import { Router } from 'react-router-dom';
import history from './history'

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}><Routes /></Router>
  </React.StrictMode>,
  document.getElementById('root')
);
