import { getLearners } from '../app/store'

export type ModuleLesson = { title: string; objective: string; minutes: number }
export type ModuleResource = { title: string; url: string }

export interface LearningModule {
  id: string
  name: string
  description: string
  version: string
  subjectNames: string[]
  learningGoals?: string[]
  lessons?: ModuleLesson[]
  resources?: ModuleResource[]
  core?: boolean
}

const key = 'learning-world-os:modules:v1'
const assignmentKey = 'learning-world-os:module-assignments:v1'
const migrationKey = 'learning-world-os:module-migration:v1'
const allowedSubjects = ['Early Learning', 'Music', 'Beginner Coding', 'Mathematics', 'Reading', 'Science', 'History', 'Geography', 'Language Arts', 'Art & Creativity', 'Physical Education', 'Engineering', 'Living Library', 'Homestead Lab', 'Learning Commons', 'Gardening', 'Mindful Movement', 'Spirit']

export const coreModule: LearningModule = { id: 'early-learning', name: 'Early Learning', version: '1.0.0', description: 'The calm, play-based core for young learners.', subjectNames: ['Early Learning'], core: true }
export const sampleModules: LearningModule[] = [
  { id: 'pre-k-learning-world', name: 'Pre-K Learning World', version: '0.1.0', description: 'A test module that unlocks the existing early-childhood subjects and maker spaces.', subjectNames: allowedSubjects.filter(subject => subject !== 'Early Learning') },
  { id: 'nature-and-garden', name: 'Nature & Garden Studio', version: '0.1.0', description: 'A test specialist module for outdoor observation and homestead learning.', subjectNames: ['Science', 'Geography', 'Gardening', 'Homestead Lab'] },
]

function readInstalled(): LearningModule[] {
  try { const saved = JSON.parse(localStorage.getItem(key) ?? '[]') as LearningModule[]; return [coreModule, ...saved.filter(module => module.id !== coreModule.id)] } catch { return [coreModule] }
}
function writeInstalled(modules: LearningModule[]) { localStorage.setItem(key, JSON.stringify(modules.filter(module => !module.core))) }
function readAssignments(): Record<string, string[]> { try { return JSON.parse(localStorage.getItem(assignmentKey) ?? '{}') as Record<string, string[]> } catch { return {} } }
function writeAssignments(assignments: Record<string, string[]>) { localStorage.setItem(assignmentKey, JSON.stringify(assignments)) }

export function installedModules() { return readInstalled() }
export function installModule(module: LearningModule) { const installed = readInstalled(); if (!installed.some(item => item.id === module.id)) writeInstalled([...installed, module]); return true }
/** Creates or replaces an editable, non-core module. Core content is intentionally immutable. */
export function saveModule(module: LearningModule) {
  if (module.core || module.id === coreModule.id) return false
  const installed = readInstalled()
  writeInstalled([...installed.filter(item => item.id !== module.id), { ...module, core: false }])
  return true
}
export function removeModule(moduleId: string) { if (moduleId === coreModule.id) return false; writeInstalled(readInstalled().filter(module => module.id !== moduleId)); const assignments = readAssignments(); Object.keys(assignments).forEach(learnerId => assignments[learnerId] = assignments[learnerId].filter(id => id !== moduleId)); writeAssignments(assignments); return true }
export function assignModule(learnerId: string, moduleId: string) { if (!readInstalled().some(module => module.id === moduleId)) return false; const assignments = readAssignments(); assignments[learnerId] = [...new Set([...(assignments[learnerId] ?? []), moduleId])]; writeAssignments(assignments); return true }
export function unassignModule(learnerId: string, moduleId: string) { const assignments = readAssignments(); assignments[learnerId] = (assignments[learnerId] ?? []).filter(id => id !== moduleId); writeAssignments(assignments) }
function migrateExistingLearners() {
  if (localStorage.getItem(migrationKey)) return
  const installed = readInstalled()
  const preK = sampleModules.find(module => module.id === 'pre-k-learning-world')!
  if (!installed.some(module => module.id === preK.id)) writeInstalled([...installed, preK])
  const assignments = readAssignments()
  getLearners().forEach(learner => assignments[learner.id] = [...new Set([...(assignments[learner.id] ?? []), preK.id])])
  writeAssignments(assignments)
  localStorage.setItem(migrationKey, 'complete')
}

function ensureLearnerBaseline(learnerId: string) {
  const preK = sampleModules.find(module => module.id === 'pre-k-learning-world')!
  const installed = readInstalled()
  if (!installed.some(module => module.id === preK.id)) writeInstalled([...installed, preK])

  const assignments = readAssignments()
  const assigned = assignments[learnerId] ?? []
  if (!assigned.includes(preK.id)) {
    assignments[learnerId] = [...assigned, preK.id]
    writeAssignments(assignments)
  }
}

export function modulesForLearner(learnerId?: string) {
  migrateExistingLearners()
  if (learnerId) ensureLearnerBaseline(learnerId)
  const assigned = learnerId ? readAssignments()[learnerId] ?? [] : []
  return readInstalled().filter(module => module.core || assigned.includes(module.id))
}
export function importModuleManifest(raw: string) {
  try {
    const parsed = JSON.parse(raw) as Partial<LearningModule>
    const id = typeof parsed.id === 'string' ? parsed.id.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') : ''
    const name = typeof parsed.name === 'string' ? parsed.name.trim() : ''
    const description = typeof parsed.description === 'string' ? parsed.description.trim() : ''
    const version = typeof parsed.version === 'string' ? parsed.version.trim() : '0.1.0'
    const subjectNames = Array.isArray(parsed.subjectNames) ? parsed.subjectNames.filter((subject): subject is string => typeof subject === 'string' && allowedSubjects.includes(subject)) : []
    if (!id || !name || !description || !subjectNames.length) return null
    const learningGoals = Array.isArray(parsed.learningGoals) ? parsed.learningGoals.filter((goal): goal is string => typeof goal === "string").map(goal => goal.trim()).filter(Boolean).slice(0, 20) : []
    const lessons = Array.isArray(parsed.lessons) ? parsed.lessons.filter((lesson): lesson is ModuleLesson => !!lesson && typeof lesson === "object" && typeof (lesson as ModuleLesson).title === "string" && typeof (lesson as ModuleLesson).objective === "string").map(lesson => ({ title: lesson.title.trim(), objective: lesson.objective.trim(), minutes: Math.max(0, Number(lesson.minutes) || 0) })).filter(lesson => lesson.title && lesson.objective).slice(0, 40) : []
    const resources = Array.isArray(parsed.resources) ? parsed.resources.filter((resource): resource is ModuleResource => !!resource && typeof resource === "object" && typeof (resource as ModuleResource).title === "string" && typeof (resource as ModuleResource).url === "string").map(resource => ({ title: resource.title.trim(), url: resource.url.trim() })).filter(resource => resource.title && /^https?:\/\//.test(resource.url)).slice(0, 40) : []
    return { id, name, description, version, subjectNames, learningGoals, lessons, resources }
  } catch { return null }
}

export const moduleSubjectOptions = allowedSubjects
