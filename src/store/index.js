import { createStore } from 'redux';
import * as ActionType from 'action';

function counter(state = 0, action) {
  switch (action.type) {
    case ActionType.TEST_INCREMENT:
      return state + 1;
    case ActionType.TEST_DECREMENT:
      return state - 1;
    default:
      return state;
  }
}

function configureStore() {
  return createStore(counter);
}

export default configureStore;