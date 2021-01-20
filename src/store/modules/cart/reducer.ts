import { Reducer } from 'react';
import produce from 'immer';
import { CartState, Product } from './types';

const INITIAL_STATE: CartState = {
  items: [],
};

interface ActionPayload {
  type: string;
  payload: {
    product: Product
  }
}

const cart: Reducer<CartState, ActionPayload> = (state = INITIAL_STATE, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'ADD_PRODUCT_TO_CART': {
        const { product } = action.payload;

        const productInCartIndex = draft.items.findIndex((item) => item.product.id === product.id);

        if (productInCartIndex >= 0) {
          draft.items[productInCartIndex].quantity += 1;
        } else {
          draft.items.push({
            product,
            quantity: 1,
          });
        }

        break;
      }
      default: {
        return draft;
      }
    }
    return draft;
  });
};

export default cart;
