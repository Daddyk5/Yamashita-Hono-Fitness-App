// Live exercise database — free-exercise-db (Unlicense), served over jsDelivr.
//
// Every record ships two frames: 0.jpg is the start of the movement, 1.jpg is
// the finish. FormDemo alternates them into a looping form animation, so the
// fighter sees how a lift is actually performed instead of just reading it.

export const EXERCISE_DB_URL =
  'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/dist/exercises.json'

export const EXERCISE_IMG_BASE =
  'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/'

export type DbExercise = {
  id: string
  name: string
  force: string | null
  level: 'beginner' | 'intermediate' | 'expert'
  mechanic: string | null
  equipment: string | null
  primaryMuscles: string[]
  secondaryMuscles: string[]
  instructions: string[]
  category: string
  images: string[]
}

/** Absolute CDN URLs for an exercise's start/finish frames. */
export function frameUrls(ex: DbExercise): string[] {
  return ex.images.map(path => EXERCISE_IMG_BASE + path)
}

// ─── Loader ───────────────────────────────────────────────────────────────────
// One in-flight request per session, shared by every screen. A rejection clears
// the cache so a retry actually re-fetches instead of replaying the failure.

let dbCache: Promise<DbExercise[]> | null = null

export function loadExerciseDb(): Promise<DbExercise[]> {
  if (!dbCache) {
    const pending = (async () => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 20000)
      try {
        const res = await fetch(EXERCISE_DB_URL, { signal: controller.signal })
        if (!res.ok) throw new Error(`Database responded ${res.status}`)
        const data = (await res.json()) as DbExercise[]
        // Three records ship no imagery; a round with no demo is worse than no round.
        return data.filter(ex => Array.isArray(ex.images) && ex.images.length >= 2)
      } finally {
        clearTimeout(timeout)
      }
    })()

    pending.catch(() => {
      if (dbCache === pending) dbCache = null
    })
    dbCache = pending
  }
  return dbCache
}

// ─── Signature moves ──────────────────────────────────────────────────────────
// The app's themed names, each bound to a verified record in the live database
// so the demo always matches the movement being named.

export type SignatureMove = {
  alias: string
  dbId: string
  cat: string
}

export const SIGNATURE_MOVES: SignatureMove[] = [
  { alias: "DESTROYER'S PRESS", dbId: 'Barbell_Bench_Press_-_Medium_Grip', cat: 'CHEST' },
  { alias: 'IRON CHAIN PULL', dbId: 'Pullups', cat: 'BACK' },
  { alias: 'STONE CRUSHER DEADLIFT', dbId: 'Barbell_Deadlift', cat: 'LEGS' },
  { alias: 'DEATH BLOW BOX JUMP', dbId: 'Box_Jump_Multiple_Response', cat: 'CARDIO' },
  { alias: "FIGHTER'S SQUAT", dbId: 'Barbell_Full_Squat', cat: 'LEGS' },
  { alias: 'BERSERKER ROW', dbId: 'Bent_Over_Barbell_Row', cat: 'BACK' },
  { alias: 'SHADOW WARRIOR PRESS', dbId: 'Standing_Military_Press', cat: 'SHOULDERS' },
  { alias: 'GLADIATOR LUNGE', dbId: 'Dumbbell_Lunges', cat: 'LEGS' },
  { alias: "FIGHTER'S LUNGE", dbId: 'Bodyweight_Walking_Lunge', cat: 'LEGS' },
]

const ALIAS_BY_ID = new Map(SIGNATURE_MOVES.map(m => [m.dbId, m.alias]))

/** The Ironvein ring name for a move, when it has one. */
export function aliasFor(dbId: string): string | undefined {
  return ALIAS_BY_ID.get(dbId)
}

// ─── Filtering ────────────────────────────────────────────────────────────────

export const LIBRARY_FILTERS = [
  'ALL',
  'CHEST',
  'BACK',
  'LEGS',
  'SHOULDERS',
  'ARMS',
  'CORE',
  'CARDIO',
] as const

const GROUP_MUSCLES: Record<string, string[]> = {
  CHEST: ['chest'],
  BACK: ['lats', 'middle back', 'lower back', 'traps'],
  LEGS: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'adductors', 'abductors'],
  SHOULDERS: ['shoulders'],
  ARMS: ['biceps', 'triceps', 'forearms'],
  CORE: ['abdominals'],
}

export function matchesGroup(ex: DbExercise, group: string): boolean {
  if (group === 'ALL') return true
  if (group === 'CARDIO') return ex.category === 'cardio' || ex.category === 'plyometrics'
  const muscles = GROUP_MUSCLES[group]
  if (!muscles) return true
  return ex.primaryMuscles.some(m => muscles.includes(m))
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export const LEVEL_META: Record<string, { label: string; color: string }> = {
  beginner: { label: 'ROOKIE', color: '#3A6B8A' },
  intermediate: { label: 'WARRIOR', color: '#D4A017' },
  expert: { label: 'BERSERKER', color: '#C41E3A' },
}

export function levelMeta(level: string): { label: string; color: string } {
  return LEVEL_META[level] ?? { label: level.toUpperCase(), color: '#5A5A65' }
}
