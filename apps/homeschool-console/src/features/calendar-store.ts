import { getSignedInUser } from '../app/session'
import { adultsForLearner, classesForTeacher, getClasses } from '../app/parent-controls'

export type CalendarScope = 'system' | 'personal' | 'class'
export type CalendarEntry = { id: string; title: string; detail: string; date: string; scope: CalendarScope; ownerKey: string; classId?: string; createdAt: string }

const key = 'learning-world-os:calendar:v1'
const lessonKey = 'learning-world-os:teacher-lesson-plans:v2'

function read(): CalendarEntry[] { try { const value = JSON.parse(localStorage.getItem(key) ?? '[]'); return Array.isArray(value) ? value as CalendarEntry[] : [] } catch { return [] } }
function write(entries: CalendarEntry[]) { localStorage.setItem(key, JSON.stringify(entries)) }

function lessonEntries(): CalendarEntry[] {
  try {
    const plans = JSON.parse(localStorage.getItem(lessonKey) ?? '[]') as Array<{ id: string; classId: string; date: string; title: string; subject: string; objective: string; createdAt: string }>
    return plans.filter(plan => plan.date).map(plan => ({ id: plan.id, title: plan.title, detail: `${plan.subject || 'Lesson'} · ${plan.objective}`, date: `${plan.date}T09:00`, scope: 'class' as const, ownerKey: 'lesson-plan', classId: plan.classId, createdAt: plan.createdAt }))
  } catch { return [] }
}

export function allCalendarEntries() { return [...read(), ...lessonEntries()] }

export function canViewCalendarEntry(entry: CalendarEntry) {
  const user = getSignedInUser()
  if (!user) return false
  if (user.role === 'Admin' || entry.scope === 'system') return true
  if (entry.scope === 'personal') return entry.ownerKey === user.accountKey
  if (!entry.classId) return false
  const group = getClasses().find(item => item.id === entry.classId)
  if (!group) return false
  if (user.role === 'Teacher') return classesForTeacher(user.accountKey.replace('adult:', '')).some(item => item.id === entry.classId)
  if (user.role === 'Learner') return group.learnerIds.includes(user.accountKey.replace('learner:', ''))
  return group.learnerIds.some(learnerId => adultsForLearner(learnerId).some(adult => `adult:${adult.id}` === user.accountKey))
}

export function calendarForCurrentUser() { return allCalendarEntries().filter(canViewCalendarEntry).sort((a, b) => a.date.localeCompare(b.date)) }
export function personalCalendarForCurrentUser() { const user = getSignedInUser(); return user ? read().filter(entry => entry.scope === 'personal' && entry.ownerKey === user.accountKey).sort((a, b) => a.date.localeCompare(b.date)) : [] }
export function addCalendarEntry(input: Omit<CalendarEntry, 'id' | 'createdAt' | 'ownerKey'> & { ownerKey?: string }) {
  const ownerKey = input.ownerKey ?? getSignedInUser()?.accountKey
  if (!ownerKey || !input.title.trim() || !input.date) return null
  const entry: CalendarEntry = { ...input, id: crypto.randomUUID(), title: input.title.trim(), detail: input.detail.trim(), ownerKey, createdAt: new Date().toISOString() }
  write([entry, ...read()])
  return entry
}
