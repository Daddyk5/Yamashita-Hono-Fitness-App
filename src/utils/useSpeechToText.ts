import { useEffect, useRef, useState } from 'react'

// Thin wrapper around the browser's SpeechRecognition API (mic button ->
// live transcript). Chromium-based WebViews (including Capacitor's Android
// WebView) expose this as `webkitSpeechRecognition`. No backend involved --
// transcription happens on-device/in the browser.

interface SpeechRecognitionResultLike {
  isFinal: boolean
  0: { transcript: string }
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null
  onerror: ((ev: Event) => void) | null
  onend: (() => void) | null
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function useSpeechToText(onTranscript: (text: string) => void) {
  const [listening, setListening] = useState(false)
  const [supported] = useState(() => getSpeechRecognitionCtor() !== null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  useEffect(() => () => recognitionRef.current?.stop(), [])

  function start() {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) return
    const recognition = new Ctor()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (ev) => {
      const transcript = Array.from(ev.results as ArrayLike<SpeechRecognitionResultLike>)
        .map(r => r[0].transcript)
        .join(' ')
      onTranscript(transcript)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }

  function stop() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return { supported, listening, start, stop }
}
