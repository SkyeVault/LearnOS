export type UserRole = 'guardian' | 'teacher' | 'learner'

export interface Learner {
  id: string
  name: string
  avatar: string
  ageBand: string
  role: 'learner'
  createdAt: string
  username?: string
  passwordHash?: string
}

export interface ActivityAttempt {
  id: string
  learnerId: string
  activityId: string
  subject: string
  score: number
  total: number
  durationSeconds: number
  completedAt: string
}

export interface AppSettings {
  householdName: string
  guardianPinHash: string
  toddlerLockEnabled: boolean
  hiddenSubjects: string[]
  guardianUsername?: string
  guardianPasswordHash?: string
  ownerPasswordChangeRequired?: boolean
}

export interface AppData {
  version: 1
  settings: AppSettings | null
  learners: Learner[]
  activeLearnerId: string | null
  attempts: ActivityAttempt[]
}
