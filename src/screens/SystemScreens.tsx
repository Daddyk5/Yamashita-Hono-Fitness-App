import { Nav } from '../types'
import { Btn, BloodStrip, ScreenLabel } from '../components/Layout'

// ─── 30. EMPTY STATE ──────────────────────────────────────────────────────────
export function EmptyStateScreen({ nav }: { nav: Nav }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#070708] px-8 text-center">
      <BloodStrip />

      {/* Empty arena visual */}
      <div className="relative mb-8">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Octagon outline */}
          <polygon
            points="56,8 104,8 148,52 148,108 104,152 56,152 12,108 12,52"
            fill="none" stroke="#1A1A1D" strokeWidth="2" strokeDasharray="8,4"
          />
          {/* Inner empty area */}
          <polygon
            points="60,16 100,16 140,56 140,104 100,144 60,144 20,104 20,56"
            fill="#0D0D0F"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display font-black text-4xl text-[#2A2A2F]">?</div>
          <div className="font-display text-[10px] text-[#1A1A1D] tracking-widest uppercase mt-1">EMPTY</div>
        </div>
      </div>

      <ScreenLabel>ARENA EMPTY</ScreenLabel>
      <h1 className="font-display font-black text-4xl text-white uppercase leading-tight mt-2 mb-3">
        NO BATTLES<br />
        <span className="text-[#2A2A2F]">RECORDED</span>
      </h1>

      <p className="font-body text-[#5A5A65] text-sm leading-relaxed mb-10 max-w-xs">
        The arena stands silent. No workouts logged yet. A fighter is defined by their action, not their potential.
      </p>

      <div className="w-full space-y-3">
        <Btn onClick={() => nav('programs')}>START YOUR FIRST BATTLE</Btn>
        <Btn variant="ghost" onClick={() => nav('home')}>RETURN TO BASE</Btn>
      </div>

      <div className="mt-8 font-display text-[10px] tracking-[0.3em] text-[#1A1A1D] uppercase">
        THE ARENA AWAITS · ENTER WHEN READY
      </div>
    </div>
  )
}

// ─── 31. ERROR STATE ──────────────────────────────────────────────────────────
export function ErrorStateScreen({ nav }: { nav: Nav }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#070708] px-8 text-center">
      <BloodStrip />

      {/* Error visual */}
      <div className="relative mb-8">
        <div className="w-32 h-32 relative">
          {/* Cracked circle */}
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="56" fill="none" stroke="#C41E3A" strokeWidth="2" />
            <circle cx="64" cy="64" r="44" fill="#0D0D0F" stroke="#8B122940" strokeWidth="1" />
            {/* Crack lines */}
            <path d="M64 20 L58 52 L72 58 L60 108" stroke="#C41E3A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M30 40 L52 56 L44 68" stroke="#8B1229" strokeWidth="1" strokeLinecap="round" fill="none" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-black text-4xl text-[#C41E3A]">!</span>
          </div>
        </div>
      </div>

      <ScreenLabel>SYSTEM FAILURE</ScreenLabel>
      <h1 className="font-display font-black text-4xl text-white uppercase leading-tight mt-2 mb-3">
        ARENA<br />
        <span className="text-[#C41E3A]">BREACHED</span>
      </h1>

      <p className="font-body text-[#5A5A65] text-sm leading-relaxed mb-3 max-w-xs">
        Something shattered in the system. The arena walls have cracked. Our engineers are fighting to restore order.
      </p>

      <div className="bg-[#C41E3A]/10 border border-[#C41E3A]/30 px-4 py-3 rounded-sm mb-8 w-full">
        <div className="font-display font-black text-xs text-[#C41E3A] uppercase tracking-wide">ERROR CODE</div>
        <div className="font-body text-xs text-[#5A5A65] mt-0.5 font-mono">ERR_ARENA_CONNECTION_LOST (0x4B47)</div>
      </div>

      <div className="w-full space-y-3">
        <Btn onClick={() => nav('home')}>RETRY CONNECTION</Btn>
        <Btn variant="ghost" onClick={() => nav('settings')}>REPORT TO COMMAND</Btn>
      </div>

      <div className="mt-6 font-display text-[10px] tracking-[0.25em] text-[#2A2A2F] uppercase">
        KENGAN ASHURA FITNESS · STATUS: INTERRUPTED
      </div>
    </div>
  )
}

// ─── 32. OFFLINE MODE ─────────────────────────────────────────────────────────
export function OfflineModeScreen({ nav }: { nav: Nav }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#070708] px-8 text-center">
      <BloodStrip />

      {/* Offline visual */}
      <div className="relative mb-8">
        <svg width="140" height="120" viewBox="0 0 140 120">
          {/* Signal waves crossed out */}
          <path d="M20 80 Q70 20 120 80" stroke="#2A2A2F" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M32 80 Q70 36 108 80" stroke="#2A2A2F" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M46 80 Q70 54 94 80" stroke="#2A2A2F" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="70" cy="88" r="5" fill="#2A2A2F" />
          {/* Red X */}
          <line x1="50" y1="30" x2="90" y2="70" stroke="#C41E3A" strokeWidth="3" strokeLinecap="round" />
          <line x1="90" y1="30" x2="50" y2="70" stroke="#C41E3A" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <ScreenLabel>NO CONNECTION</ScreenLabel>
      <h1 className="font-display font-black text-4xl text-white uppercase leading-tight mt-2 mb-3">
        ARENA<br />
        <span className="text-[#5A5A65]">OFFLINE</span>
      </h1>

      <p className="font-body text-[#5A5A65] text-sm leading-relaxed mb-6 max-w-xs">
        You've been cut off from the Kengan network. But a true fighter trains with or without connection.
      </p>

      {/* Offline available features */}
      <div className="w-full bg-[#111113] border border-[#2A2A2F] rounded-sm p-4 mb-6 text-left">
        <div className="font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase mb-3">AVAILABLE OFFLINE</div>
        {[
          { label: 'Saved workout programs', available: true },
          { label: 'Exercise library', available: true },
          { label: 'Rest timer & tracker', available: true },
          { label: 'Leaderboard & rival data', available: false },
          { label: 'Cloud sync & achievements', available: false },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5">
            <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${f.available ? 'bg-[#C41E3A20]' : 'bg-[#1A1A1D]'}`}>
              <span className="text-[8px]" style={{ color: f.available ? '#C41E3A' : '#3A3A42' }}>
                {f.available ? '✓' : '✕'}
              </span>
            </div>
            <span className={`font-body text-xs ${f.available ? 'text-white' : 'text-[#3A3A42]'}`}>{f.label}</span>
          </div>
        ))}
      </div>

      <div className="w-full space-y-3">
        <Btn onClick={() => nav('programs')}>TRAIN OFFLINE</Btn>
        <Btn variant="ghost" onClick={() => nav('home')}>RETRY CONNECTION</Btn>
      </div>
    </div>
  )
}
