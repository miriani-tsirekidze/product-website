import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import ProductGrid from '../components/ProductGrid';
import FilterBar from '../components/FilterBar';
import useProducts from '../data/useProducts';

export default function BrandPage() {
  const { brandName } = useParams();
  const { products, loading } = useProducts();
  const [filters, setFilters] = useState({});

  const filtered = useMemo(() => {
    const brand = decodeURIComponent(brandName);
    let result = products.filter((p) => p.brand === brand);
    if (filters.category) result = result.filter((p) => p.subcategory === filters.category);
    if (filters.color) result = result.filter((p) => p.color.toLowerCase().includes(filters.color.toLowerCase()));
    if (filters.sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [products, brandName, filters]);

  if (loading) return <div className="page"><div className="empty-state">Loading...</div></div>;

  return (
    <div className="page">
      <h1 className="page-title">{decodeURIComponent(brandName)}</h1>
      <FilterBar filters={filters} onChange={setFilters} />
      <ProductGrid products={filtered.slice(0, 40)} />
    </div>
  );
}
