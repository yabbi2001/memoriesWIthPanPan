import { useState } from 'react';
import { Heart, MessageCircleHeart, Sparkles, Check, Send } from 'lucide-react';

export default function MoodCheckinWidget() {
  const [selectedRating, setSelectedRating] = useState(5);
  const [customNote, setCustomNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([
    { id: 1, text: "Your smile when we shared ice cream melted all my stress away!", time: "Yesterday" }
  ]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const moodLevels = [
    { level: 1, emoji: '🌧️', label: 'Needing Hugs', desc: 'A bit tired, let’s cuddle softly' },
    { level: 2, emoji: '⛅', label: 'Gentle & Calm', desc: 'Peaceful quiet time together' },
    { level: 3, emoji: '🌸', label: 'Sweet & Warm', desc: 'Full of cute little moments' },
    { level: 4, emoji: '✨', label: 'Deeply in Love', desc: 'Heart fluttering every time we chat' },
    { level: 5, emoji: '💖', label: 'Over the Moon!', desc: 'Pure euphoric soulmate bliss' },
  ];

  const handleSelectRating = (level) => {
    setSelectedRating(level);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2400);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!customNote.trim()) return;

    setSavedNotes([
      { id: Date.now(), text: customNote.trim(), time: 'Just now' },
      ...savedNotes,
    ]);
    setCustomNote('');
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2400);
  };

  const activeMood = moodLevels.find((m) => m.level === selectedRating);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-pink-100/90 via-rose-50/90 to-pink-50/90 p-5 sm:p-6 border border-pink-300/80 shadow-2xl shadow-pink-200/50 relative overflow-hidden flex flex-col justify-between">
      {/* Curved neon pink aura in background */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-pink-500/20 text-pink-600 border border-pink-400/40">
              <MessageCircleHeart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                Weekly Connection Check-in
              </span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                How connected did you feel with Pan Pan?
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/20 text-pink-700 border border-pink-400/40 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Score: {selectedRating}/5 🌸</span>
          </div>
        </div>

        {/* Selected Mood Affirmation Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-white/80 border border-pink-300/70 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{activeMood?.emoji}</span>
            <div>
              <p className="text-xs font-bold text-slate-900">{activeMood?.label}</p>
              <p className="text-[11px] text-pink-800/80 font-medium">{activeMood?.desc}</p>
            </div>
          </div>
          {showConfirmation && (
            <span className="flex items-center gap-1 text-[11px] text-pink-600 bg-pink-100 border border-pink-400/40 px-2 py-0.5 rounded-full animate-bounce font-semibold">
              <Check className="w-3 h-3" /> Saved with Love!
            </span>
          )}
        </div>

        {/* 1 to 5 Rating Buttons */}
        <div className="mt-4">
          <label className="text-[11px] font-bold text-pink-900/70 mb-2 block">
            Tap a love rating (1 - 5):
          </label>
          <div className="grid grid-cols-5 gap-2">
            {moodLevels.map((item) => {
              const isSelected = selectedRating === item.level;
              return (
                <button
                  key={item.level}
                  onClick={() => handleSelectRating(item.level)}
                  className={`group relative flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-t from-pink-600 to-rose-500 text-white border-2 border-pink-300 shadow-lg shadow-pink-500/40 transform scale-105'
                      : 'bg-white/85 hover:bg-pink-100/90 text-slate-700 border border-pink-200 hover:border-pink-400'
                  }`}
                >
                  <span className="text-xl transition-transform group-hover:scale-125 duration-200">
                    {item.emoji}
                  </span>
                  <span className="text-xs font-bold mt-1">{item.level}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mini Sweetheart Note Input */}
      <div className="mt-4 pt-3 border-t border-pink-200/80">
        <form onSubmit={handleAddNote} className="relative flex items-center">
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Whisper a sweet note or gratitude to Pan Pan..."
            className="w-full text-xs bg-white text-slate-800 placeholder-pink-400/60 px-3.5 py-2.5 pr-10 rounded-xl border border-pink-300 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all shadow-sm font-medium"
          />
          <button
            type="submit"
            disabled={!customNote.trim()}
            className="absolute right-1.5 p-1.5 rounded-lg bg-pink-500 hover:bg-pink-400 text-white disabled:opacity-40 disabled:hover:bg-pink-500 transition-all cursor-pointer shadow-sm"
            title="Send note"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Latest sweetheart note */}
        {savedNotes.length > 0 && (
          <div className="mt-2 text-[11px] text-pink-900/80 italic flex items-center gap-1.5 px-1 truncate font-medium">
            <Heart className="w-3 h-3 text-pink-500 fill-pink-500 shrink-0" />
            <span className="truncate">"{savedNotes[0].text}"</span>
            <span className="text-pink-500 text-[10px] shrink-0 ml-auto">{savedNotes[0].time}</span>
          </div>
        )}
      </div>
    </div>
  );
}
