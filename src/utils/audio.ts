// Web Audio effects plus the invitation's ambient song.

const ambientSongUrl = new URL(
  '../assets/music/Fridayy-When-It-Comes-To-You-(HipHopKit.com).mp3',
  import.meta.url
).href;

class RomanticAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientAudio: HTMLAudioElement | null = null;
  private isPlayingAmbient: boolean = false;

  private getAmbientAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.ambientAudio) {
      this.ambientAudio = new Audio(ambientSongUrl);
      this.ambientAudio.loop = true;
      this.ambientAudio.preload = 'metadata';
      this.ambientAudio.volume = 0.3;
    }
    return this.ambientAudio;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientAudio) {
      this.ambientAudio.muted = muted;
    }
    if (muted && this.isPlayingAmbient) {
      this.stopAmbientMusic();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playRomanticChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (tender high chime)
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.85);
    });
  }

  public playHeartbeat() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const beats = [0, 0.18];

    beats.forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now + delay);
      osc.frequency.exponentialRampToValueAtTime(45, now + delay + 0.12);

      gain.gain.setValueAtTime(0.18, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.16);
    });
  }

  public playSealStamp() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Thump
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);

    // Warm chord sparkle
    setTimeout(() => {
      this.playRomanticChime();
    }, 120);
  }

  public toggleAmbientMusic(): boolean {
    if (this.isPlayingAmbient) {
      this.stopAmbientMusic();
      return false;
    } else {
      this.startAmbientMusic();
      return true;
    }
  }

  public isAmbientPlaying(): boolean {
    return this.isPlayingAmbient;
  }

  public startAmbientMusic() {
    if (this.isMuted) return;
    const audio = this.getAmbientAudio();
    if (!audio) return;

    audio.muted = false;
    this.isPlayingAmbient = true;
    void audio.play().catch(() => {
      this.isPlayingAmbient = false;
    });
  }

  public stopAmbientMusic() {
    this.isPlayingAmbient = false;
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
    }
  }
}

export const romanticAudio = new RomanticAudioService();
