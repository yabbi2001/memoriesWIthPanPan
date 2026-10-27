import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  PhoneCall, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Heart, 
  Clock,
  Maximize2
} from 'lucide-react';
import ImageExpandModal from './ImageExpandModal';

// --- ASSET CONFIGURATION (Update your image or audio directly here) ---
import defaultCallImg from '@/assets/call.jpeg';
import callAudioFile from '@/assets/audio/call.mp3';

const FIRST_CALL_AUDIO_SRC = callAudioFile;
const FIRST_CALL_IMAGE_SRC = defaultCallImg;

export default function FirstPhoneCallWidget({
  audioSrc = FIRST_CALL_AUDIO_SRC,
  imageSrc = FIRST_CALL_IMAGE_SRC,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(248); // default 04:08 call
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Format seconds to mm:ss
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Web Audio Fallback: Plays warm music-box melody if no custom audio file is imported yet
  const playSynthesizedMelody = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const notes = [261.63, 329.63, 392.00, 440.00, 349.23, 329.63, 293.66, 261.63];
      let noteIndex = 0;

      synthIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(notes[noteIndex % notes.length], now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start(now);
        osc.stop(now + 1.3);

        noteIndex++;
        setCurrentTime((prev) => {
          if (prev >= duration) {
            handlePause();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (e) {
      console.warn('Web Audio synth playback note:', e);
    }
  };

  const stopSynthesizedMelody = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  const handlePlay = () => {
    window.dispatchEvent(new CustomEvent('app-audio-play', { detail: { source: 'phone-call' } }));
    setIsPlaying(true);
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch((err) => console.warn('Audio play error:', err));
    } else {
      playSynthesizedMelody();
    }
  };

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (audioSrc && audioRef.current) {
      audioRef.current.pause();
    } else {
      stopSynthesizedMelody();
    }
  }, [audioSrc]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleSeek = (e) => {
    const targetSeconds = parseFloat(e.target.value);
    setCurrentTime(targetSeconds);
    if (audioSrc && audioRef.current) {
      audioRef.current.currentTime = targetSeconds;
    }
  };

  const handleRestart = () => {
    window.dispatchEvent(new CustomEvent('app-audio-play', { detail: { source: 'phone-call' } }));
    setCurrentTime(0);
    if (audioSrc && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  useEffect(() => {
    const handleOtherAudioPlay = (e) => {
      if (e.detail?.source !== 'phone-call') {
        handlePause();
      }
    };
    window.addEventListener('app-audio-play', handleOtherAudioPlay);

    return () => {
      window.removeEventListener('app-audio-play', handleOtherAudioPlay);
      stopSynthesizedMelody();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [handlePause]);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-pink-100/95 via-rose-50/90 to-pink-50/95 p-5 sm:p-6 border border-pink-300/80 shadow-2xl shadow-pink-200/50 relative overflow-hidden flex flex-col justify-between transition-all">
      {/* Background Soft Pink Glow Orbs */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* HTML5 Audio element for custom audio source */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onPlay={() => {
            window.dispatchEvent(new CustomEvent('app-audio-play', { detail: { source: 'phone-call' } }));
          }}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 248)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                Special Memory
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              Our First Phone Call <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
            </h3>
            <p className="text-[11px] text-pink-700/80 font-medium">
              Oct 19, 2026 • 8:34 AM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 border border-pink-300/80 text-pink-700 text-xs font-bold shadow-xs">
          <Clock className="w-3 h-3 text-pink-500" />
          <span>Morning Call ☀️</span>
        </div>
      </div>

      {/* Main Grid: Call Image (Left) & Audio Player Controls (Right) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-1">
        
        {/* Photo Container (sm:col-span-5) */}
        <div className="sm:col-span-5 flex flex-col items-center">
          <div
            onClick={() => setIsExpanded(true)}
            className="group relative w-full aspect-square max-w-[150px] sm:max-w-none rounded-2xl overflow-hidden border-2 border-pink-200/90 shadow-md bg-pink-100 cursor-pointer hover:border-pink-400 transition-all hover:shadow-lg"
            title="Click to expand photo"
          >
            <img
              src={imageSrc}
              alt="First Phone Call Memory"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 text-white text-xs font-semibold backdrop-blur-[1px]">
              <Maximize2 className="w-5 h-5 text-pink-300 drop-shadow" />
              <span className="drop-shadow text-[11px]">Click to expand</span>
            </div>

            {/* Calling Status Overlay Ribbon */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold flex items-center gap-1 shadow-sm pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Oct 19 • 8:34 AM ☀️</span>
            </div>

            {/* Bottom Tag */}
            <div className="absolute bottom-1.5 inset-x-1.5 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-xs border border-pink-200 text-[10px] font-bold text-pink-600 flex items-center justify-between shadow-xs pointer-events-none">
              <span className="truncate">First Sweet Voice</span>
              <Heart className="w-3 h-3 text-pink-500 fill-pink-500 shrink-0 ml-1" />
            </div>
          </div>
        </div>

        {/* Audio Player Controls (sm:col-span-7) */}
        <div className="sm:col-span-7 flex flex-col justify-center space-y-3">
          
          {/* Animated Waveform Equalizer Display */}
          <div className="p-3 rounded-2xl bg-white/90 border border-pink-200/90 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 h-6">
              {[40, 75, 55, 90, 60, 100, 45, 80, 65, 95, 50, 70].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying 
                      ? 'bg-gradient-to-t from-pink-500 to-rose-400 animate-pulse' 
                      : 'bg-pink-200'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(20, (h * ((i % 3) + 1)) % 100)}%` : '25%',
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>

            <div className="text-right">
              <p className="text-xs font-mono font-bold text-slate-800">
                {formatTime(currentTime)} <span className="text-pink-400">/</span> {formatTime(duration)}
              </p>
              <p className="text-[10px] text-pink-600 font-medium">
                {isPlaying ? 'Playing our memory...' : 'Ready to listen'}
              </p>
            </div>
          </div>

          {/* Seeker Progress Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Control Buttons: Play/Pause, Restart, Mute */}
          <div className="flex items-center justify-between pt-1">
            
            <button
              type="button"
              onClick={handleRestart}
              className="p-2 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 text-slate-600 hover:text-pink-600 transition-all cursor-pointer shadow-xs"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Big Main Play/Pause Button */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-500 text-white shadow-lg shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play First Call'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 text-slate-600 hover:text-pink-600 transition-all cursor-pointer shadow-xs"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>

          </div>

        </div>

      </div>

      {/* Bottom Sweet Note */}
      <div className="mt-3 pt-2.5 border-t border-pink-200/80 flex items-center justify-between text-[11px] text-pink-900/80 italic font-medium">
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
          <span>"Hearing your sweet morning voice on Oct 19 at 8:34 AM gave me butterflies 🦋"</span>
        </span>
        <span className="text-pink-600 font-bold not-italic text-[10px]">
          Pan Pan & ZMH
        </span>
      </div>

      {/* Expanded Image Modal */}
      <ImageExpandModal
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        src={imageSrc}
        alt="First Phone Call Memory"
        title="First Phone Call 📞💖"
        caption="October 19 • 8:34 AM — The first time hearing each other's voice"
      />
    </div>
  );
}
