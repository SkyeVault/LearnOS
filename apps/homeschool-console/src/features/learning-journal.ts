import { getActiveLearner } from '../app/store'

export interface LearningEvidence {
  id: string
  learnerId: string
  missionId: string
  missionTitle: string
  pillar: string
  note: string
  createdAt: string
}

const key = 'learning-world-os:learning-evidence:v1'
function readAll(): LearningEvidence[] {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(saved) ? saved as LearningEvidence[] : []
  } catch { return [] }
}

export function getLearningEvidence(): LearningEvidence[] {
  const learner = getActiveLearner()
  if (!learner) return []
  return readAll().filter(item => item.learnerId === learner.id)
}
export function saveLearningEvidence(item: Omit<LearningEvidence, 'id' | 'learnerId' | 'createdAt'>) {
  const learner = getActiveLearner()
  if (!learner) return
  const evidence = { ...item, id: crypto.randomUUID(), learnerId: learner.id, createdAt: new Date().toISOString() }
  localStorage.setItem(key, JSON.stringify([evidence, ...readAll()]))
}
