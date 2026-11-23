import { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, Sparkles, ChevronLeft, ChevronRight, Film } from 'lucide-react';

export default function ImageExpandModal({
  isOpen,
  onClose,
  src,
  type = 'image',
  media = null,
  initialIndex = 0,
  alt = 'Expanded memory photo',
  title,
  caption,
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [prevKey, setPrevKey] = useState(`${isOpen}-${initialIndex}`);

  const currentKey = `${isOpen}-${initialIndex}`;
  if (currentKey !== prevKey) {
    setPrevKey(currentKey);
    setActiveIndex(initialIndex);
    setIsZoomed(false);
  }

  const items =
    Array.isArray(media) && media.length > 0
      ? media
      : src
        ? [{ type, src, label: title, caption }]
        : [];

  const currentItem = items[activeIndex] || items[0];
  const isVideo =
    currentItem?.type === 'video' ||
    (typeof currentItem?.src === 'string' && /\.(mov|mp4|webm)(\?.*)?$/i.test(currentItem.src));

  const handleClose = () => {
    setIsZoomed(false);
    onClose();
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
        onClose();
      } else if (e.key === 'ArrowLeft' && items.length > 1) {
        setIsZoomed(false);
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'ArrowRight' && items.length > 1) {
        setIsZoomed(false);
        setActiveIndex((prev) => (prev + 1) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, items.length]);

  if (!isOpen || !currentItem?.src) return null;

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
        {!isVideo && (
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-105 shadow-lg"
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            aria-label={isZoomed ? 'Zoom Out' : 'Zoom In'}
          >
            {isZoomed ? <ZoomOut className="w-5 h-5 text-pink-300" /> : <ZoomIn className="w-5 h-5 text-pink-300" />}
          </button>
        )}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close expanded media"
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-105 shadow-lg"
        >
          <X className="w-5 h-5 text-pink-300" />
        </button>
      </div>

      {/* Left/Right Navigation Arrows when multiple media items exist */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 z-50 p-3 rounded-full bg-black/60 hover:bg-pink-500/80 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-110 shadow-lg"
            title="Previous memory"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 sm:right-6 z-50 p-3 rounded-full bg-black/60 hover:bg-pink-500/80 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-110 shadow-lg"
            title="Next memory"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Content Area */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-6xl max-h-[92vh] flex flex-col items-center justify-center overflow-auto p-1 sm:p-2"
      >
        {isVideo ? (
          <div className="flex items-center justify-center">
            <video
              key={currentItem.src}
              src={currentItem.src}
              controls
              autoPlay
              playsInline
              className="max-h-[76vh] max-w-[92vw] w-auto h-auto rounded-2xl shadow-2xl border border-pink-400/40 bg-black"
            />
          </div>
        ) : (
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
              src={currentItem.src}
              alt={currentItem.label || alt}
              className="max-h-[76vh] max-w-[92vw] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-pink-400/30"
            />
          </div>
        )}

        {/* Thumbnail Strip if multiple items */}
        {items.length > 1 && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-2xl bg-black/65 backdrop-blur-md border border-pink-400/30">
            {items.map((item, idx) => {
              const itemIsVideo =
                item.type === 'video' ||
                (typeof item.src === 'string' && /\.(mov|mp4|webm)(\?.*)?$/i.test(item.src));
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIsZoomed(false);
                    setActiveIndex(idx);
                  }}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-pink-500 scale-110 shadow-md shadow-pink-500/40'
                      : 'border-white/20 opacity-65 hover:opacity-100'
                  }`}
                  title={item.label || `Memory ${idx + 1}`}
                >
                  {itemIsVideo ? (
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-pink-400">
                      <Film className="w-4 h-4" />
                      <span className="text-[8px] font-bold text-white mt-0.5">VIDEO</span>
                    </div>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.label || `Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Caption Card */}
        {(title || currentItem.label || caption || currentItem.caption) && (
          <div className="mt-2.5 px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-md border border-pink-400/30 text-center max-w-lg shadow-xl animate-in fade-in duration-300">
            {(currentItem.label || title) && (
              <h3 className="text-white text-sm sm:text-base font-bold flex items-center justify-center gap-1.5">
                {currentItem.label || title} <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              </h3>
            )}
            {(currentItem.caption || caption) && (
              <p className="text-pink-200/80 text-xs mt-0.5 font-medium">
                {currentItem.caption || caption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
