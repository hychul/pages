import { combineReducers } from 'redux';
import postListReducer from './post';
import testReducer from './test';

export default combineReducers({
  posts: postListReducer, 
  test: testReducer
});
