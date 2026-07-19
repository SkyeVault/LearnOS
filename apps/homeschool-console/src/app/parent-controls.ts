import { getLearners, verifyGuardianPin } from './store'

export const subjectTabs = [
  'Early Learning', 'Music', 'Beginner Coding', 'Mathematics', 'Reading', 'Science',
  'History', 'Geography', 'Language Arts', 'Art & Creativity', 'Physical Education',
  'Engineering', 'Living Library', 'Homestead Lab', 'Learning Commons', 'My Learning Record', 'Gardening', 'Assignments', 'Mindful Movement', 'Spirit',
]

export interface AdultProfile {
  id: string
  name: string
  role: 'Parent' | 'Guardian' | 'Teacher'
  createdAt: string
  username?: string
  passwordHash?: string
}

export interface ClassGroup {
  id: string
  name: string
  stage: string
  teacherId: string
  learnerIds: string[]
  createdAt: string
}

interface ParentControls {
  version: 1
  externalLinksEnabled: boolean
  adults: AdultProfile[]
  allowedSubjectsByLearner: Record<string, string[]>
  adultAssignmentsByLearner: Record<string, string[]>
  teacherAssignmentsByLearner: Record<string, string[]>
  classes: ClassGroup[]
}

const key = 'learning-world-os:parent-controls:v1'
const defaults = (): ParentControls => ({ version: 1, externalLinksEnabled: false, adults: [], allowedSubjectsByLearner: {}, adultAssignmentsByLearner: {}, teacherAssignmentsByLearner: {}, classes: [] })

function read(): ParentControls {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? 'null') as ParentControls | null
    return saved?.version === 1 ? { ...defaults(), ...saved } : defaults()
  } catch { return defaults() }
}

function write(data: ParentControls) { localStorage.setItem(key, JSON.stringify(data)) }

export function getParentControls() { return read() }
export function externalLinksEnabled() { return read().externalLinksEnabled }
export function setExternalLinksEnabled(enabled: boolean) { const data = read(); data.externalLinksEnabled = enabled; write(data) }

export function allowedSubjects(learnerId: string) {
  const saved = read().allowedSubjectsByLearner[learnerId]
  return saved ? saved.map(subject => subject === "Homesteader’s Paradise" ? "Gardening" : subject) : subjectTabs
}

export function learnerCanAccess(learnerId: string | undefined, subject: string) {
  return !learnerId || allowedSubjects(learnerId).includes(subject)
}

export function setLearnerSubjectAccess(learnerId: string, subject: string, allowed: boolean) {
  const data = read()
  const current = new Set(data.allowedSubjectsByLearner[learnerId] ?? subjectTabs)
  allowed ? current.add(subject) : current.delete(subject)
  data.allowedSubjectsByLearner[learnerId] = [...current]
  write(data)
}

export async function addAdult(name: string, role: AdultProfile['role'], username = '', password = '') {
  const data = read()
  const bytes = new TextEncoder().encode(password)
  const digest = password ? await crypto.subtle.digest('SHA-256', bytes) : null
  const passwordHash = digest ? Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('') : undefined
  data.adults.push({ id: crypto.randomUUID(), name: name.trim(), role, username: username.trim().toLowerCase(), passwordHash, createdAt: new Date().toISOString() })
  write(data)
}

/** Seeds the four-account prototype workspace without replacing existing accounts. */
export async function seedPrototypeAdults(learnerId: string) {
  const existing = read().adults
  if (!existing.some(adult => adult.username === 'parent')) await addAdult('Parent', 'Parent', 'parent', '12341234')
  if (!existing.some(adult => adult.username === 'teacher')) await addAdult('Teacher', 'Teacher', 'teacher', '12341234')
  const controls = read()
  const parent = controls.adults.find(adult => adult.username === 'parent')
  const teacher = controls.adults.find(adult => adult.username === 'teacher')
  if (parent && teacher) setAdultsForLearner(learnerId, [parent.id, teacher.id])
  if (teacher && !controls.classes.some(group => group.teacherId === teacher.id && group.learnerIds.includes(learnerId))) {
    createClassGroup({ name: 'Starter Class', stage: 'All stages', teacherId: teacher.id, learnerIds: [learnerId] })
  }
}

export function updateAdultProfile(adultId: string, input: { name: string; role: AdultProfile['role'] }) {
  const data = read()
  const adult = data.adults.find(item => item.id === adultId)
  if (!adult || !input.name.trim()) return false
  const wasTeacher = adult.role === 'Teacher'
  adult.name = input.name.trim()
  adult.role = input.role
  if (wasTeacher && input.role !== 'Teacher') data.classes = data.classes.map(group => group.teacherId === adultId ? { ...group, teacherId: '' } : group)
  write(data)
  return true
}

export function removeAdult(adultId: string) {
  const data = read()
  const before = data.adults.length
  data.adults = data.adults.filter(adult => adult.id !== adultId)
  Object.keys(data.adultAssignmentsByLearner).forEach(learnerId => {
    data.adultAssignmentsByLearner[learnerId] = data.adultAssignmentsByLearner[learnerId].filter(id => id !== adultId)
  })
  Object.keys(data.teacherAssignmentsByLearner).forEach(learnerId => {
    data.teacherAssignmentsByLearner[learnerId] = data.teacherAssignmentsByLearner[learnerId].filter(id => id !== adultId)
  })
  data.classes = data.classes.map(group => group.teacherId === adultId ? { ...group, teacherId: '' } : group)
  if (data.adults.length !== before) write(data)
  return data.adults.length !== before
}

export function adultsForLearner(learnerId: string) {
  const ids = new Set(read().adultAssignmentsByLearner[learnerId] ?? [])
  return read().adults.filter(adult => ids.has(adult.id))
}

export function setAdultsForLearner(learnerId: string, adultIds: string[]) {
  const data = read()
  const valid = new Set(data.adults.map(adult => adult.id))
  data.adultAssignmentsByLearner[learnerId] = adultIds.filter(id => valid.has(id))
  write(data)
}

export function teachersForLearner(learnerId: string) {
  const ids = new Set(read().teacherAssignmentsByLearner[learnerId] ?? [])
  return read().adults.filter(adult => adult.role === "Teacher" && ids.has(adult.id))
}

export function setTeachersForLearner(learnerId: string, teacherIds: string[]) {
  const data = read()
  const valid = new Set(data.adults.filter(adult => adult.role === "Teacher").map(adult => adult.id))
  data.teacherAssignmentsByLearner[learnerId] = teacherIds.filter(id => valid.has(id))
  write(data)
}


export function getClasses() { return read().classes }
export function classesForTeacher(teacherId: string) { return read().classes.filter(group => group.teacherId === teacherId) }
export function classesForLearner(learnerId: string) { return read().classes.filter(group => group.learnerIds.includes(learnerId)) }

export function createClassGroup(input: { name: string; stage: string; teacherId: string; learnerIds: string[] }) {
  const data = read()
  const name = input.name.trim()
  const teacher = data.adults.find(adult => adult.id === input.teacherId && adult.role === 'Teacher')
  if (!name || !teacher || !input.learnerIds.length) return false
  const learnerIds = input.learnerIds.filter(id => getLearners().some(learner => learner.id === id))
  if (!learnerIds.length) return false
  data.classes.push({ id: crypto.randomUUID(), name, stage: input.stage.trim() || 'Mixed stage', teacherId: teacher.id, learnerIds: [...new Set(learnerIds)], createdAt: new Date().toISOString() })
  write(data)
  return true
}

export function updateClassGroup(classId: string, input: { name: string; stage: string; teacherId: string; learnerIds: string[] }) {
  const data = read()
  const group = data.classes.find(item => item.id === classId)
  const name = input.name.trim()
  const teacher = data.adults.find(adult => adult.id === input.teacherId && adult.role === 'Teacher')
  const learnerIds = [...new Set(input.learnerIds.filter(id => getLearners().some(learner => learner.id === id)))]
  if (!group || !name || !teacher || !learnerIds.length) return false
  group.name = name
  group.stage = input.stage.trim() || 'Mixed stage'
  group.teacherId = teacher.id
  group.learnerIds = learnerIds
  write(data)
  return true
}

export function removeClassGroup(classId: string) {
  const data = read()
  const before = data.classes.length
  data.classes = data.classes.filter(group => group.id !== classId)
  if (before !== data.classes.length) write(data)
  return before !== data.classes.length
}

export async function setAdultCredentials(adultId: string, username: string, password = "") {
  const data = read()
  const adult = data.adults.find(item => item.id === adultId)
  if (!adult || !username.trim() || (password && password.length < 8) || (!password && !adult.passwordHash)) return false
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  adult.username = username.trim().toLowerCase()
  if (password) adult.passwordHash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
  write(data)
  return true
}

export async function authenticateAdult(username: string, password: string) {
  const handle = username.trim().toLowerCase()
  if (!handle || !password) return null
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  const passwordHash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
  return read().adults.find(adult => adult.username === handle && adult.passwordHash === passwordHash) ?? null
}

export function parentSummary() {
  const controls = read()
  return { adults: controls.adults, learners: getLearners(), externalLinksEnabled: controls.externalLinksEnabled }
}

export { verifyGuardianPin }
