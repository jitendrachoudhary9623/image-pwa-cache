import { useState, useEffect, useCallback } from 'react';
import config from '../config.json';
import { getCachedOrFetch } from '../utils/cacheUtils';

const useProductFetching = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getCachedOrFetch('products', config.api.products);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, refetchProducts: fetchProducts };
};

export default useProductFetching;