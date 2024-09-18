import { useState, useEffect, useCallback } from 'react';
import config from '../config.json';
import { getCachedOrFetch } from '../utils/cacheUtils';

const useProductFetching = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCachedOrFetch('products', config.api.products);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. You might be offline.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetchProducts: fetchProducts };
};

export default useProductFetching;