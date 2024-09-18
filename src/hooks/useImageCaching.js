import { useCallback } from 'react';
import { fetchAndCache, getFromCache } from '../utils/cacheUtils';

const useImageCaching = () => {
  const cacheImage = useCallback(async (url) => {
    try {
      await fetchAndCache('images', url);
    } catch (error) {
      console.error('Error caching image:', url, error);
    }
  }, []);

  const getCachedImage = useCallback(async (url) => {
    try {
      const cachedResponse = await getFromCache('images', url);
      if (cachedResponse) {
        return URL.createObjectURL(await cachedResponse.blob());
      }
    } catch (error) {
      console.error('Error getting cached image:', url, error);
    }
    return url;
  }, []);

  return { cacheImage, getCachedImage };
};

export default useImageCaching;