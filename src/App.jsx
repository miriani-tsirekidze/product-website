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

        <button
          className={`chat-fab${chatOpen ? ' chat-fab--open' : ''}`}
          onClick={() => setChatOpen(true)}
          aria-label="Open AI stylist"
        >
          <span className="chat-fab-halo" aria-hidden="true" />
          <span className="chat-fab-halo chat-fab-halo--2" aria-hidden="true" />
          <span className="chat-fab-core" aria-hidden="true">
            <svg className="chat-fab-icon" width="42" height="42" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="fabBotBody" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e6ecdb" />
                </linearGradient>
                <radialGradient id="fabBotEye" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#eaffb2" />
                  <stop offset="60%" stopColor="#8faa6e" />
                  <stop offset="100%" stopColor="#3a4d24" />
                </radialGradient>
              </defs>
              {/* antenna */}
              <line x1="20" y1="4" x2="20" y2="9" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="20" cy="3.5" r="2.2" fill="#b5c99a" stroke="#ffffff" strokeWidth="1" />
              {/* head */}
              <rect x="7" y="9" width="26" height="22" rx="7" fill="url(#fabBotBody)" stroke="#ffffff" strokeWidth="1.2" />
              {/* side "ears" */}
              <rect x="3.5" y="16" width="3.5" height="8" rx="1.5" fill="#ffffff" opacity="0.85" />
              <rect x="33" y="16" width="3.5" height="8" rx="1.5" fill="#ffffff" opacity="0.85" />
              {/* eyes */}
              <circle cx="15" cy="19.5" r="3" fill="url(#fabBotEye)" />
              <circle cx="25" cy="19.5" r="3" fill="url(#fabBotEye)" />
              {/* eye highlights */}
              <circle cx="16" cy="18.5" r="0.9" fill="#ffffff" />
              <circle cx="26" cy="18.5" r="0.9" fill="#ffffff" />
              {/* mouth — friendly small smile */}
              <path d="M16 25.5 Q20 27.6 24 25.5" stroke="#3a4d24" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              {/* cheek dots */}
              <circle cx="11.5" cy="24.5" r="0.9" fill="#b5c99a" opacity="0.7" />
              <circle cx="28.5" cy="24.5" r="0.9" fill="#b5c99a" opacity="0.7" />
            </svg>
            <span className="chat-fab-sparkle chat-fab-sparkle--1" aria-hidden="true" />
            <span className="chat-fab-sparkle chat-fab-sparkle--2" aria-hidden="true" />
            <span className="chat-fab-sparkle chat-fab-sparkle--3" aria-hidden="true" />
          </span>
          <span className="chat-fab-label" aria-hidden="true">
            <span className="chat-fab-label-eyebrow">Ask</span>
            <span className="chat-fab-label-name">AI Stylist</span>
          </span>
        </button>

        <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      </BrowserRouter>
    </CartProvider>
  );
}
