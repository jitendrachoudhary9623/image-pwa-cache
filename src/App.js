import React, { useEffect } from 'react';
import './App.css';
import useOnlineStatus from './hooks/useOnlineStatus';
import useProductFetching from './hooks/useProductFetching';
import useImageCaching from './hooks/useImageCaching';
import config from './config.json';

function App() {
  const isOnline = useOnlineStatus();
  const { products, isLoading, refetchProducts } = useProductFetching();
  const { cacheImage, getCachedImage } = useImageCaching();

  useEffect(() => {
    if (isOnline) {
      refetchProducts();
    }
  }, [isOnline, refetchProducts]);

  useEffect(() => {
    // Cache the logo
    cacheImage(config.images.logo);
    // Cache product images
    products.forEach(product => cacheImage(product.image));
  }, [products, cacheImage]);

  const getImage = async (url) => {
    return isOnline ? url : await getCachedImage(url);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img 
          src={config.images.logo} 
          alt="BharatGo Logo" 
          className="App-logo" 
          onError={async (e) => {
            e.target.src = await getImage(config.images.logo);
          }}
        />
        <h1>Offline-Capable Store</h1>
        <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
      </header>
      <main>
        {isLoading ? (
          <p>Loading products...</p>
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
