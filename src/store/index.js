import { createStore } from 'redux';
import reducer from 'reducer';

function configureStore() {
  return createStore(reducer);
}

export default configureStore;