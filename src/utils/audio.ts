class RomanticSynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;
  private currentBeat: number = 0;

  // Romantic chord progression (C - G - Am - F)
  private chords = [
    [48, 55, 60, 64, 67, 72], // C Major notes (MIDI)
    [47, 54, 59, 62, 67, 71], // G Major notes
    [45, 52, 57, 60, 64, 69], // A minor notes
    [41, 48, 53, 57, 60, 65]  // F Major notes
  ];

  constructor() {
    // Lazy initialize to bypass browser autoplay policy
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private midiToFreq(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  private playTone(note: number, time: number, duration: number, volume = 0.15) {
    if (!this.ctx) return;

    // Create oscillator (Sine/Triangle for cozy, bell-like piano sound)
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    // Use triangle wave for soft acoustic/bell qualities
    osc.type = 'triangle';
    osc.frequency.value = this.midiToFreq(note);

    // Dynamic Filter to make it warmer/muffled like a soft keyboard
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    // Gain envelope (soft attack, long decay)
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(volume, time + 0.05); // attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration); // decay/sustain

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  public start() {
    this.init();
    if (this.isPlaying) return;
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.currentBeat = 0;

    const tempo = 110; // BPM
    const beatDuration = 60 / tempo; // Duration of one beat in seconds

    const playSequence = () => {
      if (!this.isPlaying || !this.ctx) return;

      const chordIndex = Math.floor(this.currentBeat / 8) % this.chords.length;
      const notes = this.chords[chordIndex];
      const step = this.currentBeat % 8;

      const now = this.ctx.currentTime;

      // Romantic, ambient arpeggio pattern
      if (step === 0) {
        // Bass note
        this.playTone(notes[0] - 12, now, beatDuration * 4, 0.25);
      }
      if (step === 0 || step === 4) {
        // Soft fifth
        this.playTone(notes[1], now, beatDuration * 3, 0.12);
      }
      
      // Melody pattern
      if (step === 1) this.playTone(notes[2], now, beatDuration * 1.5, 0.15);
      if (step === 2) this.playTone(notes[3], now, beatDuration * 1.5, 0.15);
      if (step === 3) this.playTone(notes[4], now, beatDuration * 1.5, 0.15);
      if (step === 5) this.playTone(notes[3], now, beatDuration * 1.5, 0.15);
      if (step === 6) this.playTone(notes[5], now, beatDuration * 2.0, 0.18);
      if (step === 7) this.playTone(notes[4], now, beatDuration * 1.5, 0.15);

      // Random soft high sparkles to simulate starry atmosphere
      if (Math.random() > 0.6) {
        const extraSparkle = notes[Math.floor(Math.random() * 3) + 3] + 12;
        this.playTone(extraSparkle, now + beatDuration * 0.5, beatDuration, 0.05);
      }

      this.currentBeat++;
      this.intervalId = setTimeout(playSequence, beatDuration * 1000);
    };

    playSequence();
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const romanticSynth = new RomanticSynth();
