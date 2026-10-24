// Web Audio API synthesized sound cues (no external audio files required)

class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  beep(freq = 880, duration = 0.1, type: OscillatorType = 'sine') {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio not supported or blocked
    }
  }

  scanSuccess() {
    this.beep(880, 0.08, 'sine');
    setTimeout(() => this.beep(1320, 0.12, 'sine'), 90);
  }

  revokeAlert() {
    this.beep(330, 0.18, 'sawtooth');
    setTimeout(() => this.beep(220, 0.28, 'sawtooth'), 150);
  }

  mintSuccess() {
    this.beep(523.25, 0.08, 'triangle');
    setTimeout(() => this.beep(659.25, 0.08, 'triangle'), 80);
    setTimeout(() => this.beep(783.99, 0.12, 'triangle'), 160);
  }
}

export const sound = new SoundFX();
