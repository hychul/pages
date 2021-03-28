import { createStore } from 'redux';
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

function configureStore() {
  return createStore(counter);
}

export default configureStore;