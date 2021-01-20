import React, { useCallback, useEffect, useState } from 'react';
import api from '~/services/api';
import { Product } from '~/store/modules/cart/types';
import CatalogItem from '../CatalogItem';

const Catalog: React.FC = () => {
  const [catalog, setCatalog] = useState<Product[]>([]);

  useEffect(() => {
    const getCatalog = async (): Promise<void> => {
      const { data } = await api.get('products');
      setCatalog(data);
    };

    getCatalog();
  }, []);

  return (
    <main>
      <h1>Catalog</h1>
      {catalog.map((product) => (
        <CatalogItem key={product.id} product={product} />
      ))}
    </main>
  );
};

export default Catalog;
