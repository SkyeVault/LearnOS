export type LessonState = 'not-started' | 'in-progress' | 'ready-for-review' | 'complete' | 'needs-revision'
export type MasteryLevel = 'not-assessed' | 'emerging' | 'developing' | 'secure' | 'extending'
export type ActivityKind = 'learn' | 'practice' | 'create' | 'discuss' | 'reflect' | 'assess'
export type EvidenceKind = 'written-response' | 'photo' | 'audio' | 'project-link' | 'observation' | 'quiz'
export type HelpReason = 'directions' | 'materials' | 'understanding' | 'feedback' | 'other'

export interface ModuleActivity {
  id: string
  title: string
  kind: ActivityKind
  learnerAction: string
  evidenceOptions: EvidenceKind[]
  estimatedMinutes: number
}
export interface ModuleLessonPath {
  id: string
  title: string
  objective: string
  estimatedMinutes: number
  prerequisites?: string[]
  activities: ModuleActivity[]
  successCriteria: string[]
}
export interface ModuleUnit {
  id: string
  title: string
  essentialQuestion: string
  outcomes: string[]
  standardIds: string[]
  lessons: ModuleLessonPath[]
}
export interface SemesterCurriculum {
  gradeId: string
  subjectId: string
  semester: 1 | 2
  pacing: { intendedWeeks: number; flexible: true }
  units: ModuleUnit[]
}

export interface ModuleEvidence {
  id: string
  lessonId: string
  kind: EvidenceKind
  note: string
  url?: string
  createdAt: string
}
export interface HelpRequest {
  id: string
  lessonId: string
  reason: HelpReason
  note: string
  status: 'open' | 'acknowledged' | 'resolved'
  createdAt: string
  resolvedAt?: string
}
export interface LessonProgress {
  state: LessonState
  mastery: MasteryLevel
  evidence: ModuleEvidence[]
  teacherFeedback: string
  reviewedAt?: string
  updatedAt: string
}
export interface LearnerModuleProgress {
  learnerId: string
  moduleId: string
  lessonProgress: Record<string, LessonProgress>
  helpRequests: HelpRequest[]
  updatedAt: string
}

const progressKey = 'learning-world-os:module-progress:v1'
const now = () => new Date().toISOString()
function read(): LearnerModuleProgress[] { try { const value = JSON.parse(localStorage.getItem(progressKey) ?? '[]'); return Array.isArray(value) ? value as LearnerModuleProgress[] : [] } catch { return [] } }
function write(records: LearnerModuleProgress[]) { localStorage.setItem(progressKey, JSON.stringify(records)) }
function defaultLessonProgress(): LessonProgress { return { state: 'not-started', mastery: 'not-assessed', evidence: [], teacherFeedback: '', updatedAt: now() } }
function recordFor(learnerId: string, moduleId: string) { return read().find(record => record.learnerId === learnerId && record.moduleId === moduleId) }
function saveRecord(record: LearnerModuleProgress) { const records = read().filter(item => !(item.learnerId === record.learnerId && item.moduleId === record.moduleId)); write([record, ...records]); return record }

export function progressForModule(learnerId: string, moduleId: string): LearnerModuleProgress {
  return recordFor(learnerId, moduleId) ?? { learnerId, moduleId, lessonProgress: {}, helpRequests: [], updatedAt: now() }
}
export function lessonProgressFor(learnerId: string, moduleId: string, lessonId: string) {
  return progressForModule(learnerId, moduleId).lessonProgress[lessonId] ?? defaultLessonProgress()
}
export function setLessonState(learnerId: string, moduleId: string, lessonId: string, state: LessonState) {
  const record = progressForModule(learnerId, moduleId)
  const lesson = record.lessonProgress[lessonId] ?? defaultLessonProgress()
  record.lessonProgress[lessonId] = { ...lesson, state, updatedAt: now() }
  record.updatedAt = now()
  return saveRecord(record)
}
export function submitModuleEvidence(learnerId: string, moduleId: string, lessonId: string, input: Omit<ModuleEvidence, 'id' | 'lessonId' | 'createdAt'>) {
  const record = progressForModule(learnerId, moduleId)
  const lesson = record.lessonProgress[lessonId] ?? defaultLessonProgress()
  const evidence: ModuleEvidence = { ...input, id: crypto.randomUUID(), lessonId, createdAt: now() }
  record.lessonProgress[lessonId] = { ...lesson, state: 'ready-for-review', evidence: [evidence, ...lesson.evidence], updatedAt: now() }
  record.updatedAt = now()
  return saveRecord(record)
}
export function raiseModuleHand(learnerId: string, moduleId: string, lessonId: string, reason: HelpReason, note = '') {
  const record = progressForModule(learnerId, moduleId)
  const request: HelpRequest = { id: crypto.randomUUID(), lessonId, reason, note: note.trim(), status: 'open', createdAt: now() }
  record.helpRequests = [request, ...record.helpRequests]
  record.updatedAt = now()
  saveRecord(record)
  return request
}
export function reviewModuleLesson(learnerId: string, moduleId: string, lessonId: string, input: { state: Extract<LessonState, 'complete' | 'needs-revision'>; mastery: MasteryLevel; feedback?: string }) {
  const record = progressForModule(learnerId, moduleId)
  const lesson = record.lessonProgress[lessonId] ?? defaultLessonProgress()
  record.lessonProgress[lessonId] = { ...lesson, state: input.state, mastery: input.mastery, teacherFeedback: input.feedback?.trim() ?? '', reviewedAt: now(), updatedAt: now() }
  record.updatedAt = now()
  return saveRecord(record)
}
export function resolveHelpRequest(learnerId: string, moduleId: string, requestId: string) {
  const record = recordFor(learnerId, moduleId)
  if (!record) return false
  const request = record.helpRequests.find(item => item.id === requestId)
  if (!request) return false
  request.status = 'resolved'; request.resolvedAt = now(); record.updatedAt = now(); saveRecord(record)
  return true
}
export function moduleProgressSummary(learnerId: string, moduleId: string, lessonIds: string[]) {
  const progress = progressForModule(learnerId, moduleId)
  const lessons = lessonIds.map(id => progress.lessonProgress[id] ?? defaultLessonProgress())
  const complete = lessons.filter(item => item.state === 'complete').length
  return { total: lessonIds.length, complete, readyForReview: lessons.filter(item => item.state === 'ready-for-review').length, needsRevision: lessons.filter(item => item.state === 'needs-revision').length, percentComplete: lessonIds.length ? Math.round((complete / lessonIds.length) * 100) : 0, openHelpRequests: progress.helpRequests.filter(item => item.status !== 'resolved').length }
}
export function teacherModuleAttentionQueue() {
  return read().flatMap(record => [
    ...record.helpRequests.filter(request => request.status !== 'resolved').map(request => ({ kind: 'help-request' as const, learnerId: record.learnerId, moduleId: record.moduleId, lessonId: request.lessonId, createdAt: request.createdAt, request })),
    ...Object.entries(record.lessonProgress).filter(([, lesson]) => lesson.state === 'ready-for-review').map(([lessonId, lesson]) => ({ kind: 'review' as const, learnerId: record.learnerId, moduleId: record.moduleId, lessonId, createdAt: lesson.updatedAt })),
  ]).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function parseSemesterCurriculum(value: unknown): SemesterCurriculum | undefined {
  if (!value || typeof value !== 'object') return undefined
  const raw = value as Partial<SemesterCurriculum>
  if (typeof raw.gradeId !== 'string' || typeof raw.subjectId !== 'string' || (raw.semester !== 1 && raw.semester !== 2) || !raw.pacing || typeof raw.pacing.intendedWeeks !== 'number' || raw.pacing.flexible !== true || !Array.isArray(raw.units)) return undefined
  const units = raw.units.filter((unit): unit is ModuleUnit => !!unit && typeof unit.id === 'string' && typeof unit.title === 'string' && typeof unit.essentialQuestion === 'string' && Array.isArray(unit.outcomes) && Array.isArray(unit.standardIds) && Array.isArray(unit.lessons)).map(unit => ({ ...unit, id: unit.id.trim(), title: unit.title.trim(), essentialQuestion: unit.essentialQuestion.trim(), outcomes: unit.outcomes.filter((item): item is string => typeof item === 'string').map(item => item.trim()).filter(Boolean), standardIds: unit.standardIds.filter((item): item is string => typeof item === 'string').map(item => item.trim()).filter(Boolean), lessons: unit.lessons.filter(lesson => !!lesson && typeof lesson.id === 'string' && typeof lesson.title === 'string' && typeof lesson.objective === 'string' && typeof lesson.estimatedMinutes === 'number' && Array.isArray(lesson.activities) && Array.isArray(lesson.successCriteria)).slice(0, 24) })).filter(unit => unit.id && unit.title)
  return { gradeId: raw.gradeId.trim(), subjectId: raw.subjectId.trim(), semester: raw.semester, pacing: { intendedWeeks: Math.max(1, Math.min(26, Math.round(raw.pacing.intendedWeeks))), flexible: true }, units: units.slice(0, 12) }
}
