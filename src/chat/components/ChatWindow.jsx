import { useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow({ messages, isLoading, onImageClick, onAddToCart }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      {messages.length === 0 && !isLoading && (
        <div className="welcome-message">
          <div className="welcome-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="1.5">
              <path d="M16 11V3a1 1 0 00-1-1H3a1 1 0 00-1 1v14l4-4h4" />
              <path d="M21 15V9a1 1 0 00-1-1h-6a1 1 0 00-1 1v10l4-4h4z" />
            </svg>
          </div>
          <h2>Welcome to Demo Boutique</h2>
          <p>
            Upload a photo of an outfit you like or describe what you're looking for.
            I'll find matching items from our catalog!
          </p>
        </div>
      )}
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} onImageClick={onImageClick} onAddToCart={onAddToCart} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
