import { Product } from './types';

const addProductToCart = (product: Product): unknown => ({
  type: 'ADD_PRODUCT_TO_CART',
  payload: {
    product,
  },
});

export { addProductToCart };
