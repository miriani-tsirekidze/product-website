import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { BRANDS, CATEGORIES } from '../data/mockProducts';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const { itemCount } = useCart();
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="navbar-logo-mark" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 1L19 10L10 19L1 10L10 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <circle cx="10" cy="10" r="2.2" fill="currentColor" />
          </svg>
        </span>
        <span className="navbar-logo-name">Demo</span>
        <span className="navbar-logo-tag" aria-hidden="true">Boutique</span>
        <span className="visually-hidden">Demo Boutique — Home</span>
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <div className="dropdown" onMouseEnter={() => setBrandsOpen(true)} onMouseLeave={() => setBrandsOpen(false)}>
          <button className="dropdown-trigger">Brands</button>
          {brandsOpen && (
            <div className="dropdown-menu">
              {BRANDS.map((b, i) => (
                <button
                  key={b}
                  className="dropdown-item"
                  style={{ '--i': i }}
                  onClick={() => { navigate(`/brand/${encodeURIComponent(b)}`); setBrandsOpen(false); }}
                >
                  <BrandLogo brand={b} size="sm" variant="on-light" />
                  <span className="visually-hidden">{b}</span>
                  <span className="dropdown-item-arrow" aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="dropdown" onMouseEnter={() => setCatsOpen(true)} onMouseLeave={() => setCatsOpen(false)}>
          <button className="dropdown-trigger">Categories</button>
          {catsOpen && (
            <div className="dropdown-menu dropdown-menu--text">
              {CATEGORIES.map((c, i) => (
                <button
                  key={c}
                  className="dropdown-item dropdown-item--text"
                  style={{ '--i': i }}
                  onClick={() => { navigate(`/category/${encodeURIComponent(c)}`); setCatsOpen(false); }}
                >
                  <span>{c}</span>
                  <span className="dropdown-item-arrow" aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Link to="/cart" className="navbar-cart" aria-label={`Cart, ${itemCount} items`}>
        <span className="navbar-cart-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </span>
        {itemCount > 0 && <span key={itemCount} className="cart-badge">{itemCount}</span>}
      </Link>
    </nav>
  );
}
