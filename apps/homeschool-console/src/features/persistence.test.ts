import { beforeEach, describe, expect, it, vi } from "vitest"

class MemoryStorage {
  private values = new Map<string, string>()
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, String(value)) }
  removeItem(key: string) { this.values.delete(key) }
  clear() { this.values.clear() }
}

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: new MemoryStorage() })
  vi.resetModules()
})

describe("learning evidence persistence", () => {
  it("keeps evidence belonging to every learner", async () => {
    const store = await import("../app/store")
    await store.createHousehold("Home", "1234", "Avery")
    const firstLearner = store.getActiveLearner()!
    const secondLearner = store.addLearner("Rowan", "🌟", "Learner")
    expect(store.getSettings()?.toddlerLockEnabled).toBe(false)
    store.setToddlerLockEnabled(true)
    expect(store.getSettings()?.toddlerLockEnabled).toBe(true)
    expect(store.setActiveLearner("missing-learner")).toBe(false)
    expect(store.getActiveLearner()?.id).toBe(firstLearner.id)
    const journal = await import("./learning-journal")

    journal.saveLearningEvidence({ missionId: "one", missionTitle: "First", pillar: "Think", note: "Avery note" })
    store.setActiveLearner(secondLearner.id)
    journal.saveLearningEvidence({ missionId: "two", missionTitle: "Second", pillar: "Care", note: "Rowan note" })

    expect(journal.getLearningEvidence()).toHaveLength(1)
    expect(journal.getLearningEvidence()[0]?.note).toBe("Rowan note")
    store.setActiveLearner(firstLearner.id)
    expect(journal.getLearningEvidence()).toHaveLength(1)
    expect(journal.getLearningEvidence()[0]?.note).toBe("Avery note")
  })
})

describe("assignment completion", () => {
  it("allows only the assigned learner to complete an assignment", async () => {
    const store = await import("../app/store")
    await store.createHousehold("Home", "1234", "Avery")
    const firstLearner = store.getActiveLearner()!
    const secondLearner = store.addLearner("Rowan", "🌟", "Learner")
    const assignments = await import("./assignments-store")

    assignments.createAssignment({ learnerId: secondLearner.id, title: "Rowan mission", description: "Do it", points: 10 })
    const assignment = assignments.assignmentsFor(secondLearner.id)[0]!

    expect(assignments.completeAssignment(assignment.id)).toBe(false)
    store.setActiveLearner(secondLearner.id)
    expect(assignments.completeAssignment(assignment.id)).toBe(true)
    expect(assignments.completeAssignment(assignment.id)).toBe(false)
    store.setActiveLearner(firstLearner.id)
    expect(assignments.assignmentStats(secondLearner.id)).toMatchObject({ completed: 1, points: 10, available: 0 })
  })
})
