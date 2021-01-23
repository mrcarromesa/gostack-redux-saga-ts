import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '~/store';
import { addProductToCartReequest } from '~/store/modules/cart/actions';
import { Product } from '~/store/modules/cart/types';

// import { Container } from './styles';

interface CatalogItemProps {
  product: Product;
}

const CatalogItem: React.FC<CatalogItemProps> = ({ product }) => {
  const dispatch = useDispatch();

  const hasFailedStockCheck = useSelector<State, boolean>((state) => {
    return state.cart.failedStockCheck.includes(product.id);
  });

  const handleAddProductToCart = useCallback(() => {
    dispatch(addProductToCartReequest(product));
  }, [dispatch, product]);
  return (
    <article key={product.id}>
      <strong>{product.title}</strong>
      {' - '}
      <span>{product.price}</span>
      {' '}
      <button
        type="button"
        onClick={handleAddProductToCart}
      >
        Comprar

      </button>
      { hasFailedStockCheck && <span style={{ color: 'red' }}>Falta de estoque</span> }
    </article>
  );
};

export default CatalogItem;
