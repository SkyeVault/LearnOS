import { getActiveLearner } from "../app/store"

export type SpiritContentKind = "family" | "research"

export interface SpiritContent {
  id: string
  title: string
  description: string
  tradition: string
  guidingQuestion: string
  targetLearnerIds: string[]
  kind: SpiritContentKind
  sourceUrl: string
  createdAt: string
}

export interface SpiritReflection {
  id: string
  contentId: string
  learnerId: string
  note: string
  createdAt: string
}

const key = "learning-world-os:spirit-content:v1"
const reflectionKey = "learning-world-os:spirit-reflections:v1"

function normalizeSpiritContent(value: unknown): SpiritContent | null {
  if (!value || typeof value !== "object") return null
  const item = value as Partial<SpiritContent>
  if (typeof item.id !== "string" || typeof item.title !== "string" || typeof item.description !== "string" || typeof item.tradition !== "string" || (item.kind !== "family" && item.kind !== "research") || typeof item.sourceUrl !== "string" || typeof item.createdAt !== "string") return null
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    tradition: item.tradition,
    guidingQuestion: typeof item.guidingQuestion === "string" ? item.guidingQuestion : "",
    targetLearnerIds: Array.isArray(item.targetLearnerIds) ? item.targetLearnerIds.filter(id => typeof id === "string") : [],
    kind: item.kind,
    sourceUrl: item.sourceUrl,
    createdAt: item.createdAt,
  }
}

function read(): SpiritContent[] {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "[]")
    return Array.isArray(saved) ? saved.map(normalizeSpiritContent).filter((item): item is SpiritContent => item !== null) : []
  } catch { return [] }
}

function readReflections(): SpiritReflection[] {
  try {
    const saved = JSON.parse(localStorage.getItem(reflectionKey) ?? "[]")
    if (!Array.isArray(saved)) return []
    return saved.filter((item): item is SpiritReflection => Boolean(item) && typeof item.id === "string" && typeof item.contentId === "string" && typeof item.learnerId === "string" && typeof item.note === "string" && typeof item.createdAt === "string")
  } catch { return [] }
}

function write(items: SpiritContent[]) {
  localStorage.setItem(key, JSON.stringify(items))
}

function validSourceUrl(value: string) {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch { return false }
}

export function getSpiritContent(kind?: SpiritContentKind, learnerId?: string) {
  return read().filter(item => (!kind || item.kind === kind) && (!learnerId || !item.targetLearnerIds.length || item.targetLearnerIds.includes(learnerId)))
}

export function addSpiritContent(input: Omit<SpiritContent, "id" | "createdAt">) {
  const title = input.title.trim().slice(0, 90)
  const description = input.description.trim().slice(0, 900)
  const tradition = input.tradition.trim().slice(0, 60)
  const guidingQuestion = input.guidingQuestion.trim().slice(0, 240)
  const sourceUrl = input.sourceUrl.trim()
  const targetLearnerIds = [...new Set(input.targetLearnerIds.filter(id => typeof id === "string" && id.trim()))]
  if ((input.kind !== "family" && input.kind !== "research") || !title || !description || !validSourceUrl(sourceUrl)) return null

  const item: SpiritContent = { id: crypto.randomUUID(), title, description, tradition, guidingQuestion, targetLearnerIds, kind: input.kind, sourceUrl, createdAt: new Date().toISOString() }
  write([item, ...read()])
  return item
}

export function removeSpiritContent(id: string) {
  write(read().filter(item => item.id !== id))
}

export function getSpiritReflection(contentId: string) {
  const learner = getActiveLearner()
  return learner ? readReflections().find(item => item.contentId === contentId && item.learnerId === learner.id) ?? null : null
}

export function spiritReflectionCount() {
  const learner = getActiveLearner()
  return learner ? readReflections().filter(item => item.learnerId === learner.id).length : 0
}

export function saveSpiritReflection(contentId: string, note: string) {
  const learner = getActiveLearner()
  const cleanNote = note.trim().slice(0, 1200)
  if (!learner || !getSpiritContent(undefined, learner.id).some(item => item.id === contentId) || !cleanNote) return null
  const reflection: SpiritReflection = { id: crypto.randomUUID(), contentId, learnerId: learner.id, note: cleanNote, createdAt: new Date().toISOString() }
  const saved = readReflections().filter(item => item.contentId !== contentId || item.learnerId !== learner.id)
  localStorage.setItem(reflectionKey, JSON.stringify([reflection, ...saved]))
  return reflection
}
