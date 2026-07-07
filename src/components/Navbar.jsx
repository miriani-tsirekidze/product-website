import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { BRANDS, CATEGORIES } from '../data/mockProducts';

export default function Navbar() {
  const { itemCount } = useCart();
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">DEMO BOUTIQUE</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <div className="dropdown" onMouseEnter={() => setBrandsOpen(true)} onMouseLeave={() => setBrandsOpen(false)}>
          <button className="dropdown-trigger">Brands</button>
          {brandsOpen && (
            <div className="dropdown-menu">
              {BRANDS.map((b) => (
                <button key={b} onClick={() => { navigate(`/brand/${encodeURIComponent(b)}`); setBrandsOpen(false); }}>{b}</button>
              ))}
            </div>
          )}
        </div>
        <div className="dropdown" onMouseEnter={() => setCatsOpen(true)} onMouseLeave={() => setCatsOpen(false)}>
          <button className="dropdown-trigger">Categories</button>
          {catsOpen && (
            <div className="dropdown-menu">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => { navigate(`/category/${encodeURIComponent(c)}`); setCatsOpen(false); }}>{c}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Link to="/cart" className="navbar-cart">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
      </Link>
    </nav>
  );
}
