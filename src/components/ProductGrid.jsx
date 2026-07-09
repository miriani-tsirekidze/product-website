import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-illo" viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="52" cy="52" r="30" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <line x1="76" y1="76" x2="98" y2="98" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <h2>No products match</h2>
        <p>Try clearing a filter or exploring a different category.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
