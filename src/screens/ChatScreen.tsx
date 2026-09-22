import { useEffect, useRef, useState } from 'react'
import { Nav } from '../types'
import { BloodStrip, Btn, ScreenLabel } from '../components/Layout'
import { FormDemo } from '../components/FormDemo'
import { FormSheet } from '../components/ExerciseDetail'
import { EXERCISE_IMG_BASE } from '../data/exerciseDb'
import { ChatExercise, ChatMessage, PurchaseRequiredError, streamChat } from '../data/chatApi'
import { purchase } from '../data/authApi'
import { playError, playSuccess, playTap } from '../utils/sfx'
import { useSpeechToText } from '../utils/useSpeechToText'

// ─── AI COACH CHAT ─────────────────────────────────────────────────────────
// Talks to POST /api/chat/stream. Every exercise recommendation is grounded
// by the backend's search_exercises tool call against the Postgres exercise
// database — the assistant never invents a move, and the exercises event
// carries the real rows so they render as tappable cards here.

type Turn = {
  role: 'user' | 'assistant'
  content: string
  exercises?: ChatExercise[]
  error?: boolean
}

const SUGGESTIONS = [
  'Beginner chest workout, no equipment',
  'Best exercises for a strong back',
  'Quick leg day, dumbbells only',
  'How do I train core without a gym?',
]

const LEVEL_COLOR: Record<string, string> = {
  beginner: '#3A6B8A',
  intermediate: '#D4A017',
  expert: '#C41E3A',
}

function ExerciseCard({ ex, onOpen }: { ex: ChatExercise; onOpen: () => void }) {
  const frames = ex.images.map(p => EXERCISE_IMG_BASE + p)
  return (
    <button
      onClick={onOpen}
      disabled={!ex.external_id}
      className="flex-shrink-0 w-28 text-left active:scale-95 transition-transform disabled:active:scale-100"
    >
      <FormDemo frames={frames} alt={ex.name} className="w-28 h-20 rounded-sm" lazy={false} speed={1300} />
      <div className="font-display font-black text-[11px] text-white uppercase mt-1 leading-tight line-clamp-2">
        {ex.name}
      </div>
      {ex.level && (
        <div
          className="font-display text-[9px] uppercase tracking-widest mt-0.5"
          style={{ color: LEVEL_COLOR[ex.level] ?? '#5A5A65' }}
        >
          {ex.level}
        </div>
      )}
    </button>
  )
}

export function ChatScreen({ nav }: { nav: Nav }) {
  const [turns, setTurns] = useState<Turn[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [provider, setProvider] = useState<'claude' | 'ollama' | null>(null)
  const [openExercise, setOpenExercise] = useState<string | null>(null)
  const [purchaseRequired, setPurchaseRequired] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const speech = useSpeechToText(text => setInput(prev => (prev ? `${prev} ${text}` : text)))

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, streaming])

  // Cancel any in-flight stream if the fighter navigates away mid-answer.
  useEffect(() => () => abortRef.current?.abort(), [])

  const send = async (text: string) => {
    const question = text.trim()
    if (!question || streaming) return
    playTap()

    const history: ChatMessage[] = turns.map(t => ({ role: t.role, content: t.content }))
    setTurns(t => [...t, { role: 'user', content: question }, { role: 'assistant', content: '' }])
    setInput('')
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    const updateLast = (fn: (t: Turn) => Turn) =>
      setTurns(prev => {
        const next = [...prev]
        next[next.length - 1] = fn(next[next.length - 1])
        return next
      })

    try {
      await streamChat(
        [...history, { role: 'user', content: question }],
        event => {
          switch (event.type) {
            case 'provider':
              setProvider(event.provider)
              break
            case 'text':
              updateLast(t => ({ ...t, content: t.content + event.delta }))
              break
            case 'exercises':
              updateLast(t => ({ ...t, exercises: event.exercises }))
              break
            case 'error':
              updateLast(t => ({ ...t, content: t.content || event.message, error: true }))
              playError()
              break
            case 'done':
              playSuccess()
              break
          }
        },
        controller.signal
      )
    } catch (err) {
      if (err instanceof PurchaseRequiredError) {
        setTurns(prev => prev.slice(0, -2))
        setPurchaseRequired(true)
      } else {
        updateLast(t => ({
          ...t,
          content: t.content || (err instanceof Error ? err.message : 'Connection lost.'),
          error: true,
        }))
        playError()
      }
    } finally {
      setStreaming(false)
    }
  }

  const handlePurchase = async () => {
    setPurchasing(true)
    try {
      await purchase()
      playSuccess()
      setPurchaseRequired(false)
    } catch {
      playError()
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#070708] relative">
      <BloodStrip />
      <div className="px-5 pt-8 pb-2 flex items-center justify-between flex-shrink-0">
        <button onClick={() => nav('home')} className="font-display text-xs text-[#5A5A65] uppercase tracking-widest">
          ← BACK
        </button>
        <ScreenLabel>AI TRAINING COACH</ScreenLabel>
        <span className="font-display text-[9px] text-[#3A3A42] uppercase tracking-widest w-16 text-right">
          {provider ?? ''}
        </span>
      </div>

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-3 space-y-4">
        {turns.length === 0 && (
          <div className="pt-6">
            <div className="font-display font-black text-2xl text-white uppercase leading-tight mb-1">
              ASK THE <span className="text-[#C41E3A]">COACH</span>
            </div>
            <p className="font-body text-xs text-[#5A5A65] mb-4">
              Every recommendation is pulled straight from the technique database — nothing invented.
            </p>
            <div className="space-y-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full text-left bg-[#111113] border border-[#2A2A2F] p-3 rounded-sm font-body text-sm text-[#C8C8D0] active:scale-[0.98] transition-transform"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {turns.map((t, i) => (
          <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${t.role === 'user' ? '' : 'w-full'}`}>
              <div
                className="p-3 rounded-sm font-body text-sm leading-relaxed whitespace-pre-wrap"
                style={
                  t.role === 'user'
                    ? { background: '#C41E3A1A', border: '1px solid #C41E3A40', color: '#fff' }
                    : t.error
                      ? { background: '#111113', border: '1px solid #FF2D5540', color: '#FF2D55' }
                      : { background: '#111113', border: '1px solid #2A2A2F', color: '#C8C8D0' }
                }
              >
                {t.content || (streaming && i === turns.length - 1 ? '···' : '')}
              </div>

              {t.exercises && t.exercises.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pt-2 pb-1">
                  {t.exercises.slice(0, 8).map(ex => (
                    <ExerciseCard
                      key={ex.id}
                      ex={ex}
                      onOpen={() => ex.external_id && setOpenExercise(ex.external_id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-5 pb-6 pt-2 flex-shrink-0 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder={speech.listening ? 'LISTENING...' : 'ASK ABOUT A WORKOUT...'}
          disabled={streaming}
          className="flex-1 bg-[#111113] border border-[#2A2A2F] text-white placeholder-[#3A3A42] px-4 py-3 font-body text-sm outline-none focus:border-[#C41E3A] transition-colors rounded-sm disabled:opacity-50"
        />
        {speech.supported && (
          <button
            onClick={() => (speech.listening ? speech.stop() : speech.start())}
            disabled={streaming}
            className="flex-shrink-0 w-11 h-11 rounded-sm border flex items-center justify-center text-lg transition-colors disabled:opacity-50"
            style={
              speech.listening
                ? { background: '#C41E3A', borderColor: '#C41E3A' }
                : { background: '#111113', borderColor: '#2A2A2F' }
            }
          >
            🎤
          </button>
        )}
        <Btn onClick={() => send(input)} fullWidth={false} size="md" className="px-5">
          {streaming ? '···' : 'SEND'}
        </Btn>
      </div>

      {purchaseRequired && (
        <div className="absolute inset-0 bg-black/80 flex items-end z-10">
          <div className="w-full bg-[#111113] border-t border-[#2A2A2F] rounded-t-lg p-6 space-y-4">
            <div className="font-display font-black text-2xl text-white uppercase leading-tight">
              UNLOCK THE <span className="text-[#C41E3A]">AI COACH</span>
            </div>
            <p className="font-body text-sm text-[#8A8A8A]">
              The AI training coach is a premium feature. Purchase access to get personalized,
              database-grounded workout recommendations.
            </p>
            <Btn onClick={handlePurchase} disabled={purchasing}>
              {purchasing ? 'PROCESSING...' : 'PURCHASE ACCESS'}
            </Btn>
            <Btn variant="ghost" onClick={() => { setPurchaseRequired(false); nav('home') }}>
              MAYBE LATER
            </Btn>
          </div>
        </div>
      )}

      {openExercise && <FormSheet dbId={openExercise} onClose={() => setOpenExercise(null)} />}
    </div>
  )
}
