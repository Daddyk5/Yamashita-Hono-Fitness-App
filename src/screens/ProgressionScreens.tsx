import { useState } from 'react'
import { Nav } from '../types'
import { BottomNav, Btn, Card, PowerBar, RankBadge, BloodStrip, ScreenLabel, StarIcon } from '../components/Layout'

// ─── 19. FIGHTER PROFILE ──────────────────────────────────────────────────────
export function ProfileScreen({ nav }: { nav: Nav }) {
  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Hero banner */}
        <div
          className="relative px-5 pt-10 pb-6"
          style={{ background: 'linear-gradient(180deg, rgba(196,30,58,0.15) 0%, transparent 100%)' }}
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full border-2 border-[#C41E3A] flex items-center justify-center flex-shrink-0"
              style={{ background: 'radial-gradient(circle, rgba(196,30,58,0.2), rgba(196,30,58,0.05))' }}>
              <span className="font-display font-black text-4xl text-[#C41E3A]">鬼</span>
            </div>
            <div className="flex-1 pt-1">
              <div className="font-display font-black text-2xl text-white uppercase leading-tight">REN KUROGANE</div>
              <div className="font-display text-xs text-[#5A5A65] uppercase tracking-wide mt-0.5">THE ONI</div>
              <div className="flex items-center gap-2 mt-2">
                <RankBadge rank="WARRIOR" size="sm" />
                <span className="font-display text-xs text-[#5A5A65]">LVL 47</span>
              </div>
            </div>
            <button onClick={() => nav('settings')} className="font-display text-xs text-[#5A5A65] uppercase tracking-widest mt-1">EDIT</button>
          </div>

          {/* Power level */}
          <div className="mt-4 bg-[#111113] border border-[#2A2A2F] p-3 rounded-sm">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-display font-bold text-xs text-[#5A5A65] uppercase tracking-widest">POWER LEVEL</span>
              <span className="font-display font-black text-xl text-[#C41E3A]">8,420</span>
            </div>
            <div className="h-2 bg-[#1A1A1D] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '73%', background: 'linear-gradient(90deg, #C41E3A, #FF2D55)' }} />
            </div>
            <div className="font-display text-[10px] text-[#5A5A65] mt-1">7,200 to next rank</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="px-5 grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'WORKOUTS', value: '148' },
            { label: 'STREAK', value: '14🔥' },
            { label: 'RIVALS BEAT', value: '23' },
          ].map(s => (
            <div key={s.label} className="text-center bg-[#111113] border border-[#2A2A2F] p-3 rounded-sm">
              <div className="font-display font-black text-xl text-white">{s.value}</div>
              <div className="font-display text-[9px] text-[#5A5A65] uppercase tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="px-5 space-y-2 mb-5">
          {[
            { label: 'POWER STATS CHART', desc: 'Full stat breakdown', screen: 'power-stats' as const, icon: '📊' },
            { label: 'RANK LADDER', desc: 'Your position in the brackets', screen: 'rank-ladder' as const, icon: '🏆' },
            { label: 'ACHIEVEMENTS', desc: '31 of 64 unlocked', screen: 'achievements' as const, icon: '🥇' },
            { label: 'WORKOUT HISTORY', desc: '148 sessions logged', screen: 'history' as const, icon: '📋' },
          ].map(item => (
            <button
              key={item.screen}
              onClick={() => nav(item.screen)}
              className="w-full flex items-center gap-4 p-4 bg-[#111113] border border-[#2A2A2F] rounded-sm text-left active:bg-[#1A1A1D] transition-colors"
            >
              <span className="text-xl w-8 text-center">{item.icon}</span>
              <div className="flex-1">
                <div className="font-display font-bold text-sm text-white uppercase">{item.label}</div>
                <div className="font-body text-xs text-[#5A5A65]">{item.desc}</div>
              </div>
              <span className="text-[#C41E3A] font-bold">›</span>
            </button>
          ))}
        </div>

        {/* Recent activity */}
        <div className="px-5">
          <div className="font-display text-xs tracking-widest text-[#5A5A65] uppercase mb-2">RECENT BATTLES</div>
          {[
            { name: 'Iron Will Protocol · Round 6', date: 'Today', xp: '+1,240', win: true },
            { name: 'Lightning Strike · Round 8', date: 'Yesterday', xp: '+980', win: true },
            { name: 'Custom: Leg Destroyer', date: '2 days ago', xp: '+640', win: false },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-[#1A1A1D]">
              <div className={`w-2 h-8 rounded-full flex-shrink-0 ${r.win ? 'bg-[#C41E3A]' : 'bg-[#2A2A2F]'}`} />
              <div className="flex-1">
                <div className="font-display font-bold text-sm text-white">{r.name}</div>
                <div className="font-display text-xs text-[#5A5A65]">{r.date}</div>
              </div>
              <span className="font-display font-bold text-sm text-[#D4A017]">{r.xp}</span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="profile" nav={nav} />
    </div>
  )
}

// ─── 20. POWER STATS CHART ────────────────────────────────────────────────────
const STATS_DATA = [
  { name: 'STRENGTH', value: 85, color: '#C41E3A' },
  { name: 'SPEED', value: 72, color: '#D4A017' },
  { name: 'ENDURANCE', value: 68, color: '#3A6B8A' },
  { name: 'TECHNIQUE', value: 79, color: '#E8820C' },
  { name: 'WILLPOWER', value: 94, color: '#FF2D55' },
  { name: 'RECOVERY', value: 61, color: '#6A3AAF' },
]

function RadarChart() {
  const cx = 130, cy = 130, maxR = 100
  const n = STATS_DATA.length
  const angle = (i: number) => (2 * Math.PI * i) / n - Math.PI / 2

  const getPoint = (i: number, r: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  })

  const gridLevels = [0.25, 0.5, 0.75, 1]
  const dataPoints = STATS_DATA.map((s, i) => getPoint(i, (s.value / 100) * maxR))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z'

  return (
    <svg width="260" height="260" viewBox="0 0 260 260">
      {/* Grid polygons */}
      {gridLevels.map(lvl => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, maxR * lvl))
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z'
        return <path key={lvl} d={path} fill="none" stroke="#2A2A2F" strokeWidth="1" />
      })}
      {/* Axis lines */}
      {Array.from({ length: n }, (_, i) => {
        const p = getPoint(i, maxR)
        return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="#2A2A2F" strokeWidth="1" />
      })}
      {/* Data polygon */}
      <path d={dataPath} fill="rgba(196,30,58,0.15)" stroke="#C41E3A" strokeWidth="2" />
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={STATS_DATA[i].color} />
      ))}
      {/* Labels */}
      {STATS_DATA.map((s, i) => {
        const labelR = maxR + 18
        const p = getPoint(i, labelR)
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
            fill={s.color} fontSize="9" fontFamily="Barlow Condensed" fontWeight="700"
            letterSpacing="1">
            {s.name}
          </text>
        )
      })}
    </svg>
  )
}

export function PowerStatsScreen({ nav }: { nav: Nav }) {
  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="px-5 pt-8 flex items-center justify-between">
        <button onClick={() => nav('profile')} className="font-display text-xs text-[#5A5A65] uppercase">← BACK</button>
        <ScreenLabel>POWER STATS</ScreenLabel>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="px-5 pt-2 pb-4">
          <h1 className="font-display font-black text-3xl text-white uppercase">FIGHTER ANALYSIS</h1>
          <div className="font-display text-xs text-[#5A5A65] tracking-widest">REN KUROGANE · WARRIOR CLASS</div>
        </div>

        {/* Radar chart */}
        <div className="flex justify-center mb-4">
          <RadarChart />
        </div>

        {/* Stat bars */}
        <div className="px-5 space-y-3">
          {STATS_DATA.map(s => (
            <div key={s.name} className="bg-[#111113] border border-[#2A2A2F] p-3 rounded-sm">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="font-display font-bold text-sm text-white uppercase">{s.name}</span>
                <span className="font-display font-black text-lg" style={{ color: s.color }}>{s.value}</span>
              </div>
              <div className="h-1.5 bg-[#1A1A1D] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Overall power */}
        <div className="px-5 mt-4">
          <div className="bg-[#C41E3A]/10 border border-[#C41E3A]/30 p-4 rounded-sm text-center">
            <div className="font-display text-xs tracking-widest text-[#5A5A65] uppercase mb-1">OVERALL POWER RATING</div>
            <div className="font-display font-black text-5xl text-[#C41E3A]">
              {Math.round(STATS_DATA.reduce((a, s) => a + s.value, 0) / STATS_DATA.length)}
            </div>
            <div className="font-display text-xs text-[#5A5A65] mt-1">TOP 15% OF ALL FIGHTERS</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 21. RANK LADDER / BRACKET ────────────────────────────────────────────────
const RANKS = [
  { name: 'STREET FIGHTER', minLvl: 1, maxLvl: 10, color: '#5A5A65', locked: false },
  { name: 'IRON FIST', minLvl: 11, maxLvl: 20, color: '#3A6B8A', locked: false },
  { name: 'BARBARIAN', minLvl: 21, maxLvl: 30, color: '#E8820C', locked: false },
  { name: 'GLADIATOR', minLvl: 31, maxLvl: 40, color: '#D4A017', locked: false },
  { name: 'WARRIOR', minLvl: 41, maxLvl: 50, color: '#C41E3A', locked: false, current: true },
  { name: 'BERSERKER', minLvl: 51, maxLvl: 60, color: '#FF2D55', locked: true },
  { name: 'CHAMPION', minLvl: 61, maxLvl: 70, color: '#9B59B6', locked: true },
  { name: 'KING', minLvl: 71, maxLvl: 80, color: '#D4A017', locked: true },
  { name: 'OMEGA', minLvl: 81, maxLvl: 90, color: '#FF2D55', locked: true },
  { name: 'SUPREME', minLvl: 91, maxLvl: 100, color: '#D4A017', locked: true },
]

export function RankLadderScreen({ nav }: { nav: Nav }) {
  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="px-5 pt-8 flex items-center justify-between">
        <button onClick={() => nav('profile')} className="font-display text-xs text-[#5A5A65] uppercase">← BACK</button>
        <ScreenLabel>RANK LADDER</ScreenLabel>
        <div className="w-16" />
      </div>

      <div className="px-5 pt-3 pb-3">
        <h1 className="font-display font-black text-3xl text-white uppercase leading-tight">
          THE IRONVEIN<br /><span className="text-[#C41E3A]">BRACKET</span>
        </h1>
        <p className="font-body text-xs text-[#5A5A65] mt-1">Rise through 10 ranks to become Supreme</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 px-5 space-y-2">
        {[...RANKS].reverse().map((rank, i) => (
          <div
            key={rank.name}
            className="flex items-center gap-4 p-4 rounded-sm border transition-all"
            style={{
              background: rank.current ? `${rank.color}15` : rank.locked ? '#0D0D0F' : '#111113',
              borderColor: rank.current ? rank.color : rank.locked ? '#1A1A1D' : '#2A2A2F',
              opacity: rank.locked ? 0.5 : 1,
            }}
          >
            {/* Rank icon */}
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
              style={{ background: rank.locked ? '#1A1A1D' : `${rank.color}20`, border: `1.5px solid ${rank.locked ? '#2A2A2F' : rank.color}` }}
            >
              {rank.locked ? (
                <span className="text-[#3A3A42] text-lg">🔒</span>
              ) : (
                <span className="font-display font-black text-lg" style={{ color: rank.color }}>
                  {RANKS.length - i}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="font-display font-black text-sm uppercase" style={{ color: rank.locked ? '#3A3A42' : rank.color }}>
                {rank.name}
              </div>
              <div className="font-display text-[10px] text-[#5A5A65]">LVL {rank.minLvl} – {rank.maxLvl}</div>
            </div>
            {rank.current && (
              <div className="font-display text-[10px] tracking-widest text-[#C41E3A] uppercase bg-[#C41E3A15] px-2 py-1 rounded-sm">
                ← YOU
              </div>
            )}
            {!rank.locked && !rank.current && (
              <span className="text-[#3A3A42] text-sm">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 22. ACHIEVEMENTS / BELT UNLOCKS ─────────────────────────────────────────
const ACHIEVEMENTS = [
  { name: 'FIRST BLOOD', desc: 'Complete your first workout', icon: '🩸', unlocked: true, xp: 100 },
  { name: 'IRON RESOLVE', desc: 'Complete 10 workouts', icon: '🔩', unlocked: true, xp: 300 },
  { name: 'SEVEN SAMURAI', desc: 'Maintain a 7-day streak', icon: '⚔️', unlocked: true, xp: 500 },
  { name: 'GLADIATOR', desc: 'Reach Gladiator rank', icon: '🛡️', unlocked: true, xp: 750 },
  { name: 'THE GRIND NEVER STOPS', desc: 'Log 50 total workouts', icon: '⛓️', unlocked: true, xp: 800 },
  { name: 'BEAST MODE', desc: 'Burn 1,000 calories in one session', icon: '🔥', unlocked: false, xp: 1000 },
  { name: 'RIVAL SLAYER', desc: 'Defeat 10 rivals', icon: '💀', unlocked: false, xp: 1200 },
  { name: 'CENTURY WARRIOR', desc: 'Complete 100 workouts', icon: '💯', unlocked: false, xp: 2000 },
  { name: 'IRONVEIN ELITE', desc: 'Reach Champion rank', icon: '👑', unlocked: false, xp: 5000 },
]

export function AchievementsScreen({ nav }: { nav: Nav }) {
  const [tab, setTab] = useState<'all' | 'unlocked' | 'locked'>('all')
  const filtered = ACHIEVEMENTS.filter(a =>
    tab === 'all' ? true : tab === 'unlocked' ? a.unlocked : !a.unlocked
  )

  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="px-5 pt-8 flex items-center justify-between">
        <button onClick={() => nav('profile')} className="font-display text-xs text-[#5A5A65] uppercase">← BACK</button>
        <ScreenLabel>ACHIEVEMENTS</ScreenLabel>
        <div className="w-16" />
      </div>

      <div className="px-5 pt-3 pb-3">
        <h1 className="font-display font-black text-3xl text-white uppercase">BELT UNLOCKS</h1>
        <div className="font-display text-xs text-[#5A5A65] mt-0.5">
          <span className="text-[#D4A017] font-bold">5</span> of {ACHIEVEMENTS.length} achievements unlocked
        </div>
        {/* Overall progress */}
        <div className="mt-2 h-1.5 bg-[#1A1A1D] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${(5/ACHIEVEMENTS.length)*100}%`, background: 'linear-gradient(90deg, #D4A017, #F0C040)' }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 gap-2 mb-3">
        {(['all', 'unlocked', 'locked'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="font-display font-bold text-xs uppercase tracking-wide px-3 py-1.5 rounded-sm transition-all"
            style={{
              background: tab === t ? '#C41E3A' : '#111113',
              color: tab === t ? '#fff' : '#5A5A65',
              border: `1px solid ${tab === t ? '#C41E3A' : '#2A2A2F'}`,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-2 pb-4">
        {filtered.map((a, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-sm border"
            style={{
              background: a.unlocked ? '#111113' : '#0D0D0F',
              borderColor: a.unlocked ? '#D4A01740' : '#1A1A1D',
              opacity: a.unlocked ? 1 : 0.5,
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-2xl"
              style={{ background: a.unlocked ? '#D4A01720' : '#1A1A1D', border: `1.5px solid ${a.unlocked ? '#D4A017' : '#2A2A2F'}` }}
            >
              {a.unlocked ? a.icon : '🔒'}
            </div>
            <div className="flex-1">
              <div className="font-display font-black text-sm uppercase" style={{ color: a.unlocked ? '#D4A017' : '#3A3A42' }}>
                {a.name}
              </div>
              <div className="font-body text-xs text-[#5A5A65]">{a.desc}</div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-xs" style={{ color: a.unlocked ? '#D4A017' : '#3A3A42' }}>
                +{a.xp} XP
              </div>
              {a.unlocked && <div className="text-[10px] text-[#3A8A3A]">EARNED</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 23. WORKOUT HISTORY ──────────────────────────────────────────────────────
const HISTORY = [
  { name: 'Iron Will Protocol · R6', date: 'Today', duration: '1h 12m', xp: 1240, type: 'STRENGTH' },
  { name: 'Lightning Strike · R8', date: 'Yesterday', duration: '54m', xp: 980, type: 'HIIT' },
  { name: 'Custom: Leg Destroyer', date: '2 days ago', duration: '48m', xp: 640, type: 'LEGS' },
  { name: 'Iron Will Protocol · R5', date: '3 days ago', duration: '1h 05m', xp: 1100, type: 'STRENGTH' },
  { name: 'The Grind · R3', date: '5 days ago', duration: '1h 30m', xp: 860, type: 'ENDURANCE' },
  { name: 'Shadow Warrior Drill', date: '6 days ago', duration: '40m', xp: 520, type: 'TECHNIQUE' },
  { name: 'Iron Will Protocol · R4', date: '7 days ago', duration: '1h 08m', xp: 1060, type: 'STRENGTH' },
]

const TYPE_COLORS: Record<string, string> = {
  STRENGTH: '#C41E3A', HIIT: '#D4A017', LEGS: '#3A6B8A', ENDURANCE: '#E8820C', TECHNIQUE: '#6A3AAF'
}

export function WorkoutHistoryScreen({ nav }: { nav: Nav }) {
  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="px-5 pt-8 flex items-center justify-between">
        <button onClick={() => nav('profile')} className="font-display text-xs text-[#5A5A65] uppercase">← BACK</button>
        <ScreenLabel>WORKOUT HISTORY</ScreenLabel>
        <div className="w-16" />
      </div>

      <div className="px-5 pt-3 pb-4">
        <h1 className="font-display font-black text-3xl text-white uppercase">BATTLE LOG</h1>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: 'TOTAL SESSIONS', value: '148' },
            { label: 'THIS MONTH', value: '22' },
            { label: 'TOTAL XP', value: '84,200' },
          ].map(s => (
            <div key={s.label} className="bg-[#111113] border border-[#2A2A2F] p-2 rounded-sm text-center">
              <div className="font-display font-black text-lg text-[#C41E3A]">{s.value}</div>
              <div className="font-display text-[8px] text-[#5A5A65] uppercase tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-2 pb-4">
        {HISTORY.map((h, i) => (
          <div key={i} className="flex items-center gap-3 bg-[#111113] border border-[#2A2A2F] p-4 rounded-sm">
            <div className="w-1.5 h-12 rounded-full flex-shrink-0" style={{ background: TYPE_COLORS[h.type] || '#5A5A65' }} />
            <div className="flex-1">
              <div className="font-display font-bold text-sm text-white">{h.name}</div>
              <div className="flex gap-3 mt-0.5">
                <span className="font-display text-[10px] text-[#5A5A65]">{h.date}</span>
                <span className="font-display text-[10px] text-[#5A5A65]">·</span>
                <span className="font-display text-[10px] text-[#5A5A65]">{h.duration}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-sm text-[#D4A017]">+{h.xp}</div>
              <div className="font-display text-[9px] text-[#5A5A65] uppercase">{h.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 24. LEADERBOARD ──────────────────────────────────────────────────────────
const LEADERS = [
  { pos: 1, name: 'JULIUS REINHOLD', rank: 'CHAMPION', power: 24880, change: 0 },
  { pos: 2, name: 'GAOLANG WONGSAWAT', rank: 'BERSERKER', power: 19420, change: 1 },
  { pos: 3, name: 'COSMO IMAI', rank: 'BERSERKER', power: 17650, change: -1 },
  { pos: 4, name: 'RYUKI GAOH', rank: 'WARRIOR', power: 14230, change: 2 },
  { pos: 5, name: 'AGITO KANOH', rank: 'WARRIOR', power: 12900, change: 0 },
  { pos: 6, name: 'REN KUROGANE ← YOU', rank: 'WARRIOR', power: 8420, change: 3, isYou: true },
  { pos: 7, name: 'KIRYU SETSUNA', rank: 'WARRIOR', power: 7840, change: -2 },
  { pos: 8, name: 'OHKUBO NAOYA', rank: 'GLADIATOR', power: 6210, change: 1 },
]

export function LeaderboardScreen({ nav }: { nav: Nav }) {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all'>('weekly')

  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-5 pt-10 pb-3">
          <ScreenLabel>GLOBAL RANKINGS</ScreenLabel>
          <h1 className="font-display font-black text-4xl text-white uppercase mt-1">
            THE IRONVEIN<br /><span className="text-[#C41E3A]">LEADERBOARD</span>
          </h1>
        </div>

        {/* Period filter */}
        <div className="flex px-5 gap-2 mb-4">
          {(['weekly', 'monthly', 'all'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="font-display font-bold text-xs uppercase tracking-wide px-4 py-2 rounded-sm transition-all"
              style={{
                background: period === p ? '#C41E3A' : '#111113',
                color: period === p ? '#fff' : '#5A5A65',
                border: `1px solid ${period === p ? '#C41E3A' : '#2A2A2F'}`,
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div className="px-5 flex items-end gap-2 mb-6 justify-center">
          {[LEADERS[1], LEADERS[0], LEADERS[2]].map((l, i) => {
            const heights = [84, 104, 68]
            const colors = ['#3A6B8A', '#D4A017', '#C41E3A']
            const labels = ['2ND', '1ST', '3RD']
            return (
              <div key={l.pos} className="flex-1 flex flex-col items-center">
                <div className="font-display font-bold text-[10px] text-[#5A5A65] mb-1 uppercase">
                  {l.name.split(' ')[0]}
                </div>
                <div
                  className="w-full rounded-t-sm flex items-center justify-center"
                  style={{ height: heights[i], background: `${colors[i]}20`, border: `1.5px solid ${colors[i]}` }}
                >
                  <span className="font-display font-black text-xl" style={{ color: colors[i] }}>{labels[i]}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Full list */}
        <div className="px-5 space-y-2">
          {LEADERS.map((l) => (
            <button
              key={l.pos}
              onClick={() => l.isYou ? nav('profile') : nav('rival')}
              className="w-full flex items-center gap-4 p-3 rounded-sm border text-left transition-all active:scale-95"
              style={{
                background: l.isYou ? 'rgba(196,30,58,0.1)' : '#111113',
                borderColor: l.isYou ? '#C41E3A' : '#2A2A2F',
              }}
            >
              <div
                className="w-8 h-8 rounded-sm flex items-center justify-center font-display font-black text-sm flex-shrink-0"
                style={{
                  background: l.pos <= 3 ? '#D4A01720' : '#1A1A1D',
                  color: l.pos <= 3 ? '#D4A017' : '#5A5A65',
                }}
              >
                {l.pos}
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-sm text-white uppercase">{l.name}</div>
                <div className="font-display text-[10px] text-[#5A5A65]">{l.rank}</div>
              </div>
              <div className="text-right">
                <div className="font-display font-bold text-sm text-[#C41E3A]">{l.power.toLocaleString()}</div>
                {l.change !== 0 && (
                  <div className={`font-display text-[10px] ${l.change > 0 ? 'text-[#3A8A3A]' : 'text-[#FF2D55]'}`}>
                    {l.change > 0 ? '▲' : '▼'}{Math.abs(l.change)}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      <BottomNav active="leaderboard" nav={nav} />
    </div>
  )
}

// ─── 25. RIVAL MATCHUP / CHALLENGE ────────────────────────────────────────────
export function RivalScreen({ nav }: { nav: Nav }) {
  const [challenged, setChallenged] = useState(false)

  return (
    <div className="h-full flex flex-col bg-[#070708] relative overflow-hidden">
      <BloodStrip />

      {/* VS background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="font-display font-black text-[200px] text-[#1A1A1D] leading-none select-none">VS</div>
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(196,30,58,0.08) 0%, transparent 50%, rgba(58,107,138,0.08) 100%)' }} />

      <div className="px-5 pt-8 flex items-center justify-between relative z-10">
        <button onClick={() => nav('leaderboard')} className="font-display text-xs text-[#5A5A65] uppercase">← BACK</button>
        <ScreenLabel>RIVAL MATCHUP</ScreenLabel>
        <div className="w-16" />
      </div>

      {/* Fighters */}
      <div className="flex-1 flex flex-col justify-center px-5 relative z-10">
        <div className="flex items-stretch gap-4 mb-6">
          {/* You */}
          <div className="flex-1 bg-[#C41E3A10] border border-[#C41E3A30] rounded-sm p-4 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-[#C41E3A] flex items-center justify-center mx-auto mb-3"
              style={{ background: 'rgba(196,30,58,0.15)' }}>
              <span className="font-display font-black text-3xl text-[#C41E3A]">龍</span>
            </div>
            <div className="font-display font-black text-sm text-white uppercase">REN KUROGANE</div>
            <div className="font-display text-xs text-[#C41E3A] mt-0.5">WARRIOR</div>
            <div className="font-display font-black text-2xl text-white mt-2">8,420</div>
            <div className="font-display text-[10px] text-[#5A5A65]">POWER LVL</div>
          </div>

          {/* VS divider */}
          <div className="flex flex-col items-center justify-center">
            <div className="font-display font-black text-3xl text-[#C41E3A]">VS</div>
            <div className="w-px h-12 bg-[#2A2A2F] mt-2" />
          </div>

          {/* Rival */}
          <div className="flex-1 bg-[#3A6B8A10] border border-[#3A6B8A30] rounded-sm p-4 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-[#3A6B8A] flex items-center justify-center mx-auto mb-3"
              style={{ background: 'rgba(58,107,138,0.15)' }}>
              <span className="font-display font-black text-3xl text-[#3A6B8A]">剛</span>
            </div>
            <div className="font-display font-black text-sm text-white uppercase">RYUKI GAOH</div>
            <div className="font-display text-xs text-[#3A6B8A] mt-0.5">WARRIOR</div>
            <div className="font-display font-black text-2xl text-white mt-2">14,230</div>
            <div className="font-display text-[10px] text-[#5A5A65]">POWER LVL</div>
          </div>
        </div>

        {/* Power comparison */}
        <div className="bg-[#111113] border border-[#2A2A2F] rounded-sm p-4 mb-4">
          <div className="font-display text-xs tracking-widest text-[#5A5A65] uppercase mb-3">POWER COMPARISON</div>
          {[
            { stat: 'STRENGTH', you: 85, rival: 72 },
            { stat: 'SPEED', you: 72, rival: 91 },
            { stat: 'ENDURANCE', you: 68, rival: 65 },
            { stat: 'WILLPOWER', you: 94, rival: 88 },
          ].map(s => (
            <div key={s.stat} className="mb-2">
              <div className="flex justify-between font-display text-[10px] text-[#5A5A65] uppercase mb-1">
                <span className="text-[#C41E3A]">{s.you}</span>
                <span>{s.stat}</span>
                <span className="text-[#3A6B8A]">{s.rival}</span>
              </div>
              <div className="flex h-1.5 rounded-full overflow-hidden">
                <div style={{ width: `${s.you / (s.you + s.rival) * 100}%`, background: '#C41E3A' }} />
                <div style={{ flex: 1, background: '#3A6B8A' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Challenge */}
        {challenged ? (
          <div className="bg-[#D4A017]/10 border border-[#D4A017]/30 p-4 rounded-sm text-center">
            <div className="font-display font-black text-lg text-[#D4A017] uppercase">⚔️ CHALLENGE SENT!</div>
            <div className="font-body text-xs text-[#5A5A65] mt-1">Ryuki Gaoh has been notified of your challenge</div>
          </div>
        ) : (
          <Btn onClick={() => setChallenged(true)} variant="primary">⚔️ SEND CHALLENGE</Btn>
        )}
      </div>

      <div className="px-5 pb-6 relative z-10">
        <Btn variant="ghost" onClick={() => nav('leaderboard')}>BACK TO RANKINGS</Btn>
      </div>
    </div>
  )
}
