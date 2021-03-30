import { TEST_DECREMENT, TEST_INCREMENT } from "redux/action";

const initialState = {
  count: 0
}

function testReducer(state = initialState, action) {
  switch (action.type) {
    case TEST_INCREMENT:
      return {
        count: state.count + 1
      }
    case TEST_DECREMENT:
      return {
        count: state.count - 1
      }
    default:
      return state;
  }
}

export default testReducer;
