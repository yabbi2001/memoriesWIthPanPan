import { useState } from 'react';
import {
  Heart,
  MapPin,
  Calendar,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Film,
  Images,
} from 'lucide-react';
import defaultAvatar from '@/assets/avatar/panpan.jpg';

export default function HeroFeaturedCard({ memory, onSelectMemory }) {
  const [likes, setLikes] = useState(memory.likes || 128);
  const [isLiked, setIsLiked] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const mediaList =
    Array.isArray(memory.media) && memory.media.length > 0
      ? memory.media
      : [{ type: 'image', src: memory.imageUrl, label: memory.title }];

  const currentMedia = mediaList[activeMediaIndex] || mediaList[0];
  const isVideo =
    currentMedia?.type === 'video' ||
    (typeof currentMedia?.src === 'string' && /\.(mov|mp4|webm)(\?.*)?$/i.test(currentMedia.src));

  const handleLike = (e) => {
    e.stopPropagation();
    if (!isLiked) {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
  };

  return (
    <div
      onClick={() => onSelectMemory({ ...memory, initialMediaIndex: activeMediaIndex })}
      className="group relative cursor-pointer select-none transition-all duration-300 ease-out transform -rotate-1 hover:rotate-0 hover:scale-[1.01] w-full"
    >
      {/* Outer Polaroid Frame with clean pink romantic styling */}
      <div className="relative rounded-3xl bg-white p-4 sm:p-5 border border-pink-200/90 shadow-xl shadow-pink-200/40 group-hover:border-pink-400 group-hover:shadow-pink-300/30 transition-all duration-300">
        
        {/* Neon Pink Glow underlay on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400/25 via-rose-400/25 to-pink-300/25 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none -z-10" />

        {/* Featured Badge Pill */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/40 text-pink-600 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin-slow" />
            <span>Featured Chapter 💖</span>
          </div>

          <div className="flex items-center gap-2">
            {mediaList.length > 1 && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-[11px] font-bold text-pink-600">
                <Images className="w-3 h-3 text-pink-500" />
                <span>
                  {activeMediaIndex + 1}/{mediaList.length}
                </span>
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-pink-500" />
              <span>{memory.date}</span>
            </div>
          </div>
        </div>

        {/* Photo / Video Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-pink-200/60">
          {isVideo ? (
            <video
              key={currentMedia.src}
              src={currentMedia.src}
              controls
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <>
              <img
                src={currentMedia.src}
                alt={currentMedia.label || memory.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Dark gradient overlay for bottom text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />
            </>
          )}

          {/* Floating Glassmorphic Avatar Badge Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-pink-300/30 text-white shadow-lg pointer-events-none">
            <div className="relative">
              <img
                src={memory.authorAvatar || defaultAvatar}
                alt="Partner avatar"
                className="w-5 h-5 rounded-full object-cover ring-2 ring-pink-400"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping"></span>
            </div>
            <span className="text-[11px] font-semibold tracking-wide">
              {currentMedia.label || memory.partnerNote || 'Pan Pan & ZMH'}
            </span>
          </div>

          {/* Fullscreen indicator */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMemory({ ...memory, initialMediaIndex: activeMediaIndex });
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-pink-500/80 backdrop-blur-md border border-white/20 text-white/90 transition-all duration-300 cursor-pointer"
            title="Open in Lightbox"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Left / Right Carousel Arrows */}
          {mediaList.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/55 hover:bg-pink-500 text-white border border-white/25 backdrop-blur-md transition-all cursor-pointer hover:scale-110 shadow-md"
                title="Previous memory"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/55 hover:bg-pink-500 text-white border border-white/25 backdrop-blur-md transition-all cursor-pointer hover:scale-110 shadow-md"
                title="Next memory"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Location Badge bottom left of image */}
          {memory.location && !isVideo && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-pink-400/30 text-white text-xs font-medium pointer-events-none">
              <MapPin className="w-3 h-3 text-pink-400" />
              <span className="text-[11px]">{memory.location}</span>
            </div>
          )}
        </div>

        {/* Interactive Thumbnail Strip for First Date Memories (3 Photos + 1 Video) */}
        {mediaList.length > 1 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-3 flex items-center justify-between gap-2 bg-pink-50/80 p-2 rounded-2xl border border-pink-200/80"
          >
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
                    className={`group/thumb relative flex items-center gap-1.5 pr-2.5 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'border-pink-500 bg-pink-500 text-white shadow-sm shadow-pink-500/30'
                        : 'border-pink-200 bg-white text-slate-700 hover:border-pink-400'
                    }`}
                  >
                    <div className="w-10 h-10 overflow-hidden bg-slate-900 flex items-center justify-center shrink-0">
                      {itemIsVideo ? (
                        <Film className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-pink-400'}`} />
                      ) : (
                        <img
                          src={item.src}
                          alt={item.label || `Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-[11px] font-bold whitespace-nowrap">
                      {item.shortLabel || (itemIsVideo ? 'Video 🎬' : `Photo ${idx + 1}`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Caption Area & Story */}
        <div className="mt-4 pt-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-pink-600 transition-colors">
                {memory.title}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {memory.description}
              </p>
            </div>

            {/* Like heart button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isLiked
                  ? 'bg-pink-500/20 border-pink-500 text-pink-600 shadow-sm shadow-pink-500/30 scale-105'
                  : 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-slate-600 hover:text-pink-500'
              }`}
              title="Give love"
            >
              <Heart
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  isLiked ? 'fill-pink-500 text-pink-500 animate-pulse' : ''
                }`}
              />
              <span className="text-xs font-bold">{likes}</span>
            </button>
          </div>

          {/* Polaroid handwritten-style tag footer */}
          <div className="mt-3.5 pt-3 border-t border-pink-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="italic font-serif text-pink-700 font-medium">
              "{memory.quote || 'Moments frozen in love, forever ours.'}"
            </span>
            <span className="text-pink-500 font-mono text-[10px] tracking-widest uppercase font-bold">
              #ETERNAL-01
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
