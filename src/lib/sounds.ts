// Web Audio API sound effects - no external files needed!
// Perfect for static deployment

class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled = true
  
  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return this.audioContext
  }
  
  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }
  
  // Play a simple beep/tone
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.enabled) return
    
    try {
      const ctx = this.getContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch {
      // Audio not supported
    }
  }
  
  // Sound: Puppet obeys (happy chime)
  obey() {
    this.playTone(523, 0.1, 'sine', 0.2) // C5
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.2), 100) // E5
    setTimeout(() => this.playTone(784, 0.15, 'sine', 0.2), 200) // G5
  }
  
  // Sound: Puppet disobeys (mischievous)
  disobey() {
    this.playTone(392, 0.1, 'square', 0.15) // G4
    setTimeout(() => this.playTone(349, 0.15, 'square', 0.15), 100) // F4
    setTimeout(() => this.playTone(330, 0.2, 'square', 0.15), 200) // E4
  }
  
  // Sound: Random chaos (wild)
  chaos() {
    this.playTone(440, 0.05, 'sawtooth', 0.2)
    setTimeout(() => this.playTone(554, 0.05, 'sawtooth', 0.2), 50)
    setTimeout(() => this.playTone(659, 0.05, 'sawtooth', 0.2), 100)
    setTimeout(() => this.playTone(880, 0.1, 'sawtooth', 0.2), 150)
  }
  
  // Sound: Collect item (sparkle)
  collect() {
    const freq = [784, 988, 1175, 1319][Math.floor(Math.random() * 4)]
    this.playTone(freq, 0.1, 'sine', 0.25)
    setTimeout(() => this.playTone(freq * 1.5, 0.1, 'sine', 0.2), 50)
  }
  
  // Sound: Lose life (sad)
  loseLife() {
    this.playTone(392, 0.2, 'sine', 0.3) // G4
    setTimeout(() => this.playTone(349, 0.2, 'sine', 0.3), 200) // F4
    setTimeout(() => this.playTone(294, 0.3, 'sine', 0.3), 400) // D4
  }
  
  // Sound: Game over
  gameOver() {
    this.playTone(392, 0.3, 'sine', 0.3)
    setTimeout(() => this.playTone(349, 0.3, 'sine', 0.3), 300)
    setTimeout(() => this.playTone(330, 0.3, 'sine', 0.3), 600)
    setTimeout(() => this.playTone(262, 0.5, 'sine', 0.3), 900)
  }
  
  // Sound: Level complete (fanfare)
  levelComplete() {
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.25), i * 150)
    })
  }
  
  // Sound: Button tap
  tap() {
    this.playTone(600, 0.05, 'sine', 0.15)
  }
  
  // Sound: Start game
  start() {
    this.playTone(262, 0.1, 'sine', 0.2) // C4
    setTimeout(() => this.playTone(330, 0.1, 'sine', 0.2), 100) // E4
    setTimeout(() => this.playTone(392, 0.1, 'sine', 0.2), 200) // G4
    setTimeout(() => this.playTone(523, 0.2, 'sine', 0.25), 300) // C5
  }
  
  // Sound: Bounce
  bounce() {
    this.playTone(300, 0.1, 'sine', 0.2)
    setTimeout(() => this.playTone(450, 0.1, 'sine', 0.2), 50)
  }
}

export const sounds = new SoundManager()
