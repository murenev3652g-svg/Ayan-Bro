class RomanticSynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;
  private currentBeat: number = 0;
  private musicType: 'musicbox' | 'lullaby' | 'starlit' = 'musicbox';

  // Chords for different progression styles
  private chords = {
    musicbox: [
      [48, 55, 60, 64, 67, 72], // C Major
      [47, 54, 59, 62, 67, 71], // G Major
      [45, 52, 57, 60, 64, 69], // A minor
      [41, 48, 53, 57, 60, 65]  // F Major
    ],
    lullaby: [
      [55, 59, 62, 67, 71, 74], // G Major (sweet & sleepy)
      [48, 52, 55, 60, 64, 67], // C Major
      [50, 54, 57, 62, 66, 69], // D Major
      [55, 59, 62, 67, 71, 74]  // G Major
    ],
    starlit: [
      [53, 60, 64, 67, 72, 76], // F Major7 (dreamy space)
      [55, 62, 66, 69, 74, 78], // G Major7
      [48, 55, 59, 62, 67, 71], // C Major7
      [45, 52, 55, 60, 64, 67]  // A minor7
    ]
  };

  constructor() {
    // Lazy initialize to bypass browser autoplay policy
  }

  public setMusicType(type: 'musicbox' | 'lullaby' | 'starlit') {
    this.musicType = type || 'musicbox';
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private midiToFreq(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  private playTone(note: number, time: number, duration: number, volume = 0.15, isSine = false) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    // Sine for super cozy, Triangle for musicbox bells
    osc.type = isSine ? 'sine' : 'triangle';
    osc.frequency.value = this.midiToFreq(note);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = isSine ? 800 : 1200;

    // Gain envelope with sweet dreamy fade-outs
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(volume, time + 0.06); // attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration); // decay

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

    // Slightly different tempos depending on music preset
    const tempo = this.musicType === 'lullaby' ? 95 : this.musicType === 'starlit' ? 105 : 112;
    const beatDuration = 60 / tempo;

    const playSequence = () => {
      if (!this.isPlaying || !this.ctx) return;

      const activeChords = this.chords[this.musicType] || this.chords.musicbox;
      const chordIndex = Math.floor(this.currentBeat / 8) % activeChords.length;
      const notes = activeChords[chordIndex];
      const step = this.currentBeat % 8;

      const now = this.ctx.currentTime;
      const useSine = this.musicType === 'lullaby';

      // Bass notes
      if (step === 0) {
        this.playTone(notes[0] - 12, now, beatDuration * 4, useSine ? 0.22 : 0.24, useSine);
      }
      if (step === 0 || step === 4) {
        this.playTone(notes[1], now, beatDuration * 3, useSine ? 0.10 : 0.12, useSine);
      }
      
      // Sweet arpeggiated melodic lines
      if (step === 1) this.playTone(notes[2], now, beatDuration * 1.5, useSine ? 0.12 : 0.14, useSine);
      if (step === 2) this.playTone(notes[3], now, beatDuration * 1.5, useSine ? 0.12 : 0.14, useSine);
      if (step === 3) this.playTone(notes[4] + (this.musicType === 'starlit' ? 12 : 0), now, beatDuration * 1.5, useSine ? 0.12 : 0.14, useSine);
      if (step === 5) this.playTone(notes[3], now, beatDuration * 1.5, useSine ? 0.12 : 0.14, useSine);
      if (step === 6) this.playTone(notes[5] + (this.musicType === 'starlit' ? 12 : 0), now, beatDuration * 2.0, useSine ? 0.14 : 0.16, useSine);
      if (step === 7) this.playTone(notes[4], now, beatDuration * 1.5, useSine ? 0.12 : 0.14, useSine);

      // Random high pitch sparkles simulating star sparkles
      if (Math.random() > 0.5) {
        const extraSparkle = notes[Math.floor(Math.random() * 3) + 3] + 12;
        this.playTone(extraSparkle, now + beatDuration * 0.5, beatDuration * 0.8, 0.04, useSine);
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

  public playTouchSound() {
    try {
      this.init();
      if (!this.ctx) return;
      
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5 note - very sweet, gentle chime
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.06, now + 0.008);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {
      console.warn('Audio touch sound failed', e);
    }
  }
}

export const romanticSynth = new RomanticSynth();
