import React, { ReactNode } from 'react'
import { Screen, Nav } from '../types'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070708] flex items-center justify-center py-4">
      <div
        className="relative bg-[#070708] overflow-hidden shadow-2xl"
        style={{
          width: 390,
          height: 844,
          borderRadius: 40,
          border: '2px solid #2A2A2F',
          boxShadow: '0 0 0 4px #111113, 0 0 60px rgba(196,30,58,0.15)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function ScreenScroll({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`h-full overflow-y-auto ${className}`} style={{ WebkitOverflowScrolling: 'touch' }}>
      {children}
    </div>
  )
}

interface TopBarProps {
  title?: string
  onBack?: () => void
  right?: ReactNode
  transparent?: boolean
}

export function TopBar({ title, onBack, right, transparent }: TopBarProps) {
  return (
    <div
      className={`flex items-center justify-between px-5 pt-12 pb-4 ${transparent ? '' : 'bg-[#070708]'}`}
      style={transparent ? { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 } : {}}
    >
      <div className="w-10">
        {onBack && (
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1D] active:bg-[#2A2A2F] transition-colors">
            <ChevronLeft />
          </button>
        )}
      </div>
      {title && (
        <span className="font-display font-bold text-lg tracking-widest uppercase text-white">{title}</span>
      )}
      <div className="w-10 flex justify-end">{right}</div>
    </div>
  )
}

const APP_TABS: { id: Screen; label: string; Icon: () => React.ReactElement }[] = [
  { id: 'home', label: 'HOME', Icon: HomeIcon },
  { id: 'programs', label: 'TRAIN', Icon: FistIcon },
  { id: 'leaderboard', label: 'RANKS', Icon: TrophyIcon },
  { id: 'profile', label: 'FIGHTER', Icon: ShieldIcon },
  { id: 'settings', label: 'GEAR', Icon: GearIcon },
]

export function BottomNav({ active, nav }: { active: Screen; nav: Nav }) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex border-t border-[#2A2A2F]"
      style={{ background: 'rgba(17,17,19,0.97)', backdropFilter: 'blur(10px)', paddingBottom: 8 }}
    >
      {APP_TABS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => nav(id)}
            className="flex-1 py-3 flex flex-col items-center gap-1 transition-all active:scale-90"
          >
            <span style={{ color: isActive ? '#C41E3A' : '#5A5A65' }}>
              <Icon />
            </span>
            <span
              className="font-display text-[10px] font-bold tracking-widest"
              style={{ color: isActive ? '#C41E3A' : '#5A5A65' }}
            >
              {label}
            </span>
            {isActive && (
              <div className="w-1 h-1 rounded-full bg-[#C41E3A] absolute top-1" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export function Btn({
  children,
  onClick,
  variant = 'primary',
  fullWidth = true,
  size = 'lg',
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger'
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const variants = {
    primary: 'bg-[#C41E3A] text-white hover:bg-[#A01830] active:bg-[#8B1229]',
    secondary: 'bg-[#2A2A2F] text-white hover:bg-[#3A3A42] border border-[#3A3A42]',
    ghost: 'bg-transparent text-[#C41E3A] border border-[#C41E3A] hover:bg-[#C41E3A]/10',
    gold: 'bg-[#D4A017] text-[#070708] hover:bg-[#F0C040] font-black',
    danger: 'bg-transparent text-[#FF2D55] border border-[#FF2D55] hover:bg-[#FF2D55]/10',
  }
  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  }
  return (
    <button
      onClick={onClick}
      className={`font-display font-bold tracking-widest uppercase transition-all active:scale-95 rounded-sm ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

export function TextInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  right,
}: {
  label?: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (v: string) => void
  right?: ReactNode
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-display font-bold text-xs tracking-widest text-[#5A5A65] uppercase mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className="w-full bg-[#1A1A1D] border border-[#2A2A2F] text-white placeholder-[#3A3A42] px-4 py-3.5 font-body text-base focus:outline-none focus:border-[#C41E3A] transition-colors rounded-sm"
        />
        {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
    </div>
  )
}

export function PowerBar({ value, max = 100, color = '#C41E3A', label, sublabel }: {
  value: number; max?: number; color?: string; label?: string; sublabel?: string
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="w-full">
      {(label || sublabel) && (
        <div className="flex justify-between items-baseline mb-1.5">
          {label && <span className="font-display font-bold text-sm tracking-wide text-white uppercase">{label}</span>}
          {sublabel && <span className="font-display font-bold text-sm" style={{ color }}>{sublabel}</span>}
        </div>
      )}
      <div className="h-2 rounded-full bg-[#1A1A1D] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}CC)` }}
        />
      </div>
    </div>
  )
}

export function RankBadge({ rank, size = 'md' }: { rank: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1', lg: 'text-base px-4 py-1.5' }
  return (
    <span
      className={`font-display font-black tracking-widest uppercase rounded-sm ${sizes[size]}`}
      style={{ background: 'linear-gradient(135deg, #D4A017, #F0C040)', color: '#070708' }}
    >
      {rank}
    </span>
  )
}

export function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-[#2A2A2F]" />
      {label && <span className="font-display text-xs tracking-widest text-[#5A5A65] uppercase">{label}</span>}
      <div className="flex-1 h-px bg-[#2A2A2F]" />
    </div>
  )
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      className={`bg-[#111113] border border-[#2A2A2F] rounded-sm p-4 ${onClick ? 'cursor-pointer active:bg-[#1A1A1D] transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function BloodStrip() {
  return (
    <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #8B1229, #C41E3A, #FF2D55)' }} />
  )
}

export function ScreenLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-center mb-2">
      <span className="font-display font-black text-[10px] tracking-[0.3em] text-[#C41E3A] uppercase">{children}</span>
    </div>
  )
}

// --- Icons ---
function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M3 9L11 3L19 9V19H14V14H8V19H3V9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function FistIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="5" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="7" y="5" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 12H3C2.4 12 2 12.5 2 13V16C2 16.6 2.4 17 3 17H5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M7 3H15V12C15 14.2 13.2 16 11 16C8.8 16 7 14.2 7 12V3Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 7H4C4 9.8 5.6 11.4 7 12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 7H18C18 9.8 16.4 11.4 15 12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 19H14M11 16V19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 3L19 7V12C19 15.9 15.4 19.3 11 20C6.6 19.3 3 15.9 3 12V7L11 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 2V4M11 18V20M2 11H4M18 11H20M4.9 4.9L6.3 6.3M15.7 15.7L17.1 17.1M4.9 17.1L6.3 15.7M15.7 6.3L17.1 4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function StarIcon({ filled, size = 16 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={filled ? '#D4A017' : 'none'}>
      <path d="M8 1L9.8 5.8L15 6.2L11.2 9.5L12.5 14.5L8 11.8L3.5 14.5L4.8 9.5L1 6.2L6.2 5.8L8 1Z"
        stroke={filled ? '#D4A017' : '#3A3A42'} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function ChainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 11L11 7" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="4.5" cy="13.5" rx="2.5" ry="1.5" transform="rotate(-45 4.5 13.5)" stroke="#C41E3A" strokeWidth="1.5" />
      <ellipse cx="13.5" cy="4.5" rx="2.5" ry="1.5" transform="rotate(-45 13.5 4.5)" stroke="#C41E3A" strokeWidth="1.5" />
    </svg>
  )
}

export function LightningIcon({ color = '#D4A017', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M10 2L4 10H9L8 16L14 8H9L10 2Z" fill={color} />
    </svg>
  )
}

export function FlameIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M9 2C9 2 12 6 12 9.5C12 11.4 10.7 13 9 13C7.3 13 6 11.4 6 9.5C6 8.5 6.4 7.5 7 7C7 7 7 9 8.5 9C8.5 7 9 2 9 2Z" fill="#E8820C" />
      <path d="M9 13C9 13 11 14 11 15.5C11 16.3 10.1 17 9 17C7.9 17 7 16.3 7 15.5C7 14 9 13 9 13Z" fill="#C41E3A" />
    </svg>
  )
}
