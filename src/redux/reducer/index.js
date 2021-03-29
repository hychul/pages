import { combineReducers } from 'redux';
import * as ActionType from 'redux/action';

const initialState = {
  count: 0
}

function testReducer(state = initialState, action) {
  let ret = {
    count: 0
  }
  switch (action.type) {
    case ActionType.TEST_INCREMENT:
      ret.count = state.count + 1;
      return ret;
    case ActionType.TEST_DECREMENT:
      ret.count = state.count - 1;
      return ret;
    default:
      return state;
  }
}

export default combineReducers({
  test: testReducer
})
