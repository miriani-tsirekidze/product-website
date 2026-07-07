import { useState, useEffect } from 'react';
import { loadProducts, isLoaded, getProducts } from './mockProducts';

export default function useProducts() {
  const [products, setProducts] = useState(isLoaded() ? getProducts() : []);
  const [loading, setLoading] = useState(!isLoaded());

  useEffect(() => {
    if (isLoaded()) return;
    loadProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return { products, loading };
}
