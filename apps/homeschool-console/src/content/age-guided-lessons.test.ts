import { describe, expect, it } from "vitest"
import { inferLearningStage, learningStages, lessonsForStage } from "./age-guided-lessons"

describe("age-guided lesson library", () => {
  it("offers a focused, subject-varied lesson set for every stage", () => {
    learningStages.forEach(stage => {
      const lessons = lessonsForStage(stage.id)
      expect(lessons.length).toBeGreaterThanOrEqual(15)
      expect(new Set(lessons.map(lesson => lesson.subject)).size).toBeGreaterThanOrEqual(12)
      expect(lessons.some(lesson => lesson.subject === "Technology & Coding")).toBe(true)
      expect(lessons.some(lesson => lesson.subject === "Physical Education & Wellness")).toBe(true)
      expect(lessons.some(lesson => lesson.subject === "Homestead & Life Skills")).toBe(true)
    })
  })

  it("infers the right stage from toddler through teen age bands", () => {
    expect(inferLearningStage("2 years")).toBe("Toddler · 1–3")
    expect(inferLearningStage("Early learner")).toBe("Early learner · 4–6")
    expect(inferLearningStage("Age 8")).toBe("Elementary · 7–10")
    expect(inferLearningStage("Age 12")).toBe("Middle school · 11–13")
    expect(inferLearningStage("Age 16")).toBe("Teen · 14–18")
  })
})
