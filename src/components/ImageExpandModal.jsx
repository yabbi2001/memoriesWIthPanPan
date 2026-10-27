import { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';

export default function ImageExpandModal({
  isOpen,
  onClose,
  src,
  alt = 'Expanded memory photo',
  title,
  caption,
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleClose = () => {
    setIsZoomed(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
      onClick={handleClose}
    >
      {/* Top action controls */}
      <div
        className="absolute top-4 right-4 z-50 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setIsZoomed((prev) => !prev)}
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-105 shadow-lg"
          title={isZoomed ? 'Zoom Out' : 'Zoom In'}
          aria-label={isZoomed ? 'Zoom Out' : 'Zoom In'}
        >
          {isZoomed ? <ZoomOut className="w-5 h-5 text-pink-300" /> : <ZoomIn className="w-5 h-5 text-pink-300" />}
        </button>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close expanded image"
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-105 shadow-lg"
        >
          <X className="w-5 h-5 text-pink-300" />
        </button>
      </div>

      {/* Main Content Area */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-6xl max-h-[92vh] flex flex-col items-center justify-center overflow-auto p-1 sm:p-2"
      >
        <div
          onClick={() => setIsZoomed((prev) => !prev)}
          className={`transition-transform duration-300 ease-out flex items-center justify-center ${
            isZoomed
              ? 'scale-125 sm:scale-150 cursor-zoom-out my-12'
              : 'scale-100 cursor-zoom-in'
          }`}
          title={isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[82vh] max-w-[92vw] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-pink-400/30"
          />
        </div>

        {/* Caption Card */}
        {(title || caption) && (
          <div className="mt-3 px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-md border border-pink-400/30 text-center max-w-lg shadow-xl animate-in fade-in duration-300">
            {title && (
              <h3 className="text-white text-sm sm:text-base font-bold flex items-center justify-center gap-1.5">
                {title} <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              </h3>
            )}
            {caption && (
              <p className="text-pink-200/80 text-xs mt-0.5 font-medium">{caption}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
