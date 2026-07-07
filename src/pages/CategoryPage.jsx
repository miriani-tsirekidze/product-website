import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import ProductGrid from '../components/ProductGrid';
import FilterBar from '../components/FilterBar';
import useProducts from '../data/useProducts';

export default function CategoryPage() {
  const { categoryName } = useParams();
  const { products, loading } = useProducts();
  const [filters, setFilters] = useState({});

  const filtered = useMemo(() => {
    const category = decodeURIComponent(categoryName);
    let result = products.filter((p) => p.subcategory === category);
    if (filters.brand) result = result.filter((p) => p.brand === filters.brand);
    if (filters.color) result = result.filter((p) => p.color.toLowerCase().includes(filters.color.toLowerCase()));
    if (filters.sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [products, categoryName, filters]);

  if (loading) return <div className="page"><div className="empty-state">Loading...</div></div>;

  return (
    <div className="page">
      <h1 className="page-title">{decodeURIComponent(categoryName)}</h1>
      <FilterBar filters={filters} onChange={setFilters} showBrandFilter />
      <ProductGrid products={filtered.slice(0, 40)} />
    </div>
  );
}
