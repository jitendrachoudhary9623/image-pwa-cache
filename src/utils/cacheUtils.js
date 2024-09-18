import config from '../config.json';

export const getCacheInstance = async (cacheName) => {
  return await caches.open(config.cacheNames[cacheName]);
};

export const getFromCache = async (cacheName, key) => {
  const cache = await getCacheInstance(cacheName);
  return await cache.match(key);
};

export const putInCache = async (cacheName, key, value) => {
  const cache = await getCacheInstance(cacheName);
  await cache.put(key, value);
};

export const fetchAndCache = async (cacheName, url) => {
  try {
    const response = await fetch(url);
    const responseClone = response.clone();
    await putInCache(cacheName, url, responseClone);
    return response;
  } catch (error) {
    console.error('Error fetching and caching:', error);
    return null;
  }
};

export const getCachedOrFetch = async (cacheName, url) => {
  const cachedResponse = await getFromCache(cacheName, url);
  if (cachedResponse) {
    return cachedResponse;
  }
  if (!navigator.onLine) {
    throw new Error('Offline and no cached data available');
  }
  return await fetchAndCache(cacheName, url);
};