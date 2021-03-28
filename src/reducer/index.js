import * as ActionType from 'action';

function reducer(state = 0, action) {
  switch (action.type) {
    case ActionType.TEST_INCREMENT:
      return state + 1;
    case ActionType.TEST_DECREMENT:
      return state - 1;
    default:
      return state;
  }
}

export default reducer;
