import { getActiveLearner } from '../app/store'

export interface Assignment {
  id: string
  learnerId: string
  title: string
  description: string
  points: number
  createdAt: string
  completedAt: string | null
}

const key = 'learning-world-os:assignments:v1'
function read(): Assignment[] { try { return JSON.parse(localStorage.getItem(key) ?? '[]') as Assignment[] } catch { return [] } }
function write(assignments: Assignment[]) { localStorage.setItem(key, JSON.stringify(assignments)) }

export function assignmentsFor(learnerId: string) { return read().filter(assignment => assignment.learnerId === learnerId) }
export function activeAssignments() { const learner = getActiveLearner(); return learner ? assignmentsFor(learner.id) : [] }
export function createAssignment(input: Omit<Assignment, 'id' | 'createdAt' | 'completedAt'>) {
  const assignment: Assignment = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), completedAt: null }
  write([assignment, ...read()])
}
export function completeAssignment(id: string) {
  const learner = getActiveLearner()
  if (!learner) return false
  const assignments = read()
  const assignment = assignments.find(item => item.id === id)
  if (!assignment || assignment.learnerId !== learner.id || assignment.completedAt) return false
  assignment.completedAt = new Date().toISOString()
  write(assignments)
  return true
}
export function assignmentStats(learnerId: string) {
  const assignments = assignmentsFor(learnerId)
  const completed = assignments.filter(assignment => assignment.completedAt)
  return { total: assignments.length, completed: completed.length, points: completed.reduce((sum, assignment) => sum + assignment.points, 0), available: assignments.filter(assignment => !assignment.completedAt).reduce((sum, assignment) => sum + assignment.points, 0) }
}
