import { useState } from 'react';
import { TrendingUp, Sparkles, Heart } from 'lucide-react';

export default function ProgressChartWidget() {
  const [activeMilestone, setActiveMilestone] = useState(null);

  const milestones = [
    { id: 1, x: 50, y: 130, date: 'May 2023', label: 'First Met', note: 'Coffee under the city raindrops ☕' },
    { id: 2, x: 130, y: 100, date: 'Aug 2023', label: 'First Beach Trip', note: 'Sunset waves & endless talks 🌊' },
    { id: 3, x: 210, y: 70, date: 'Dec 2023', label: 'Holiday Stargazing', note: 'Whispered wishes on a hilltop ✨' },
    { id: 4, x: 290, y: 55, date: 'Jun 2024', label: '1st Anniversary', note: 'Celebrated 365 days of warm hugs 💖' },
    { id: 5, x: 370, y: 30, date: 'Oct 2024', label: 'New Adventures', note: 'Building our cozy shared dreams 🏡' },
  ];

  return (
    <div className="rounded-3xl bg-white p-5 border border-pink-200/90 shadow-xl shadow-pink-200/40 relative overflow-hidden flex flex-col justify-between">
      {/* Background soft ambient pink glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-pink-500/15 text-pink-600 border border-pink-400/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              Love Progression Wave <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            </h3>
            <p className="text-[11px] text-pink-700/70 font-medium">Milestones & Love Resonance</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/40 text-pink-600 text-xs font-bold shadow-sm">
          <Sparkles className="w-3 h-3 text-pink-500" />
          <span>99.8% Resonance 🌸</span>
        </div>
      </div>

      {/* SVG Wave Graph */}
      <div className="relative my-3 w-full h-36">
        <svg
          viewBox="0 0 420 160"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Rich Pink Gradient for Wave Area */}
            <linearGradient id="wavePinkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing stroke gradient with neon pink/rose */}
            <linearGradient id="strokePinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            {/* Filter for glowing neon pink line */}
            <filter id="neonPinkGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1="20" y1="40" x2="400" y2="40" stroke="#fbcfe8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="20" y1="80" x2="400" y2="80" stroke="#fbcfe8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="20" y1="120" x2="400" y2="120" stroke="#fbcfe8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Area under wave */}
          <path
            d="M 20,140 C 90,135 110,95 180,85 C 240,75 280,50 350,35 C 380,28 395,25 410,24 L 410,150 L 20,150 Z"
            fill="url(#wavePinkGradient)"
          />

          {/* Neon Smooth Pink Wave Curve */}
          <path
            d="M 20,140 C 90,135 110,95 180,85 C 240,75 280,50 350,35 C 380,28 395,25 410,24"
            fill="none"
            stroke="url(#strokePinkGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#neonPinkGlow)"
          />

          {/* Milestone interactive markers */}
          {milestones.map((m) => {
            const isHovered = activeMilestone?.id === m.id;
            return (
              <g
                key={m.id}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setActiveMilestone(m)}
                onMouseLeave={() => setActiveMilestone(null)}
              >
                {/* Outer pulsing ring on hover */}
                {isHovered && (
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r="13"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2.5"
                    className="animate-ping opacity-85"
                  />
                )}
                {/* Outer glow ring */}
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={isHovered ? "8" : "6"}
                  fill="#ffffff"
                  stroke="#ec4899"
                  strokeWidth="3"
                  className="transition-all duration-200 shadow-sm"
                />
                {/* Inner dot */}
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={isHovered ? "4" : "3"}
                  fill="#f43f5e"
                />
              </g>
            );
          })}
        </svg>

        {/* Milestone Tooltip Card */}
        {activeMilestone && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full px-3.5 py-2 rounded-2xl bg-white border border-pink-400 shadow-xl text-left backdrop-blur-md transition-all duration-150 animate-in fade-in zoom-in-95"
            style={{
              left: `${(activeMilestone.x / 420) * 100}%`,
              top: `${(activeMilestone.y / 160) * 100}%`,
              marginTop: '-10px',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-pink-600 font-mono font-bold">
                {activeMilestone.date}
              </span>
              <span className="text-slate-900 font-extrabold text-xs">
                {activeMilestone.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5 whitespace-nowrap">
              {activeMilestone.note}
            </p>
          </div>
        )}
      </div>

      {/* Milestone tag pills below graph */}
      <div className="pt-2 border-t border-pink-100 grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-2xl bg-pink-50/80 border border-pink-200/70 shadow-sm">
          <p className="text-[10px] text-slate-500 font-medium">Chapters Written</p>
          <p className="text-sm font-black text-pink-600 mt-0.5">24+ Tales</p>
        </div>
        <div className="p-2.5 rounded-2xl bg-pink-50/80 border border-pink-200/70 shadow-sm">
          <p className="text-[10px] text-slate-500 font-medium">Miles Explored</p>
          <p className="text-sm font-black text-rose-500 mt-0.5">1,480 km</p>
        </div>
        <div className="p-2.5 rounded-2xl bg-pink-50/80 border border-pink-200/70 shadow-sm">
          <p className="text-[10px] text-slate-500 font-medium">Sweet Laughs</p>
          <p className="text-sm font-black text-pink-500 mt-0.5">Infinite ∞ 💖</p>
        </div>
      </div>
    </div>
  );
}
