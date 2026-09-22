export type Screen =
  // Onboarding & Auth
  | 'splash'
  | 'welcome'
  | 'fighter-name'
  | 'weight-class'
  | 'login'
  | 'signup'
  | 'avatar'
  | 'forgot-password'
  | 'reset-confirm'
  | 'verifying'
  // Core Training
  | 'home'
  | 'programs'
  | 'workout'
  | 'rest-timer'
  | 'live-stats'
  | 'builder'
  | 'library'
  | 'victory'
  | 'chat'
  // Progression & Social
  | 'profile'
  | 'power-stats'
  | 'rank-ladder'
  | 'achievements'
  | 'history'
  | 'leaderboard'
  | 'rival'
  // Account & Settings
  | 'settings'
  | 'notifications'
  | 'fighter-pass'
  | 'body-stats'
  // System States
  | 'empty'
  | 'error'
  | 'offline'

export type Nav = (screen: Screen) => void
