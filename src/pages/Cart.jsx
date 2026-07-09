import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { items, subtotal, tax, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <svg className="empty-illo" viewBox="0 0 120 120" aria-hidden="true">
            <path d="M30 40 h60 l-6 60 a4 4 0 0 1-4 4 H40 a4 4 0 0 1-4-4 z"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M45 40 v-8 a15 15 0 0 1 30 0 v8"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="48" cy="58" r="2.5" fill="currentColor" />
            <circle cx="72" cy="58" r="2.5" fill="currentColor" />
          </svg>
          <h2>Your cart is empty</h2>
          <p>Add pieces you love and they'll show up here.</p>
          <Link to="/" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-hero reveal">
        <span className="page-hero-eyebrow">Bag</span>
        <h1 className="page-hero-title">Shopping Cart</h1>
        <span className="page-hero-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
      </header>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem key={`${item.id}-${item.size}`} item={item} />
          ))}
        </div>
        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span className="pill-free">Free</span></div>
          <div className="summary-divider" />
          <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <Link to="/checkout" className="btn-primary full-width">
            Proceed to Checkout
            <span className="btn-arrow-icon" aria-hidden="true">→</span>
          </Link>
          <ul className="cart-trust">
            <li>✦ Free shipping on every order</li>
            <li>✦ 30-day easy returns</li>
            <li>✦ Secure encrypted checkout</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
