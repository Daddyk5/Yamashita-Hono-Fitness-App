import { useState, useEffect } from 'react'
import { Nav } from '../types'
import { Btn, TextInput, Divider, BloodStrip, ScreenLabel } from '../components/Layout'
import { login as apiLogin, register as apiRegister } from '../data/authApi'

// ─── 1. SPLASH ───────────────────────────────────────────────────────────────
export function SplashScreen({ nav }: { nav: Nav }) {
  useEffect(() => {
    const t = setTimeout(() => nav('welcome'), 2800)
    return () => clearTimeout(t)
  }, [nav])

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#070708] relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(196,30,58,0.18) 0%, transparent 70%)'
      }} />
      {/* Animated scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-px bg-[#C41E3A]/20" style={{ animation: 'scan-line 3s linear infinite' }} />
      </div>

      {/* Octagon frame */}
      <div className="relative mb-8">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <polygon
            points="56,8 104,8 148,52 148,108 104,152 56,152 12,108 12,52"
            fill="none" stroke="#C41E3A" strokeWidth="2"
          />
          <polygon
            points="60,16 100,16 140,56 140,104 100,144 60,144 20,104 20,56"
            fill="#111113" stroke="#2A2A2F" strokeWidth="1"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            {/* Stylized fist */}
            <rect x="22" y="34" width="36" height="30" rx="4" fill="#C41E3A" />
            <rect x="26" y="18" width="26" height="18" rx="4" fill="#A01830" />
            <rect x="18" y="40" width="8" height="16" rx="3" fill="#8B1229" />
            <rect x="26" y="14" width="6" height="8" rx="2" fill="#C41E3A" />
            <rect x="34" y="14" width="6" height="8" rx="2" fill="#C41E3A" />
            <rect x="42" y="14" width="6" height="8" rx="2" fill="#C41E3A" />
          </svg>
        </div>
      </div>

      <div className="text-center animate-flicker">
        <div className="font-display font-black text-[52px] leading-none tracking-[0.1em] text-white uppercase">
          IRONVEIN
        </div>
        <div className="font-display font-black text-[52px] leading-none tracking-[0.1em] text-[#C41E3A] uppercase">
          ARENA
        </div>
        <div className="font-display font-bold text-[18px] tracking-[0.4em] text-[#5A5A65] uppercase mt-1">
          FITNESS
        </div>
      </div>

      <div className="absolute bottom-16 flex gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1 h-1 rounded-full bg-[#C41E3A] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>

      <div className="absolute bottom-8 font-display text-[10px] tracking-[0.3em] text-[#2A2A2F] uppercase">
        ENTER THE ARENA
      </div>
    </div>
  )
}

// ─── 2. WELCOME (ORIGIN STORY) ───────────────────────────────────────────────
export function WelcomeScreen({ nav }: { nav: Nav }) {
  const [page, setPage] = useState(0)
  const slides = [
    {
      headline: 'THE ARENA AWAITS',
      body: 'In the underground fighting world of Ironvein, only the strongest survive. Every workout is a battle. Every rep, a war cry.',
    },
    {
      headline: 'FORGE YOUR LEGEND',
      body: 'Rise through the ranks. Shatter limits. Your power level isn\'t just a number — it\'s your fighting spirit quantified.',
    },
    {
      headline: 'NO MERCY. NO WEAKNESS.',
      body: 'Champions are made in the grind. Enter the tournament. Claim your rank. Become unstoppable.',
    },
  ]

  return (
    <div className="h-full flex flex-col bg-[#070708] relative overflow-hidden">
      <BloodStrip />
      {/* BG graphic */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-[-60px] top-20 w-[280px] h-[280px] rounded-full border border-[#1A1A1D]" />
        <div className="absolute right-[-30px] top-40 w-[180px] h-[180px] rounded-full border border-[#2A2A2F]" />
        <div className="absolute left-[-80px] bottom-60 w-[220px] h-[220px] rounded-full border border-[#1A1A1D]" />
      </div>

      {/* Diagonal slash accent */}
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-40 h-1 bg-[#C41E3A]" style={{ transform: 'rotate(45deg) translate(20px, -20px)' }} />
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 pt-20">
        <ScreenLabel>ORIGIN STORY · {page + 1}/{slides.length}</ScreenLabel>
        <h1 className="font-display font-black text-5xl leading-none tracking-wide text-white uppercase mt-4 mb-6">
          {slides[page].headline}
        </h1>
        <div className="w-16 h-1 bg-[#C41E3A] mb-6" />
        <p className="font-body text-[#8A8A8A] text-base leading-relaxed">
          {slides[page].body}
        </p>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setPage(i)}
            className="transition-all"
            style={{ width: i === page ? 24 : 8, height: 8, borderRadius: 4, background: i === page ? '#C41E3A' : '#2A2A2F' }}
          />
        ))}
      </div>

      <div className="px-6 pb-8 space-y-3">
        {page < slides.length - 1 ? (
          <Btn onClick={() => setPage(p => p + 1)}>NEXT</Btn>
        ) : (
          <Btn onClick={() => nav('fighter-name')}>BEGIN YOUR FIGHT</Btn>
        )}
        <Divider label="already a fighter?" />
        <Btn variant="ghost" onClick={() => nav('login')}>ENTER THE ARENA</Btn>
      </div>
    </div>
  )
}

// ─── 3. FIGHTER NAME ENTRY ────────────────────────────────────────────────────
export function FighterNameScreen({ nav }: { nav: Nav }) {
  const [name, setName] = useState('')

  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="flex-1 flex flex-col justify-center px-8">
        <ScreenLabel>REGISTRATION · STEP 1 OF 4</ScreenLabel>

        <div className="mb-10">
          <h1 className="font-display font-black text-5xl leading-tight text-white uppercase mb-3">
            WHAT IS YOUR<br />
            <span className="text-[#C41E3A]">FIGHT NAME?</span>
          </h1>
          <p className="font-body text-[#5A5A65] text-sm">
            Choose wisely. This is the name your rivals will fear.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <TextInput
              label="Fighter Name"
              placeholder="e.g. REN KUROGANE"
              value={name}
              onChange={setName}
            />
          </div>

          {name.trim().length > 0 && (
            <div className="bg-[#111113] border border-[#C41E3A]/30 p-4 rounded-sm animate-slide-up">
              <div className="font-display text-xs tracking-widest text-[#5A5A65] uppercase mb-1">YOUR FIGHTER ID</div>
              <div className="font-display font-black text-2xl text-white">{name.toUpperCase()}</div>
              <div className="font-display text-xs text-[#C41E3A] tracking-wide mt-1">RANK: STREET FIGHTER · LVL 1</div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-10">
        <Btn onClick={() => nav('weight-class')} variant={name.trim() ? 'primary' : 'secondary'}>
          CONFIRM IDENTITY
        </Btn>
      </div>
    </div>
  )
}

// ─── 4. WEIGHT CLASS / FITNESS LEVEL ─────────────────────────────────────────
const WEIGHT_CLASSES = [
  { id: 'feather', name: 'FEATHERWEIGHT', sub: 'Under 66kg · Agility-focused', icon: '⚡' },
  { id: 'light', name: 'LIGHTWEIGHT', sub: '66–79kg · Balanced fighter', icon: '🥊' },
  { id: 'middle', name: 'MIDDLEWEIGHT', sub: '79–93kg · Power & speed', icon: '💥' },
  { id: 'heavy', name: 'HEAVYWEIGHT', sub: '93–120kg · Raw strength', icon: '🔥' },
  { id: 'super', name: 'SUPER HEAVYWEIGHT', sub: '120kg+ · Absolute destroyer', icon: '☠️' },
]

const FITNESS_LEVELS = [
  { id: 'rookie', label: 'ROOKIE', sub: 'Just entered the arena' },
  { id: 'fighter', label: 'STREET FIGHTER', sub: '1-2 years training' },
  { id: 'warrior', label: 'SEASONED WARRIOR', sub: '3-5 years training' },
  { id: 'berserker', label: 'BERSERKER', sub: 'Elite-level athlete' },
]

export function WeightClassScreen({ nav }: { nav: Nav }) {
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')

  return (
    <div className="h-full overflow-y-auto bg-[#070708]">
      <BloodStrip />
      <div className="px-5 pt-8 pb-4">
        <ScreenLabel>REGISTRATION · STEP 2 OF 4</ScreenLabel>
        <h1 className="font-display font-black text-4xl text-white uppercase leading-tight mt-2">
          YOUR<br /><span className="text-[#C41E3A]">WEIGHT CLASS</span>
        </h1>
      </div>

      <div className="px-5 space-y-2 pb-4">
        {WEIGHT_CLASSES.map(wc => (
          <button
            key={wc.id}
            onClick={() => setSelectedClass(wc.id)}
            className="w-full flex items-center gap-4 p-4 border transition-all rounded-sm text-left active:scale-95"
            style={{
              background: selectedClass === wc.id ? 'rgba(196,30,58,0.12)' : '#111113',
              borderColor: selectedClass === wc.id ? '#C41E3A' : '#2A2A2F',
            }}
          >
            <span className="text-2xl">{wc.icon}</span>
            <div className="flex-1">
              <div className="font-display font-black text-sm tracking-wide text-white">{wc.name}</div>
              <div className="font-body text-xs text-[#5A5A65] mt-0.5">{wc.sub}</div>
            </div>
            {selectedClass === wc.id && <div className="w-2 h-2 rounded-full bg-[#C41E3A]" />}
          </button>
        ))}
      </div>

      <div className="px-5 pb-4">
        <h2 className="font-display font-black text-xl text-white uppercase mb-3">FITNESS LEVEL</h2>
        <div className="grid grid-cols-2 gap-2">
          {FITNESS_LEVELS.map(fl => (
            <button
              key={fl.id}
              onClick={() => setSelectedLevel(fl.id)}
              className="p-3 border rounded-sm text-left transition-all active:scale-95"
              style={{
                background: selectedLevel === fl.id ? 'rgba(196,30,58,0.12)' : '#111113',
                borderColor: selectedLevel === fl.id ? '#C41E3A' : '#2A2A2F',
              }}
            >
              <div className="font-display font-black text-xs tracking-wide text-white">{fl.label}</div>
              <div className="font-body text-[10px] text-[#5A5A65] mt-0.5">{fl.sub}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-8">
        <Btn onClick={() => nav('signup')} variant={selectedClass && selectedLevel ? 'primary' : 'secondary'}>
          LOCK IN STATS
        </Btn>
      </div>
    </div>
  )
}

// ─── 5. LOGIN ─────────────────────────────────────────────────────────────────
export function LoginScreen({ nav }: { nav: Nav }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError(null)
    setLoading(true)
    try {
      await apiLogin(email, password)
      nav('home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="px-6 pt-12 mb-8">
        <ScreenLabel>SECURE ACCESS</ScreenLabel>
        <h1 className="font-display font-black text-5xl text-white uppercase leading-tight mt-2">
          RETURN<br />TO THE<br />
          <span className="text-[#C41E3A]">ARENA</span>
        </h1>
      </div>

      <div className="flex-1 px-6 space-y-4">
        <TextInput label="Email" placeholder="fighter@ironvein.io" type="email" value={email} onChange={setEmail} />
        <TextInput
          label="Password"
          placeholder="••••••••"
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          right={
            <button onClick={() => setShowPw(p => !p)} className="font-display text-xs text-[#5A5A65] uppercase tracking-wide">
              {showPw ? 'HIDE' : 'SHOW'}
            </button>
          }
        />
        <div className="flex justify-end">
          <button onClick={() => nav('forgot-password')} className="font-display text-xs text-[#C41E3A] tracking-widest uppercase">
            FORGOT PASSWORD?
          </button>
        </div>
        {error && <div className="font-body text-sm text-[#FF2D55]">{error}</div>}
      </div>

      <div className="px-6 pb-8 space-y-3">
        <Btn onClick={handleLogin} disabled={loading}>{loading ? 'ENTERING...' : 'ENTER THE ARENA'}</Btn>
        <Divider label="new fighter?" />
        <Btn variant="ghost" onClick={() => nav('signup')}>CREATE FIGHTER ACCOUNT</Btn>
      </div>
    </div>
  )
}

// ─── 6. SIGN UP ───────────────────────────────────────────────────────────────
export function SignupScreen({ nav }: { nav: Nav }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setError(null)
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await apiRegister(email, password, name || undefined)
      nav('avatar')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-[#070708]">
      <BloodStrip />
      <div className="px-6 pt-10 mb-6">
        <button onClick={() => nav('welcome')} className="font-display text-xs text-[#5A5A65] uppercase tracking-widest mb-4 block">← BACK</button>
        <ScreenLabel>REGISTRATION · STEP 3 OF 4</ScreenLabel>
        <h1 className="font-display font-black text-4xl text-white uppercase leading-tight mt-2">
          CREATE<br /><span className="text-[#C41E3A]">FIGHTER ACCOUNT</span>
        </h1>
      </div>

      <div className="px-6 space-y-4 pb-6">
        <TextInput label="Full Name" placeholder="Your real name" value={name} onChange={setName} />
        <TextInput label="Email" placeholder="fighter@ironvein.io" type="email" value={email} onChange={setEmail} />
        <TextInput
          label="Password"
          placeholder="Min. 8 characters"
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          right={
            <button onClick={() => setShowPw(p => !p)} className="font-display text-xs text-[#5A5A65] uppercase">
              {showPw ? 'HIDE' : 'SHOW'}
            </button>
          }
        />
        <TextInput
          label="Confirm Password"
          placeholder="Repeat password"
          type="password"
          value={confirm}
          onChange={setConfirm}
        />

        {password && confirm && password !== confirm && (
          <div className="text-[#FF2D55] font-display text-xs tracking-wide uppercase">
            ⚠ PASSWORDS DO NOT MATCH
          </div>
        )}
        {error && <div className="font-body text-sm text-[#FF2D55]">{error}</div>}

        <div className="text-[#5A5A65] font-body text-xs leading-relaxed pt-2">
          By registering, you agree to our Terms of Combat and Privacy Policy. Your data is as secure as an Ironvein fighter's grip.
        </div>
      </div>

      <div className="px-6 pb-8">
        <Btn onClick={handleRegister} disabled={loading}>{loading ? 'REGISTERING...' : 'REGISTER FIGHTER'}</Btn>
      </div>
    </div>
  )
}

// ─── 7. FIGHTER AVATAR SELECTION ─────────────────────────────────────────────
const AVATARS = [
  { id: 'a1', name: 'THE ONI', color: '#C41E3A', symbol: '鬼' },
  { id: 'a2', name: 'IRON HAMMER', color: '#3A6B8A', symbol: '鉄' },
  { id: 'a3', name: 'SHADOW WOLF', color: '#2A5C3A', symbol: '狼' },
  { id: 'a4', name: 'GOLD FANG', color: '#D4A017', symbol: '牙' },
  { id: 'a5', name: 'THUNDER GOD', color: '#6A3AAF', symbol: '雷' },
  { id: 'a6', name: 'STEEL TITAN', color: '#4A4A5A', symbol: '鋼' },
  { id: 'a7', name: 'CRIMSON HAWK', color: '#C44E1E', symbol: '鷹' },
  { id: 'a8', name: 'DARK EMPEROR', color: '#1A1A2E', symbol: '帝' },
]

export function AvatarScreen({ nav }: { nav: Nav }) {
  const [selected, setSelected] = useState<string>('a1')

  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="px-6 pt-10 mb-4">
        <ScreenLabel>REGISTRATION · STEP 4 OF 4</ScreenLabel>
        <h1 className="font-display font-black text-4xl text-white uppercase leading-tight mt-2">
          CHOOSE YOUR<br /><span className="text-[#C41E3A]">FIGHTER SPIRIT</span>
        </h1>
      </div>

      {/* Large preview */}
      <div className="flex justify-center mb-6">
        {(() => {
          const av = AVATARS.find(a => a.id === selected)!
          return (
            <div className="relative">
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center"
                style={{ background: `radial-gradient(circle, ${av.color}40, ${av.color}20)`, border: `2px solid ${av.color}` }}
              >
                <span className="font-display font-black text-5xl" style={{ color: av.color }}>{av.symbol}</span>
              </div>
              <div className="text-center mt-2">
                <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase">{av.name}</div>
              </div>
            </div>
          )
        })()}
      </div>

      <div className="flex-1 px-5 grid grid-cols-4 gap-2 content-start">
        {AVATARS.map(av => (
          <button
            key={av.id}
            onClick={() => setSelected(av.id)}
            className="flex flex-col items-center gap-1 p-2 rounded-sm transition-all active:scale-90"
            style={{
              background: selected === av.id ? `${av.color}20` : '#111113',
              border: `1.5px solid ${selected === av.id ? av.color : '#2A2A2F'}`,
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: `${av.color}30` }}
            >
              <span className="font-display font-black text-xl" style={{ color: av.color }}>{av.symbol}</span>
            </div>
            <span className="font-display text-[9px] text-center text-[#5A5A65] uppercase leading-tight">{av.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <div className="px-6 pb-8 pt-4">
        <Btn onClick={() => nav('verifying')}>SEAL YOUR IDENTITY</Btn>
      </div>
    </div>
  )
}

// ─── 8. FORGOT PASSWORD ───────────────────────────────────────────────────────
export function ForgotPasswordScreen({ nav }: { nav: Nav }) {
  const [email, setEmail] = useState('')

  return (
    <div className="h-full flex flex-col bg-[#070708]">
      <BloodStrip />
      <div className="px-6 pt-12 mb-8">
        <button onClick={() => nav('login')} className="font-display text-xs text-[#5A5A65] uppercase tracking-widest mb-6 block">← BACK TO LOGIN</button>
        <ScreenLabel>FIGHTER RECOVERY</ScreenLabel>
        <h1 className="font-display font-black text-4xl text-white uppercase leading-tight mt-2">
          RESET<br />YOUR<br /><span className="text-[#C41E3A]">ACCESS</span>
        </h1>
        <p className="font-body text-[#5A5A65] text-sm mt-4 leading-relaxed">
          Even the strongest fighters need a lifeline. Enter your email and we'll send a recovery strike.
        </p>
      </div>

      <div className="flex-1 px-6">
        <TextInput label="Registered Email" placeholder="fighter@ironvein.io" type="email" value={email} onChange={setEmail} />

        {/* Visual decoration */}
        <div className="mt-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#1A1A1D]" />
          <div className="w-12 h-12 rounded-full bg-[#111113] border border-[#2A2A2F] flex items-center justify-center">
            <span className="text-xl">📧</span>
          </div>
          <div className="flex-1 h-px bg-[#1A1A1D]" />
        </div>
        <p className="font-display text-xs text-[#3A3A42] text-center mt-3 tracking-widest uppercase">Recovery link expires in 30 minutes</p>
      </div>

      <div className="px-6 pb-8">
        <Btn onClick={() => nav('reset-confirm')}>SEND RECOVERY LINK</Btn>
      </div>
    </div>
  )
}

// ─── 9. RESET CONFIRMATION ────────────────────────────────────────────────────
export function ResetConfirmScreen({ nav }: { nav: Nav }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#070708] px-6 text-center">
      <BloodStrip />

      <div className="w-24 h-24 rounded-full border-2 border-[#C41E3A] flex items-center justify-center mb-8 animate-pulse-red">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M8 22L18 32L36 12" stroke="#C41E3A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <ScreenLabel>RECOVERY SENT</ScreenLabel>
      <h1 className="font-display font-black text-4xl text-white uppercase leading-tight mt-3 mb-4">
        CHECK YOUR<br /><span className="text-[#C41E3A]">INBOX</span>
      </h1>

      <p className="font-body text-[#5A5A65] text-sm leading-relaxed mb-10 max-w-xs">
        A reset link has been sent to your email. Click it within 30 minutes to reclaim your fighter account.
      </p>

      <div className="w-full space-y-3">
        <Btn onClick={() => nav('login')}>RETURN TO LOGIN</Btn>
        <Btn variant="ghost" onClick={() => nav('forgot-password')}>RESEND LINK</Btn>
      </div>
    </div>
  )
}

// ─── 10. VERIFYING / LOADING ──────────────────────────────────────────────────
export function VerifyingScreen({ nav }: { nav: Nav }) {
  const [step, setStep] = useState(0)
  const steps = [
    'ANALYZING FIGHTER DATA...',
    'CALIBRATING POWER LEVELS...',
    'ENTERING THE IRONVEIN ARENA...',
    'FIGHTER REGISTERED.',
  ]

  useEffect(() => {
    const intervals = steps.map((_, i) =>
      setTimeout(() => setStep(i), i * 900)
    )
    const navTimer = setTimeout(() => nav('home'), steps.length * 900 + 400)
    return () => { intervals.forEach(clearTimeout); clearTimeout(navTimer) }
  }, [nav])

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#070708] relative overflow-hidden">
      <BloodStrip />

      {/* Rotating ring */}
      <div className="relative mb-10">
        <svg width="140" height="140" viewBox="0 0 140 140" className="animate-spin-slow">
          <circle cx="70" cy="70" r="62" fill="none" stroke="#1A1A1D" strokeWidth="4" />
          <circle cx="70" cy="70" r="62" fill="none" stroke="#C41E3A" strokeWidth="4"
            strokeDasharray="80 310" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <rect x="16" y="24" width="28" height="22" rx="3" fill="#C41E3A" />
            <rect x="20" y="12" width="20" height="14" rx="3" fill="#8B1229" />
            <rect x="12" y="28" width="6" height="12" rx="2" fill="#8B1229" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-3 min-h-[80px]">
        {steps.slice(0, step + 1).map((s, i) => (
          <div
            key={i}
            className="font-display font-bold text-sm tracking-widest uppercase animate-slide-up"
            style={{ color: i === step ? '#C41E3A' : '#3A3A42' }}
          >
            {i < step ? '✓ ' : ''}{s}
          </div>
        ))}
      </div>

      <div className="absolute bottom-16">
        <div className="font-display text-[10px] tracking-[0.3em] text-[#1A1A1D] uppercase">IRONVEIN ARENA FITNESS</div>
      </div>
    </div>
  )
}
