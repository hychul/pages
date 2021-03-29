import { combineReducers } from 'redux';
import * as ActionType from 'redux/action';

const initialState = {
  test: 0
}

function testReducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.TEST_INCREMENT:
      state.test++;
      break;
    case ActionType.TEST_DECREMENT:
      state.test--;
      break;
    default:
      break;
  }

  return state;
}

export default combineReducers({
  test: testReducer
})
