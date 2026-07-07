import { useState, useRef } from 'react';
import CropModal from './CropModal';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [cropSrc, setCropSrc] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 7 * 1024 * 1024) {
      alert('Image must be under 7MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleCropConfirm(croppedDataUrl) {
    const dataUrl = croppedDataUrl || cropSrc;
    const base64 = dataUrl.split(',')[1];
    const mimeType = croppedDataUrl ? 'image/jpeg' : cropSrc.split(';')[0].split(':')[1];
    setImage({
      base64,
      mimeType,
      preview: dataUrl,
      name: 'photo',
    });
    setCropSrc(null);
  }

  function handleCropCancel() {
    setCropSrc(null);
  }

  function handleSend() {
    if (disabled) return;
    const trimmed = text.trim();
    if (!trimmed && !image) return;

    onSend({
      text: trimmed,
      image: image ? { base64: image.base64, mimeType: image.mimeType } : null,
      imagePreview: image?.preview || null,
    });

    setText('');
    setImage(null);
    textareaRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function autoResize(e) {
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }

  return (
    <div className="chat-input-area">
      {image && (
        <div className="image-preview-bar">
          <img src={image.preview} alt="" className="image-preview-thumb" />
          <span className="image-preview-name">Cropped photo</span>
          <button className="image-preview-remove" onClick={() => setImage(null)}>
            &times;
          </button>
        </div>
      )}
      <div className="chat-input-row">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
        <button
          className="btn-icon"
          onClick={() => fileInputRef.current?.click()}
          title="Upload image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => { setText(e.target.value); autoResize(e); }}
          onKeyDown={handleKeyDown}
          placeholder="Search, ask about sizes, or upload a photo..."
          onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'end' }), 300)}
          disabled={disabled}
        />
        <button
          className="btn-send"
          onClick={handleSend}
          disabled={disabled || (!text.trim() && !image)}
          title="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
