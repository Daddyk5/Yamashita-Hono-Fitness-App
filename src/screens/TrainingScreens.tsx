import { useState, useEffect, useMemo, useRef } from 'react'
import { Nav } from '../types'
import { BottomNav, Btn, Card, PowerBar, RankBadge, BloodStrip, ScreenLabel, LightningIcon, FlameIcon } from '../components/Layout'
import { ExerciseDemo, FormDemo, OfflineBanner, useExerciseDb, useOnline } from '../components/FormDemo'
import { FormSheet } from '../components/ExerciseDetail'
import {
  LIBRARY_FILTERS,
  SIGNATURE_MOVES,
  aliasFor,
  frameUrls,
  levelMeta,
  matchesGroup,
} from '../data/exerciseDb'

// ─── 11. HOME DASHBOARD ───────────────────────────────────────────────────────
const QUICK_MATCHUPS = [
  { name: 'IRON WILL PROTOCOL', rounds: 6, type: 'STRENGTH', level: 'WARRIOR' },
  { name: 'LIGHTNING STRIKE DRILL', rounds: 8, type: 'HIIT', level: 'STREET FIGHTER' },
]

export function HomeScreen({ nav }: { nav: Nav }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Header */}
        <div className="px-5 pt-10 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display text-xs tracking-[0.3em] text-[#5A5A65] uppercase mb-1">{today}</div>
              <h1 className="font-display font-black text-3xl text-white uppercase leading-tight">
                WELCOME BACK,<br /><span className="text-[#C41E3A]">TOKITA ŌHMA</span>
              </h1>
            </div>
            <button onClick={() => nav('profile')} className="w-12 h-12 rounded-full bg-[#C41E3A]/20 border border-[#C41E3A]/40 flex items-center justify-center">
              <span className="font-display font-black text-xl text-[#C41E3A]">龍</span>
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="px-5 grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'POWER LVL', value: '8,420', color: '#C41E3A', icon: <LightningIcon /> },
            { label: 'STREAK', value: '14 🔥', color: '#E8820C', icon: null },
            { label: 'RANK', value: 'WARRIOR', color: '#D4A017', icon: null },
          ].map(s => (
            <div key={s.label} className="bg-[#111113] border border-[#2A2A2F] p-3 rounded-sm text-center">
              <div className="font-display font-black text-sm" style={{ color: s.color }}>{s.value}</div>
              <div className="font-display text-[9px] tracking-widest text-[#5A5A65] uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Training Arc */}
        <div className="px-5 mb-5">
          <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase mb-2">CURRENT TRAINING ARC</div>
          <div className="bg-[#111113] border border-[#2A2A2F] p-4 rounded-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-display font-black text-lg text-white uppercase">IRON WILL ARC</div>
                <div className="font-display text-xs text-[#5A5A65] tracking-wide">Week 3 of 8 · 24 sessions</div>
              </div>
              <RankBadge rank="ACTIVE" size="sm" />
            </div>
            <PowerBar value={38} label="ARC PROGRESS" sublabel="38%" />
          </div>
        </div>

        {/* Quick-Start Matchup */}
        <div className="px-5 mb-5">
          <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase mb-2">QUICK-START MATCHUP</div>
          {QUICK_MATCHUPS.map((m, i) => (
            <button
              key={i}
              onClick={() => nav('workout')}
              className="w-full mb-2 text-left p-4 rounded-sm border transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #111113, #1A1A1D)', borderColor: '#2A2A2F' }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-black text-base text-white">{m.name}</span>
                <span className="text-[#C41E3A]">→</span>
              </div>
              <div className="flex gap-3">
                <span className="font-display text-xs text-[#5A5A65] uppercase">{m.rounds} ROUNDS</span>
                <span className="font-display text-xs text-[#C41E3A] uppercase">{m.type}</span>
                <span className="font-display text-xs text-[#D4A017] uppercase">{m.level}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Today's Mission */}
        <div className="px-5 mb-5">
          <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase mb-2">TODAY'S MISSION</div>
          <div className="space-y-2">
            {[
              { done: true, name: 'Morning warm-up drill', xp: '+120 XP' },
              { done: false, name: 'Strength training — Round 4', xp: '+350 XP' },
              { done: false, name: 'Evening recovery protocol', xp: '+80 XP' },
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#111113] border border-[#2A2A2F] p-3 rounded-sm">
                <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${task.done ? 'bg-[#C41E3A] border-[#C41E3A]' : 'border-[#3A3A42]'}`}>
                  {task.done && <span className="text-[10px] text-white font-bold">✓</span>}
                </div>
                <span className={`font-body text-sm flex-1 ${task.done ? 'line-through text-[#3A3A42]' : 'text-white'}`}>{task.name}</span>
                <span className="font-display text-xs font-bold text-[#D4A017]">{task.xp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-5">
          <Btn onClick={() => nav('programs')}>ENTER THE TRAINING GROUNDS</Btn>
        </div>
      </div>

      <BottomNav active="home" nav={nav} />
    </div>
  )
}

// ─── 12. PROGRAM SELECTION ────────────────────────────────────────────────────
const PROGRAMS = [
  {
    name: 'IRON WILL PROTOCOL',
    sub: 'Raw strength dominance',
    weeks: 8,
    sessions: 4,
    level: 'BERSERKER',
    color: '#C41E3A',
    tag: 'STRENGTH',
    icon: '🔩',
  },
  {
    name: 'LIGHTNING STRIKE',
    sub: 'Speed & explosive power',
    weeks: 6,
    sessions: 5,
    level: 'WARRIOR',
    color: '#D4A017',
    tag: 'HIIT',
    icon: '⚡',
  },
  {
    name: 'THE GRIND',
    sub: 'Endurance above all else',
    weeks: 12,
    sessions: 3,
    level: 'STREET FIGHTER',
    color: '#3A6B8A',
    tag: 'ENDURANCE',
    icon: '⛓️',
  },
  {
    name: "DEATH'S GATE",
    sub: 'Full-body destruction',
    weeks: 4,
    sessions: 6,
    level: 'BERSERKER',
    color: '#6A3AAF',
    tag: 'EXTREME',
    icon: '💀',
  },
  {
    name: 'ŌMA TOKITA PROTOCOL',
    sub: 'The Ashura method — body and mind',
    weeks: 10,
    sessions: 5,
    level: 'CHAMPION',
    color: '#FF2D55',
    tag: 'ELITE',
    icon: '龍',
  },
]

export function ProgramSelectScreen({ nav }: { nav: Nav }) {
  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-5 pt-10 pb-4">
          <ScreenLabel>TRAINING GROUNDS</ScreenLabel>
          <h1 className="font-display font-black text-4xl text-white uppercase leading-tight mt-2">
            SELECT YOUR<br /><span className="text-[#C41E3A]">PROGRAM</span>
          </h1>
        </div>

        <div className="px-5 space-y-3">
          {PROGRAMS.map((p, i) => (
            <button
              key={i}
              onClick={() => nav('workout')}
              className="w-full text-left rounded-sm border overflow-hidden active:scale-95 transition-all"
              style={{ borderColor: '#2A2A2F' }}
            >
              <div className="flex items-stretch">
                {/* Color accent */}
                <div className="w-1.5 flex-shrink-0" style={{ background: p.color }} />
                <div className="flex-1 p-4" style={{ background: '#111113' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-display text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                        style={{ background: `${p.color}20`, color: p.color }}>
                        {p.tag}
                      </span>
                      <div className="font-display font-black text-lg text-white uppercase mt-1">{p.name}</div>
                      <div className="font-body text-xs text-[#5A5A65]">{p.sub}</div>
                    </div>
                    <span className="text-2xl ml-2">{p.icon}</span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <span className="font-display text-xs text-[#5A5A65] uppercase">{p.weeks}W PROGRAM</span>
                    <span className="font-display text-xs text-[#5A5A65] uppercase">{p.sessions}×/WEEK</span>
                    <span className="font-display text-xs font-bold uppercase" style={{ color: p.color }}>{p.level}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="px-5 mt-4">
          <Btn variant="ghost" onClick={() => nav('builder')}>+ BUILD CUSTOM PROGRAM</Btn>
        </div>
      </div>

      <BottomNav active="programs" nav={nav} />
    </div>
  )
}

// ─── 13. WORKOUT TRACKER ─────────────────────────────────────────────────────
const EXERCISES = [
  { name: "DESTROYER'S PRESS", dbId: 'Barbell_Bench_Press_-_Medium_Grip', sets: 4, reps: 8, weight: 100, done: [true, true, false, false] },
  { name: "IRON CHAIN PULL", dbId: 'Pullups', sets: 3, reps: 12, weight: 80, done: [true, false, false] },
  { name: "STONE CRUSHER DEADLIFT", dbId: 'Barbell_Deadlift', sets: 5, reps: 5, weight: 140, done: [false, false, false, false, false] },
  { name: "FIGHTER'S LUNGE", dbId: 'Bodyweight_Walking_Lunge', sets: 3, reps: 15, weight: 60, done: [false, false, false] },
]

export function WorkoutTrackerScreen({ nav }: { nav: Nav }) {
  const [exercises, setExercises] = useState(EXERCISES)
  const [round, setRound] = useState(1)
  const [formFor, setFormFor] = useState<string | null>(null)
  const online = useOnline()

  const toggleSet = (exIdx: number, setIdx: number) => {
    setExercises(prev => prev.map((ex, i) =>
      i === exIdx ? { ...ex, done: ex.done.map((d, j) => j === setIdx ? !d : d) } : ex
    ))
  }

  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0)
  const doneSets = exercises.reduce((acc, ex) => acc + ex.done.filter(Boolean).length, 0)

  return (
    <div className="h-full flex flex-col bg-[#070708] relative">
      <BloodStrip />
      {!online && <OfflineBanner />}
      {/* Header */}
      <div className="px-5 pt-8 pb-3 flex items-center justify-between">
        <button onClick={() => nav('programs')} className="font-display text-xs text-[#5A5A65] uppercase tracking-widest">← EXIT</button>
        <div className="text-center">
          <div className="font-display font-black text-sm text-white uppercase">IRON WILL PROTOCOL</div>
          <div className="font-display text-xs text-[#C41E3A] uppercase tracking-wide">ROUND {round} OF 6</div>
        </div>
        <button onClick={() => nav('live-stats')} className="font-display text-xs text-[#D4A017] uppercase tracking-widest">STATS</button>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-3">
        <div className="flex justify-between text-xs font-display text-[#5A5A65] uppercase mb-1">
          <span>SETS COMPLETED</span><span>{doneSets}/{totalSets}</span>
        </div>
        <div className="h-1.5 bg-[#1A1A1D] rounded-full overflow-hidden">
          <div className="h-full bg-[#C41E3A] transition-all" style={{ width: `${(doneSets / totalSets) * 100}%` }} />
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3">
        {exercises.map((ex, exIdx) => (
          <div key={exIdx} className="bg-[#111113] border border-[#2A2A2F] rounded-sm overflow-hidden">
            <div className="px-3 py-3 border-b border-[#2A2A2F] flex items-center gap-3">
              {/* Looping form demo, so the movement is never a guess mid-round */}
              <button
                onClick={() => setFormFor(ex.dbId)}
                className="flex-shrink-0 active:scale-95 transition-transform"
                aria-label={`Show proper form for ${ex.name}`}
              >
                <ExerciseDemo dbId={ex.dbId} alt={ex.name} className="w-16 h-16 rounded-sm" speed={1200} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="font-display font-black text-sm text-white uppercase truncate">{ex.name}</div>
                <div className="font-display text-xs text-[#5A5A65]">{ex.sets} sets × {ex.reps} reps · {ex.weight}kg</div>
                <button
                  onClick={() => setFormFor(ex.dbId)}
                  className="mt-1 font-display text-[10px] text-[#C41E3A] uppercase tracking-widest"
                >
                  ▶ WATCH FORM
                </button>
              </div>
            </div>
            <div className="p-3 flex gap-2 flex-wrap">
              {ex.done.map((done, setIdx) => (
                <button
                  key={setIdx}
                  onClick={() => toggleSet(exIdx, setIdx)}
                  className="w-10 h-10 rounded-sm font-display font-bold text-xs uppercase transition-all active:scale-90"
                  style={{
                    background: done ? '#C41E3A' : '#1A1A1D',
                    color: done ? '#fff' : '#5A5A65',
                    border: `1.5px solid ${done ? '#C41E3A' : '#2A2A2F'}`,
                  }}
                >
                  {done ? '✓' : setIdx + 1}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="px-5 pb-6 pt-2 flex gap-3">
        <Btn variant="secondary" onClick={() => nav('rest-timer')} fullWidth={false} size="md" className="flex-1">
          REST TIMER
        </Btn>
        <Btn onClick={() => nav('victory')} fullWidth={false} size="md" className="flex-1">
          FINISH ROUND
        </Btn>
      </div>

      {formFor && <FormSheet dbId={formFor} onClose={() => setFormFor(null)} />}
    </div>
  )
}

// ─── 14. REST TIMER ────────────────────────────────────────────────────────────
/** The round waiting on the other side of the rest. */
const NEXT_UP = { name: 'STONE CRUSHER DEADLIFT', dbId: 'Barbell_Deadlift', sets: 5, reps: 5 }

export function RestTimerScreen({ nav }: { nav: Nav }) {
  const [seconds, setSeconds] = useState(90)
  const [running, setRunning] = useState(true)
  const [selected, setSelected] = useState(90)
  const [preview, setPreview] = useState(false)
  const OPTIONS = [30, 60, 90, 120, 180]
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running && seconds > 0) {
      ref.current = setInterval(() => setSeconds(s => s - 1), 1000)
    } else {
      if (ref.current) clearInterval(ref.current)
    }
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [running, seconds])

  const reset = (val: number) => { setSelected(val); setSeconds(val); setRunning(true) }
  const pct = (seconds / selected) * 100
  const r = 100
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - pct / 100)

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="h-full flex flex-col bg-[#070708] relative overflow-hidden">
      <BloodStrip />
      <div className="w-full px-5 pt-8 flex items-center justify-between flex-shrink-0">
        <button onClick={() => nav('workout')} className="font-display text-xs text-[#5A5A65] uppercase tracking-widest">← BACK</button>
        <ScreenLabel>REST TIMER</ScreenLabel>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center pb-6">
      <div className="font-display font-black text-xl text-[#5A5A65] uppercase tracking-widest mt-4 mb-2">
        {seconds === 0 ? '⚡ BACK TO BATTLE' : 'RECOVERY PHASE'}
      </div>

      {/* Circular timer */}
      <div className="relative my-4">
        <svg width="240" height="240" viewBox="0 0 240 240">
          <circle cx="120" cy="120" r={r} fill="none" stroke="#1A1A1D" strokeWidth="8" />
          <circle
            cx="120" cy="120" r={r} fill="none"
            stroke={seconds === 0 ? '#D4A017' : '#C41E3A'}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 120 120)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="font-display font-black text-6xl text-white"
            style={{ color: seconds === 0 ? '#D4A017' : 'white', fontVariantNumeric: 'tabular-nums' }}
          >
            {fmt(seconds)}
          </div>
          <div className="font-display text-xs tracking-widest text-[#5A5A65] uppercase mt-1">SECONDS</div>
        </div>
      </div>

      {/* Preset times */}
      <div className="flex gap-2 mb-6">
        {OPTIONS.map(o => (
          <button
            key={o}
            onClick={() => reset(o)}
            className="px-3 py-2 rounded-sm font-display font-bold text-xs uppercase transition-all"
            style={{
              background: selected === o ? '#C41E3A' : '#1A1A1D',
              color: selected === o ? '#fff' : '#5A5A65',
              border: `1px solid ${selected === o ? '#C41E3A' : '#2A2A2F'}`,
            }}
          >
            {o}s
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-4 w-full px-8">
        <Btn variant="secondary" onClick={() => setRunning(r => !r)} fullWidth size="md">
          {running ? '⏸ PAUSE' : '▶ RESUME'}
        </Btn>
        <Btn onClick={() => nav('workout')} fullWidth size="md">SKIP REST</Btn>
      </div>

      {/* Next round preview — study the movement before you walk back in */}
      <div className="w-full px-5 mt-6">
        <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase mb-2">
          NEXT ROUND
        </div>
        <button
          onClick={() => setPreview(true)}
          className="w-full flex items-center gap-3 bg-[#111113] border border-[#2A2A2F] p-3 rounded-sm text-left active:scale-95 transition-transform"
        >
          <ExerciseDemo dbId={NEXT_UP.dbId} alt={NEXT_UP.name} className="w-16 h-16 rounded-sm flex-shrink-0" speed={1200} />
          <div className="flex-1 min-w-0">
            <div className="font-display font-black text-sm text-white uppercase truncate">{NEXT_UP.name}</div>
            <div className="font-display text-xs text-[#5A5A65]">{NEXT_UP.sets} sets × {NEXT_UP.reps} reps</div>
            <div className="mt-1 font-display text-[10px] text-[#C41E3A] uppercase tracking-widest">▶ WATCH FORM</div>
          </div>
        </button>
      </div>

      {/* Motivational text */}
      <div className="mt-5 px-8 text-center">
        <p className="font-display font-bold text-sm text-[#3A3A42] uppercase tracking-widest italic">
          "The moment you want to quit is the moment you need to keep going."
        </p>
      </div>
      </div>

      {preview && <FormSheet dbId={NEXT_UP.dbId} onClose={() => setPreview(false)} />}
    </div>
  )
}

// ─── 15. LIVE STAT TRACKING ───────────────────────────────────────────────────
export function LiveStatsScreen({ nav }: { nav: Nav }) {
  const [bpm, setBpm] = useState(142)

  useEffect(() => {
    const t = setInterval(() => setBpm(b => 135 + Math.floor(Math.random() * 20)), 1500)
    return () => clearInterval(t)
  }, [])

  const stats = [
    { label: 'CALORIES', value: '487', unit: 'kcal', color: '#C41E3A' },
    { label: 'DURATION', value: '48:23', unit: 'min:sec', color: '#D4A017' },
    { label: 'SETS DONE', value: '14', unit: 'of 20', color: '#3A6B8A' },
    { label: 'VOLUME', value: '8,440', unit: 'kg total', color: '#E8820C' },
  ]

  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="px-5 pt-8 flex items-center justify-between">
        <button onClick={() => nav('workout')} className="font-display text-xs text-[#5A5A65] uppercase">← BACK</button>
        <ScreenLabel>LIVE COMBAT STATS</ScreenLabel>
        <div className="w-12" />
      </div>

      {/* BPM Hero */}
      <div className="flex flex-col items-center py-6 relative">
        <div className="font-display text-xs tracking-[0.3em] text-[#5A5A65] uppercase mb-1">HEART RATE</div>
        <div className="font-display font-black text-8xl text-[#C41E3A] leading-none animate-pulse" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {bpm}
        </div>
        <div className="font-display font-bold text-lg text-[#5A5A65] uppercase tracking-widest mt-1">BPM</div>

        {/* Zone indicator */}
        <div className="mt-3 px-4 py-1.5 rounded-sm font-display font-black text-sm tracking-widest uppercase"
          style={{ background: bpm > 150 ? '#C41E3A20' : '#D4A01720', color: bpm > 150 ? '#C41E3A' : '#D4A017' }}>
          {bpm > 160 ? '🔴 MAXIMUM ZONE' : bpm > 150 ? '🟠 ANAEROBIC' : bpm > 140 ? '🟡 COMBAT ZONE' : '🟢 AEROBIC'}
        </div>

        {/* Simulated heartbeat line */}
        <div className="mt-4 w-64 h-12 relative">
          <svg width="256" height="48" viewBox="0 0 256 48">
            <path
              d="M0 24 L30 24 L40 8 L50 40 L60 24 L80 24 L90 4 L100 44 L110 24 L140 24 L150 10 L160 38 L170 24 L200 24 L210 6 L220 42 L230 24 L256 24"
              fill="none" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Stat grid */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-5">
        {stats.map(s => (
          <div key={s.label} className="bg-[#111113] border border-[#2A2A2F] p-4 rounded-sm">
            <div className="font-display text-[10px] tracking-widest text-[#5A5A65] uppercase mb-1">{s.label}</div>
            <div className="font-display font-black text-2xl" style={{ color: s.color }}>{s.value}</div>
            <div className="font-display text-[10px] text-[#3A3A42] uppercase">{s.unit}</div>
          </div>
        ))}
      </div>

      {/* Muscle activation */}
      <div className="px-5 mb-4">
        <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase mb-2">MUSCLE ACTIVATION</div>
        <div className="space-y-2">
          {[
            { muscle: 'CHEST', pct: 88 },
            { muscle: 'SHOULDERS', pct: 72 },
            { muscle: 'TRICEPS', pct: 65 },
            { muscle: 'CORE', pct: 91 },
          ].map(m => (
            <div key={m.muscle} className="flex items-center gap-3">
              <span className="font-display text-xs text-[#5A5A65] w-24 uppercase">{m.muscle}</span>
              <div className="flex-1 h-1.5 bg-[#1A1A1D] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${m.pct}%`, background: '#C41E3A' }} />
              </div>
              <span className="font-display text-xs text-[#C41E3A] w-8 text-right">{m.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-6">
        <Btn onClick={() => nav('workout')}>RETURN TO BATTLE</Btn>
      </div>
    </div>
  )
}

// ─── 16. CUSTOM WORKOUT BUILDER ───────────────────────────────────────────────
export function WorkoutBuilderScreen({ nav }: { nav: Nav }) {
  const [programName, setProgramName] = useState('')
  const [added, setAdded] = useState<string[]>([
    'Barbell_Bench_Press_-_Medium_Grip',
    'Barbell_Full_Squat',
  ])
  const [formFor, setFormFor] = useState<string | null>(null)

  const nameOf = (dbId: string) => aliasFor(dbId) ?? dbId.replace(/_/g, ' ')

  return (
    <div className="h-full flex flex-col bg-[#070708] relative">
      <BloodStrip />
      <div className="px-5 pt-8 flex items-center justify-between">
        <button onClick={() => nav('programs')} className="font-display text-xs text-[#5A5A65] uppercase">← BACK</button>
        <ScreenLabel>CUSTOM BUILDER</ScreenLabel>
        <button onClick={() => nav('home')} className="font-display text-xs text-[#D4A017] uppercase">SAVE</button>
      </div>

      <div className="px-5 pt-4 pb-3">
        <input
          value={programName}
          onChange={e => setProgramName(e.target.value)}
          placeholder="PROGRAM NAME..."
          className="w-full bg-transparent font-display font-black text-3xl text-white uppercase placeholder-[#2A2A2F] outline-none border-b border-[#2A2A2F] pb-2 focus:border-[#C41E3A] transition-colors"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        {/* Added exercises */}
        <div className="font-display text-xs tracking-widest text-[#5A5A65] uppercase mb-2">YOUR EXERCISES ({added.length})</div>
        <div className="space-y-2 mb-4">
          {added.map((dbId, i) => (
            <div key={dbId} className="flex items-center gap-3 bg-[#111113] border border-[#2A2A2F] p-3 rounded-sm">
              <button
                onClick={() => setFormFor(dbId)}
                className="flex-shrink-0 active:scale-95 transition-transform"
                aria-label={`Show proper form for ${nameOf(dbId)}`}
              >
                <ExerciseDemo dbId={dbId} alt={nameOf(dbId)} className="w-12 h-12 rounded-sm" speed={1250} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="font-display font-black text-sm text-white uppercase truncate">{nameOf(dbId)}</div>
                <button
                  onClick={() => setFormFor(dbId)}
                  className="font-display text-[10px] text-[#C41E3A] uppercase tracking-widest"
                >
                  ▶ WATCH FORM
                </button>
              </div>
              <button
                onClick={() => setAdded(a => a.filter((_, j) => j !== i))}
                className="font-display text-xs text-[#FF2D55] uppercase ml-1"
              >✕</button>
            </div>
          ))}
        </div>

        {/* Exercise library */}
        <div className="font-display text-xs tracking-widest text-[#5A5A65] uppercase mb-2">ADD EXERCISES</div>
        <div className="space-y-2">
          {SIGNATURE_MOVES.filter(m => !added.includes(m.dbId)).map(m => (
            <button
              key={m.dbId}
              onClick={() => setAdded(a => [...a, m.dbId])}
              className="w-full flex items-center gap-3 p-3 bg-[#0D0D0F] border border-[#1A1A1D] rounded-sm text-left active:bg-[#111113] transition-colors"
            >
              <ExerciseDemo dbId={m.dbId} alt={m.alias} className="w-12 h-12 rounded-sm flex-shrink-0" speed={1300} />
              <span className="font-display font-bold text-sm text-[#5A5A65] flex-1 uppercase truncate">{m.alias}</span>
              <span className="font-display text-[#C41E3A] text-lg font-bold">+</span>
            </button>
          ))}
        </div>

        <div className="mt-3">
          <Btn variant="ghost" onClick={() => nav('library')} size="sm">BROWSE FULL LIBRARY →</Btn>
        </div>
      </div>

      <div className="px-5 pb-6 pt-3">
        <Btn onClick={() => nav('workout')}>START CUSTOM WORKOUT</Btn>
      </div>

      {formFor && <FormSheet dbId={formFor} onClose={() => setFormFor(null)} />}
    </div>
  )
}

// ─── 17. EXERCISE LIBRARY ─────────────────────────────────────────────────────
// Backed by the live technique database: every entry carries a looping
// demonstration and step-by-step form cues.

const PAGE_SIZE = 24

export function ExerciseLibraryScreen({ nav }: { nav: Nav }) {
  const { data, status, error, retry } = useExerciseDb()
  const online = useOnline()
  const [group, setGroup] = useState<string>('ALL')
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [openId, setOpenId] = useState<string | null>(null)

  const q = query.trim().toLowerCase()

  const filtered = useMemo(
    () =>
      data.filter(
        ex =>
          matchesGroup(ex, group) &&
          (!q ||
            ex.name.toLowerCase().includes(q) ||
            (aliasFor(ex.id) ?? '').toLowerCase().includes(q) ||
            ex.primaryMuscles.some(m => m.includes(q)) ||
            (ex.equipment ?? '').toLowerCase().includes(q))
      ),
    [data, group, q]
  )

  // A new search should start back at the top of the results.
  useEffect(() => setLimit(PAGE_SIZE), [group, q])

  const visible = filtered.slice(0, limit)

  return (
    <div className="h-full flex flex-col bg-[#070708] relative">
      <BloodStrip />
      <div className="px-5 pt-8 flex items-center justify-between flex-shrink-0">
        <button onClick={() => nav('workout')} className="font-display text-xs text-[#5A5A65] uppercase">← BACK</button>
        <ScreenLabel>EXERCISE LIBRARY</ScreenLabel>
        <div className="w-16" />
      </div>

      {!online && <OfflineBanner />}

      {/* Search */}
      <div className="px-5 pt-3 pb-3 flex-shrink-0">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="SEARCH TECHNIQUES..."
          className="w-full bg-[#111113] border border-[#2A2A2F] text-white placeholder-[#3A3A42] px-4 py-3 font-display text-sm uppercase tracking-wide outline-none focus:border-[#C41E3A] transition-colors rounded-sm"
        />
      </div>

      {/* Muscle group filter */}
      <div className="flex gap-2 px-5 pb-3 overflow-x-auto flex-shrink-0">
        {LIBRARY_FILTERS.map(c => (
          <button
            key={c}
            onClick={() => setGroup(c)}
            className="flex-shrink-0 px-3 py-1.5 font-display font-bold text-xs uppercase tracking-wide rounded-sm transition-all"
            style={{
              background: group === c ? '#C41E3A' : '#111113',
              color: group === c ? '#fff' : '#5A5A65',
              border: `1px solid ${group === c ? '#C41E3A' : '#2A2A2F'}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-2 border-[#C41E3A] border-t-transparent rounded-full animate-spin" />
          <span className="font-display text-xs tracking-widest text-[#5A5A65] uppercase">
            LOADING TECHNIQUE DATABASE...
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
          <span className="text-3xl">⚠️</span>
          <div className="font-display font-black text-lg text-white uppercase">
            {online ? 'DATABASE UNREACHABLE' : 'NO SIGNAL'}
          </div>
          <p className="font-body text-xs text-[#5A5A65]">
            {online
              ? `The technique database could not be reached. ${error}`
              : 'The library streams from the technique database. Reconnect to load it.'}
          </p>
          <button
            onClick={retry}
            className="mt-2 px-6 py-3 bg-[#C41E3A] font-display font-black text-sm text-white uppercase tracking-widest rounded-sm active:scale-95 transition-transform"
          >
            RETRY
          </button>
        </div>
      )}

      {status === 'ready' && (
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {/* Signature moves — the app's named techniques */}
          {group === 'ALL' && !q && (
            <div className="mb-4">
              <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase mb-2">
                ⚔ SIGNATURE TECHNIQUES
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {SIGNATURE_MOVES.map(move => (
                  <button
                    key={move.alias}
                    onClick={() => setOpenId(move.dbId)}
                    className="flex-shrink-0 w-32 text-left active:scale-95 transition-transform"
                  >
                    <ExerciseDemo
                      dbId={move.dbId}
                      alt={move.alias}
                      className="w-32 h-24 rounded-sm"
                      lazy={false}
                      speed={1150}
                    />
                    <div className="font-display font-black text-[11px] text-white uppercase mt-1 leading-tight">
                      {move.alias}
                    </div>
                    <div className="font-display text-[9px] text-[#C41E3A] uppercase tracking-widest">
                      {move.cat}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase mb-2">
            {filtered.length} TECHNIQUE{filtered.length === 1 ? '' : 'S'}
          </div>

          <div className="space-y-2">
            {visible.map(ex => {
              const meta = levelMeta(ex.level)
              const alias = aliasFor(ex.id)
              return (
                <button
                  key={ex.id}
                  onClick={() => setOpenId(ex.id)}
                  className="w-full flex items-center gap-3 bg-[#111113] border border-[#2A2A2F] p-3 rounded-sm text-left active:scale-[0.98] transition-transform"
                >
                  <FormDemo
                    frames={frameUrls(ex)}
                    alt={ex.name}
                    className="w-16 h-16 rounded-sm flex-shrink-0"
                    speed={1250}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-black text-sm text-white uppercase leading-tight">
                      {alias ?? ex.name}
                    </div>
                    {alias && <div className="font-body text-[10px] text-[#3A3A42] truncate">{ex.name}</div>}
                    <div className="font-body text-xs text-[#5A5A65] truncate">
                      {ex.primaryMuscles.join(', ')}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span
                        className="font-display text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wide"
                        style={{ background: `${meta.color}20`, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <span className="font-display text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wide bg-[#1A1A1D] text-[#5A5A65]">
                        {ex.equipment || 'no gear'}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-[#3A3A42] font-display uppercase tracking-widest">
              NO TECHNIQUES FOUND
            </div>
          )}

          {limit < filtered.length && (
            <button
              onClick={() => setLimit(l => l + PAGE_SIZE)}
              className="w-full mt-3 py-3 bg-[#111113] border border-[#2A2A2F] font-display font-bold text-xs text-[#5A5A65] uppercase tracking-widest rounded-sm active:scale-95 transition-transform"
            >
              LOAD {Math.min(PAGE_SIZE, filtered.length - limit)} MORE
            </button>
          )}
        </div>
      )}

      {openId && <FormSheet dbId={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}

// ─── 18. VICTORY SUMMARY ─────────────────────────────────────────────────────
export function VictoryScreen({ nav }: { nav: Nav }) {
  return (
    <div className="h-full flex flex-col bg-[#070708] relative overflow-hidden">
      <BloodStrip />

      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(212,160,23,0.12) 0%, transparent 70%)' }} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center pt-10 px-5">
          {/* Victory badge */}
          <div className="relative mb-4">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <polygon points="42,6 78,6 110,38 110,82 78,114 42,114 10,82 10,38"
                fill="none" stroke="#D4A017" strokeWidth="2" />
              <polygon points="46,14 74,14 102,42 102,78 74,106 46,106 18,78 18,42"
                fill="#111113" stroke="#D4A01740" strokeWidth="1" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-black text-4xl text-[#D4A017]">V</span>
            </div>
          </div>

          <ScreenLabel>BATTLE COMPLETE</ScreenLabel>
          <h1 className="font-display font-black text-5xl text-white uppercase text-center leading-tight mt-2 mb-1">
            VICTORY!
          </h1>
          <p className="font-display text-sm text-[#D4A017] tracking-widest uppercase mb-6">ROUND 6 OF 6 CONQUERED</p>

          {/* XP gained */}
          <div className="bg-[#D4A017]/10 border border-[#D4A017]/30 px-8 py-4 rounded-sm text-center mb-6 w-full">
            <div className="font-display font-black text-4xl text-[#D4A017]">+1,240 XP</div>
            <div className="font-display text-xs text-[#5A5A65] tracking-widest uppercase mt-1">POWER GAINED</div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 w-full mb-5">
            {[
              { label: 'DURATION', value: '1h 12m', color: '#fff' },
              { label: 'SETS DONE', value: '20/20', color: '#C41E3A' },
              { label: 'TOTAL VOLUME', value: '12,800 kg', color: '#D4A017' },
              { label: 'CALORIES', value: '687 kcal', color: '#E8820C' },
            ].map(s => (
              <div key={s.label} className="bg-[#111113] border border-[#2A2A2F] p-3 rounded-sm text-center">
                <div className="font-display font-black text-xl" style={{ color: s.color }}>{s.value}</div>
                <div className="font-display text-[9px] tracking-widest text-[#5A5A65] uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Rank progress */}
          <div className="w-full bg-[#111113] border border-[#2A2A2F] p-4 rounded-sm mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-display font-bold text-sm text-white uppercase">RANK PROGRESS</span>
              <span className="font-display text-xs text-[#D4A017]">WARRIOR → BERSERKER</span>
            </div>
            <div className="h-2 bg-[#1A1A1D] rounded-full overflow-hidden">
              <div className="h-full bg-[#D4A017] rounded-full" style={{ width: '73%' }} />
            </div>
            <div className="font-display text-xs text-[#5A5A65] mt-1 text-right">73% to next rank</div>
          </div>

          {/* Personal records */}
          <div className="w-full mb-6">
            <div className="font-display text-xs tracking-widest text-[#5A5A65] uppercase mb-2">🏆 PERSONAL RECORDS</div>
            <div className="bg-[#D4A017]/10 border border-[#D4A017]/30 p-3 rounded-sm">
              <div className="font-display font-black text-sm text-[#D4A017] uppercase">NEW RECORD! STONE CRUSHER DEADLIFT</div>
              <div className="font-body text-xs text-[#8A8A6A] mt-0.5">145kg × 5 reps — Previous: 140kg</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-8 space-y-3">
        <Btn onClick={() => nav('home')}>RETURN TO BASE</Btn>
        <Btn variant="ghost" onClick={() => nav('programs')}>FIGHT AGAIN</Btn>
      </div>
    </div>
  )
}
