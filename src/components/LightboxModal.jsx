import { useEffect, useState } from 'react';
import {
  X,
  Heart,
  MapPin,
  Calendar,
  Share2,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Film,
  Images,
} from 'lucide-react';
import ImageExpandModal from './ImageExpandModal';

export default function LightboxModal({ memory, onClose, onLike }) {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(memory?.likes || 99);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(memory?.initialMediaIndex || 0);
  const [prevMemoryKey, setPrevMemoryKey] = useState(
    `${memory?.id}-${memory?.initialMediaIndex || 0}`
  );

  const currentMemoryKey = `${memory?.id}-${memory?.initialMediaIndex || 0}`;
  if (currentMemoryKey !== prevMemoryKey) {
    setPrevMemoryKey(currentMemoryKey);
    setActiveMediaIndex(memory?.initialMediaIndex || 0);
    setLikes(memory?.likes || 99);
  }

  const mediaList =
    Array.isArray(memory?.media) && memory.media.length > 0
      ? memory.media
      : memory?.imageUrl
        ? [{ type: 'image', src: memory.imageUrl, label: memory.title, caption: memory.description }]
        : [];

  const currentMedia = mediaList[activeMediaIndex] || mediaList[0];
  const isCurrentVideo =
    currentMedia?.type === 'video' ||
    (typeof currentMedia?.src === 'string' && /\.(mov|mp4|webm)(\?.*)?$/i.test(currentMedia.src));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPhotoExpanded) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && mediaList.length > 1) {
        setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
      }
      if (e.key === 'ArrowRight' && mediaList.length > 1) {
        setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, mediaList.length, isPhotoExpanded]);

  if (!memory) return null;

  const handleLikeClick = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      if (onLike) onLike(memory.id);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrevMedia = (e) => {
    e.stopPropagation();
    setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const handleNextMedia = (e) => {
    e.stopPropagation();
    setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-pink-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Photo / Video Gallery Frame */}
        <div className="relative md:w-3/5 bg-slate-950 flex flex-col justify-between min-h-[320px] md:min-h-[520px] overflow-hidden">
          <div
            onClick={() => !isCurrentVideo && setIsPhotoExpanded(true)}
            className={`group relative flex-1 flex items-center justify-center overflow-hidden ${
              isCurrentVideo ? '' : 'cursor-pointer'
            }`}
            title={isCurrentVideo ? currentMedia?.label : 'Click to view full photo'}
          >
            {isCurrentVideo ? (
              <video
                key={currentMedia.src}
                src={currentMedia.src}
                controls
                autoPlay
                playsInline
                className="w-full h-full max-h-[54vh] md:max-h-[440px] object-contain bg-black"
              />
            ) : (
              <>
                <img
                  src={currentMedia?.src}
                  alt={currentMedia?.label || memory.title}
                  className="w-full h-full object-cover max-h-[54vh] md:max-h-[440px] transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover hint */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 text-white font-semibold text-xs backdrop-blur-[1px] pointer-events-none">
                  <Maximize2 className="w-5 h-5 text-pink-300 drop-shadow" />
                  <span className="drop-shadow">Click to expand</span>
                </div>
              </>
            )}

            {/* Floating Tag */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-pink-400/40 text-xs text-white pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span className="font-semibold">
                {currentMedia?.label || memory.tag || 'Storybook Moment'}
              </span>
            </div>

            {/* Expand button for video or image */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPhotoExpanded(true);
              }}
              className="absolute top-4 right-14 md:right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-pink-500/80 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
              title="Fullscreen view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Prev / Next Controls if multiple media */}
            {mediaList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevMedia}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-pink-500 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-110 shadow-md"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMedia}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-pink-500 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-110 shadow-md"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Media Thumbnail Strip inside Left Pane */}
          {mediaList.length > 1 && (
            <div className="bg-slate-900/95 border-t border-slate-800 px-3 py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-x-auto">
                {mediaList.map((item, idx) => {
                  const itemIsVideo =
                    item.type === 'video' ||
                    (typeof item.src === 'string' && /\.(mov|mp4|webm)(\?.*)?$/i.test(item.src));
                  const isSelected = idx === activeMediaIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-pink-500 scale-105 shadow-md shadow-pink-500/30'
                          : 'border-slate-700 opacity-65 hover:opacity-100'
                      }`}
                      title={item.label || `Memory ${idx + 1}`}
                    >
                      {itemIsVideo ? (
                        <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-pink-400">
                          <Film className="w-4 h-4" />
                          <span className="text-[8px] font-bold text-white mt-0.5">VIDEO</span>
                        </div>
                      ) : (
                        <img
                          src={item.src}
                          alt={item.label || `Thumb ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="text-[11px] font-bold text-pink-300 shrink-0 flex items-center gap-1 px-2">
                <Images className="w-3.5 h-3.5 text-pink-400" />
                <span>
                  {activeMediaIndex + 1} / {mediaList.length}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Memory Story Details */}
        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[520px]">
          <div>
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {memory.date ? (
                <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-pink-500/15 text-pink-600 border border-pink-400/30 text-xs font-semibold">
                  <Calendar className="w-3 h-3" />
                  <span>{memory.date}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-pink-500/15 text-pink-600 border border-pink-400/30 text-xs font-semibold">
                  <Sparkles className="w-3 h-3 text-pink-500" />
                  <span>Upcoming Plan 🌸</span>
                </div>
              )}

              {memory.location && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-500/15 text-rose-600 border border-rose-400/30 text-xs font-semibold">
                  <MapPin className="w-3 h-3" />
                  <span>{memory.location}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {memory.title}
            </h2>

            {/* Active Media Sub-caption if available */}
            {currentMedia?.caption && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200 text-xs font-bold text-pink-600">
                <Sparkles className="w-3 h-3 text-pink-500 shrink-0" />
                <span>{currentMedia.caption}</span>
              </div>
            )}

            {/* Story Description */}
            <p className="mt-3.5 text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
              {memory.description}
            </p>

            {/* Couple note quote box */}
            {memory.quote && (
              <div className="mt-4 p-3.5 rounded-2xl bg-pink-50 border-l-4 border-pink-500 text-xs italic text-pink-900 font-medium">
                "{memory.quote}"
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                  hasLiked
                    ? 'bg-pink-500/20 border-pink-500 text-pink-600 shadow-md shadow-pink-500/20'
                    : 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-slate-700'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${hasLiked ? 'fill-pink-500 text-pink-500 animate-pulse' : ''}`}
                />
                <span>{likes} Loves 💖</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                title="Copy link"
              >
                <Share2 className="w-3.5 h-3.5 text-pink-500" />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-pink-500 font-bold">
              Ditto Memory 🌸
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo / Video Expand Modal */}
      <ImageExpandModal
        isOpen={isPhotoExpanded}
        onClose={() => setIsPhotoExpanded(false)}
        src={currentMedia?.src}
        type={currentMedia?.type}
        media={mediaList}
        initialIndex={activeMediaIndex}
        alt={memory.title}
        title={memory.title}
        caption={`${memory.date ? memory.date + ' • ' : ''}${memory.location || ''}`}
      />
    </div>
  );
}
