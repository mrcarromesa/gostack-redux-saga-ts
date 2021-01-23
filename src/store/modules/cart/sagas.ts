import { AxiosResponse } from 'axios';
import {
  all, call, CallEffect, put, PutEffect, select, SelectEffect, takeLatest,
} from 'redux-saga/effects';
import api from '~/services/api';
import { State } from '~/store';
import { addProductToCartFailure, addProductToCartReequest, addProductToCartSuccess } from './actions';
import { ActionPayloadFailure, ActionTypes } from './types';

type CheckProductStockRequest = ReturnType<typeof addProductToCartReequest>;

interface StockResponse {
  id: number;
  quantity: number;
}

function* checkProductStock({ payload }: CheckProductStockRequest): Generator<SelectEffect
| CallEffect<unknown> | PutEffect<ActionPayloadFailure>,
void, number & AxiosResponse<StockResponse>> {
  const { product } = payload;

  const currentQuantity: number = yield select((state: State) => {
    return state.cart.items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  });

  const availableStockResponse: AxiosResponse<StockResponse> = yield call(api.get, `stock/${product.id}`);

  if (availableStockResponse.data.quantity > currentQuantity) {
    yield put(addProductToCartSuccess(product));
  } else {
    yield put(addProductToCartFailure(product.id));
  }
}

export default all([
  takeLatest(ActionTypes.addProductToCartReequest, checkProductStock),
]);
