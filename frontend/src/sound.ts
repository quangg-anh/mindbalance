export type MusicMood = 'dorm' | 'campus' | 'classroom' | 'surprise' | 'ending';

type AudioWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

class GameAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private timer: number | null = null;
  private step = 0;
  private enabled = true;
  private mood: MusicMood = 'dorm';

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopMusic();
      void this.context?.suspend();
      return;
    }
    void this.ensureStarted();
  }

  setMood(mood: MusicMood) {
    if (this.mood === mood) return;
    this.mood = mood;
    if (this.enabled && this.context?.state === 'running') this.restartMusic();
  }

  async ensureStarted() {
    if (!this.enabled) return;
    if (!this.context) {
      const AudioContextClass = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
      if (!AudioContextClass) return;
      this.context = new AudioContextClass();
      this.master = this.context.createGain();
      this.master.gain.value = 0.42;
      this.master.connect(this.context.destination);
      this.music = this.context.createGain();
      this.music.gain.value = 0.16;
      this.music.connect(this.master);
    }
    if (this.context.state === 'suspended') await this.context.resume();
    if (this.timer === null) this.startMusic();
  }

  play(type: 'click' | 'choice' | 'advance' | 'surprise' | 'ending') {
    if (!this.enabled) return;
    void this.ensureStarted().then(() => {
      if (!this.context || !this.master) return;
      const now = this.context.currentTime;
      const presets = {
        click: [520, 0.035, 0.035],
        choice: [660, 0.09, 0.08],
        advance: [440, 0.16, 0.1],
        surprise: [180, 0.32, 0.15],
        ending: [523.25, 0.65, 0.12],
      } as const;
      const [frequency, duration, volume] = presets[type];
      this.tone(frequency, now, duration, volume, type === 'surprise' ? 'sawtooth' : 'sine', this.master);
      if (type === 'choice') this.tone(frequency * 1.25, now + 0.055, duration, volume * 0.75, 'sine', this.master);
      if (type === 'advance') this.tone(frequency * 1.5, now + 0.09, duration, volume * 0.7, 'triangle', this.master);
      if (type === 'ending') {
        this.tone(659.25, now + 0.18, 0.55, 0.1, 'sine', this.master);
        this.tone(783.99, now + 0.36, 0.75, 0.09, 'sine', this.master);
      }
    });
  }

  private tone(frequency: number, start: number, duration: number, volume: number, wave: OscillatorType, output: AudioNode) {
    if (!this.context) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.025, duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  private startMusic() {
    if (!this.context || !this.music || this.timer !== null) return;
    this.step = 0;
    this.playMusicStep();
    this.timer = window.setInterval(() => this.playMusicStep(), 1450);
  }

  private restartMusic() {
    this.stopMusic();
    this.startMusic();
  }

  private stopMusic() {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
  }

  private playMusicStep() {
    if (!this.context || !this.music || !this.enabled) return;
    const scales: Record<MusicMood, number[]> = {
      dorm: [220, 261.63, 329.63, 293.66],
      campus: [261.63, 329.63, 392, 329.63],
      classroom: [196, 246.94, 293.66, 246.94],
      surprise: [146.83, 174.61, 138.59, 164.81],
      ending: [261.63, 329.63, 392, 523.25],
    };
    const notes = scales[this.mood];
    const note = notes[this.step % notes.length]!;
    const now = this.context.currentTime;
    this.tone(note, now, 1.3, this.mood === 'surprise' ? 0.08 : 0.055, 'sine', this.music);
    this.tone(note * 1.5, now + 0.12, 1.05, 0.025, 'triangle', this.music);
    this.step += 1;
  }
}

export const gameAudio = new GameAudio();
