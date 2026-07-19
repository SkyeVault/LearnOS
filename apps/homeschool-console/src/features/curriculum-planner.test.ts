import { beforeEach, describe, expect, it, vi } from "vitest"

class MemoryStorage {
  private values = new Map<string, string>()
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, String(value)) }
}

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: new MemoryStorage() })
  vi.resetModules()
})

describe("parent curriculum planner", () => {
  it("keeps a parent-owned plan per learner and a safe state notebook", async () => {
    const store = await import("../app/store")
    await store.createHousehold("Home", "1234", "Avery")
    const avery = store.getActiveLearner()!
    const rowan = store.addLearner("Rowan", "🌟", "Age 12")
    const planner = await import("./curriculum-planner")

    const plan = planner.addCurriculumPlan({ learnerId: avery.id, stage: "Elementary · 7–10", subject: "Science", title: "Nature study", objective: "Keep a weekly observation notebook.", cadence: "Once a week", resources: ["Notebook", "Field guide"] })
    expect(plan).not.toBeNull()
    expect(planner.curriculumPlansFor(avery.id)).toHaveLength(1)
    expect(planner.curriculumPlansFor(rowan.id)).toEqual([])

    expect(planner.saveStateRequirementOverview({ state: "Example State", officialSourceUrl: "https://education.example.gov", notes: "Verify requirements yearly." })?.state).toBe("Example State")
    planner.toggleStateRequirementPrompt("records", true)
    expect(planner.getStateRequirementOverview()).toMatchObject({ state: "Example State", completedPromptIds: ["records"] })
    expect(planner.saveStateRequirementOverview({ state: "Example State", officialSourceUrl: "javascript:alert(1)", notes: "" })).toBeNull()

    planner.removeCurriculumPlan(plan!.id)
    expect(planner.curriculumPlansFor(avery.id)).toEqual([])
  })
})
