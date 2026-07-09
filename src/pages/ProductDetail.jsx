import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { getProductById, getRelatedProducts } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import ProductGrid from '../components/ProductGrid';
import BrandLogo from '../components/BrandLogo';
import useProducts from '../data/useProducts';

export default function ProductDetail() {
  const { productId } = useParams();
  const { loading } = useProducts();
  const product = getProductById(productId);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (loading) {
    return (
      <div className="page">
        <div className="pdp pdp-skeleton">
          <div className="skeleton skeleton-pdp-img" />
          <div className="pdp-info">
            <div className="skeleton skeleton-line" style={{ width: '30%' }} />
            <div className="skeleton skeleton-line" style={{ width: '80%', height: 28 }} />
            <div className="skeleton skeleton-line" style={{ width: '40%', height: 22 }} />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" style={{ width: '70%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <div className="empty-state">
          <svg className="empty-illo" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
            <path d="M42 46l36 36M78 46l-36 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          </svg>
          <h2>Product not found</h2>
          <p>We couldn't locate that item. It may have been removed.</p>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const related = getRelatedProducts(product);

  function handleAddToCart() {
    if (!selectedSize) return;
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/brand/${encodeURIComponent(product.brand)}`}>{product.brand}</Link>
        <span aria-hidden="true">/</span>
        <span className="breadcrumb-current">{product.title}</span>
      </nav>
      <div className="pdp">
        <div className="pdp-image">
          {!imgError ? (
            <img src={product.image_url} alt={product.title} onError={() => setImgError(true)} />
          ) : (
            <div className="pdp-placeholder">{product.title}</div>
          )}
        </div>
        <div className="pdp-info">
          <Link to={`/brand/${encodeURIComponent(product.brand)}`} className="pdp-brand">
            <BrandLogo brand={product.brand} size="md" variant="on-light" />
          </Link>
          <h1 className="pdp-title">{product.title}</h1>
          <span className="pdp-price">${product.price.toFixed(2)}</span>

          <div className="pdp-meta">
            <span className="pdp-meta-pill">{product.color}</span>
            <span className="pdp-meta-pill">{product.style_vibe}</span>
            <span className={`pdp-meta-pill ${product.in_stock ? 'in-stock' : 'oos'}`}>
              <span className="dot" aria-hidden="true" />
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <p className="pdp-desc">{product.description}</p>

          <div className="pdp-sizes">
            <div className="pdp-sizes-label">
              <span className="pdp-label">Size</span>
              <a href="#size-guide" onClick={(e) => e.preventDefault()} className="pdp-size-guide">Size guide</a>
            </div>
            <div className="size-options">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={`size-btn${selectedSize === s ? ' active' : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            className={`add-to-cart-btn${added ? ' added' : ''}`}
            onClick={handleAddToCart}
            disabled={!selectedSize}
          >
            <span className="atc-label">
              {added ? 'Added to Cart' : selectedSize ? 'Add to Cart' : 'Select a size'}
            </span>
            {added && (
              <svg className="atc-check" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M4 12l6 6L20 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <div className="pdp-perks">
            <div className="pdp-perk">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>Free shipping</span>
            </div>
            <div className="pdp-perk">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 019-9 9 9 0 016.4 2.7L21 8" /><polyline points="21 3 21 8 16 8" /><path d="M21 12a9 9 0 01-9 9 9 9 0 01-6.4-2.7L3 16" /><polyline points="3 21 3 16 8 16" />
              </svg>
              <span>30-day returns</span>
            </div>
            <div className="pdp-perk">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
              </svg>
              <span>Authentic</span>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section reveal">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">More like this</span>
              <h2 className="section-title">You might also like</h2>
            </div>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
