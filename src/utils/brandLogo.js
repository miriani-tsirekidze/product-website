const LOGOS = {
  'H&M':       '/logos/hm.svg',
  'Nike':      '/logos/nike.svg',
  'Zara':      '/logos/zara.svg',
  'Mango':     '/logos/mango.svg',
  'Pull&Bear': '/logos/pullbear.svg',
};

export const BRAND_ACCENT = {
  'H&M':       '#E50010',
  'Nike':      '#111111',
  'Zara':      '#111111',
  'Mango':     '#FFC72C',
  'Pull&Bear': '#111111',
};

export const BRAND_ASPECT = {
  'H&M':       1.0,
  'Nike':      1.0,
  'Zara':      1.0,
  'Mango':     7.55,
  'Pull&Bear': 6.42,
};

// Optical-size correction: the icon-style marks (Nike swoosh, H&M monogram,
// Zara wordmark) sit inside a 24x24 Simple Icons viewBox with padding, so at a
// given rendered height they look smaller than the tight-cropped Mango and
// Pull&Bear wordmarks. Boost the icon-style marks so all brands feel balanced.
export const BRAND_SCALE = {
  'H&M':       1.9,
  'Nike':      1.9,
  'Zara':      1.9,
  'Mango':     1.0,
  'Pull&Bear': 1.0,
};

export function getBrandLogo(brand) {
  return LOGOS[brand] || null;
}

export function hasBrandLogo(brand) {
  return brand in LOGOS;
}
