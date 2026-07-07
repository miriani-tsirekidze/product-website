import { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function CropModal({ imageSrc, onConfirm, onCancel }) {
  const [crop, setCrop] = useState(null);
  const imgRef = useRef(null);

  const onImageLoad = useCallback((e) => {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;
    const size = Math.min(width, height) * 0.7;
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    setCrop({ unit: 'px', x, y, width: size, height: size });
  }, []);

  function getCroppedImage() {
    const image = imgRef.current;
    if (!image || !crop) return null;

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  }

  function handleConfirm() {
    const cropped = getCroppedImage();
    if (cropped) {
      onConfirm(cropped);
    }
  }

  function handleSkip() {
    onConfirm(null);
  }

  return (
    <div className="crop-overlay" onClick={onCancel}>
      <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
        <div className="crop-header">
          <h3>Select the item you want to search for</h3>
          <button className="crop-close" onClick={onCancel}>&times;</button>
        </div>
        <div className="crop-body">
          <ReactCrop crop={crop} onChange={setCrop} minWidth={50} minHeight={50}>
            <img src={imageSrc} onLoad={onImageLoad} className="crop-image" alt="Crop" />
          </ReactCrop>
        </div>
        <div className="crop-footer">
          <button className="crop-btn secondary" onClick={handleSkip}>
            Use full image
          </button>
          <button className="crop-btn primary" onClick={handleConfirm}>
            Search this area
          </button>
        </div>
      </div>
    </div>
  );
}
