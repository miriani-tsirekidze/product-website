import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="cart-item">
      <Link to={`/product/${item.id}`} className="cart-item-img">
        <img src={item.image_url} alt={item.title} />
      </Link>
      <div className="cart-item-details">
        <div className="cart-item-brand"><BrandLogo brand={item.brand} size="sm" variant="on-light" /></div>
        <Link to={`/product/${item.id}`} className="cart-item-title">{item.title}</Link>
        <span className="cart-item-meta">Size {item.size} · {item.color}</span>
        <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
      </div>
      <div className="cart-item-actions">
        <div className="qty-control">
          <button aria-label="Decrease quantity" onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
          <span className="qty-value">{item.quantity}</span>
          <button aria-label="Increase quantity" onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>+</button>
        </div>
        <button className="cart-item-remove" onClick={() => removeItem(item.id, item.size)} aria-label="Remove item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
}
