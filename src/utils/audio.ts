// Mimi the Kitten Premium Sound & Music Synthesizer Engine using Web Audio API
// Programmatic synthesis ensures 100% reliability with zero assets/loading wait!
// High-fidelity, customized, organic sound effects and premium cozy lofi background music.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterSFXVolume: number = 0.5;
  private masterMusicVolume: number = 0.3;
  
  // Background Music State
  private bgmInterval: any = null;
  private bgmGainNode: GainNode | null = null;
  private bgmPlaying: boolean = false;
  private isDucked: boolean = false;

  constructor() {
    // Lazy initialized on first user gesture to comply with browser autoplay policies
  }

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Setup BGM global Gain Node
      this.bgmGainNode = this.ctx.createGain();
      this.bgmGainNode.gain.setValueAtTime(this.masterMusicVolume, this.ctx.currentTime);
      this.bgmGainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Adjust volumes
  public setSFXVolume(vol: number) {
    this.masterSFXVolume = Math.max(0, Math.min(1, vol));
  }

  public setMusicVolume(vol: number) {
    this.masterMusicVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmGainNode && this.ctx) {
      const currentVol = this.isDucked ? this.masterMusicVolume * 0.25 : this.masterMusicVolume;
      this.bgmGainNode.gain.setTargetAtTime(currentVol, this.ctx.currentTime, 0.1);
    }
  }

  public getSFXVolume() { return this.masterSFXVolume; }
  public getMusicVolume() { return this.masterMusicVolume; }

  // Temporarily reduce music volume during important sound effects
  private duckMusic() {
    if (!this.bgmGainNode || !this.ctx || this.isDucked) return;
    this.isDucked = true;
    this.bgmGainNode.gain.setTargetAtTime(this.masterMusicVolume * 0.15, this.ctx.currentTime, 0.1);
    setTimeout(() => {
      if (this.bgmGainNode && this.ctx && this.isDucked) {
        this.isDucked = false;
        this.bgmGainNode.gain.setTargetAtTime(this.masterMusicVolume, this.ctx.currentTime, 0.4);
      }
    }, 1500);
  }

  // Generic Synth helper with flexible ADSR-like envelope and optional vibrato
  private playSynthNote(
    freqs: number[],
    duration: number,
    type: OscillatorType = 'sine',
    slide: boolean = false,
    delay: number = 0,
    vibratoFreq: number = 0,
    vibratoDepth: number = 0,
    volumeScale: number = 1.0
  ) {
    this.init();
    if (!this.ctx || this.masterSFXVolume === 0) return;

    const ctx = this.ctx;
    const time = ctx.currentTime + delay;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = type;
    
    // Set frequency timeline
    if (freqs.length === 1) {
      osc.frequency.setValueAtTime(freqs[0], time);
    } else if (freqs.length > 1) {
      osc.frequency.setValueAtTime(freqs[0], time);
      if (slide) {
        osc.frequency.exponentialRampToValueAtTime(freqs[freqs.length - 1], time + duration);
      } else {
        const step = duration / freqs.length;
        freqs.forEach((f, idx) => {
          osc.frequency.setValueAtTime(f, time + idx * step);
        });
      }
    }

    // Optional Vibrato / Tremolo LFO
    if (vibratoFreq > 0 && vibratoDepth > 0) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(vibratoFreq, time);
      lfoGain.gain.setValueAtTime(vibratoDepth, time);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(time);
      lfo.stop(time + duration);
    }

    // Custom warm lowpass filter to prevent piercing digital harshness
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'sine' ? 2500 : 1500, time);
    if (type === 'sawtooth' || type === 'square') {
      filter.frequency.exponentialRampToValueAtTime(600, time + duration);
    }

    // Professional envelope: Attack, Decay, Sustain, Release (ADSR) approximation
    const attack = 0.015;
    const peakVolume = this.masterSFXVolume * 0.45 * volumeScale;
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(peakVolume, time + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  // =================================================================
  // PREMIUM SOUND EFFECTS LIBRARY
  // =================================================================

  // Soft, satisfying organic wooden "plop" click
  public playClick() {
    this.playSynthNote([780, 390], 0.06, 'sine', true, 0, 0, 0, 0.7);
  }

  // Beautiful, luxurious rising chime transition
  public playTransition() {
    this.duckMusic();
    const now = 0;
    this.playSynthNote([329.63], 0.3, 'sine', false, now, 0, 0, 0.6); // E4
    this.playSynthNote([392.00], 0.3, 'sine', false, now + 0.05, 0, 0, 0.6); // G4
    this.playSynthNote([523.25], 0.4, 'sine', false, now + 0.10, 0, 0, 0.6); // C5
    this.playSynthNote([659.25], 0.5, 'sine', false, now + 0.15, 0, 0, 0.8); // E5
  }

  // Ultra-realistic, extremely adorable warm kitten meow
  public playMeow() {
    this.duckMusic();
    this.init();
    if (!this.ctx || this.masterSFXVolume === 0) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator(); // Formant 1 (Warmth)
    const osc2 = this.ctx.createOscillator(); // Formant 2 (Bright core)
    const osc3 = this.ctx.createOscillator(); // Harmonic top-end
    const lfo = this.ctx.createOscillator();  // Vibrato
    const lfoGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const gainNode = this.ctx.createGain();

    // Natural vocal pitch contour (rise slightly, then glide down smoothly)
    const startFreq = 580;
    const peakFreq = 740;
    const endFreq = 520;
    const dur = 0.52;

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(startFreq, now);
    osc1.frequency.linearRampToValueAtTime(peakFreq, now + 0.12);
    osc1.frequency.exponentialRampToValueAtTime(endFreq, now + dur);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(startFreq * 1.5, now);
    osc2.frequency.linearRampToValueAtTime(peakFreq * 1.5, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(endFreq * 1.5, now + dur);

    osc3.type = 'sawtooth';
    osc3.frequency.setValueAtTime(startFreq * 2, now);
    osc3.frequency.linearRampToValueAtTime(peakFreq * 2, now + 0.12);
    osc3.frequency.exponentialRampToValueAtTime(endFreq * 2, now + dur);

    // Warm vocal formant filter (Lowpass sweeping down to sound like "m-e-o-w")
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(4.0, now);
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(750, now + dur);

    // Dynamic cute vibrato
    lfo.frequency.setValueAtTime(7.5, now);
    lfoGain.gain.setValueAtTime(12, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    // Expressive kitten envelope
    const peak = this.masterSFXVolume * 0.55;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(peak * 0.9, now + 0.08); // soft attack
    gainNode.gain.linearRampToValueAtTime(peak, now + 0.22);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    lfo.start(now);
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    lfo.stop(now + dur);
    osc1.stop(now + dur);
    osc2.stop(now + dur);
    osc3.stop(now + dur);
  }

  // Trembling, sorrowful whimpering kitten meow
  public playSadMeow() {
    this.duckMusic();
    this.init();
    if (!this.ctx || this.masterSFXVolume === 0) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const gainNode = this.ctx.createGain();

    const dur = 0.58;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(490, now);
    osc.frequency.linearRampToValueAtTime(360, now + 0.35); // downward sorrow
    osc.frequency.exponentialRampToValueAtTime(260, now + dur);

    lfo.frequency.setValueAtTime(9.0, now); // fast trembling whimper
    lfoGain.gain.setValueAtTime(15, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    const peak = this.masterSFXVolume * 0.42;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(peak, now + 0.12);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + dur);
    osc.stop(now + dur);
  }

  // Highly soothing, organic purring vibration
  public playPurr() {
    this.init();
    if (!this.ctx || this.masterSFXVolume === 0) return;
    const now = this.ctx.currentTime;
    const dur = 0.95;

    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(62, now); // super warm low frequency purr

    lfo.frequency.setValueAtTime(14.5, now); // cozy chest vibration rate
    lfoGain.gain.setValueAtTime(10, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now); // mask any high hums

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.masterSFXVolume * 0.65, now + 0.15);
    gainNode.gain.linearRampToValueAtTime(this.masterSFXVolume * 0.50, now + 0.6);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + dur);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + dur);
    lfo.stop(now + dur);
  }

  // Subtle organic paw step tap
  public playFootsteps() {
    this.playSynthNote([110, 50], 0.05, 'sine', true, 0, 0, 0, 0.45);
  }

  // Sweet, sleepy kitten yawn sigh
  public playYawn() {
    this.duckMusic();
    const now = 0;
    // Slump down tone
    this.playSynthNote([480, 260], 0.75, 'sine', true, now, 6, 8, 0.6);
    // Breath release noise
    this.playSynthNote([120, 100], 0.65, 'triangle', false, now + 0.1, 0, 0, 0.3);
  }

  // Sparkling bubble cascade giggle chimes
  public playGiggle() {
    const notes = [1100, 1320, 1540, 1760, 1980, 2200];
    notes.forEach((f, idx) => {
      this.playSynthNote([f], 0.09, 'sine', false, idx * 0.035, 0, 0, 0.55);
    });
  }

  // Peaceful, warm, sleeping breathing cycle
  public playSnore() {
    this.init();
    if (!this.ctx || this.masterSFXVolume === 0) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(82, now);
    osc.frequency.linearRampToValueAtTime(108, now + 0.75); // inhale rise
    osc.frequency.linearRampToValueAtTime(82, now + 1.6); // exhale fall

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(130, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.masterSFXVolume * 0.22, now + 0.75);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.7);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.7);
  }

  // Satisfying bubble-pop food item select
  public playFoodPickup() {
    this.playSynthNote([220, 880], 0.08, 'sine', true, 0, 0, 0, 0.8);
  }

  // Cartoonish, rapid-crunch eating sound
  public playEating() {
    for (let i = 0; i < 5; i++) {
      const delay = i * 0.14;
      const freq = 750 + Math.random() * 450;
      this.playSynthNote([freq, freq - 350], 0.045, 'triangle', true, delay, 0, 0, 0.65);
    }
  }

  // High-fidelity gurgling beverage bloops
  public playDrinking() {
    for (let i = 0; i < 4; i++) {
      const delay = i * 0.18;
      this.playSynthNote([250, 950], 0.07, 'sine', true, delay, 0, 0, 0.75);
    }
  }

  // Magical fairy-dust sparkle reward chime
  public playHappyReward() {
    this.duckMusic();
    const notes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98]; // C major pentatonic sweep
    notes.forEach((f, idx) => {
      this.playSynthNote([f], 0.6, 'sine', false, idx * 0.045, 0, 0, 0.7);
    });
  }

  // Real, double-click premium switch sound
  public playLampSwitch() {
    const now = 0;
    this.playSynthNote([1600], 0.02, 'sine', false, now, 0, 0, 0.85); // metallic snap
    this.playSynthNote([110], 0.04, 'triangle', false, now + 0.015, 0, 0, 0.5); // base thud
  }

  // Comical bouncy cartoon "boing" spring
  public playBedJump() {
    this.playSynthNote([170, 480], 0.38, 'sine', true, 0, 14, 25, 0.9);
  }

  // Cozy fabric rustling whispers
  public playBlanketRustle() {
    for (let i = 0; i < 6; i++) {
      const delay = i * 0.06;
      const freq = 120 + Math.random() * 80;
      this.playSynthNote([freq], 0.08, 'triangle', false, delay, 0, 0, 0.4);
    }
  }

  // Beautiful morning sunrise arpeggio chord
  public playWakeupStretch() {
    this.duckMusic();
    const chord = [261.63, 329.63, 392.00, 493.88, 523.25]; // Cmaj7 beautiful cluster
    chord.forEach((f, idx) => {
      this.playSynthNote([f], 0.9, 'sine', false, idx * 0.08, 4, 6, 0.55);
    });
  }

  // Sparkling shower spray cascade
  public playShowerWater() {
    this.init();
    if (!this.ctx || this.masterSFXVolume === 0) return;
    const now = this.ctx.currentTime;
    
    // Generate 16 highly sparkling water chimes
    for (let i = 0; i < 18; i++) {
      const delay = i * 0.055;
      const freq = 850 + Math.random() * 950;
      this.playSynthNote([freq, freq - 350], 0.05, 'sine', true, delay, 0, 0, 0.5);
    }
  }

  // Glassy, high-pitched squeaking bubble pops
  public playSoapBubbles() {
    for (let i = 0; i < 10; i++) {
      const delay = i * 0.06;
      const freq = 1400 + Math.random() * 800;
      this.playSynthNote([freq, freq + 180], 0.035, 'sine', true, delay, 0, 0, 0.6);
    }
  }

  // Squeaky, crisp, rhythmic tooth brushing bristles
  public playTeethBrushing() {
    for (let i = 0; i < 12; i++) {
      const delay = i * 0.11;
      const freq = 180 + (i % 2 === 0 ? 60 : 0);
      this.playSynthNote([freq, freq + 30], 0.05, 'triangle', false, delay, 0, 0, 0.5);
    }
  }

  // High-fidelity futuristic smoothie blender whirr
  public playMixerBuzz() {
    this.duckMusic();
    this.init();
    if (!this.ctx || this.masterSFXVolume === 0) return;
    const now = this.ctx.currentTime;
    
    const duration = 1.6;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gainNode = this.ctx.createGain();

    // Rev up, hum steady, spin down smoothly
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(100, now);
    osc1.frequency.linearRampToValueAtTime(260, now + 0.35); // Rev up
    osc1.frequency.setValueAtTime(260, now + duration - 0.35);
    osc1.frequency.linearRampToValueAtTime(40, now + duration); // Spin down

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(150, now);
    osc2.frequency.linearRampToValueAtTime(390, now + 0.35); // Harmony core
    osc2.frequency.setValueAtTime(390, now + duration - 0.35);
    osc2.frequency.linearRampToValueAtTime(60, now + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, now);

    const peak = this.masterSFXVolume * 0.24;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(peak, now + 0.1);
    gainNode.gain.linearRampToValueAtTime(peak, now + duration - 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // Realistic, powerful swirling whirlpool toilet flush
  public playToiletFlush() {
    this.duckMusic();
    this.init();
    if (!this.ctx || this.masterSFXVolume === 0) return;
    const now = this.ctx.currentTime;

    // Synthesis of flowing water
    for (let i = 0; i < 24; i++) {
      const delay = i * 0.055;
      const baseFreq = Math.max(80, 750 - i * 26);
      this.playSynthNote([baseFreq, baseFreq - 100], 0.09, 'triangle', true, delay, 0, 0, 0.45);
    }
  }

  // Soft fuzzy fleece towel swish
  public playTowelWipe() {
    this.playSynthNote([240, 280, 240], 0.28, 'triangle', false, 0, 0, 0, 0.6);
  }

  // Crystalline fairy magic glint
  public playSparkle() {
    this.playSynthNote([1400, 1800, 2200], 0.32, 'sine', false, 0, 0, 0, 0.7);
  }

  // Highly satisfying, clean wooden cutting board chop impact
  public playChop() {
    const now = 0;
    this.playSynthNote([900, 220], 0.045, 'triangle', true, now, 0, 0, 0.9);
    this.playSynthNote([80], 0.035, 'sine', false, now, 0, 0, 0.6); // board resonance
  }

  // Rich, wet kitchen pot swirl splash
  public playStir() {
    this.playSynthNote([380, 480, 310], 0.075, 'sine', true, 0, 0, 0, 0.8);
  }

  // High-fidelity arcade crystal coin ring
  public playCoinCollect() {
    const now = 0;
    this.playSynthNote([987.77], 0.07, 'sine', false, now, 0, 0, 0.75); // B5
    this.playSynthNote([1318.51], 0.07, 'sine', false, now + 0.04, 0, 0, 0.75); // E6
    this.playSynthNote([1975.53], 0.22, 'sine', false, now + 0.08, 0, 0, 0.85); // B6 ring
  }

  // Joyous, uplifting majestic victory chime chord
  public playSuccess() {
    const now = 0;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Beautiful C Major triad cascade
    notes.forEach((f, idx) => {
      this.playSynthNote([f], 0.55, 'sine', false, now + idx * 0.04, 0, 0, 0.75);
    });
  }

  // Outstanding, sweeping orchestral fantasy stage complete arpeggio
  public playLevelComplete() {
    this.duckMusic();
    const now = 0;
    const melody = [523.25, 587.33, 659.25, 783.99, 880.00, 987.77, 1046.50, 1318.51];
    melody.forEach((f, idx) => {
      this.playSynthNote([f], 0.45, 'sine', false, now + idx * 0.06, 0, 0, 0.65);
    });
    // Warm harmonic backing chord
    const backing = [130.81, 196.00, 329.63, 392.00];
    backing.forEach((f) => {
      this.playSynthNote([f], 1.2, 'triangle', false, now + 0.15, 3, 5, 0.5);
    });
  }

  // Melancholic, jazz minor downward slide
  public playLose() {
    this.duckMusic();
    const now = 0;
    this.playSynthNote([392.00, 349.23, 311.13, 261.63], 0.55, 'triangle', true, now, 0, 0, 0.65);
    this.playSynthNote([116.54, 110.00], 0.5, 'sine', true, now + 0.25, 0, 0, 0.5); // dejected low bass
  }

  // Sparkling magical celestial star ring
  public playStarCollect() {
    this.playSynthNote([1600, 1900, 2400], 0.22, 'sine', true, 0, 0, 0, 0.8);
  }

  // Cute, realistic morning forest bird warbles
  public playBirdChirp() {
    const now = 0;
    this.playSynthNote([1800, 2300, 2100], 0.07, 'sine', false, now, 18, 30, 0.7);
    this.playSynthNote([2000, 2500, 2300], 0.07, 'sine', false, now + 0.09, 18, 30, 0.7);
  }

  // Cozy, soft woodland wind breeze
  public playWindSwoosh() {
    this.playSynthNote([130, 160, 140, 110], 0.95, 'sine', true, 0, 4, 8, 0.5);
  }

  // Realistic comic liquid splash plop
  public playWaterSplash() {
    this.playSynthNote([420, 90], 0.13, 'triangle', true, 0, 0, 0, 0.95);
    for (let i = 0; i < 5; i++) {
      this.playSynthNote([850 + i * 220, 1100], 0.05, 'sine', true, 0.04 + i * 0.035, 0, 0, 0.65);
    }
  }

  // Modern, premium clean dual-tone notify popup
  public playPopup() {
    const now = 0;
    this.playSynthNote([523.25], 0.12, 'sine', false, now, 0, 0, 0.8); // C5
    this.playSynthNote([783.99], 0.25, 'sine', false, now + 0.07, 0, 0, 0.9); // G5 (bright fifth chord resolve)
  }

  // Shimmering treasure chest reward chime sequence
  public playChestOpen() {
    this.duckMusic();
    const now = 0;
    // Magic harp sweep roll
    const scale = [261.63, 311.13, 349.23, 392.00, 466.16, 523.25, 622.25, 783.99, 1046.50];
    scale.forEach((f, idx) => {
      this.playSynthNote([f], 0.45, 'sine', false, now + idx * 0.05, 0, 0, 0.65);
    });
  }

  // =================================================================
  // BEAUTIFUL COZY LOFI BACKGROUND MUSIC (BGM) GENERATION
  // =================================================================
  public startBGM() {
    this.init();
    if (!this.ctx || this.bgmPlaying) return;
    this.bgmPlaying = true;
    
    // Gorgeous Warm Jazz-Seventh Chord Progression: Cmaj7 -> Am7 -> Dm7 -> G7
    // Soft, comforting, highly relaxing nursery/lofi melody played using warm tones.
    const chords = [
      // Cmaj7: C3 (130.81Hz), E3 (164.81Hz), G3 (196.00Hz), B3 (246.94Hz)
      [130.81, 164.81, 196.00, 246.94],
      // Am7: A2 (110.00Hz), C3 (130.81Hz), E3 (164.81Hz), G3 (196.00Hz)
      [110.00, 130.81, 164.81, 196.00],
      // Dm7: D3 (146.83Hz), F3 (174.61Hz), A3 (220.00Hz), C4 (261.63Hz)
      [146.83, 174.61, 220.00, 261.63],
      // G7: G2 (98.00Hz), B3 (246.94Hz), D3 (146.83Hz), F3 (174.61Hz)
      [98.00, 246.94, 146.83, 174.61]
    ];
    
    // Sweet, cozy, wandering fantasy lofi melody notes (0 represents a resting beat)
    const melody = [
      // Bar 1 (Cmaj7)
      523.25, 0, 659.25, 783.99,
      // Bar 2 (Am7)
      880.00, 987.77, 783.99, 0,
      // Bar 3 (Dm7)
      587.33, 0, 698.46, 880.00,
      // Bar 4 (G7)
      987.77, 1046.50, 783.99, 587.33,
      // Bar 5 (Cmaj7)
      523.25, 659.25, 783.99, 987.77,
      // Bar 6 (Am7)
      1046.50, 880.00, 783.99, 0,
      // Bar 7 (Dm7)
      698.46, 587.33, 523.25, 587.33,
      // Bar 8 (G7)
      783.99, 0, 0, 0
    ];

    let step = 0;
    const msPerBeat = 400; // Soothing, relaxed lofi tempo (150 BPM at quarter notes)

    const playLoopStep = () => {
      if (!this.bgmPlaying || !this.ctx || !this.bgmGainNode) return;
      if (this.masterMusicVolume === 0) return;

      const now = this.ctx.currentTime;
      
      // Determine the current bar index (each chord spans 4 beats / 1 bar)
      const barIndex = Math.floor(step / 4) % chords.length;
      const currentChord = chords[barIndex];
      const currentMelodyFreq = melody[step % melody.length];

      // Accompaniment Chords played with super warm, soft, low-pass filtered triangle waves
      const chordVolume = this.isDucked ? this.masterMusicVolume * 0.22 : this.masterMusicVolume;
      
      // We play the root note on the first beat of the bar, and the full warm chord on the second beat
      const isFirstBeatOfBar = (step % 4 === 0);
      
      if (isFirstBeatOfBar) {
        // Deep warm root bass note
        const oscB = this.ctx.createOscillator();
        const filterB = this.ctx.createBiquadFilter();
        const gainB = this.ctx.createGain();

        oscB.type = 'triangle';
        oscB.frequency.setValueAtTime(currentChord[0], now);

        filterB.type = 'lowpass';
        filterB.frequency.setValueAtTime(150, now); // super smooth bass

        gainB.gain.setValueAtTime(0, now);
        gainB.gain.linearRampToValueAtTime(chordVolume * 0.42, now + 0.1);
        gainB.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        oscB.connect(filterB);
        filterB.connect(gainB);
        gainB.connect(this.bgmGainNode);

        oscB.start(now);
        oscB.stop(now + 1.5);
      } else if (step % 4 === 1) {
        // Soft, gorgeous chord harmony notes
        currentChord.slice(1).forEach((f) => {
          if (!this.ctx || !this.bgmGainNode) return;
          const oscC = this.ctx.createOscillator();
          const filterC = this.ctx.createBiquadFilter();
          const gainC = this.ctx.createGain();

          oscC.type = 'triangle';
          oscC.frequency.setValueAtTime(f, now);

          filterC.type = 'lowpass';
          filterC.frequency.setValueAtTime(280, now); // warm pad filter

          gainC.gain.setValueAtTime(0, now);
          gainC.gain.linearRampToValueAtTime(chordVolume * 0.16, now + 0.15);
          gainC.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

          oscC.connect(filterC);
          filterC.connect(gainC);
          gainC.connect(this.bgmGainNode);

          oscC.start(now);
          oscC.stop(now + 1.4);
        });
      }

      // Melody notes played with beautifully smooth sine waves with a cozy warm decay
      if (currentMelodyFreq > 0) {
        const oscM = this.ctx.createOscillator();
        const filterM = this.ctx.createBiquadFilter();
        const gainM = this.ctx.createGain();
        const lfo = this.ctx.createOscillator(); // Soft cozy vibrato
        const lfoGain = this.ctx.createGain();

        oscM.type = 'sine';
        oscM.frequency.setValueAtTime(currentMelodyFreq, now);

        lfo.frequency.setValueAtTime(4.5, now); // slow, warm vibrato rate
        lfoGain.gain.setValueAtTime(5, now);
        lfo.connect(lfoGain);
        lfoGain.connect(oscM.frequency);

        filterM.type = 'lowpass';
        filterM.frequency.setValueAtTime(1600, now);

        gainM.gain.setValueAtTime(0, now);
        gainM.gain.linearRampToValueAtTime(chordVolume * 0.32, now + 0.05); // sweet soft attack
        gainM.gain.exponentialRampToValueAtTime(0.001, now + 0.72);

        oscM.connect(filterM);
        filterM.connect(gainM);
        gainM.connect(this.bgmGainNode);

        lfo.start(now);
        oscM.start(now);
        lfo.stop(now + 0.75);
        oscM.stop(now + 0.75);
      }

      step++;
    };

    // Trigger step immediately and start the looping interval
    playLoopStep();
    this.bgmInterval = setInterval(playLoopStep, msPerBeat);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

// Export single shared manager instance
export const synthAudio = new SoundEngine();
