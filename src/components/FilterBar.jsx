import { BRANDS, CATEGORIES } from '../data/mockProducts';

export default function FilterBar({ filters, onChange, showBrandFilter = false }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="filter-bar">
      {showBrandFilter && (
        <select value={filters.brand || ''} onChange={(e) => update('brand', e.target.value)}>
          <option value="">All Brands</option>
          {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      )}
      <select value={filters.category || ''} onChange={(e) => update('category', e.target.value)}>
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={filters.color || ''} onChange={(e) => update('color', e.target.value)}>
        <option value="">All Colors</option>
        {['Black', 'White', 'Gray', 'Navy', 'Beige', 'Brown', 'Green', 'Orange', 'Blue'].map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select value={filters.sort || ''} onChange={(e) => update('sort', e.target.value)}>
        <option value="">Sort by</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
      </select>
    </div>
  );
}
