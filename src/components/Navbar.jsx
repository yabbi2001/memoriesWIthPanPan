import { useState, useEffect, useRef } from 'react';
import { Heart, Music, Sparkles, Calendar, Volume2, SkipForward } from 'lucide-react';

import panpanAvatar from '@/assets/avatar/panpan.jpg';
import zmhAvatar from '@/assets/avatar/zmh.jpg';
import thinkingOutLoudAudio from '@/assets/audio/thinkingOutLoud.mp3';
import scarsBecomeArtAudio from '@/assets/audio/scarsBecomeArt.mp3';
import heaven from '@/assets/audio/heaven.mp3';
const PLAYLIST = [
  { id: 'scars', title: 'Scars Become Art', src: scarsBecomeArtAudio },
  { id: 'heaven', title: 'Heaven', src: heaven },
  { id: 'thinking', title: 'Thinking Out Loud', src: thinkingOutLoudAudio },
];

// First conversation: Sep 17, 2026, 8:57 PM
const CONVERSATION_START_DATE = new Date(2026, 8, 17, 20, 57, 0);
const getDefaultDaysTogether = () => {
  const diff = Date.now() - CONVERSATION_START_DATE.getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

export default function Navbar({ daysTogether }) {
  const displayDaysTogether = daysTogether ?? getDefaultDaysTogether();
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  const [currentDateStr] = useState(() => {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return now.toLocaleDateString(undefined, options);
  });

  const handleToggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      window.dispatchEvent(new CustomEvent('app-audio-play', { detail: { source: 'navbar-music' } }));
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch((err) => console.warn('Audio play error:', err));
    }
  };

  const handleNextTrack = (e) => {
    if (e) e.stopPropagation();
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
  };

  const isPlayingRef = useRef(isPlayingMusic);
  useEffect(() => {
    isPlayingRef.current = isPlayingMusic;
  }, [isPlayingMusic]);

  // Listen for audio from other components (like first phone call) and auto-pause background music
  useEffect(() => {
    const handleOtherAudioPlay = (e) => {
      if (e.detail?.source !== 'navbar-music') {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlayingMusic(false);
      }
    };

    window.addEventListener('app-audio-play', handleOtherAudioPlay);
    return () => window.removeEventListener('app-audio-play', handleOtherAudioPlay);
  }, []);

  // When track index changes, reload and if already playing, keep playing new song
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlayingRef.current) {
        audioRef.current.play().catch((err) => console.warn('Audio switch error:', err));
      }
    }
  }, [currentTrackIndex]);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-pink-200/80 px-4 sm:px-6 lg:px-8 py-3.5 shadow-sm shadow-pink-100/50 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Partner Avatars */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-rose-500/25 to-pink-400/30 border border-pink-400/50 shadow-sm shadow-pink-500/20 group">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500/40 group-hover:scale-125 transition-transform duration-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                  Ditto <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-600 border border-pink-400/30 font-semibold shadow-sm">Storybook</span>
                </h1>
              </div>
              <p className="text-xs text-pink-700/70 font-medium">Pan Pan & ZMH's Love Journal</p>
            </div>
          </div>

          {/* Couple Avatars with status dot */}
          <div className="flex items-center gap-2 bg-pink-50/90 px-3 py-1.5 rounded-full border border-pink-200 shadow-sm">
            <div className="flex items-center -space-x-2">
              <div className="relative" title="Pan Pan">
                <img
                  src={panpanAvatar}
                  alt="Pan Pan"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-pink-500 shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white"></span>
              </div>
              <div className="relative" title="ZMH">
                <img
                  src={zmhAvatar}
                  alt="ZMH"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-rose-400 shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-pink-400 ring-1 ring-white"></span>
              </div>
            </div>
            <div className="text-xs font-semibold text-slate-700 hidden sm:block">
              Pan Pan <span className="text-pink-500">💖</span> ZMH
            </div>
          </div>
        </div>

        {/* Action Widgets: Music Player, Date/Days Counter, Add Memory */}
        <div className="flex items-center flex-nowrap justify-between sm:justify-end gap-2 sm:gap-3.5 w-full md:w-auto">
          
          {/* Days Together Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-pink-100/90 border border-pink-300/70 text-xs shadow-sm shrink-0 whitespace-nowrap">
            <div className="p-1 rounded-lg bg-pink-500/20 text-pink-600">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-slate-600 font-normal">Together: </span>
              <span className="font-bold text-pink-600">{displayDaysTogether} Days 🌸</span>
            </div>
          </div>

          {/* Current Date */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50/70 border border-pink-200/80 text-xs text-slate-600 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            <span>{currentDateStr}</span>
          </div>

          {/* Romantic Playlist Audio Player */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleMusic}
              aria-label={isPlayingMusic ? 'Pause Romantic Music' : 'Play Romantic Music'}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 border cursor-pointer shrink-0 whitespace-nowrap ${
                isPlayingMusic
                  ? 'bg-pink-500/20 border-pink-400 text-pink-600 glow-pink shadow-md shadow-pink-500/20'
                  : 'bg-white hover:bg-pink-50 border-pink-200 text-slate-700'
              }`}
              title={isPlayingMusic ? `Playing: ${currentTrack.title} (Click to pause)` : 'Play Thinking Out Loud & Scars Become Art'}
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-pink-500 animate-bounce shrink-0" />
                  <span className="hidden sm:inline font-bold truncate max-w-[130px]">
                    {currentTrack.title}
                  </span>
                  <span className="sm:hidden font-bold">Playing</span>
                  <div className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-pink-500 rounded-full animate-pulse"></span>
                    <span className="w-1 h-4 bg-rose-400 rounded-full animate-pulse delay-100"></span>
                    <span className="w-1 h-2 bg-pink-400 rounded-full animate-pulse delay-200"></span>
                  </div>
                </>
              ) : (
                <>
                  <Music className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span className="hidden sm:inline">Play Music 🎵</span>
                  <span className="sm:hidden">Play 🎵</span>
                </>
              )}
            </button>

            {/* Switch to next track */}
            <button
              type="button"
              onClick={handleNextTrack}
              className="p-1.5 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 hover:text-pink-600 hover:border-pink-300 transition-all cursor-pointer shadow-xs shrink-0"
              title={`Switch song (Next: ${PLAYLIST[(currentTrackIndex + 1) % PLAYLIST.length].title})`}
              aria-label="Next song"
            >
              <SkipForward className="w-3.5 h-3.5 text-pink-500" />
            </button>
          </div>
        </div>
      </div>

      {/* HTML5 Audio Player */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="auto"
        onPlay={() => {
          window.dispatchEvent(new CustomEvent('app-audio-play', { detail: { source: 'navbar-music' } }));
        }}
        onEnded={handleNextTrack}
      />
    </header>
  );
}
