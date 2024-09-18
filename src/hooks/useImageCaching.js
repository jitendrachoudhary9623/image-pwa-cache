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
      if (!navigator.onLine) {
        console.warn('Offline and image not cached:', url);
        return null;
      }
      await cacheImage(url);
      return url;
    } catch (error) {
      console.error('Error getting cached image:', url, error);
      return null;
    }
  }, [cacheImage]);

  return { cacheImage, getCachedImage };
};

export default useImageCaching;