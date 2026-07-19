import type { ActivityAttempt, AppData, AppSettings, Learner } from './types'

const STORAGE_KEY = 'learning-world-os:data:v1'

const emptyData = (): AppData => ({
  version: 1,
  settings: null,
  learners: [],
  activeLearnerId: null,
  attempts: [],
})

let data = read()

function read(): AppData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return emptyData()
    const parsed = JSON.parse(saved) as AppData
    return parsed.version === 1 ? parsed : emptyData()
  } catch {
    return emptyData()
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function id() {
  return crypto.randomUUID()
}

export async function hashSecret(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}

export function getData() { return data }
export function isConfigured() { return data.settings !== null }
export function getSettings() { return data.settings }
export function getLearners() { return data.learners }
export function getActiveLearner() { return data.learners.find(l => l.id === data.activeLearnerId) ?? null }

export async function createHousehold(householdName: string, pin: string, learnerName: string) {
  const learner: Learner = {
    id: id(), name: learnerName.trim(), avatar: '🌟', ageBand: 'Early learner', role: 'learner', createdAt: new Date().toISOString(),
  }
  const settings: AppSettings = {
    householdName: householdName.trim(), guardianPinHash: await hashSecret(pin), toddlerLockEnabled: false, hiddenSubjects: [],
  }
  data = { version: 1, settings, learners: [learner], activeLearnerId: learner.id, attempts: [] }
  save()
}

export async function verifyGuardianPin(pin: string) {
  return Boolean(data.settings && (await hashSecret(pin)) === data.settings.guardianPinHash)
}

export async function setGuardianCredentials(username: string, password: string) {
  if (!data.settings || !username.trim() || password.length < 8) return false
  data.settings.guardianUsername = username.trim().toLowerCase()
  data.settings.guardianPasswordHash = await hashSecret(password)
  data.settings.ownerPasswordChangeRequired = false
  save()
  return true
}

export async function recoverOwnerWithGuardianPin(pin: string, newPassword: string) {
  if (!data.settings || newPassword.length < 8) return false
  const secretHash = await hashSecret(pin)
  const matchesLegacyPin = await verifyGuardianPin(pin)
  const matchesInitialOwnerPassword = data.settings.guardianPasswordHash === secretHash
  if (!matchesLegacyPin && !matchesInitialOwnerPassword) return false
  data.settings.guardianUsername = 'admin'
  data.settings.guardianPasswordHash = await hashSecret(newPassword)
  data.settings.ownerPasswordChangeRequired = false
  save()
  return true
}

export async function updateOwnerAccount(input: { name: string; username: string; password?: string }) {
  if (!data.settings || !input.name.trim() || !input.username.trim()) return false
  if (input.password && input.password.length < 8) return false
  data.settings.householdName = input.name.trim()
  data.settings.guardianUsername = input.username.trim().toLowerCase()
  if (input.password) data.settings.guardianPasswordHash = await hashSecret(input.password)
  data.settings.ownerPasswordChangeRequired = false
  save()
  return true
}

export async function setLearnerCredentials(learnerId: string, username: string, password = "") {
  const learner = data.learners.find(item => item.id === learnerId)
  if (!learner || !username.trim() || (password && password.length < 8) || (!password && !learner.passwordHash)) return false
  learner.username = username.trim().toLowerCase()
  if (password) learner.passwordHash = await hashSecret(password)
  save()
  return true
}

export type AccountLogin = { role: 'Admin' | 'Parent' | 'Guardian' | 'Teacher' | 'Learner'; learnerId?: string; adultId?: string; ownerBootstrap?: boolean }

export async function authenticateAccount(username: string, password: string): Promise<AccountLogin | null> {
  const handle = username.trim().toLowerCase()
  if (!handle || !password) return null
  const passwordHash = await hashSecret(password)
  if (data.settings?.guardianUsername === handle && data.settings.guardianPasswordHash === passwordHash) return { role: 'Admin' }
  // Compatibility recovery for homes created before the unified owner account.
  // The default owner pair is accepted only when it proves knowledge of this
  // device's existing local guardian credential; it is never a global bypass.
  if (data.settings?.guardianUsername === 'admin' && handle === 'admin' && password === '12341234' && await verifyGuardianPin(password)) {
    data.settings.guardianPasswordHash = passwordHash
    data.settings.ownerPasswordChangeRequired = false
    save()
    return { role: 'Admin' }
  }
  // A one-time owner bootstrap makes existing local homes administrable without a second PIN.
  if (data.settings && !data.settings.guardianUsername && handle === 'admin' && password === '12341234') {
    data.settings.guardianUsername = 'admin'
    data.settings.guardianPasswordHash = passwordHash
    data.settings.ownerPasswordChangeRequired = true
    save()
    return { role: 'Admin', ownerBootstrap: true }
  }
  // Existing local homes are transitioned through the owner account once, then credentials are set in User Management.
  if (!data.settings?.guardianUsername && handle === 'parent' && await verifyGuardianPin(password)) return { role: 'Admin' }
  const learner = data.learners.find(item => item.username === handle && item.passwordHash === passwordHash)
  if (learner) return { role: 'Learner', learnerId: learner.id }
  return null
}

export function addLearner(name: string, avatar: string, ageBand: string) {
  const learner: Learner = { id: id(), name: name.trim(), avatar, ageBand, role: 'learner', createdAt: new Date().toISOString() }
  data.learners.push(learner)
  save()
  return learner
}

export function setActiveLearner(learnerId: string) {
  if (!data.learners.some(learner => learner.id === learnerId)) return false
  data.activeLearnerId = learnerId
  save()
  return true
}

export function updateLearnerProfile(learnerId: string, input: { name: string; ageBand: string; avatar: string }) {
  const learner = data.learners.find(item => item.id === learnerId)
  if (!learner || !input.name.trim() || !input.ageBand.trim()) return false
  learner.name = input.name.trim()
  learner.ageBand = input.ageBand.trim()
  learner.avatar = input.avatar
  save()
  return true
}

export function recordAttempt(input: Omit<ActivityAttempt, 'id' | 'learnerId' | 'completedAt'>) {
  const learner = getActiveLearner()
  if (!learner) return
  data.attempts.push({ ...input, id: id(), learnerId: learner.id, completedAt: new Date().toISOString() })
  save()
}

export function attemptsFor(learnerId: string) { return data.attempts.filter(attempt => attempt.learnerId === learnerId) }

export function setToddlerLockEnabled(enabled: boolean) {
  if (!data.settings) return
  data.settings.toddlerLockEnabled = enabled
  save()
}

export function toggleSubject(subject: string) {
  if (!data.settings) return
  const hidden = new Set(data.settings.hiddenSubjects)
  hidden.has(subject) ? hidden.delete(subject) : hidden.add(subject)
  data.settings.hiddenSubjects = [...hidden]
  save()
}

export function isSubjectVisible(subject: string) {
  return !data.settings?.hiddenSubjects.includes(subject)
}

export function removeLearner(learnerId: string) {
  if (!data.learners.some(learner => learner.id === learnerId)) return false
  data.learners = data.learners.filter(learner => learner.id !== learnerId)
  data.attempts = data.attempts.filter(attempt => attempt.learnerId !== learnerId)
  if (data.activeLearnerId === learnerId) data.activeLearnerId = data.learners[0]?.id ?? null
  save()
  return true
}
