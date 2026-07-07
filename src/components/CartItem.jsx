import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="cart-item">
      <Link to={`/product/${item.id}`} className="cart-item-img">
        <img src={item.image_url} alt={item.title} />
      </Link>
      <div className="cart-item-details">
        <Link to={`/product/${item.id}`} className="cart-item-title">{item.title}</Link>
        <span className="cart-item-meta">{item.brand} · Size {item.size} · {item.color}</span>
        <span className="cart-item-price">${item.price.toFixed(2)}</span>
      </div>
      <div className="cart-item-actions">
        <div className="qty-control">
          <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>+</button>
        </div>
        <button className="cart-item-remove" onClick={() => removeItem(item.id, item.size)}>Remove</button>
      </div>
    </div>
  );
}
