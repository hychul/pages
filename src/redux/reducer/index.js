import { combineReducers } from 'redux';
import postListReducer from './postList';
import testReducer from './test';

export default combineReducers({
  posts: postListReducer, 
  test: testReducer
})
