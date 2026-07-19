import { lessonsForStage, type LearningStage } from "../content/age-guided-lessons"

export interface ParentLessonSuggestion {
  id: string
  stage: LearningStage
  subject: string
  title: string
  objective: string
  materials: string[]
  steps: string[]
  source: "suggestion" | "custom"
}

const customKey = "learning-world-os:parent-lesson-bank:v1"
const hiddenKey = "learning-world-os:hidden-lesson-suggestions:v1"

function readCustom(): ParentLessonSuggestion[] {
  try {
    const saved = JSON.parse(localStorage.getItem(customKey) ?? "[]")
    return Array.isArray(saved) ? saved.filter((item): item is ParentLessonSuggestion => Boolean(item) && typeof item.id === "string" && typeof item.stage === "string" && typeof item.subject === "string" && typeof item.title === "string" && typeof item.objective === "string" && Array.isArray(item.materials) && Array.isArray(item.steps) && item.source === "custom") : []
  } catch { return [] }
}

function readHidden(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(hiddenKey) ?? "[]")
    return Array.isArray(saved) ? saved.filter((item): item is string => typeof item === "string") : []
  } catch { return [] }
}

function writeCustom(items: ParentLessonSuggestion[]) { localStorage.setItem(customKey, JSON.stringify(items)) }
function writeHidden(items: string[]) { localStorage.setItem(hiddenKey, JSON.stringify(items)) }

export function lessonSuggestionsForStage(stage: LearningStage) {
  const hidden = new Set(readHidden())
  const builtIn = lessonsForStage(stage).map(lesson => ({ id: `local:${lesson.id}`, stage, subject: lesson.subject, title: lesson.title, objective: lesson.objective, materials: lesson.materials, steps: lesson.steps, source: "suggestion" as const }))
  return [...builtIn, ...readCustom().filter(lesson => lesson.stage === stage)].filter(lesson => !hidden.has(lesson.id))
}

export function addCustomLesson(input: Omit<ParentLessonSuggestion, "id" | "source">) {
  const title = input.title.trim().slice(0, 90)
  const subject = input.subject.trim().slice(0, 60)
  const objective = input.objective.trim().slice(0, 700)
  const materials = input.materials.map(item => item.trim()).filter(Boolean).slice(0, 12)
  const steps = input.steps.map(item => item.trim()).filter(Boolean).slice(0, 8)
  if (!title || !subject || !objective) return null
  const lesson: ParentLessonSuggestion = { id: `custom:${crypto.randomUUID()}`, stage: input.stage, title, subject, objective, materials, steps, source: "custom" }
  writeCustom([lesson, ...readCustom()])
  return lesson
}

export function hideLessonSuggestion(id: string) {
  if (!readHidden().includes(id)) writeHidden([...readHidden(), id])
}

export function restoreLessonSuggestion(id: string) {
  writeHidden(readHidden().filter(item => item !== id))
}

export function hiddenSuggestionCount() { return readHidden().length }
