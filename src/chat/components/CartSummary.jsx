export default function CartSummary({ data }) {
  return (
    <div className="cart-summary">
      <div className="cart-header">
        <h3>Order Summary</h3>
        <span className="cart-item-count">{data.items.length} {data.items.length === 1 ? 'item' : 'items'}</span>
      </div>
      <div className="cart-items">
        {data.items.map((item, i) => (
          <div className="cart-item" key={i}>
            <div className="cart-item-left">
              <span className="cart-item-name">{item.name}</span>
              {item.size && <span className="cart-item-size">Size {item.size}</span>}
            </div>
            <span className="cart-item-price">${item.price}</span>
          </div>
        ))}
      </div>
      {(data.totals.subtotal || data.totals.total) && (
        <div className="cart-totals">
          {data.totals.subtotal && (
            <div className="cart-total-row">
              <span>Subtotal</span>
              <span>${data.totals.subtotal}</span>
            </div>
          )}
          {data.totals.tax && (
            <div className="cart-total-row">
              <span>Tax (8%)</span>
              <span>${data.totals.tax}</span>
            </div>
          )}
          {data.totals.shipping && (
            <div className="cart-total-row">
              <span>Shipping</span>
              <span>{data.totals.shipping}</span>
            </div>
          )}
          {data.totals.total && (
            <div className="cart-total-row final">
              <span>Total</span>
              <span>${data.totals.total}</span>
            </div>
          )}
        </div>
      )}
      {data.payment && (
        <div className="cart-payment">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          <span>{data.payment}</span>
        </div>
      )}
    </div>
  );
}
