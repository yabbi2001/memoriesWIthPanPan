import { useState, useEffect } from 'react';
import {
  X,
  Mail,
  MailOpen,
  Lock,
  Heart,
  Sparkles,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  LOVE_ENVELOPES,
  isEnvelopeUnlocked,
  getEnvelopeUnlockDateLabel,
} from '../utils/envelopesData';

const STORAGE_KEY = 'panpan_zmh_opened_envelopes_v1';

export default function LoveEnvelopesModal({ isOpen, onClose }) {
  const [now, setNow] = useState(() => new Date());
  const [selectedEnvelope, setSelectedEnvelope] = useState(null);
  const [lockedNotice, setLockedNotice] = useState(null);
  const [shakingId, setShakingId] = useState(null);
  const [openedIds, setOpenedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep current date fresh
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedEnvelope) {
          setSelectedEnvelope(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedEnvelope, onClose]);

  if (!isOpen) return null;

  const currentFormattedDate = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const unlockedCount = LOVE_ENVELOPES.filter((env) => isEnvelopeUnlocked(env, now)).length;

  const handleEnvelopeClick = (envelope) => {
    const unlocked = isEnvelopeUnlocked(envelope, now);

    if (!unlocked) {
      setShakingId(envelope.id);
      setTimeout(() => setShakingId(null), 600);

      const isTodayEnvelope =
        now.getFullYear() === envelope.year &&
        now.getMonth() === envelope.month &&
        now.getDate() === envelope.day;

      setLockedNotice({
        id: envelope.id,
        dateStr: envelope.fullDateStr,
        unlockLabel: getEnvelopeUnlockDateLabel(envelope),
        isTodayEnvelope,
      });
      return;
    }

    setLockedNotice(null);
    setSelectedEnvelope(envelope);

    if (!openedIds.includes(envelope.id)) {
      const updated = [...openedIds, envelope.id];
      setOpenedIds(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Big Popup Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl bg-gradient-to-b from-[#fff5f8] via-white to-[#fff0f5] border-2 border-pink-300/90 shadow-2xl shadow-pink-500/25 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
      >
        {/* Decorative Background Orbs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-7 py-4 sm:py-5 bg-white/90 backdrop-blur-md border-b border-pink-200/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  15 Days of Love Envelopes <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/15 border border-pink-400/40 text-pink-600 text-[11px] font-bold">
                  Nov 23 – Dec 7
                </span>
              </div>
              <p className="text-xs text-pink-700/80 font-medium mt-0.5">
                One envelope unlocks day by day after each date passes • Today is{' '}
                <strong className="text-pink-600">{currentFormattedDate}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Unlocked progress badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-xs font-bold text-pink-600 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>
                {unlockedCount} / {LOVE_ENVELOPES.length} Unlocked
              </span>
            </div>

            {/* Close popup button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close envelopes popup"
              className="p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-slate-600 hover:text-pink-600 border border-pink-200 transition-all cursor-pointer hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Locked Notice Banner (if user clicked a locked envelope) */}
        {lockedNotice && !selectedEnvelope && (
          <div className="relative z-10 mx-5 sm:mx-7 mt-4 px-4 py-3 rounded-2xl bg-rose-50 border border-rose-300/90 text-rose-800 flex items-center justify-between gap-3 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
              <div className="p-1.5 rounded-xl bg-rose-500/15 text-rose-600 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-rose-700">
                  {lockedNotice.dateStr} Envelope is Locked!
                </span>{' '}
                {lockedNotice.isTodayEnvelope ? (
                  <span>
                    Since today is <strong>{lockedNotice.dateStr}</strong>, you cannot open today&apos;s envelope yet — you can open envelopes up to yesterday, and this one unlocks tomorrow on{' '}
                    <strong>{lockedNotice.unlockLabel}</strong>! 💖
                  </span>
                ) : (
                  <span>
                    Envelopes open day by day. This envelope will unlock on{' '}
                    <strong>{lockedNotice.unlockLabel}</strong>! 💖
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLockedNotice(null)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2 py-1 rounded-lg hover:bg-rose-100 cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Body: Either the Opened Envelope Letter View OR the 15 Envelopes Grid */}
        <div className="relative z-10 flex-1 overflow-y-auto p-5 sm:p-7">
          {selectedEnvelope ? (
            /* OPENED LOVE LETTER VIEW */
            <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setSelectedEnvelope(null)}
                className="mb-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 text-xs font-bold text-pink-600 shadow-xs transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All 15 Envelopes</span>
              </button>

              <div className="relative rounded-3xl bg-white p-6 sm:p-8 border-2 border-pink-300 shadow-xl shadow-pink-200/50 overflow-hidden">
                {/* Top decorative ribbon */}
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400" />

                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/30 text-pink-600 text-xs font-extrabold">
                    <MailOpen className="w-3.5 h-3.5" />
                    <span>Envelope #{selectedEnvelope.dayNumber} of 15</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-slate-600 text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5 text-pink-500" />
                    <span>{selectedEnvelope.fullDateStr}</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {selectedEnvelope.title}
                </h3>

                <div className="mt-5 p-5 sm:p-6 rounded-2xl bg-[#fff8fa] border border-pink-200/80 shadow-inner">
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                    {selectedEnvelope.message}
                  </p>
                </div>

                {selectedEnvelope.quote && (
                  <div className="mt-5 p-4 rounded-2xl bg-pink-50/90 border-l-4 border-pink-500 text-xs sm:text-sm italic text-pink-900 font-semibold">
                    &ldquo;{selectedEnvelope.quote}&rdquo;
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Envelope Opened</span>
                  </div>
                  <span className="text-sm font-extrabold text-pink-600 italic">
                    {selectedEnvelope.footerNote}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* 15 ENVELOPES GRID (3x5 on Desktop, 2-3 cols on Tablet/Mobile) */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {LOVE_ENVELOPES.map((envelope) => {
                const unlocked = isEnvelopeUnlocked(envelope, now);
                const isOpened = openedIds.includes(envelope.id);
                const isShaking = shakingId === envelope.id;
                const isTodayEnvelope =
                  now.getFullYear() === envelope.year &&
                  now.getMonth() === envelope.month &&
                  now.getDate() === envelope.day;

                return (
                  <button
                    key={envelope.id}
                    type="button"
                    onClick={() => handleEnvelopeClick(envelope)}
                    className={`group relative text-left rounded-2xl p-3.5 sm:p-4 border-2 transition-all duration-300 flex flex-col justify-between min-h-[155px] sm:min-h-[168px] cursor-pointer select-none ${
                      isShaking ? 'animate-bounce border-rose-400' : ''
                    } ${
                      unlocked
                        ? 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-pink-50/90 border-pink-300 hover:border-pink-500 shadow-md shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-300/40 hover:-translate-y-1'
                        : 'bg-slate-100/85 hover:bg-slate-100 border-slate-200/90 text-slate-400 opacity-85'
                    }`}
                  >
                    {/* Top Row: Day number & Date Pill */}
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          unlocked
                            ? 'bg-pink-500/15 text-pink-600 border border-pink-300'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        Day {envelope.dayNumber}
                      </span>

                      <span
                        className={`text-xs font-black ${
                          unlocked ? 'text-slate-800' : 'text-slate-500'
                        }`}
                      >
                        {envelope.dateStr}
                      </span>
                    </div>

                    {/* Center Envelope Flap & Seal Illustration */}
                    <div className="my-3 flex flex-col items-center justify-center">
                      <div
                        className={`relative w-14 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 ${
                          unlocked
                            ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30 group-hover:scale-110'
                            : 'bg-slate-200 text-slate-400 border border-slate-300'
                        }`}
                      >
                        {unlocked ? (
                          isOpened ? (
                            <MailOpen className="w-6 h-6 text-white" />
                          ) : (
                            <Mail className="w-6 h-6 text-white animate-pulse" />
                          )
                        ) : (
                          <Lock className="w-5 h-5 text-slate-500" />
                        )}

                        {/* Wax Heart Seal Badge */}
                        <span
                          className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 border-white shadow-xs ${
                            unlocked ? 'bg-rose-500 text-white' : 'bg-slate-400 text-white'
                          }`}
                        >
                          ♥
                        </span>
                      </div>
                    </div>

                    {/* Bottom Status Footer */}
                    <div className="w-full pt-2 border-t border-pink-100/80 flex items-center justify-between text-[11px]">
                      {unlocked ? (
                        isOpened ? (
                          <span className="font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Opened 💌</span>
                          </span>
                        ) : (
                          <span className="font-extrabold text-pink-600 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-pink-500" />
                            <span>Tap to Open</span>
                          </span>
                        )
                      ) : isTodayEnvelope ? (
                        <span className="font-bold text-amber-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Unlocks Tomorrow</span>
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="relative z-10 px-5 sm:px-7 py-3.5 bg-white/90 border-t border-pink-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>
              15 Envelopes from <strong className="text-pink-600">Nov 23</strong> to{' '}
              <strong className="text-pink-600">Dec 7</strong> • Made with love for Pan Pan
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-sm shadow-pink-500/30 transition-all cursor-pointer"
          >
            Continue to Storybook →
          </button>
        </div>
      </div>
    </div>
  );
}
