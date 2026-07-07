import { useNavigate } from 'react-router-dom';
import { parseAgentResponse } from '../utils/parseResponse';
import ProductGrid from './ProductGrid';
import CartSummary from './CartSummary';

const URL_REGEX = /(https?:\/\/[^\s)]+)/g;

function renderLineWithUrls(line, keyPrefix, navigate) {
  const parts = line.split(URL_REGEX);
  return parts.map((seg, k) => {
    if (URL_REGEX.test(seg)) {
      URL_REGEX.lastIndex = 0;
      try {
        const u = new URL(seg);
        if (u.pathname.startsWith('/product/')) {
          return <a key={`${keyPrefix}-${k}`} href={u.pathname} className="chat-link" onClick={(e) => { e.preventDefault(); navigate(u.pathname); }}>{seg}</a>;
        }
      } catch {}
      return <a key={`${keyPrefix}-${k}`} href={seg} className="chat-link" target="_blank" rel="noopener noreferrer">{seg}</a>;
    }
    return seg;
  });
}

function formatText(text, navigate) {
  if (!text) return null;
  const parts = text.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, linkText, url] = linkMatch;
      if (url.startsWith('/')) {
        return <a key={i} href={url} className="chat-link" onClick={(e) => { e.preventDefault(); navigate(url); }}>{linkText}</a>;
      }
      return <a key={i} href={url} className="chat-link" target="_blank" rel="noopener noreferrer">{linkText}</a>;
    }
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {renderLineWithUrls(line, `${i}-${j}`, navigate)}
        {j < arr.length - 1 && <br />}
      </span>
    ));
  });
}

export default function Message({ message, onImageClick, onAddToCart }) {
  const navigate = useNavigate();
  const { role, text, imagePreview } = message;
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="message-row user">
        <div className="message-avatar user">U</div>
        <div className="message-bubble user">
          {imagePreview && (
            <img src={imagePreview} alt="Uploaded" className="message-image" />
          )}
          {text && <div>{text}</div>}
        </div>
      </div>
    );
  }

  const parsed = parseAgentResponse(text);

  const avatar = (
    <div className="message-avatar agent">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  );

  if (parsed.type === 'products') {
    return (
      <div className="message-row agent">
        {avatar}
        <div className="message-content-plain">
          {parsed.introText && (
            <div className="message-bubble agent">
              <p>{formatText(parsed.introText, navigate)}</p>
            </div>
          )}
          <ProductGrid
            products={parsed.products}
            isCompleteTheLook={parsed.isCompleteTheLook}
            onImageClick={onImageClick}
            onAddToCart={onAddToCart}
          />
          {parsed.closingText && (
            <div className="message-bubble agent">
              <p>{formatText(parsed.closingText, navigate)}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (parsed.type === 'cart') {
    return (
      <div className="message-row agent">
        {avatar}
        <div className="chat-cart-wrapper">
          <CartSummary data={parsed} />
          {parsed.closingText && (
            <div className="message-bubble agent">
              <p>{formatText(parsed.closingText, navigate)}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="message-row agent">
      {avatar}
      <div className="message-bubble agent">
        <div>{formatText(parsed.text, navigate)}</div>
      </div>
    </div>
  );
}
