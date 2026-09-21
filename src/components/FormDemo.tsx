import { useEffect, useRef, useState } from 'react'
import { DbExercise, frameUrls, loadExerciseDb } from '../data/exerciseDb'

// ─── Network state ────────────────────────────────────────────────────────────

export function useOnline(): boolean {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  )

  useEffect(() => {
    const up = () => setOnline(true)
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  return online
}

export function OfflineBanner() {
  return (
    <div className="px-5 py-2 bg-[#C41E3A]/15 border-y border-[#C41E3A]/30 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] animate-pulse flex-shrink-0" />
      <span className="font-display text-[10px] tracking-widest text-[#C41E3A] uppercase">
        NO SIGNAL — FORM DEMOS PAUSED
      </span>
    </div>
  )
}

// ─── Live database hooks ──────────────────────────────────────────────────────

type DbState = {
  status: 'loading' | 'ready' | 'error'
  data: DbExercise[]
  error: string
}

export function useExerciseDb(): DbState & { retry: () => void } {
  const [state, setState] = useState<DbState>({ status: 'loading', data: [], error: '' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    setState({ status: 'loading', data: [], error: '' })

    loadExerciseDb()
      .then(data => {
        if (alive) setState({ status: 'ready', data, error: '' })
      })
      .catch((err: unknown) => {
        if (!alive) return
        const msg = err instanceof Error ? err.message : String(err)
        setState({ status: 'error', data: [], error: msg })
      })

    return () => {
      alive = false
    }
  }, [attempt])

  return { ...state, retry: () => setAttempt(a => a + 1) }
}

/** A single exercise out of the live database, by id. */
export function useExercise(dbId: string) {
  const db = useExerciseDb()
  const exercise = db.status === 'ready' ? db.data.find(e => e.id === dbId) : undefined
  return { ...db, exercise }
}

// ─── Form demo ────────────────────────────────────────────────────────────────

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return reduced
}

/**
 * Tracks whether an element is near the viewport. The library lists hundreds of
 * moves; without this every row would pull its frames at once.
 *
 * `near` drives animation and flips both ways, so off-screen rows stop
 * animating. `seen` latches on first approach and never clears, so scrolling a
 * row away and back does not discard loaded frames and flash a skeleton.
 */
function useNearViewport<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T | null>(null)
  const [near, setNear] = useState(!enabled)
  const [seen, setSeen] = useState(!enabled)

  useEffect(() => {
    if (!enabled) {
      setNear(true)
      setSeen(true)
      return
    }
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true)
      setSeen(true)
      return
    }

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          setNear(entry.isIntersecting)
          if (entry.isIntersecting) setSeen(true)
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [enabled])

  return { ref, near, seen }
}

type FormDemoProps = {
  /** Absolute frame URLs — [start, finish]. */
  frames: string[]
  alt: string
  /** Milliseconds each frame is held. */
  speed?: number
  playing?: boolean
  /** Overlays a START / FINISH phase tag on the current frame. */
  showPhase?: boolean
  /** Defer loading until scrolled near. Off for demos shown immediately. */
  lazy?: boolean
  className?: string
}

/**
 * Alternates an exercise's start and finish frames into a looping demonstration
 * of the movement — the two-frame equivalent of a form GIF. Frames are
 * preloaded and cross-faded so the loop never flashes a blank tile, and the
 * whole thing degrades to a labelled placeholder when the CDN is unreachable.
 */
export function FormDemo({
  frames,
  alt,
  speed = 1100,
  playing = true,
  showPhase = false,
  lazy = true,
  className = '',
}: FormDemoProps) {
  const [idx, setIdx] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle')
  const reduced = usePrefersReducedMotion()
  const { ref, near, seen } = useNearViewport<HTMLDivElement>(lazy)
  const key = frames.join('|')

  // Preload every frame before animating, so the loop is smooth from frame one.
  useEffect(() => {
    if (!seen) return

    let alive = true
    setStatus('loading')
    setIdx(0)

    if (frames.length === 0) {
      setStatus('failed')
      return
    }

    let loaded = 0
    const imgs = frames.map(src => {
      const img = new Image()
      img.onload = () => {
        if (!alive) return
        loaded += 1
        if (loaded === frames.length) setStatus('ready')
      }
      img.onerror = () => {
        if (alive) setStatus('failed')
      }
      img.src = src
      return img
    })

    return () => {
      alive = false
      imgs.forEach(img => {
        img.onload = null
        img.onerror = null
      })
    }
  }, [key, seen])

  const animating = playing && near && !reduced && status === 'ready' && frames.length > 1

  useEffect(() => {
    if (!animating) return
    const t = setInterval(() => setIdx(v => (v + 1) % frames.length), speed)
    return () => clearInterval(t)
  }, [animating, speed, frames.length])

  const phase = idx === 0 ? 'START' : 'FINISH'

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-[#0D0D0F] border border-[#2A2A2F] ${className}`}
      role="img"
      aria-label={`${alt} — form demonstration`}
    >
      {status === 'failed' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center">
          <span className="text-base leading-none">🥊</span>
          <span className="font-display text-[8px] tracking-widest text-[#3A3A42] uppercase leading-tight">
            DEMO UNAVAILABLE
          </span>
        </div>
      ) : (
        <>
          {status !== 'idle' &&
            frames.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover select-none"
                style={{
                  opacity: status === 'ready' && i === idx ? 1 : 0,
                  transition: 'opacity 260ms ease-in-out',
                  filter: 'contrast(1.06) saturate(0.82) brightness(0.94)',
                }}
              />
            ))}

          {/* Red wash keeps the bright stock photography inside the arena palette. */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-multiply"
            style={{ background: 'linear-gradient(160deg, rgba(196,30,58,0.22), rgba(7,7,8,0.55))' }}
          />

          {status !== 'ready' && <div className="absolute inset-0 bg-[#1A1A1D] animate-pulse" />}

          {showPhase && status === 'ready' && (
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1 bg-gradient-to-t from-[#070708] to-transparent">
              <span className="font-display font-black text-[9px] tracking-widest text-white uppercase">
                {phase}
              </span>
              <div className="flex gap-1">
                {frames.map((f, i) => (
                  <span
                    key={f}
                    className="w-1.5 h-1.5 rounded-full transition-colors"
                    style={{ background: i === idx ? '#C41E3A' : '#3A3A42' }}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Demo by database id ──────────────────────────────────────────────────────

type ExerciseDemoProps = Omit<FormDemoProps, 'frames' | 'alt'> & {
  dbId: string
  alt?: string
}

/** FormDemo that resolves its frames from the live database by exercise id. */
export function ExerciseDemo({ dbId, alt, className = '', ...rest }: ExerciseDemoProps) {
  const { exercise, status } = useExercise(dbId)

  if (status === 'ready' && exercise) {
    return (
      <FormDemo
        frames={frameUrls(exercise)}
        alt={alt ?? exercise.name}
        className={className}
        {...rest}
      />
    )
  }

  return (
    <div
      className={`relative overflow-hidden bg-[#0D0D0F] border border-[#2A2A2F] ${className}`}
      role="img"
      aria-label={`${alt ?? 'Exercise'} — form demonstration`}
    >
      {status === 'loading' ? (
        <div className="absolute inset-0 bg-[#1A1A1D] animate-pulse" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center">
          <span className="text-base leading-none">🥊</span>
          <span className="font-display text-[8px] tracking-widest text-[#3A3A42] uppercase leading-tight">
            DEMO UNAVAILABLE
          </span>
        </div>
      )}
    </div>
  )
}
