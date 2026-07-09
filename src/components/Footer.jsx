import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { BRANDS } from '../data/mockProducts';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brands" aria-label="Brands we stock">
          {BRANDS.map((b) => (
            <Link
              key={b}
              to={`/brand/${encodeURIComponent(b)}`}
              className="footer-brand-link"
              aria-label={b}
            >
              <BrandLogo brand={b} size="md" variant="on-light" />
            </Link>
          ))}
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/">Home</Link>
            <Link to="/category/T-shirts">T-shirts</Link>
            <Link to="/category/Shoes">Shoes</Link>
            <Link to="/category/Outerwear">Outerwear</Link>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <a href="#shipping" onClick={(e) => e.preventDefault()}>Shipping</a>
            <a href="#returns" onClick={(e) => e.preventDefault()}>Returns</a>
            <a href="#faq" onClick={(e) => e.preventDefault()}>FAQ</a>
            <a href="#contact" onClick={(e) => e.preventDefault()}>Contact</a>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <a href="#story" onClick={(e) => e.preventDefault()}>Our story</a>
            <a href="#careers" onClick={(e) => e.preventDefault()}>Careers</a>
            <a href="#press" onClick={(e) => e.preventDefault()}>Press</a>
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
          </div>
          <div className="footer-col footer-brand-block">
            <span className="footer-logo">DEMO BOUTIQUE</span>
            <p className="footer-tagline">Curated pieces from the brands you love.</p>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© Demo project — not a real store</span>
          <span className="footer-legal">Made with care ✦ Handpicked styles ✦ Global shipping</span>
        </div>
      </div>
    </footer>
  );
}
