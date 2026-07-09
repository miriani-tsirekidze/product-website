import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatPanel from './chat/ChatPanel';
import Home from './pages/Home';
import BrandPage from './pages/BrandPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function RevealObserver() {
  const { pathname } = useLocation();
  useEffect(() => {
    const shell = document.querySelector('.site-shell');
    if (!shell) return undefined;

    if (!('IntersectionObserver' in window)) {
      shell.querySelectorAll('.reveal:not(.is-in-view)').forEach((el) => el.classList.add('is-in-view'));
      return undefined;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    const observeAll = () => {
      shell.querySelectorAll('.reveal:not(.is-in-view)').forEach((el) => io.observe(el));
    };
    observeAll();

    const mo = new MutationObserver(observeAll);
    mo.observe(shell, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);
  return null;
}

function NavbarScrollSentinel() {
  const ref = useRef(null);
  useEffect(() => {
    const nav = document.querySelector('.navbar');
    if (!nav || !ref.current || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      nav.classList.toggle('navbar--scrolled', !entry.isIntersecting);
    }, { threshold: 0 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className="navbar-sentinel" aria-hidden="true" />;
}

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <main>
          <div className="site-shell">
            <NavbarScrollSentinel />
            <RevealObserver />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/brand/:brandName" element={<BrandPage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </div>
        </main>
        <Footer />

        <button className="chat-fab" onClick={() => setChatOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </button>

        <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      </BrowserRouter>
    </CartProvider>
  );
}
