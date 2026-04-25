"use client";

/**
 * Tiny Web Audio beep kit for the SHIFT Runner mini-game.
 *
 * No samples — pure oscillators. Each public helper plays a short envelope
 * so the audio context stays cheap. Lazy-creates a single AudioContext the
 * first time the user un-mutes; if the browser blocks autoplay, calls just
 * silently no-op until the context resumes.
 */

let ctx: AudioContext | null = null;

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
  } catch {
    return null;
  }
  return ctx;
}

type ToneOpts = {
  freq: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  attack?: number;
  release?: number;
};

function tone({
  freq,
  duration,
  type = "square",
  volume = 0.08,
  attack = 0.005,
  release = 0.04,
}: ToneOpts) {
  const audio = ensureCtx();
  if (!audio) return;
  if (audio.state === "suspended") {
    // Best-effort resume — Safari/iOS need a user gesture.
    audio.resume().catch(() => {});
  }
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + attack);
  gain.gain.linearRampToValueAtTime(0, now + duration + release);
  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + duration + release + 0.02);
}

export const sfx = {
  jump() {
    tone({ freq: 660, duration: 0.06, type: "square", volume: 0.07 });
    setTimeout(
      () => tone({ freq: 880, duration: 0.05, type: "square", volume: 0.06 }),
      45,
    );
  },
  coin() {
    tone({ freq: 988, duration: 0.05, type: "square", volume: 0.06 });
    setTimeout(
      () => tone({ freq: 1318, duration: 0.07, type: "square", volume: 0.06 }),
      40,
    );
  },
  liquidate() {
    tone({ freq: 220, duration: 0.18, type: "sawtooth", volume: 0.1 });
    setTimeout(
      () =>
        tone({ freq: 110, duration: 0.28, type: "sawtooth", volume: 0.09 }),
      120,
    );
  },
  hiscore() {
    [880, 1109, 1318, 1760].forEach((f, i) =>
      setTimeout(
        () => tone({ freq: f, duration: 0.08, type: "square", volume: 0.07 }),
        i * 70,
      ),
    );
  },
  start() {
    tone({ freq: 523, duration: 0.06, type: "square", volume: 0.05 });
    setTimeout(
      () => tone({ freq: 784, duration: 0.08, type: "square", volume: 0.05 }),
      60,
    );
  },
};

/** Some browsers require an explicit gesture to unlock the audio context. */
export function unlockAudio() {
  const audio = ensureCtx();
  if (!audio) return;
  if (audio.state === "suspended") audio.resume().catch(() => {});
}
