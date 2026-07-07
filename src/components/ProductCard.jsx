import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-img-wrap">
        {!imgError ? (
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="product-card-placeholder">{product.title}</div>
        )}
      </div>
      <div className="product-card-info">
        <span className="product-card-brand">{product.brand}</span>
        <h3 className="product-card-title">{product.title}</h3>
        <span className="product-card-price">${product.price.toFixed(2)}</span>
      </div>
    </Link>
  );
}
