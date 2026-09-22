// Lightweight UI sound effects, synthesized with the Web Audio API instead
// of shipped audio files -- no licensing concerns, zero bundle weight, and
// no risk of using anime-sourced sound clips.

let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return null
  if (!ctx) ctx = new AudioCtx()
  // Browsers suspend a freshly created context until a user gesture resumes
  // it; every call here happens from a click/tap handler, so this is safe.
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function tone(freq: number, startOffset: number, duration: number, gain: number, type: OscillatorType = 'sine') {
  const audioCtx = getContext()
  if (!audioCtx) return
  const osc = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()
  osc.type = type
  osc.frequency.value = freq
  const start = audioCtx.currentTime + startOffset
  gainNode.gain.setValueAtTime(0, start)
  gainNode.gain.linearRampToValueAtTime(gain, start + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration)
  osc.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

/** Short, low-key tap — navigation, sending a message. */
export function playTap() {
  tone(520, 0, 0.06, 0.05, 'square')
}

/** Rising two-note chime — success, unlocked, purchase complete. */
export function playSuccess() {
  tone(660, 0, 0.1, 0.06, 'triangle')
  tone(880, 0.08, 0.14, 0.06, 'triangle')
}

/** Low buzz — error, request failed. */
export function playError() {
  tone(160, 0, 0.18, 0.06, 'sawtooth')
}
