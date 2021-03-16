import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { TEST_DECREMENT, TEST_INCREMENT } from 'action/ActionType';

function counter(state = 0, action) {
  switch (action.type) {
    case TEST_INCREMENT:
      return state + 1;
    case TEST_DECREMENT:
      return state - 1;
    default:
      return state;
  }
}

let store = createStore(counter);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
