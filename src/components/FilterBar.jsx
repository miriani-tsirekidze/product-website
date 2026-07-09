import { BRANDS, CATEGORIES } from '../data/mockProducts';

const COLORS = ['Black', 'White', 'Gray', 'Navy', 'Beige', 'Brown', 'Green', 'Orange', 'Blue'];

function Chip({ icon, active, children }) {
  return (
    <div className={`filter-chip${active ? ' is-active' : ''}`}>
      <span className="filter-chip-icon" aria-hidden="true">{icon}</span>
      {children}
      <span className="filter-chip-caret" aria-hidden="true">▾</span>
    </div>
  );
}

export default function FilterBar({ filters, onChange, showBrandFilter = false }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="filter-bar">
      {showBrandFilter && (
        <Chip icon="✦" active={!!filters.brand}>
          <select value={filters.brand || ''} onChange={(e) => update('brand', e.target.value)}>
            <option value="">All Brands</option>
            {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </Chip>
      )}
      <Chip icon="◇" active={!!filters.category}>
        <select value={filters.category || ''} onChange={(e) => update('category', e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Chip>
      <Chip icon="●" active={!!filters.color}>
        <select value={filters.color || ''} onChange={(e) => update('color', e.target.value)}>
          <option value="">All Colors</option>
          {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Chip>
      <Chip icon="↕" active={!!filters.sort}>
        <select value={filters.sort || ''} onChange={(e) => update('sort', e.target.value)}>
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </Chip>
    </div>
  );
}
