import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { getProductById, getRelatedProducts } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import ProductGrid from '../components/ProductGrid';
import useProducts from '../data/useProducts';

export default function ProductDetail() {
  const { productId } = useParams();
  const { loading } = useProducts();
  const product = getProductById(productId);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (loading) return <div className="page"><div className="empty-state">Loading...</div></div>;

  if (!product) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Product not found</h2>
          <Link to="/">Back to Home</Link>
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
      <div className="pdp">
        <div className="pdp-image">
          {!imgError ? (
            <img src={product.image_url} alt={product.title} onError={() => setImgError(true)} />
          ) : (
            <div className="pdp-placeholder">{product.title}</div>
          )}
        </div>
        <div className="pdp-info">
          <Link to={`/brand/${encodeURIComponent(product.brand)}`} className="pdp-brand">{product.brand}</Link>
          <h1 className="pdp-title">{product.title}</h1>
          <span className="pdp-price">${product.price.toFixed(2)}</span>

          <div className="pdp-meta">
            <span>{product.color}</span>
            <span>·</span>
            <span>{product.style_vibe}</span>
            <span>·</span>
            <span>{product.in_stock ? 'In Stock' : 'Out of Stock'}</span>
          </div>

          <p className="pdp-desc">{product.description}</p>

          <div className="pdp-sizes">
            <span className="pdp-label">Size</span>
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
            {added ? 'Added to Cart ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <h2 className="section-title">You might also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
