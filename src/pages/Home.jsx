import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { BRANDS, CATEGORIES } from '../data/mockProducts';
import useProducts from '../data/useProducts';

export default function Home() {
  const { products, loading } = useProducts();

  if (loading) return <div className="page"><div className="empty-state">Loading...</div></div>;

  const mango = products.filter((p) => p.brand === 'Mango');
  const trending = mango.slice(0, 8);
  const newArrivals = mango.slice(8, 12);

  const heroImg1 = (products.find((p) => p.id === 'MANGO-27038272') || mango[0])?.image_url || '';
  const heroImg2 = (products.find((p) => p.id === 'MANGO-27006713') || mango[1])?.image_url || '';
  const heroImg3 = (products.find((p) => p.id === 'MANGO-27095937') || mango[2])?.image_url || '';

  const catImages = {};
  for (const cat of CATEGORIES) {
    const p = products.find((p) => p.subcategory === cat && p.image_url && p.brand === 'Nike')
      || products.find((p) => p.subcategory === cat && p.image_url);
    catImages[cat] = p?.image_url || `https://via.placeholder.com/400x500/e8e4dc/1a1a1a?text=${encodeURIComponent(cat)}`;
  }

  return (
    <div>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>STEP INTO THE<br />FUTURE OF<br />FASHION</h1>
            <div className="hero-right-text">
              <p>Discover trendsetting styles from H&M, Nike, Zara, Mango, and Pull&Bear — from timeless classics to bold streetwear.</p>
              <Link to="/brand/Mango" className="btn-arrow">
                SHOP NEW ARRIVALS <span>→</span>
              </Link>
            </div>
          </div>
          <div className="hero-images">
            <img src={heroImg1} alt="" className="hero-img" />
            <img src={heroImg2} alt="" className="hero-img" />
            <img src={heroImg3} alt="" className="hero-img" />
          </div>
        </div>
      </section>

      <div className="page">
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Shop by Brand</h2>
            <span className="section-subtitle">{BRANDS.length} brands available</span>
          </div>
          <div className="brand-grid">
            {BRANDS.map((brand) => (
              <Link key={brand} to={`/brand/${encodeURIComponent(brand)}`} className="brand-card">
                <span className="brand-name">{brand}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="promo-banner">
          <div className="promo-content">
            <span className="promo-tag">Limited Time</span>
            <h2>Free Shipping on All Orders</h2>
            <p>No minimum purchase required. Shop your favorite brands today.</p>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className="category-scroll">
            {CATEGORIES.map((cat) => (
              <Link key={cat} to={`/category/${encodeURIComponent(cat)}`} className="category-card">
                <img src={catImages[cat]} alt={cat} />
                <div className="category-overlay">
                  <span>{cat}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Trending Now</h2>
            <Link to="/brand/Mango" className="section-link">View All →</Link>
          </div>
          <ProductGrid products={trending} />
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/brand/Mango" className="section-link">View All →</Link>
          </div>
          <ProductGrid products={newArrivals} />
        </section>
      </div>
    </div>
  );
}
