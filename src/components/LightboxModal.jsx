import { useEffect, useState } from 'react';
import { X, Heart, MapPin, Calendar, Share2, Sparkles, Maximize2 } from 'lucide-react';
import ImageExpandModal from './ImageExpandModal';

export default function LightboxModal({ memory, onClose, onLike }) {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(memory?.likes || 99);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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

        {/* Left Side: Photo Frame */}
        <div 
          onClick={() => setIsPhotoExpanded(true)}
          className="group relative md:w-3/5 bg-slate-950 flex items-center justify-center min-h-[300px] md:min-h-[500px] cursor-pointer overflow-hidden"
          title="Click to view full photo"
        >
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-cover max-h-[60vh] md:max-h-[520px] transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover hint */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 text-white font-semibold text-xs backdrop-blur-[1px] pointer-events-none">
            <Maximize2 className="w-5 h-5 text-pink-300 drop-shadow" />
            <span className="drop-shadow">Click to expand</span>
          </div>

          {/* Floating Tag */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-pink-400/40 text-xs text-white pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="font-semibold">{memory.tag || "Storybook Moment"}</span>
          </div>
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

      {/* Fullscreen Photo Expand Modal */}
      <ImageExpandModal
        isOpen={isPhotoExpanded}
        onClose={() => setIsPhotoExpanded(false)}
        src={memory.imageUrl}
        alt={memory.title}
        title={memory.title}
        caption={`${memory.date ? memory.date + ' • ' : ''}${memory.location || ''}`}
      />
    </div>
  );
}
