import { useState } from 'react'
import { aliasFor, frameUrls, levelMeta } from '../data/exerciseDb'
import { FormDemo, useExercise, useOnline } from './FormDemo'

function Chip({ label, value, color = '#5A5A65' }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-[#111113] border border-[#2A2A2F] px-3 py-2 rounded-sm">
      <div className="font-display text-[8px] tracking-widest text-[#3A3A42] uppercase">{label}</div>
      <div className="font-display font-bold text-xs uppercase mt-0.5" style={{ color }}>
        {value || '—'}
      </div>
    </div>
  )
}

/**
 * Full-screen form breakdown for a single move: the looping demonstration plus
 * the numbered cues for performing it properly. Rendered inside the phone
 * shell, so it needs a positioned parent.
 */
export function FormSheet({ dbId, onClose }: { dbId: string; onClose: () => void }) {
  const { exercise, status, error, retry } = useExercise(dbId)
  const [playing, setPlaying] = useState(true)
  const online = useOnline()
  const alias = aliasFor(dbId)

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#070708]">
      {/* Header */}
      <div className="px-5 pt-8 pb-3 flex items-center justify-between border-b border-[#1A1A1D]">
        <button
          onClick={onClose}
          className="font-display text-xs text-[#5A5A65] uppercase tracking-widest"
        >
          ✕ CLOSE
        </button>
        <span className="font-display font-bold text-[10px] tracking-[0.3em] text-[#C41E3A] uppercase">
          FIGHT MANUAL
        </span>
        <div className="w-16" />
      </div>

      {status === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-2 border-[#C41E3A] border-t-transparent rounded-full animate-spin" />
          <span className="font-display text-xs tracking-widest text-[#5A5A65] uppercase">
            LOADING FORM DEMO...
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
          <span className="text-3xl">⚠️</span>
          <div className="font-display font-black text-lg text-white uppercase">
            {online ? 'MANUAL UNREACHABLE' : 'NO SIGNAL'}
          </div>
          <p className="font-body text-xs text-[#5A5A65]">
            {online
              ? `Could not reach the technique database. ${error}`
              : 'Form demos stream from the technique database. Reconnect to load them.'}
          </p>
          <button
            onClick={retry}
            className="mt-2 px-6 py-3 bg-[#C41E3A] font-display font-black text-sm text-white uppercase tracking-widest rounded-sm active:scale-95 transition-transform"
          >
            RETRY
          </button>
        </div>
      )}

      {status === 'ready' && !exercise && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-8 text-center">
          <span className="text-3xl">🥋</span>
          <div className="font-display font-black text-base text-white uppercase">MOVE NOT FOUND</div>
          <p className="font-body text-xs text-[#5A5A65]">
            This technique is not in the database yet.
          </p>
        </div>
      )}

      {status === 'ready' && exercise && (
        <div className="flex-1 overflow-y-auto pb-6">
          {/* Looping demonstration */}
          <div className="relative">
            <FormDemo
              frames={frameUrls(exercise)}
              alt={exercise.name}
              playing={playing}
              showPhase
              speed={1000}
              className="w-full aspect-[4/3] border-x-0 border-t-0"
            />
            <button
              onClick={() => setPlaying(p => !p)}
              className="absolute top-3 right-3 px-3 py-1.5 bg-[#070708]/80 border border-[#2A2A2F] font-display font-bold text-[10px] text-white uppercase tracking-widest rounded-sm"
            >
              {playing ? '⏸ PAUSE' : '▶ PLAY'}
            </button>
          </div>

          <div className="px-5 pt-4">
            {alias && (
              <div className="font-display font-black text-2xl text-[#C41E3A] uppercase leading-tight">
                {alias}
              </div>
            )}
            <h2
              className={
                alias
                  ? 'font-body text-sm text-[#5A5A65] mt-0.5'
                  : 'font-display font-black text-2xl text-white uppercase leading-tight'
              }
            >
              {exercise.name}
            </h2>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Chip
                label="DIFFICULTY"
                value={levelMeta(exercise.level).label}
                color={levelMeta(exercise.level).color}
              />
              <Chip label="EQUIPMENT" value={exercise.equipment ?? ''} color="#D4A017" />
              <Chip label="MECHANIC" value={exercise.mechanic ?? ''} />
              <Chip label="FORCE" value={exercise.force ?? ''} />
            </div>

            {/* Muscles */}
            <div className="mt-5">
              <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase mb-2">
                TARGET MUSCLES
              </div>
              <div className="flex flex-wrap gap-2">
                {exercise.primaryMuscles.map(m => (
                  <span
                    key={m}
                    className="font-display text-[10px] uppercase tracking-wide px-2 py-1 rounded-sm bg-[#C41E3A]/15 text-[#C41E3A] border border-[#C41E3A]/30"
                  >
                    {m}
                  </span>
                ))}
                {exercise.secondaryMuscles.map(m => (
                  <span
                    key={m}
                    className="font-display text-[10px] uppercase tracking-wide px-2 py-1 rounded-sm bg-[#111113] text-[#5A5A65] border border-[#2A2A2F]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Form cues */}
            <div className="mt-5">
              <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase mb-2">
                ⚔ PROPER FORM — STEP BY STEP
              </div>
              <ol className="space-y-2">
                {exercise.instructions.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-3 bg-[#111113] border border-[#2A2A2F] p-3 rounded-sm"
                  >
                    <span className="font-display font-black text-sm text-[#C41E3A] flex-shrink-0 w-5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-body text-xs text-[#C8C8D0] leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="font-display text-[9px] tracking-widest text-[#2A2A2F] uppercase text-center mt-5">
              TECHNIQUE DATA — FREE-EXERCISE-DB
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
