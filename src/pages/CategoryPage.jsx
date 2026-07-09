import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import ProductGrid from '../components/ProductGrid';
import FilterBar from '../components/FilterBar';
import useProducts from '../data/useProducts';

export default function CategoryPage() {
  const { categoryName } = useParams();
  const { products, loading } = useProducts();
  const [filters, setFilters] = useState({});

  const category = decodeURIComponent(categoryName);

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.subcategory === category);
    if (filters.brand) result = result.filter((p) => p.brand === filters.brand);
    if (filters.color) result = result.filter((p) => p.color.toLowerCase().includes(filters.color.toLowerCase()));
    if (filters.sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [products, category, filters]);

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
      <header className="page-hero reveal">
        <span className="page-hero-eyebrow">Category</span>
        <h1 className="page-hero-title">{category}</h1>
        <span className="page-hero-count">{filtered.length} items</span>
      </header>
      <FilterBar filters={filters} onChange={setFilters} showBrandFilter />
      <ProductGrid products={filtered.slice(0, 40)} />
    </div>
  );
}
