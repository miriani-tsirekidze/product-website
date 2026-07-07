import { useState, useEffect, useCallback, useRef } from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import Lightbox from './components/Lightbox';

const API_BASE = import.meta.env.VITE_CHAT_API || '';
const DEFAULT_WIDTH = 480;
const MIN_WIDTH = 420;
const MAX_WIDTH = 700;

let msgCounter = 0;

export default function ChatPanel({ open, onClose }) {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const dragging = useRef(false);

  const createSession = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/session`, { method: 'POST' });
      const data = await res.json();
      setSessionId(data.sessionId);
      setMessages([]);
      setError(null);
    } catch {
      setError('Failed to connect to assistant.');
    }
  }, []);

  useEffect(() => {
    if (open && !sessionId) createSession();
  }, [open, sessionId, createSession]);

  useEffect(() => {
    function onMouseMove(e) {
      if (!dragging.current) return;
      const newWidth = window.innerWidth - e.clientX;
      setWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth)));
    }
    function onMouseUp() {
      if (dragging.current) {
        dragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  function startDrag(e) {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  async function handleSend({ text, image, imagePreview }) {
    if (!sessionId) return;

    const userMsg = { id: ++msgCounter, role: 'user', text, imagePreview };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId, image }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Request failed');

      if (data.text) {
        const agentMsg = { id: ++msgCounter, role: 'agent', text: data.text };
        setMessages((prev) => [...prev, agentMsg]);

        if (data.text.includes('having trouble with that')) {
          try {
            const sessionRes = await fetch(`${API_BASE}/api/session`, { method: 'POST' });
            const sessionData = await sessionRes.json();
            setSessionId(sessionData.sessionId);
          } catch {}
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddToCart(title, size) {
    const text = size ? `add ${title} size ${size}` : `add ${title}`;
    handleSend({ text, image: null, imagePreview: null });
  }

  return (
    <>
      <div className={`chat-panel-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`chat-panel${open ? ' open' : ''}`} style={{ width }}>
        <div className="chat-resize-handle" onMouseDown={startDrag} />
        <div className="chat-panel-header">
          <div className="chat-panel-title">
            <span className="chat-panel-dot" />
            <span>Shopping Assistant</span>
          </div>
          <div className="chat-panel-actions">
            <button className="chat-panel-btn" onClick={createSession} title="New chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <button className="chat-panel-btn" onClick={onClose} title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onImageClick={(src, alt) => setLightbox({ src, alt })}
          onAddToCart={handleAddToCart}
        />
        {error && <div className="chat-error">{error}</div>}
        <ChatInput onSend={handleSend} disabled={isLoading || !sessionId} />
      </div>
      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}
