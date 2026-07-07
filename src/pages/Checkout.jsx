import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, subtotal, tax, total, clearCart } = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber] = useState(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);

  if (confirmed) {
    return (
      <div className="page">
        <div className="confirmation">
          <div className="confirmation-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p className="order-number">Order #{orderNumber}</p>
          <p>Your items will ship within 3-5 business days.</p>
          <Link to="/" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Nothing to checkout</h2>
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
      <h1 className="page-title">Checkout</h1>
      <div className="checkout-layout">
        <div className="checkout-form">
          <h3>Shipping Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" defaultValue="John Doe" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" defaultValue="john@example.com" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" defaultValue="123 Fashion Street, New York, NY 10001" />
          </div>

          <h3>Payment</h3>
          <div className="payment-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <span>Visa ending in 4242</span>
          </div>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="checkout-item">
              <span>{item.title} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>Free</span></div>
          <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button className="btn-primary full-width" onClick={handlePlaceOrder}>Place Order</button>
        </div>
      </div>
    </div>
  );
}
