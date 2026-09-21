import { useState } from 'react'
import { Screen } from './types'
import { AppShell } from './components/Layout'

// Onboarding & Auth
import {
  SplashScreen,
  WelcomeScreen,
  FighterNameScreen,
  WeightClassScreen,
  LoginScreen,
  SignupScreen,
  AvatarScreen,
  ForgotPasswordScreen,
  ResetConfirmScreen,
  VerifyingScreen,
} from './screens/OnboardingScreens'

// Core Training
import {
  HomeScreen,
  ProgramSelectScreen,
  WorkoutTrackerScreen,
  RestTimerScreen,
  LiveStatsScreen,
  WorkoutBuilderScreen,
  ExerciseLibraryScreen,
  VictoryScreen,
} from './screens/TrainingScreens'

// Progression & Social
import {
  ProfileScreen,
  PowerStatsScreen,
  RankLadderScreen,
  AchievementsScreen,
  WorkoutHistoryScreen,
  LeaderboardScreen,
  RivalScreen,
} from './screens/ProgressionScreens'

// Account & Settings
import {
  SettingsScreen,
  NotificationsScreen,
  FighterPassScreen,
  BodyStatsScreen,
} from './screens/AccountScreens'

// System States
import {
  EmptyStateScreen,
  ErrorStateScreen,
  OfflineModeScreen,
} from './screens/SystemScreens'

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

      default: return <HomeScreen nav={nav} />
    }
  }

  return (
    <AppShell>
      {renderScreen()}
    </AppShell>
  )
}
/*this is comment*/