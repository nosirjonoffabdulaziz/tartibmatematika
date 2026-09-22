// Web Audio API Synthesizer for rich interactive educational sound effects (SFX)
// Zero external assets or bandwidth needed; runs client-side with zero latency.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Aerodynamic WHOOSH / SWOOSH sound effect
 * Synchronized with the arrow swooping down to point to the active operation.
 */
export function playWhoosh(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Filtered noise swoosh simulation
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.linearRampToValueAtTime(1600, now + 0.12);
    filter.frequency.linearRampToValueAtTime(200, now + 0.28);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.29);
  } catch {}
}

/**
 * Crisp BUBBLE POP sound effect
 * Played when an order number badge (①, ②, ③...) is focused or pops in.
 */
export function playBubblePop(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {}
}

/**
 * SUCCESS DING / CRYSTAL BELL CHIME
 * Played when a calculation step finishes and yields its sub-result.
 */
export function playSuccessDing(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Harmonic bell: Primary fundamental 784 Hz (G5) + overtone 1568 Hz (G6)
    [783.99, 1567.98].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = i === 0 ? 0.15 : 0.06;
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (i === 0 ? 0.45 : 0.25));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    });
  } catch {}
}

/**
 * Rhythmic Metronome Wooden TICK
 * Plays lightly during the 5-second countdown progress.
 */
export function playCountdownTick(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.025);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.026);
  } catch {}
}

/**
 * NUMBERS MERGE / CALCULATION PULSE
 * A vibrant warm chord when operands collapse into their calculated value.
 */
export function playCalculationPulse(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Two rising notes (C5 -> E5 -> G5)
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const t = now + idx * 0.04;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.22);
    });
  } catch {}
}

/**
 * TRIUMPH CELEBRATION FANFARE
 * Played when all operations complete and the final answer appears with confetti.
 */
export function playTrophyCelebration(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Fanfare sequence: C5 -> E5 -> G5 -> C6 (Held bright chord)
    const notes = [
      { f: 523.25, time: 0.0, dur: 0.2 },
      { f: 659.25, time: 0.1, dur: 0.2 },
      { f: 783.99, time: 0.2, dur: 0.25 },
      { f: 1046.5, time: 0.35, dur: 0.8 },
      { f: 1318.51, time: 0.38, dur: 0.75 }, // Harmonic shimmer E6
    ];

    notes.forEach((note) => {
      const startTime = now + note.time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, startTime);

      gain.gain.setValueAtTime(0.14, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + note.dur + 0.05);
    });
  } catch {}
}
