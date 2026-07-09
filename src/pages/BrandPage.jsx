import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import ProductGrid from '../components/ProductGrid';
import FilterBar from '../components/FilterBar';
import BrandLogo from '../components/BrandLogo';
import { BRAND_ACCENT } from '../utils/brandLogo';
import useProducts from '../data/useProducts';

export default function BrandPage() {
  const { brandName } = useParams();
  const { products, loading } = useProducts();
  const [filters, setFilters] = useState({});

  const brand = decodeURIComponent(brandName);

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.brand === brand);
    if (filters.category) result = result.filter((p) => p.subcategory === filters.category);
    if (filters.color) result = result.filter((p) => p.color.toLowerCase().includes(filters.color.toLowerCase()));
    if (filters.sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [products, brand, filters]);

  if (loading) {
    return (
      <div className="page">
        <div className="page-hero-skeleton">
          <div className="skeleton skeleton-line skeleton-page-title" />
        </div>
        <div className="skeleton-grid">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton skeleton-card" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header
        className="brand-hero reveal"
        style={{ '--brand-accent': BRAND_ACCENT[brand] || 'var(--accent-dark)' }}
      >
        <div className="brand-hero-bg" aria-hidden="true" />
        <span className="brand-hero-eyebrow">Brand</span>
        <div className="brand-hero-logo">
          <BrandLogo brand={brand} size="xl" variant="color" />
          <h1 className="visually-hidden">{brand}</h1>
        </div>
        <span className="brand-hero-count">{filtered.length} pieces available</span>
      </header>
      <FilterBar filters={filters} onChange={setFilters} />
      <ProductGrid products={filtered.slice(0, 40)} />
    </div>
  );
}
