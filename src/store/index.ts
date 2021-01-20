import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { CartState } from './modules/cart/types';
import rootReducer from './modules/rootReducer';

export interface State {
  cart: CartState;
}

const store = createStore(rootReducer, composeWithDevTools());

export default store;
