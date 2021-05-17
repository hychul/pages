import { combineReducers } from 'redux';
import postReducer from './post';
import testReducer from './test';

export default combineReducers({
  posts: postReducer,
  test: testReducer
});
