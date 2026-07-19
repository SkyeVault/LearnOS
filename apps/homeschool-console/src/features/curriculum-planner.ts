import type { LearningStage } from "../content/age-guided-lessons"

export interface CurriculumPlan {
  id: string
  learnerId: string
  stage: LearningStage
  subject: string
  title: string
  objective: string
  cadence: string
  resources: string[]
  createdAt: string
}

export interface StateRequirementOverview {
  state: string
  officialSourceUrl: string
  notes: string
  completedPromptIds: string[]
}

export const stateRequirementPrompts = [
  { id: "notice", label: "Registration, notice, or withdrawal", detail: "Confirm whether the family must notify a district or submit a form." },
  { id: "subjects", label: "Required subjects or instruction", detail: "Record the subjects, scope, or curriculum expectations that apply." },
  { id: "time", label: "Attendance or instructional time", detail: "Record any days, hours, or attendance expectations." },
  { id: "assessment", label: "Assessment, evaluation, or portfolio", detail: "Record tests, evaluator requirements, or portfolio review rules." },
  { id: "records", label: "Records and exemptions", detail: "Record what to retain and any health, immunization, or exemption rules." },
] as const

const curriculumKey = "learning-world-os:curriculum-plans:v1"
const stateKey = "learning-world-os:state-requirements:v1"

function validPlan(item: unknown): item is CurriculumPlan {
  if (!item || typeof item !== "object") return false
  const plan = item as Partial<CurriculumPlan>
  return typeof plan.id === "string" && typeof plan.learnerId === "string" && typeof plan.stage === "string" && typeof plan.subject === "string" && typeof plan.title === "string" && typeof plan.objective === "string" && typeof plan.cadence === "string" && Array.isArray(plan.resources) && typeof plan.createdAt === "string"
}

function readPlans(): CurriculumPlan[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(curriculumKey) ?? "[]")
    return Array.isArray(saved) ? saved.filter(validPlan) : []
  } catch { return [] }
}

function writePlans(plans: CurriculumPlan[]) {
  localStorage.setItem(curriculumKey, JSON.stringify(plans))
}

export function curriculumPlansFor(learnerId: string) {
  return readPlans().filter(plan => plan.learnerId === learnerId)
}

export function addCurriculumPlan(input: Omit<CurriculumPlan, "id" | "createdAt">) {
  const title = input.title.trim().slice(0, 100)
  const subject = input.subject.trim().slice(0, 70)
  const objective = input.objective.trim().slice(0, 900)
  const cadence = input.cadence.trim().slice(0, 100)
  if (!title || !subject || !objective) return null
  const plan: CurriculumPlan = {
    id: crypto.randomUUID(),
    learnerId: input.learnerId,
    stage: input.stage,
    title,
    subject,
    objective,
    cadence: cadence || "Parent-defined cadence",
    resources: input.resources.map(item => item.trim()).filter(Boolean).slice(0, 15),
    createdAt: new Date().toISOString(),
  }
  writePlans([plan, ...readPlans()])
  return plan
}

export function removeCurriculumPlan(id: string) {
  writePlans(readPlans().filter(plan => plan.id !== id))
}

function defaultStateOverview(): StateRequirementOverview {
  return { state: "", officialSourceUrl: "", notes: "", completedPromptIds: [] }
}

export function getStateRequirementOverview(): StateRequirementOverview {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(stateKey) ?? "null")
    if (!saved || typeof saved !== "object") return defaultStateOverview()
    const overview = saved as Partial<StateRequirementOverview>
    return {
      state: typeof overview.state === "string" ? overview.state : "",
      officialSourceUrl: typeof overview.officialSourceUrl === "string" ? overview.officialSourceUrl : "",
      notes: typeof overview.notes === "string" ? overview.notes : "",
      completedPromptIds: Array.isArray(overview.completedPromptIds) ? overview.completedPromptIds.filter((id): id is string => typeof id === "string" && stateRequirementPrompts.some(prompt => prompt.id === id)) : [],
    }
  } catch { return defaultStateOverview() }
}

export function saveStateRequirementOverview(input: Pick<StateRequirementOverview, "state" | "officialSourceUrl" | "notes">) {
  const current = getStateRequirementOverview()
  const state = input.state.trim().slice(0, 60)
  const officialSourceUrl = input.officialSourceUrl.trim().slice(0, 500)
  if (officialSourceUrl && !/^https?:\/\//i.test(officialSourceUrl)) return null
  const overview: StateRequirementOverview = { ...current, state, officialSourceUrl, notes: input.notes.trim().slice(0, 1500) }
  localStorage.setItem(stateKey, JSON.stringify(overview))
  return overview
}

export function toggleStateRequirementPrompt(id: string, complete: boolean) {
  if (!stateRequirementPrompts.some(prompt => prompt.id === id)) return
  const current = getStateRequirementOverview()
  const completed = new Set(current.completedPromptIds)
  complete ? completed.add(id) : completed.delete(id)
  localStorage.setItem(stateKey, JSON.stringify({ ...current, completedPromptIds: [...completed] }))
}
