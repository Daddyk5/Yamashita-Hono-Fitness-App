import { useState } from 'react'
import { Nav } from '../types'
import { BottomNav, Btn, BloodStrip, ScreenLabel } from '../components/Layout'

// ─── 26. SETTINGS ─────────────────────────────────────────────────────────────
const SETTING_GROUPS = [
  {
    title: 'FIGHTER ACCOUNT',
    items: [
      { label: 'Fighter Profile', sub: 'Tokita Ōhma · WARRIOR', action: 'profile' as const, icon: '👤' },
      { label: 'Body Stats Tracker', sub: 'Weight, measurements & more', action: 'body-stats' as const, icon: '📏' },
      { label: 'Fighter Pass', sub: 'Free tier · Upgrade available', action: 'fighter-pass' as const, icon: '⚡' },
    ],
  },
  {
    title: 'APP',
    items: [
      { label: 'Notifications', sub: 'Daily battle reminders', action: 'notifications' as const, icon: '🔔' },
      { label: 'Theme', sub: 'Dark — Arena Mode', action: null, icon: '🎨' },
      { label: 'Units', sub: 'Metric (kg / cm)', action: null, icon: '📐' },
    ],
  },
  {
    title: 'DATA',
    items: [
      { label: 'Empty State Demo', sub: 'View empty screen', action: 'empty' as const, icon: '◻' },
      { label: 'Error State Demo', sub: 'View error screen', action: 'error' as const, icon: '⚠️' },
      { label: 'Offline Mode Demo', sub: 'View offline screen', action: 'offline' as const, icon: '📵' },
    ],
  },
]

export function SettingsScreen({ nav }: { nav: Nav }) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'sound': true, 'haptics': true, 'autoRest': false,
  })

  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-5 pt-10 pb-4">
          <ScreenLabel>FIGHTER CONTROL</ScreenLabel>
          <h1 className="font-display font-black text-4xl text-white uppercase mt-1">SETTINGS</h1>
        </div>

        {SETTING_GROUPS.map(group => (
          <div key={group.title} className="px-5 mb-5">
            <div className="font-display text-xs tracking-[0.3em] text-[#5A5A65] uppercase mb-2">{group.title}</div>
            <div className="space-y-1">
              {group.items.map(item => (
                <button
                  key={item.label}
                  onClick={() => item.action && nav(item.action)}
                  className="w-full flex items-center gap-4 p-4 bg-[#111113] border border-[#2A2A2F] rounded-sm text-left active:bg-[#1A1A1D] transition-colors"
                >
                  <span className="text-xl w-8 text-center">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-display font-bold text-sm text-white uppercase">{item.label}</div>
                    <div className="font-body text-xs text-[#5A5A65]">{item.sub}</div>
                  </div>
                  {item.action && <span className="text-[#5A5A65] font-bold">›</span>}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Toggle settings */}
        <div className="px-5 mb-5">
          <div className="font-display text-xs tracking-[0.3em] text-[#5A5A65] uppercase mb-2">PREFERENCES</div>
          <div className="space-y-1">
            {[
              { key: 'sound', label: 'Battle Sounds', sub: 'Audio cues during workout' },
              { key: 'haptics', label: 'Haptic Feedback', sub: 'Vibration on set complete' },
              { key: 'autoRest', label: 'Auto Rest Timer', sub: 'Start timer automatically' },
            ].map(t => (
              <div key={t.key} className="flex items-center gap-4 p-4 bg-[#111113] border border-[#2A2A2F] rounded-sm">
                <div className="flex-1">
                  <div className="font-display font-bold text-sm text-white uppercase">{t.label}</div>
                  <div className="font-body text-xs text-[#5A5A65]">{t.sub}</div>
                </div>
                <button
                  onClick={() => setToggles(prev => ({ ...prev, [t.key]: !prev[t.key] }))}
                  className="w-12 h-6 rounded-full transition-all flex-shrink-0 relative"
                  style={{ background: toggles[t.key] ? '#C41E3A' : '#2A2A2F' }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                    style={{ left: toggles[t.key] ? 24 : 2 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <div className="px-5 mb-6">
          <Btn variant="danger" onClick={() => nav('welcome')}>LEAVE THE ARENA</Btn>
        </div>
      </div>
      <BottomNav active="settings" nav={nav} />
    </div>
  )
}

// ─── 27. NOTIFICATIONS CENTER ─────────────────────────────────────────────────
const NOTIFS = [
  {
    type: 'battle', icon: '⚔️', color: '#C41E3A',
    title: 'RIVAL CHALLENGE RECEIVED',
    body: 'Cosmo Imai has challenged you to a power duel!',
    time: '2 min ago', unread: true,
  },
  {
    type: 'achievement', icon: '🏆', color: '#D4A017',
    title: 'ACHIEVEMENT UNLOCKED',
    body: 'You\'ve earned "Seven Samurai" — 7-day streak complete!',
    time: '1 hour ago', unread: true,
  },
  {
    type: 'streak', icon: '🔥', color: '#E8820C',
    title: 'STREAK WARNING',
    body: 'Your 14-day streak ends in 4 hours. Get to the arena!',
    time: '3 hours ago', unread: true,
  },
  {
    type: 'rank', icon: '⬆️', color: '#D4A017',
    title: 'RANK UP INCOMING',
    body: 'You\'re 73% to BERSERKER rank. One strong session will do it.',
    time: 'Yesterday', unread: false,
  },
  {
    type: 'program', icon: '📋', color: '#3A6B8A',
    title: 'NEW PROGRAM AVAILABLE',
    body: '"Death\'s Gate" extreme program is now unlocked for your level.',
    time: '2 days ago', unread: false,
  },
  {
    type: 'social', icon: '👊', color: '#6A3AAF',
    title: 'LEADERBOARD SHAKEUP',
    body: 'Ryuki Gaoh passed you. Reclaim your position!',
    time: '3 days ago', unread: false,
  },
]

export function NotificationsScreen({ nav }: { nav: Nav }) {
  const [notifications, setNotifications] = useState(NOTIFS)

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, unread: false })))
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="px-5 pt-8 flex items-center justify-between">
        <button onClick={() => nav('settings')} className="font-display text-xs text-[#5A5A65] uppercase">← BACK</button>
        <ScreenLabel>NOTIFICATIONS</ScreenLabel>
        <button onClick={markAllRead} className="font-display text-xs text-[#C41E3A] uppercase">CLEAR ALL</button>
      </div>

      <div className="px-5 pt-3 pb-3">
        <h1 className="font-display font-black text-3xl text-white uppercase">INTEL CENTER</h1>
        {unreadCount > 0 && (
          <div className="font-display text-xs text-[#C41E3A] mt-0.5">{unreadCount} unread dispatches</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-2 pb-4">
        {notifications.map((n, i) => (
          <button
            key={i}
            onClick={() => setNotifications(prev => prev.map((x, j) => j === i ? { ...x, unread: false } : x))}
            className="w-full flex items-start gap-4 p-4 rounded-sm border text-left transition-all active:scale-95"
            style={{
              background: n.unread ? '#111113' : '#0D0D0F',
              borderColor: n.unread ? n.color + '40' : '#1A1A1D',
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${n.color}20`, border: `1.5px solid ${n.color}40` }}
            >
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="font-display font-bold text-sm uppercase" style={{ color: n.unread ? '#fff' : '#5A5A65' }}>
                  {n.title}
                </div>
                {n.unread && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: n.color }} />}
              </div>
              <div className="font-body text-xs text-[#5A5A65] mt-0.5 leading-relaxed">{n.body}</div>
              <div className="font-display text-[10px] text-[#3A3A42] mt-1 uppercase">{n.time}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── 28. SUBSCRIPTION / FIGHTER PASS ─────────────────────────────────────────
const TIERS = [
  {
    name: 'STREET FIGHTER',
    price: 'FREE',
    priceLabel: 'ALWAYS',
    color: '#5A5A65',
    current: true,
    features: [
      '3 programs included',
      'Basic power stats',
      'Public leaderboard',
      'Community challenges',
    ],
  },
  {
    name: 'WARRIOR PASS',
    price: '$9.99',
    priceLabel: '/MONTH',
    color: '#C41E3A',
    popular: true,
    features: [
      'All 12 programs unlocked',
      'Advanced power analytics',
      'Live stat tracking',
      'Priority rival matchups',
      'Custom workout builder',
      'Body stats tracking',
    ],
  },
  {
    name: 'OMEGA PASS',
    price: '$24.99',
    priceLabel: '/MONTH',
    color: '#D4A017',
    features: [
      'Everything in Warrior Pass',
      '1-on-1 coaching sessions',
      'AI fight arc personalization',
      'Exclusive Omega rank badge',
      'Annual achievement bonus',
      'Priority support arena',
    ],
  },
]

export function FighterPassScreen({ nav }: { nav: Nav }) {
  const [selected, setSelected] = useState<string>('WARRIOR PASS')

  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="px-5 pt-8 flex items-center justify-between">
        <button onClick={() => nav('settings')} className="font-display text-xs text-[#5A5A65] uppercase">← BACK</button>
        <ScreenLabel>FIGHTER PASS</ScreenLabel>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="px-5 pt-3 pb-4 text-center">
          <h1 className="font-display font-black text-4xl text-white uppercase leading-tight">
            UPGRADE YOUR<br /><span className="text-[#C41E3A]">FIGHTER PASS</span>
          </h1>
          <p className="font-body text-xs text-[#5A5A65] mt-2">Unlock elite programs and dominate the arena</p>
        </div>

        <div className="px-5 space-y-4">
          {TIERS.map(tier => (
            <button
              key={tier.name}
              onClick={() => setSelected(tier.name)}
              className="w-full text-left rounded-sm border overflow-hidden transition-all active:scale-95 relative"
              style={{
                borderColor: selected === tier.name ? tier.color : '#2A2A2F',
                background: selected === tier.name ? `${tier.color}08` : '#111113',
              }}
            >
              {tier.popular && (
                <div className="absolute top-0 right-4 px-3 py-1 font-display font-black text-[10px] tracking-widest uppercase"
                  style={{ background: '#C41E3A', color: '#fff' }}>
                  POPULAR
                </div>
              )}
              <div className="p-4">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <div className="font-display font-black text-lg uppercase" style={{ color: tier.color }}>{tier.name}</div>
                    {tier.current && <div className="font-display text-[10px] text-[#5A5A65] uppercase">YOUR CURRENT PLAN</div>}
                  </div>
                  <div className="text-right">
                    <div className="font-display font-black text-2xl text-white">{tier.price}</div>
                    <div className="font-display text-[10px] text-[#5A5A65]">{tier.priceLabel}</div>
                  </div>
                </div>
                <div className="h-px bg-[#2A2A2F] mb-3" />
                <div className="space-y-1.5">
                  {tier.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0"
                        style={{ background: `${tier.color}20` }}>
                        <span className="text-[8px]" style={{ color: tier.color }}>✓</span>
                      </div>
                      <span className="font-body text-xs text-[#8A8A8A]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="px-5 mt-5 space-y-3">
          {selected !== 'STREET FIGHTER' ? (
            <Btn onClick={() => nav('settings')} variant="primary">
              UNLOCK {selected.split(' ')[0]} PASS
            </Btn>
          ) : (
            <Btn variant="secondary" onClick={() => nav('settings')}>KEEP FREE PLAN</Btn>
          )}
          <div className="text-center font-display text-[10px] text-[#3A3A42] uppercase tracking-widest">
            Cancel anytime · No contracts · Arena guaranteed
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 29. BODY STATS TRACKER ───────────────────────────────────────────────────
export function BodyStatsScreen({ nav }: { nav: Nav }) {
  const [weight, setWeight] = useState('82.5')
  const [expanded, setExpanded] = useState(false)

  const measurements = [
    { label: 'CHEST', value: '104cm' },
    { label: 'WAIST', value: '82cm' },
    { label: 'HIPS', value: '96cm' },
    { label: 'BICEPS', value: '38cm' },
    { label: 'THIGHS', value: '58cm' },
  ]

  const weightHistory = [78, 79.5, 80, 81, 80.5, 82, 82.5]
  const maxW = Math.max(...weightHistory)
  const minW = Math.min(...weightHistory)
  const range = maxW - minW || 1

  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="px-5 pt-8 flex items-center justify-between">
        <button onClick={() => nav('settings')} className="font-display text-xs text-[#5A5A65] uppercase">← BACK</button>
        <ScreenLabel>BODY STATS</ScreenLabel>
        <button className="font-display text-xs text-[#D4A017] uppercase">LOG</button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 px-5">
        <h1 className="font-display font-black text-3xl text-white uppercase pt-3 pb-4">
          PHYSICAL<br /><span className="text-[#C41E3A]">COMBAT METRICS</span>
        </h1>

        {/* Weight */}
        <div className="bg-[#111113] border border-[#2A2A2F] rounded-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase">CURRENT WEIGHT</div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-3xl text-white">{weight}</span>
              <span className="font-display text-sm text-[#5A5A65]">kg</span>
            </div>
          </div>

          {/* Mini sparkline */}
          <svg width="100%" height="48" viewBox={`0 0 ${(weightHistory.length - 1) * 40} 48`} className="overflow-visible">
            {weightHistory.map((w, i) => {
              if (i === 0) return null
              const x1 = (i - 1) * 40
              const x2 = i * 40
              const y1 = 40 - ((weightHistory[i - 1] - minW) / range) * 36
              const y2 = 40 - ((w - minW) / range) * 36
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" />
            })}
            {weightHistory.map((w, i) => {
              const x = i * 40
              const y = 40 - ((w - minW) / range) * 36
              return <circle key={i} cx={x} cy={y} r="3" fill={i === weightHistory.length - 1 ? '#C41E3A' : '#5A5A65'} />
            })}
          </svg>

          <div className="flex justify-between font-display text-[10px] text-[#3A3A42] uppercase mt-1">
            <span>6 WEEKS AGO</span><span>TODAY</span>
          </div>
        </div>

        {/* Body composition */}
        <div className="bg-[#111113] border border-[#2A2A2F] rounded-sm p-4 mb-4">
          <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase mb-3">BODY COMPOSITION</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'BODY FAT', value: '14.2%', color: '#E8820C' },
              { label: 'MUSCLE', value: '43.8%', color: '#C41E3A' },
              { label: 'BMI', value: '24.1', color: '#D4A017' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display font-black text-xl" style={{ color: s.color }}>{s.value}</div>
                <div className="font-display text-[9px] text-[#5A5A65] uppercase tracking-wide mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Measurements */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 bg-[#111113] border border-[#2A2A2F] rounded-sm mb-2"
        >
          <span className="font-display font-bold text-sm text-white uppercase">COMBAT MEASUREMENTS</span>
          <span className="text-[#5A5A65] font-bold text-lg">{expanded ? '−' : '+'}</span>
        </button>

        {expanded && (
          <div className="bg-[#111113] border border-[#2A2A2F] border-t-0 rounded-b-sm p-4 -mt-2 mb-4 space-y-3">
            {measurements.map(m => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-[#5A5A65] uppercase">{m.label}</span>
                <span className="font-display font-black text-sm text-white">{m.value}</span>
              </div>
            ))}
          </div>
        )}

        <Btn onClick={() => nav('settings')} variant="secondary">LOG TODAY'S STATS</Btn>
      </div>
    </div>
  )
}
