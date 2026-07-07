import { useState } from 'react';

export default function ProductCard({ product, onImageClick, onCartClick, isPickingSize }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`product-card${isPickingSize ? ' picking' : ''}`}>
      <div className="product-card-image-wrapper">
        {product.imageUrl && !imgError ? (
          <img
            className="product-card-image clickable"
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            onError={() => setImgError(true)}
            onClick={() => onImageClick(product.imageUrl, product.title)}
          />
        ) : (
          <div className="product-card-image error">
            <span>Image unavailable</span>
          </div>
        )}
        <button className="product-card-cart-btn" onClick={(e) => { e.stopPropagation(); onCartClick(product); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </button>
      </div>
      <div className="product-card-body">
        <div className="product-card-header">
          <div className="product-card-number">{product.number}</div>
          <span className="product-card-title">{product.title}</span>
          <span className="product-card-price">${product.price}</span>
        </div>
        {product.details && <div className="product-card-details">{product.details}</div>}
        {product.description && <div className="product-card-desc">{product.description}</div>}
        {product.pairingNote && <div className="product-card-desc">{product.pairingNote}</div>}
      </div>
    </div>
  );
}
