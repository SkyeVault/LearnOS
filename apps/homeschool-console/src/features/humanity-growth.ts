import { getActiveLearner } from "../app/store"

export type HumanityPracticeKind = "check-in" | "empathy" | "repair"

export interface HumanityReflection {
  id: string
  learnerId: string
  kind: HumanityPracticeKind
  feeling: string
  prompt: string
  note: string
  createdAt: string
}

const key = "learning-world-os:humanity-growth:v1"

function validReflection(item: unknown): item is HumanityReflection {
  if (!item || typeof item !== "object") return false
  const reflection = item as Partial<HumanityReflection>
  return typeof reflection.id === "string" && typeof reflection.learnerId === "string" && (reflection.kind === "check-in" || reflection.kind === "empathy" || reflection.kind === "repair") && typeof reflection.feeling === "string" && typeof reflection.prompt === "string" && typeof reflection.note === "string" && typeof reflection.createdAt === "string"
}

function read(): HumanityReflection[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(key) ?? "[]")
    return Array.isArray(saved) ? saved.filter(validReflection) : []
  } catch { return [] }
}

export function recentHumanityReflections(limit = 6) {
  const learner = getActiveLearner()
  return learner ? read().filter(item => item.learnerId === learner.id).slice(0, limit) : []
}

export function saveHumanityReflection(input: Omit<HumanityReflection, "id" | "learnerId" | "createdAt">) {
  const learner = getActiveLearner()
  const note = input.note.trim().slice(0, 900)
  const feeling = input.feeling.trim().slice(0, 60)
  const prompt = input.prompt.trim().slice(0, 220)
  if (!learner || !note || !feeling || !prompt) return null
  const reflection: HumanityReflection = { id: crypto.randomUUID(), learnerId: learner.id, kind: input.kind, feeling, prompt, note, createdAt: new Date().toISOString() }
  localStorage.setItem(key, JSON.stringify([reflection, ...read()]))
  return reflection
}
