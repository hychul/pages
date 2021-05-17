import { combineReducers } from 'redux';
import postReducer from './post';
import tagReducer from './tag';
import testReducer from './test';

export default combineReducers({
  posts: postReducer,
  tags: tagReducer,
  test: testReducer
});
