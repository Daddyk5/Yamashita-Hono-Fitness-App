import { lazy, Suspense, useState } from 'react'
import { Screen } from './types'
import { AppShell } from './components/Layout'

// Every screen group is its own dynamic import, so the initial bundle only
// pays for Onboarding (the first thing rendered) — Training, Progression,
// Account, System, and the AI Chat screen only load once actually navigated
// to. Multiple screens from the same file share one chunk (Vite/Rollup
// dedupes by module path), so this splits by the five existing groups plus
// Chat rather than by every individual screen.

// Onboarding & Auth
const SplashScreen = lazy(() => import('./screens/OnboardingScreens').then(m => ({ default: m.SplashScreen })))
const WelcomeScreen = lazy(() => import('./screens/OnboardingScreens').then(m => ({ default: m.WelcomeScreen })))
const FighterNameScreen = lazy(() => import('./screens/OnboardingScreens').then(m => ({ default: m.FighterNameScreen })))
const WeightClassScreen = lazy(() => import('./screens/OnboardingScreens').then(m => ({ default: m.WeightClassScreen })))
const LoginScreen = lazy(() => import('./screens/OnboardingScreens').then(m => ({ default: m.LoginScreen })))
const SignupScreen = lazy(() => import('./screens/OnboardingScreens').then(m => ({ default: m.SignupScreen })))
const AvatarScreen = lazy(() => import('./screens/OnboardingScreens').then(m => ({ default: m.AvatarScreen })))
const ForgotPasswordScreen = lazy(() => import('./screens/OnboardingScreens').then(m => ({ default: m.ForgotPasswordScreen })))
const ResetConfirmScreen = lazy(() => import('./screens/OnboardingScreens').then(m => ({ default: m.ResetConfirmScreen })))
const VerifyingScreen = lazy(() => import('./screens/OnboardingScreens').then(m => ({ default: m.VerifyingScreen })))

// Core Training
const HomeScreen = lazy(() => import('./screens/TrainingScreens').then(m => ({ default: m.HomeScreen })))
const ProgramSelectScreen = lazy(() => import('./screens/TrainingScreens').then(m => ({ default: m.ProgramSelectScreen })))
const WorkoutTrackerScreen = lazy(() => import('./screens/TrainingScreens').then(m => ({ default: m.WorkoutTrackerScreen })))
const RestTimerScreen = lazy(() => import('./screens/TrainingScreens').then(m => ({ default: m.RestTimerScreen })))
const LiveStatsScreen = lazy(() => import('./screens/TrainingScreens').then(m => ({ default: m.LiveStatsScreen })))
const WorkoutBuilderScreen = lazy(() => import('./screens/TrainingScreens').then(m => ({ default: m.WorkoutBuilderScreen })))
const ExerciseLibraryScreen = lazy(() => import('./screens/TrainingScreens').then(m => ({ default: m.ExerciseLibraryScreen })))
const VictoryScreen = lazy(() => import('./screens/TrainingScreens').then(m => ({ default: m.VictoryScreen })))

// Progression & Social
const ProfileScreen = lazy(() => import('./screens/ProgressionScreens').then(m => ({ default: m.ProfileScreen })))
const PowerStatsScreen = lazy(() => import('./screens/ProgressionScreens').then(m => ({ default: m.PowerStatsScreen })))
const RankLadderScreen = lazy(() => import('./screens/ProgressionScreens').then(m => ({ default: m.RankLadderScreen })))
const AchievementsScreen = lazy(() => import('./screens/ProgressionScreens').then(m => ({ default: m.AchievementsScreen })))
const WorkoutHistoryScreen = lazy(() => import('./screens/ProgressionScreens').then(m => ({ default: m.WorkoutHistoryScreen })))
const LeaderboardScreen = lazy(() => import('./screens/ProgressionScreens').then(m => ({ default: m.LeaderboardScreen })))
const RivalScreen = lazy(() => import('./screens/ProgressionScreens').then(m => ({ default: m.RivalScreen })))

// Account & Settings
const SettingsScreen = lazy(() => import('./screens/AccountScreens').then(m => ({ default: m.SettingsScreen })))
const NotificationsScreen = lazy(() => import('./screens/AccountScreens').then(m => ({ default: m.NotificationsScreen })))
const FighterPassScreen = lazy(() => import('./screens/AccountScreens').then(m => ({ default: m.FighterPassScreen })))
const BodyStatsScreen = lazy(() => import('./screens/AccountScreens').then(m => ({ default: m.BodyStatsScreen })))

// System States
const EmptyStateScreen = lazy(() => import('./screens/SystemScreens').then(m => ({ default: m.EmptyStateScreen })))
const ErrorStateScreen = lazy(() => import('./screens/SystemScreens').then(m => ({ default: m.ErrorStateScreen })))
const OfflineModeScreen = lazy(() => import('./screens/SystemScreens').then(m => ({ default: m.OfflineModeScreen })))

// AI Coach
const ChatScreen = lazy(() => import('./screens/ChatScreen').then(m => ({ default: m.ChatScreen })))

/** Minimal, on-theme fallback while a screen chunk loads — shown only on
 * the first visit to a given group, since the chunk is cached after that. */
function ScreenLoading() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 bg-[#070708]">
      <div className="w-10 h-10 border-2 border-[#C41E3A] border-t-transparent rounded-full animate-spin" />
      <span className="font-display text-xs tracking-widest text-[#5A5A65] uppercase">LOADING</span>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const nav = (s: Screen) => setScreen(s)

  const renderScreen = () => {
    switch (screen) {
      // Onboarding & Auth
      case 'splash':           return <SplashScreen nav={nav} />
      case 'welcome':          return <WelcomeScreen nav={nav} />
      case 'fighter-name':     return <FighterNameScreen nav={nav} />
      case 'weight-class':     return <WeightClassScreen nav={nav} />
      case 'login':            return <LoginScreen nav={nav} />
      case 'signup':           return <SignupScreen nav={nav} />
      case 'avatar':           return <AvatarScreen nav={nav} />
      case 'forgot-password':  return <ForgotPasswordScreen nav={nav} />
      case 'reset-confirm':    return <ResetConfirmScreen nav={nav} />
      case 'verifying':        return <VerifyingScreen nav={nav} />

      // Core Training
      case 'home':             return <HomeScreen nav={nav} />
      case 'programs':         return <ProgramSelectScreen nav={nav} />
      case 'workout':          return <WorkoutTrackerScreen nav={nav} />
      case 'rest-timer':       return <RestTimerScreen nav={nav} />
      case 'live-stats':       return <LiveStatsScreen nav={nav} />
      case 'builder':          return <WorkoutBuilderScreen nav={nav} />
      case 'library':          return <ExerciseLibraryScreen nav={nav} />
      case 'victory':          return <VictoryScreen nav={nav} />

      // Progression & Social
      case 'profile':          return <ProfileScreen nav={nav} />
      case 'power-stats':      return <PowerStatsScreen nav={nav} />
      case 'rank-ladder':      return <RankLadderScreen nav={nav} />
      case 'achievements':     return <AchievementsScreen nav={nav} />
      case 'history':          return <WorkoutHistoryScreen nav={nav} />
      case 'leaderboard':      return <LeaderboardScreen nav={nav} />
      case 'rival':            return <RivalScreen nav={nav} />

      // Account & Settings
      case 'settings':         return <SettingsScreen nav={nav} />
      case 'notifications':    return <NotificationsScreen nav={nav} />
      case 'fighter-pass':     return <FighterPassScreen nav={nav} />
      case 'body-stats':       return <BodyStatsScreen nav={nav} />

      // System States
      case 'empty':            return <EmptyStateScreen nav={nav} />
      case 'error':            return <ErrorStateScreen nav={nav} />
      case 'offline':          return <OfflineModeScreen nav={nav} />

      // AI Coach
      case 'chat':              return <ChatScreen nav={nav} />

      default: return <HomeScreen nav={nav} />
    }
  }

  return (
    <AppShell>
      <Suspense fallback={<ScreenLoading />}>
        {renderScreen()}
      </Suspense>
    </AppShell>
  )
}
