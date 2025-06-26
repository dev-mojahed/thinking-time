class AudioService {
  private audio: HTMLAudioElement | null = null;
  private isInitialized = false;

  initialize() {
    if (this.isInitialized) return;
    
    this.audio = new Audio('https://cdn.kiyamah.com/audio/motivation.mp3');
    this.audio.loop = true;
    this.audio.volume = 0.3; // Quiet background volume
    this.audio.preload = 'auto';
    
    // Handle potential loading errors gracefully
    this.audio.addEventListener('error', (e) => {
      console.warn('Audio loading failed:', e);
    });
    
    this.isInitialized = true;
  }

  async play(): Promise<void> {
    if (!this.audio) {
      this.initialize();
    }
    
    try {
      await this.audio?.play();
    } catch (error) {
      console.warn('Audio play failed:', error);
    }
  }

  pause(): void {
    this.audio?.pause();
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }
}

export const audioService = new AudioService();