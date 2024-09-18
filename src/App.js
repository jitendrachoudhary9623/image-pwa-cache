import React, { useEffect, useState } from 'react';
import './App.css';
import useOnlineStatus from './hooks/useOnlineStatus';
import useProductFetching from './hooks/useProductFetching';
import useImageCaching from './hooks/useImageCaching';
import config from './config.json';

function App() {
  const isOnline = useOnlineStatus();
  const { products, isLoading, error, refetchProducts } = useProductFetching();
  const { cacheImage, getCachedImage } = useImageCaching();
  const [logoUrl, setLogoUrl] = useState(config.images.logo);

  useEffect(() => {
    if (isOnline) {
      refetchProducts();
    }
  }, [isOnline, refetchProducts]);

  useEffect(() => {
    const cacheImages = async () => {
      // Cache the logo
      await cacheImage(config.images.logo);
      // Cache product images
      products.forEach(product => cacheImage(product.image));
    };
    
    if (isOnline) {
      cacheImages();
    }
  }, [isOnline, products, cacheImage]);

  useEffect(() => {
    const updateLogoUrl = async () => {
      const cachedLogoUrl = await getCachedImage(config.images.logo);
      if (cachedLogoUrl) {
        setLogoUrl(cachedLogoUrl);
      }
    };
    updateLogoUrl();
  }, [getCachedImage]);

  const getImage = async (url) => {
    const cachedUrl = await getCachedImage(url);
    return cachedUrl || url;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img 
          src={logoUrl}
          alt="BharatGo Logo" 
          className="App-logo" 
        />
        <h1>Offline-Capable Store</h1>
        <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
      </header>
      <main>
        {isLoading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.title}
                  onError={async (e) => {
                    e.target.src = await getImage(product.image);
                  }}
                />
                <h3>{product.title}</h3>
                <p>${product.price}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
