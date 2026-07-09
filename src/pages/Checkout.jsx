import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import BrandLogo from '../components/BrandLogo';

export default function Checkout() {
  const { items, subtotal, tax, total, clearCart } = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber] = useState(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);

  if (confirmed) {
    return (
      <div className="page">
        <div className="confirmation">
          <div className="confirmation-icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="72" height="72">
              <circle className="confirm-ring" cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <path className="confirm-check" d="M20 33l9 9 16-18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>Order confirmed</h1>
          <p className="confirm-sub">Thanks — we've received your order.</p>
          <div className="order-number-chip">Order <strong>#{orderNumber}</strong></div>
          <p className="confirm-note">Your pieces will ship within 3–5 business days. A receipt is on the way to your inbox.</p>
          <div className="confirm-actions">
            <Link to="/" className="btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <svg className="empty-illo" viewBox="0 0 120 120" aria-hidden="true">
            <rect x="24" y="30" width="72" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="24" y1="46" x2="96" y2="46" stroke="currentColor" strokeWidth="2.5" />
          </svg>
          <h2>Nothing to checkout</h2>
          <p>Your bag is empty — grab a piece you love first.</p>
          <Link to="/" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  function handlePlaceOrder() {
    setConfirmed(true);
    clearCart();
  }

  return (
    <div className="page">
      <header className="page-hero reveal">
        <span className="page-hero-eyebrow">Almost there</span>
        <h1 className="page-hero-title">Checkout</h1>
      </header>
      <div className="checkout-layout">
        <div className="checkout-form">
          <fieldset className="checkout-fieldset">
            <legend>Shipping Information</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" defaultValue="John Doe" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue="john@example.com" />
              </div>
              <div className="form-group form-group--full">
                <label>Address</label>
                <input type="text" defaultValue="123 Fashion Street, New York, NY 10001" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" defaultValue="New York" />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input type="text" defaultValue="10001" />
              </div>
            </div>
          </fieldset>

          <fieldset className="checkout-fieldset">
            <legend>Payment</legend>
            <div className="payment-card">
              <div className="payment-card-face">
                <div className="payment-card-chip" aria-hidden="true" />
                <div className="payment-card-number">•••• •••• •••• 4242</div>
                <div className="payment-card-meta">
                  <span>John Doe</span>
                  <span>12/29</span>
                </div>
              </div>
              <div className="payment-card-brand" aria-hidden="true">VISA</div>
            </div>
          </fieldset>
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="checkout-item">
                <div className="checkout-item-img" aria-hidden="true">
                  {item.image_url ? <img src={item.image_url} alt="" /> : <span>{item.title[0]}</span>}
                </div>
                <div className="checkout-item-info">
                  <div className="checkout-item-brand"><BrandLogo brand={item.brand} size="sm" variant="on-light" /></div>
                  <div className="checkout-item-title">{item.title}</div>
                  <div className="checkout-item-meta">Size {item.size} · Qty {item.quantity}</div>
                </div>
                <div className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span className="pill-free">Free</span></div>
          <div className="summary-divider" />
          <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button className="btn-primary full-width" onClick={handlePlaceOrder}>
            Place Order
            <span className="btn-arrow-icon" aria-hidden="true">→</span>
          </button>
        </aside>
      </div>
    </div>
  );
}
