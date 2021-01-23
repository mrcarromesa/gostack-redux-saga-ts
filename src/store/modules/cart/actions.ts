import {
  ActionPayload, ActionPayloadFailure, ActionTypes, Product,
} from './types';

export const addProductToCartReequest = (product: Product): ActionPayload => ({
  type: ActionTypes.addProductToCartReequest,
  payload: {
    product,
  },
});

export const addProductToCartSuccess = (product: Product): ActionPayload => ({
  type: ActionTypes.addProductToCartSuccess,
  payload: {
    product,
  },
});

export const addProductToCartFailure = (productId: number): ActionPayloadFailure => ({
  type: ActionTypes.addProductToCartFailure,
  payload: {
    product: {
      id: productId,
    },
  },
});
