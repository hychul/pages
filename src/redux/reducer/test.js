import * as ActionType from 'redux/action';

const initialState = {
  count: 0
}

function testReducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.TEST_INCREMENT:
      return {
        count: state.count + 1
      }
    case ActionType.TEST_DECREMENT:
      return {
        count: state.count - 1
      }
    default:
      return state;
  }
}

export default testReducer;