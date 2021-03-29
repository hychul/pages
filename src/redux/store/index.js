import { createStore } from 'redux';
import reducer from 'redux/reducer';

function configureStore() {
  return createStore(reducer);
}

export default configureStore;