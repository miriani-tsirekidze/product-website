export default function SuggestionItem({ product, onImageClick, onCartClick, isPickingSize }) {
  return (
    <div className={`suggestion-item${isPickingSize ? ' picking' : ''}`}>
      <div className="suggestion-image-wrapper">
        {product.imageUrl && (
          <img
            className="suggestion-image"
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            onClick={() => onImageClick(product.imageUrl, product.title)}
          />
        )}
        <button className="product-card-cart-btn" onClick={(e) => { e.stopPropagation(); onCartClick(product); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </button>
      </div>
      <div className="suggestion-info">
        <div className="suggestion-title-row">
          <span className="suggestion-title">{product.number}. {product.title}</span>
          <span className="suggestion-price">${product.price}</span>
        </div>
        {product.details && <span className="suggestion-details">{product.details}</span>}
        {product.pairingNote && <span className="suggestion-pairing">{product.pairingNote}</span>}
      </div>
    </div>
  );
}
