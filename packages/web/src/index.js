import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import { install as installReduxLoop } from 'redux-loop';
import { save as saveRedux } from "redux-localstorage-simple";

import './stylesheets/tailwind.css';
import './stylesheets/loading.css';
import './stylesheets/buy-me-a-coffee.css';

import reducers from './reducers';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import App from './components/App';

/** @ts-ignore */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  /** @type {any} */(reducers),
  composeEnhancers(
    installReduxLoop({ ENABLE_THUNK_MIGRATION: true }), applyMiddleware(saveRedux()),
  )
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
