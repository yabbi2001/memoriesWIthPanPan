import { useState, useEffect } from 'react';
import { Heart, MessageCircleHeart, Sparkles, Maximize2 } from 'lucide-react';
import ImageExpandModal from './ImageExpandModal';

// --- ASSET CONFIGURATION (Update your conversation photo directly here in code) ---
import defaultConversationImg from '@/assets/firstconversation.jpg';
const CONVERSATION_IMAGE_SRC = defaultConversationImg;

// Conversation start date: September 17, 2026 at 8:57 PM (20:57:00)
const CONVERSATION_START_DATE = new Date(2026, 8, 17, 20, 57, 0);

export default function ConversationCounterWidget({
  imageSrc = CONVERSATION_IMAGE_SRC,
}) {
  const [now, setNow] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate elapsed time from Sep 17, 2026, 8:57 PM
  const diffMs = Math.max(0, now.getTime() - CONVERSATION_START_DATE.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="rounded-3xl bg-white p-5 sm:p-6 border border-pink-200/90 shadow-xl shadow-pink-200/40 relative overflow-hidden flex flex-col justify-between transition-all">
      {/* Background Soft Pink Glow Orbs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-pink-500/15 text-pink-600 border border-pink-400/30">
            <MessageCircleHeart className="w-4 h-4 text-pink-600" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              First Conversation <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
            </h3>
            <p className="text-[11px] text-pink-700/80 font-medium">
              Sep 17, 2026 • 8:57 PM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-[11px] font-bold shadow-sm">
          <Sparkles className="w-3 h-3 text-pink-500" />
          <span>Since Day One</span>
        </div>
      </div>

      {/* Main Content Area: Image + Live Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-1">
        
        {/* Featured Memory / Conversation Image (sm:col-span-5) */}
        <div className="sm:col-span-5 flex flex-col items-center">
          <div
            onClick={() => setIsExpanded(true)}
            className="group relative w-full aspect-square max-w-[150px] sm:max-w-none rounded-2xl overflow-hidden border-2 border-pink-200/90 shadow-md bg-pink-50 cursor-pointer hover:border-pink-400 transition-all hover:shadow-lg"
            title="Click to expand photo"
          >
            <img
              src={imageSrc}
              alt="First Conversation Memory"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 text-white text-xs font-semibold backdrop-blur-[1px]">
              <Maximize2 className="w-5 h-5 text-pink-300 drop-shadow" />
              <span className="drop-shadow text-[11px]">Click to expand</span>
            </div>

            {/* Subtle bottom badge */}
            <div className="absolute bottom-1.5 inset-x-1.5 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-sm border border-pink-200/80 text-[10px] font-bold text-pink-600 flex items-center justify-between shadow-sm pointer-events-none">
              <span className="truncate">Our First Talk 💖</span>
              <Heart className="w-3 h-3 text-pink-500 fill-pink-500 shrink-0 ml-1" />
            </div>
          </div>
        </div>

        {/* Live Elapsed Time Counter Cards (sm:col-span-7) */}
        <div className="sm:col-span-7 flex flex-col justify-center space-y-2.5">
          <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <span>Talking for</span>
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping inline-block" />
          </p>

          {/* 4 Counter Number Blocks */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {/* Days */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-b from-pink-50 to-pink-100/70 border border-pink-200/90 shadow-sm">
              <span className="text-lg sm:text-xl font-black text-slate-900 leading-none font-mono">
                {days}
              </span>
              <span className="text-[10px] font-bold text-pink-600 mt-1 uppercase tracking-tight">
                Days
              </span>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-b from-pink-50 to-pink-100/70 border border-pink-200/90 shadow-sm">
              <span className="text-lg sm:text-xl font-black text-slate-900 leading-none font-mono">
                {String(hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-pink-600 mt-1 uppercase tracking-tight">
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-b from-pink-50 to-pink-100/70 border border-pink-200/90 shadow-sm">
              <span className="text-lg sm:text-xl font-black text-slate-900 leading-none font-mono">
                {String(minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-pink-600 mt-1 uppercase tracking-tight">
                Mins
              </span>
            </div>

            {/* Seconds */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-b from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25 border border-pink-400">
              <span className="text-lg sm:text-xl font-black leading-none font-mono">
                {String(seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tight text-pink-100">
                Secs
              </span>
            </div>
          </div>

          {/* Sweet Subtitle Message */}
          <div className="p-2 rounded-xl bg-pink-50/80 border border-pink-200/80 text-center">
            <p className="text-[11px] text-pink-700 font-medium italic">
              "Counting every second since our very first message 💌"
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Footer Accent */}
      <div className="mt-3 pt-2.5 border-t border-pink-100 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
        <span className="text-pink-600">Started: Sep 17, 2026 • 8:57 PM</span>
        <span className="flex items-center gap-1 text-pink-500 font-bold">
          <span>Always & Forever</span>
          <Heart className="w-3 h-3 fill-pink-500" />
        </span>
      </div>

      {/* Expanded Image Modal */}
      <ImageExpandModal
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        src={imageSrc}
        alt="First Conversation Memory"
        title="First Conversation 💬💖"
        caption="Sep 17, 2026 • 8:57 PM — Counting every second since our first talk"
      />
    </div>
  );
}
