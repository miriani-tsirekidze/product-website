export const BRANDS = ["H&M", "Nike", "Zara", "Mango", "Pull&Bear"];

export const CATEGORIES = [
  "T-Shirts & Tops",
  "Pants & Trousers",
  "Jackets & Coats",
  "Hoodies & Sweatshirts",
  "Shorts",
  "Dresses & Skirts",
  "Sportswear & Swimwear",
  "Accessories",
  "Other",
];

let products = [];
let loaded = false;
let loadPromise = null;

export function loadProducts() {
  if (loadPromise) return loadPromise;
  loadPromise = fetch('/products.json')
    .then((res) => res.json())
    .then((data) => {
      products = data;
      loaded = true;
      return products;
    });
  return loadPromise;
}

export function getProducts() {
  return products;
}

export function isLoaded() {
  return loaded;
}

export function getProductById(id) {
  return products.find((p) => p.id === id);
}

export function getProductsByBrand(brand) {
  return products.filter((p) => p.brand === brand);
}

export function getProductsByCategory(category) {
  return products.filter((p) => p.subcategory === category);
}

export function getRelatedProducts(product, count = 4) {
  return products
    .filter((p) => p.id !== product.id && (p.subcategory === product.subcategory || p.brand === product.brand))
    .slice(0, count);
}
