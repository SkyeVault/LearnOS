import { localTeachingLibrary, type LocalLesson } from "./local-teaching-library"

export type LearningStage = "Toddler · 1–3" | "Early learner · 4–6" | "Elementary · 7–10" | "Middle school · 11–13" | "Teen · 14–18"

export const learningStages: Array<{ id: LearningStage; description: string }> = [
  { id: "Toddler · 1–3", description: "Short, sensory, adult-near play" },
  { id: "Early learner · 4–6", description: "Playful foundations and story" },
  { id: "Elementary · 7–10", description: "Concrete inquiry and making" },
  { id: "Middle school · 11–13", description: "Evidence, systems, and voice" },
  { id: "Teen · 14–18", description: "Independent inquiry and synthesis" },
]

const titles: Record<LearningStage, string[]> = {
  "Toddler · 1–3": ["Color Detective", "Texture Rubbing Lab", "Backyard Biodiversity Count", "Sound Map", "Pattern Hunt", "Found Sound Orchestra"],
  "Early learner · 4–6": ["Shadow Theatre", "Map My Day", "Kitchen Chemistry", "Word Collector", "Snack Fraction Studio", "Movement Story"],
  "Elementary · 7–10": ["Museum Label Maker", "Object Time Capsule", "Weather Station", "Family Recipe Reading", "Measurement Makers", "Beat Builder"],
  "Middle school · 11–13": ["Primary Source Detective", "Engineering Repair Challenge", "Fact, Claim, Question", "Budget a Picnic", "Listening Map", "Design for Someone"],
  "Teen · 14–18": ["Migration Stories", "Community Helpers Oral History", "Data Story", "Letter to the Future", "Math Game Inventor", "Poetry Sound Walk"],
}

export function inferLearningStage(ageBand: string | undefined): LearningStage {
  const value = ageBand?.toLowerCase() ?? ""
  if (value.includes("toddler")) return "Toddler · 1–3"
  if (value.includes("early") || value.includes("prek") || value.includes("kindergarten")) return "Early learner · 4–6"
  const age = Number(value.match(/\d+/)?.[0])
  if (Number.isFinite(age)) {
    if (age <= 3) return "Toddler · 1–3"
    if (age <= 6) return "Early learner · 4–6"
    if (age <= 10) return "Elementary · 7–10"
    if (age <= 13) return "Middle school · 11–13"
    return "Teen · 14–18"
  }
  return "Elementary · 7–10"
}


const planningSubjects: Array<[string, string, string]> = [
  ["Reading & Literature", "Reading studio", "Build meaning, vocabulary, and a response to a text at the learner level."],
  ["Geography & Culture", "Place and people inquiry", "Connect place, environment, culture, and the lives of people."],
  ["Technology & Coding", "Create and debug", "Use precise steps, testing, and revision to solve a meaningful problem."],
  ["Physical Education & Wellness", "Body and wellbeing check-in", "Build age-appropriate movement, rest, nourishment, and self-awareness habits."],
  ["Homestead & Life Skills", "Home skills lab", "Practice a supervised real-world routine with safety, care, and responsibility."],
  ["Gardening & Nature", "Grow and notice", "Observe living systems and make a responsible care plan for nature or a plant."],
  ["Civic & Financial Life", "Choices and community", "Consider needs, trade-offs, shared responsibility, and contribution to a community."],
  ["Media & Information Literacy", "Evidence detective", "Notice purpose, evidence, missing information, and questions worth checking."],
  ["Research & Study Skills", "Learning strategy lab", "Set a learning target, use an appropriate strategy, and reflect on evidence of progress."],
]

const stageFocus: Record<LearningStage, { title: string; emphasis: string }> = {
  "Toddler · 1–3": { title: "together", emphasis: "Keep it brief, sensory, playful, and alongside a caring adult." },
  "Early learner · 4–6": { title: "through play", emphasis: "Use stories, pictures, movement, and concrete choices." },
  "Elementary · 7–10": { title: "by making", emphasis: "Invite observation, explanation, and a small artifact or record." },
  "Middle school · 11–13": { title: "with evidence", emphasis: "Invite growing independence, revision, and respectful discussion." },
  "Teen · 14–18": { title: "for real life", emphasis: "Support independent inquiry, synthesis, and reflection on trade-offs." },
}

function planningLessonsForStage(stage: LearningStage): LocalLesson[] {
  const focus = stageFocus[stage]
  return planningSubjects.map(([subject, activity, objective], index) => ({
    id: "plan:" + stage.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ":" + (index + 1),
    subject,
    ages: stage,
    title: activity + " " + focus.title,
    objective: objective + " " + focus.emphasis,
    materials: ["Notebook or paper", "Pencil, crayons, or a keyboard", "A grown-up check-in when needed"],
    steps: ["Start with a wonder question.", "Try the activity or make a small artifact.", "Talk through what happened and save one piece of evidence."],
    extension: "Choose a next step, adapt the challenge, or connect it to another subject.",
  }))
}

// The local library supplies deep, hands-on exemplars. These planning seeds make
// the age-first plan maker a complete map rather than implying six subjects are
// a complete education for every child.
export function lessonsForStage(stage: LearningStage): LocalLesson[] {
  const preferred = titles[stage]
  const libraryLessons = preferred.map(title => localTeachingLibrary.find(lesson => lesson.title === title)).filter((lesson): lesson is LocalLesson => Boolean(lesson))
  return [...libraryLessons, ...planningLessonsForStage(stage)]
}
