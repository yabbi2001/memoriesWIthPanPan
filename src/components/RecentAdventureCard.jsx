import { useState } from 'react';
import { Heart, MapPin, Camera, Sparkles } from 'lucide-react';

export default function RecentAdventureCard({ memory, onSelectMemory, rotationClass = "rotate-2" }) {
  const [likes, setLikes] = useState(memory.likes || 42);
  const [isLiked, setIsLiked] = useState(false);

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

  return (
    <div
      onClick={() => onSelectMemory(memory)}
      className={`group cursor-pointer select-none transition-all duration-300 ease-out transform ${rotationClass} hover:rotate-0 hover:scale-105 z-10 hover:z-20`}
    >
      <div className="relative rounded-2xl bg-white p-3.5 sm:p-4 border border-pink-200/90 shadow-xl shadow-pink-200/40 group-hover:border-pink-400 group-hover:shadow-pink-300/30 transition-all duration-300 flex flex-col justify-between h-full">
        
        {/* Subtle neon pink glow on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400/25 via-rose-400/25 to-pink-300/25 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none -z-10" />

        {/* Top Polaroid Tag */}
        <div className="flex items-center justify-between mb-2.5 px-0.5 text-xs">
          <div className="flex items-center gap-1 text-[11px] font-bold text-pink-600 bg-pink-500/15 px-2.5 py-0.5 rounded-full border border-pink-400/30">
            <Camera className="w-3 h-3 text-pink-500" />
            <span>{memory.tag || "Plan"}</span>
          </div>

          <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200 shadow-2xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-pink-500" />
            <span>Plan 🌸</span>
          </span>
        </div>

        {/* Polaroid Picture Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-pink-50 mb-3 ring-1 ring-pink-100">
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Location badge */}
          {memory.location && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-pink-400/30 text-white text-[10px] font-medium">
              <MapPin className="w-2.5 h-2.5 text-pink-400" />
              <span className="truncate max-w-[120px]">{memory.location}</span>
            </div>
          )}
        </div>

        {/* Polaroid bottom caption */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-1">
                {memory.title}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {memory.description}
              </p>
            </div>

            {/* Like heart */}
            <button
              onClick={handleLike}
              className={`p-1.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                isLiked
                  ? 'bg-pink-500/20 border-pink-500 text-pink-600 scale-110'
                  : 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-slate-500 hover:text-pink-500'
              }`}
              title="Like"
            >
              <Heart
                className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-500 text-pink-500 animate-pulse' : ''}`}
              />
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-pink-100 flex items-center justify-between text-[10px] text-slate-500">
            <span className="italic truncate max-w-[150px] font-medium text-pink-800">
              {memory.partnerNote ? `“${memory.partnerNote}”` : '“Forever with you”'}
            </span>
            <span className="font-mono text-pink-600 font-bold">{likes} ♥</span>
          </div>
        </div>

      </div>
    </div>
  );
}
