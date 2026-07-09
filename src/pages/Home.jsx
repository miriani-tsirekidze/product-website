import { Link } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import BrandLogo from '../components/BrandLogo';
import { BRANDS, CATEGORIES } from '../data/mockProducts';
import { BRAND_ACCENT } from '../utils/brandLogo';
import useProducts from '../data/useProducts';

const DRAG_THRESHOLD = 6;
const CAT_SPEED = 30;

function useCategoryMarquee() {
  const [track, setTrack] = useState(null);
  const trackRef = useCallback((node) => setTrack(node), []);
  const stateRef = useRef({
    offset: 0,
    half: 0,
    dragging: false,
    dragMoved: false,
    startX: 0,
    startOffset: 0,
    pointerId: null,
  });

  useEffect(() => {
    if (!track) return undefined;
    const state = stateRef.current;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const speed = reduced ? 0 : CAT_SPEED;

    state.offset = 0;
    state.dragging = false;
    state.dragMoved = false;

    const measure = () => { state.half = track.scrollWidth / 2; };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const wrap = () => {
      if (!state.half) return;
      while (state.offset <= -state.half) state.offset += state.half;
      while (state.offset > 0) state.offset -= state.half;
    };

    const onWinMove = (e) => {
      if (!state.dragging || state.pointerId !== e.pointerId) return;
      const dx = e.clientX - state.startX;
      if (Math.abs(dx) > DRAG_THRESHOLD) state.dragMoved = true;
      state.offset = state.startOffset + dx;
      wrap();
    };
    const onWinUp = (e) => {
      if (!state.dragging || (e && state.pointerId !== e.pointerId)) return;
      state.dragging = false;
      state.pointerId = null;
    };
    const onDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      state.dragging = true;
      state.dragMoved = false;
      state.startX = e.clientX;
      state.startOffset = state.offset;
      state.pointerId = e.pointerId;
    };
    const preventDrag = (e) => e.preventDefault();

    track.addEventListener('pointerdown', onDown);
    track.addEventListener('dragstart', preventDrag);
    window.addEventListener('pointermove', onWinMove);
    window.addEventListener('pointerup', onWinUp);
    window.addEventListener('pointercancel', onWinUp);

    let last = 0;
    let raf = requestAnimationFrame(function tick(t) {
      if (!last) last = t;
      const dt = (t - last) / 1000;
      last = t;
      if (!state.dragging && state.half > 0) {
        state.offset -= speed * dt;
        wrap();
      }
      track.style.transform = `translate3d(${state.offset}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('dragstart', preventDrag);
      window.removeEventListener('pointermove', onWinMove);
      window.removeEventListener('pointerup', onWinUp);
      window.removeEventListener('pointercancel', onWinUp);
    };
  }, [track]);

  const onLinkClick = (e) => {
    if (stateRef.current.dragMoved) {
      e.preventDefault();
      stateRef.current.dragMoved = false;
    }
  };

  return { trackRef, onLinkClick };
}

function HomeSkeleton() {
  return (
    <div>
      <section className="hero hero-skeleton">
        <div className="hero-inner">
          <div className="hero-text">
            <div className="skeleton skeleton-line skeleton-hero-title" />
            <div className="skeleton skeleton-line skeleton-hero-title" />
            <div className="skeleton skeleton-line skeleton-hero-title short" />
            <div className="skeleton skeleton-line skeleton-hero-p" />
          </div>
          <div className="hero-images">
            <div className="skeleton skeleton-hero-img" />
            <div className="skeleton skeleton-hero-img" />
            <div className="skeleton skeleton-hero-img" />
          </div>
        </div>
      </section>
      <div className="page">
        <div className="skeleton-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { products, loading } = useProducts();
  const catMarquee = useCategoryMarquee();

  if (loading) return <HomeSkeleton />;

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

  const marqueeBrands = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <div>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-eyebrow">Summer '26 · New Season</span>
            <h1>
              <span className="hero-word">STEP INTO THE</span>
              <span className="hero-word">FUTURE OF</span>
              <span className="hero-word hero-word--accent">FASHION</span>
            </h1>
            <div className="hero-right-text">
              <p>Trendsetting styles from five iconic brands — timeless classics to bold streetwear, curated in one place.</p>
              <Link to="/brand/Mango" className="btn-arrow">
                SHOP NEW ARRIVALS <span>→</span>
              </Link>
            </div>
          </div>
          <div className="hero-images">
            <img src={heroImg1} alt="" className="hero-img hero-img--1" />
            <img src={heroImg2} alt="" className="hero-img hero-img--2" />
            <img src={heroImg3} alt="" className="hero-img hero-img--3" />
            <span className="hero-badge" aria-hidden="true">
              <span className="hero-badge-inner">
                <span>NEW · DROPS · WEEKLY · </span>
                <span>NEW · DROPS · WEEKLY · </span>
              </span>
            </span>
          </div>
        </div>
      </section>

      <section className="marquee" aria-label="Featured brands">
        <div className="marquee-track">
          {marqueeBrands.map((b, i) => (
            <span key={`${b}-${i}`} className="marquee-item">
              <BrandLogo brand={b} size="lg" variant="on-light" />
            </span>
          ))}
        </div>
      </section>

      <div className="page">
        <section className="section reveal">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Discover</span>
              <h2 className="section-title">Shop by Brand</h2>
            </div>
            <span className="section-subtitle">{BRANDS.length} iconic labels</span>
          </div>
          <div className="brand-grid">
            {BRANDS.map((brand) => (
              <Link
                key={brand}
                to={`/brand/${encodeURIComponent(brand)}`}
                className="brand-card"
                style={{ '--brand-accent': BRAND_ACCENT[brand] }}
              >
                <span className="brand-card-glow" aria-hidden="true" />
                <BrandLogo brand={brand} size="lg" variant="on-dark" />
                <span className="visually-hidden">{brand}</span>
                <span className="brand-card-cta" aria-hidden="true">Shop <span>→</span></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="promo-banner reveal">
          <div className="promo-content">
            <span className="promo-tag">Limited Time</span>
            <h2>Free Shipping on All Orders</h2>
            <p>No minimum purchase required. Shop your favorite brands today.</p>
            <Link to="/brand/Nike" className="btn-arrow btn-arrow--light">
              EXPLORE <span>→</span>
            </Link>
          </div>
          <div className="promo-orbs" aria-hidden="true">
            <span className="orb orb-1" />
            <span className="orb orb-2" />
            <span className="orb orb-3" />
          </div>
        </section>

        <section className="section reveal">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Browse</span>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <span className="section-subtitle">{CATEGORIES.length} categories</span>
          </div>
          <div className="category-marquee">
            <div
              className="category-scroll"
              ref={catMarquee.trackRef}
            >
              {[...CATEGORIES, ...CATEGORIES].map((cat, i) => {
                const isClone = i >= CATEGORIES.length;
                const num = (i % CATEGORIES.length) + 1;
                return (
                  <Link
                    key={`${cat}-${i}`}
                    to={`/category/${encodeURIComponent(cat)}`}
                    className="category-card"
                    onClick={catMarquee.onLinkClick}
                    draggable={false}
                    aria-hidden={isClone ? 'true' : undefined}
                    tabIndex={isClone ? -1 : undefined}
                  >
                    <img src={catImages[cat]} alt="" draggable={false} />
                    <span className="category-tint" aria-hidden="true" />
                    <span className="category-num" aria-hidden="true">{String(num).padStart(2, '0')}</span>
                    <span className="category-ring" aria-hidden="true" />
                    <div className="category-overlay">
                      <span className="category-eyebrow">Collection</span>
                      <span className="category-label">{cat}</span>
                      <span className="category-shop">
                        <span>Shop the drop</span>
                        <span className="category-arrow" aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section reveal">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Hot right now</span>
              <h2 className="section-title">Trending Now</h2>
            </div>
            <Link to="/brand/Mango" className="section-link">View All →</Link>
          </div>
          <ProductGrid products={trending} />
        </section>

        <section className="section reveal">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Fresh drops</span>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link to="/brand/Mango" className="section-link">View All →</Link>
          </div>
          <ProductGrid products={newArrivals} />
        </section>
      </div>
    </div>
  );
}
