import { getBrandLogo, BRAND_ACCENT, BRAND_ASPECT, BRAND_SCALE } from '../utils/brandLogo';

const HEIGHTS = { sm: 14, md: 20, lg: 36, xl: 72 };

export default function BrandLogo({ brand, size = 'md', variant = 'on-light', className = '' }) {
  const src = getBrandLogo(brand);
  if (!src) {
    return <span className={`brand-logo-fallback ${className}`.trim()}>{brand}</span>;
  }
  const baseH = HEIGHTS[size] || HEIGHTS.md;
  const scale = BRAND_SCALE[brand] || 1;
  const h = Math.round(baseH * scale);
  const aspect = BRAND_ASPECT[brand] || 1;
  const w = Math.round(h * aspect);
  const bg =
    variant === 'on-dark' ? '#ffffff'
    : variant === 'color' ? (BRAND_ACCENT[brand] || 'currentColor')
    : 'currentColor';
  const style = {
    display: 'inline-block',
    width: `${w}px`,
    height: `${h}px`,
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    backgroundColor: bg,
    verticalAlign: 'middle',
    flexShrink: 0,
  };
  return (
    <span
      role="img"
      aria-label={brand}
      className={`brand-logo brand-logo--${size} brand-logo--${variant} ${className}`.trim()}
      style={style}
    />
  );
}
