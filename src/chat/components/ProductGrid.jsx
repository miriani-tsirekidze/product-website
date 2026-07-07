import { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';
import SuggestionItem from './SuggestionItem';

export default function ProductGrid({ products, isCompleteTheLook, onImageClick, onAddToCart }) {
  const [activeProduct, setActiveProduct] = useState(null);
  const [pickerTop, setPickerTop] = useState(0);
  const containerRef = useRef(null);
  const cardRefs = useRef({});

  const setCardRef = useCallback((number, el) => {
    if (el) cardRefs.current[number] = el;
  }, []);

  useEffect(() => {
    if (!activeProduct) return;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveProduct(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeProduct]);

  function handleCartClick(product) {
    if (!product.sizes || product.sizes.length === 0) {
      onAddToCart(product.title, null);
      return;
    }
    if (activeProduct?.number === product.number) {
      setActiveProduct(null);
      return;
    }
    const cardEl = cardRefs.current[product.number];
    if (cardEl && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();
      setPickerTop(cardRect.top - containerRect.top);
    }
    setActiveProduct(product);
  }

  function handleSizeClick(size) {
    if (!activeProduct) return;
    onAddToCart(activeProduct.title, size);
    setActiveProduct(null);
  }

  const sizePicker = activeProduct && (
    <div className="size-picker-gutter" style={{ top: pickerTop }} key="picker">
      {activeProduct.sizes.map((size, i) => (
        <button
          key={size}
          className="size-circle"
          style={{ animationDelay: `${i * 50}ms` }}
          onClick={() => handleSizeClick(size)}
        >
          {size}
        </button>
      ))}
    </div>
  );

  const useHorizontal = isCompleteTheLook || products.length === 3;

  if (useHorizontal) {
    return (
      <div className="product-grid-wrapper" ref={containerRef}>
        {sizePicker}
        <div className="suggestion-row">
          {products.map((product) => (
            <div className="suggestion-item-wrapper" key={product.number} ref={(el) => setCardRef(product.number, el)}>
              <SuggestionItem
                product={product}
                onImageClick={onImageClick}
                onCartClick={handleCartClick}
                isPickingSize={activeProduct?.number === product.number}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid-wrapper" ref={containerRef}>
      {sizePicker}
      <div className={products.length === 1 ? 'product-single' : 'product-grid'}>
        {products.map((product) => (
          <div key={product.number} ref={(el) => setCardRef(product.number, el)}>
            <ProductCard
              product={product}
              onImageClick={onImageClick}
              onCartClick={handleCartClick}
              isPickingSize={activeProduct?.number === product.number}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
