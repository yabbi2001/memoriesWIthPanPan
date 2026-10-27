// Web Audio API Lofi Ambient Chord Synth for Couples Storybook
// Creates warm, dreamy Rhodes/piano-style lofi chords in real-time without external audio files.

class LofiAudioSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.filter = null;
    this.intervalId = null;
    this.chordIndex = 0;
    this.onStateChange = null;

    // Sweet nostalgic chord progression: Fmaj9 -> Em7 -> Dm9 -> Cmaj7
    this.chords = [
      [174.61, 220.0, 261.63, 329.63, 392.0], // Fmaj9 (F3, A3, C4, E4, G4)
      [164.81, 196.0, 246.94, 293.66, 392.0], // Em7 (E3, G3, B3, D4, G4)
      [146.83, 220.0, 261.63, 329.63, 349.23], // Dm9 (D3, A3, C4, E4, F4)
      [130.81, 196.0, 246.94, 261.63, 329.63], // Cmaj7 (C3, G3, B3, C4, E4)
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

      // Warm low-pass filter characteristic of lofi beats
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(850, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  playChord(frequencies) {
    if (!this.ctx || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const chordDuration = 3.6;

    frequencies.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Stagger notes slightly for a gentle humanized arpeggio strum
      const noteDelay = i * 0.05 + Math.random() * 0.03;
      const noteStart = now + noteDelay;

      // Soft triangle + sine blend for warm vintage electric piano tone
      osc.type = i === 0 ? 'sine' : (i % 2 === 0 ? 'triangle' : 'sine');
      
      // Slight pitch drift for vintage vinyl/tape vibe
      const detune = (Math.random() - 0.5) * 8;
      osc.detune.setValueAtTime(detune, noteStart);
      osc.frequency.setValueAtTime(freq, noteStart);

      // Smooth attack and lingering release envelope
      noteGain.gain.setValueAtTime(0.0001, noteStart);
      noteGain.gain.linearRampToValueAtTime(0.065 / (i + 1) * 1.5, noteStart + 0.25);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + chordDuration);

      osc.connect(noteGain);
      noteGain.connect(this.filter);

      osc.start(noteStart);
      osc.stop(noteStart + chordDuration + 0.1);
    });
  }

  toggle() {
    this.init();

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  start() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.chordIndex = 0;

    // Play first chord immediately
    this.playChord(this.chords[this.chordIndex]);
    this.chordIndex = (this.chordIndex + 1) % this.chords.length;

    // Loop through chord progression every 3.8 seconds
    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.playChord(this.chords[this.chordIndex]);
        this.chordIndex = (this.chordIndex + 1) % this.chords.length;
      }
    }, 3800);

    if (this.onStateChange) this.onStateChange(true);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.onStateChange) this.onStateChange(false);
  }
}

export const lofiSynth = new LofiAudioSynth();
export default lofiSynth;
