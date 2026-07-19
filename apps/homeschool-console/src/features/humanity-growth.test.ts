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

describe("humanity growth reflections", () => {
  it("stores an unscored reflection only for the active learner", async () => {
    const store = await import("../app/store")
    await store.createHousehold("Home", "1234", "Avery")
    const avery = store.getActiveLearner()!
    const rowan = store.addLearner("Rowan", "🌟", "Age 12")
    const humanity = await import("./humanity-growth")

    const reflection = humanity.saveHumanityReflection({ kind: "empathy", feeling: "worried", prompt: "Someone is alone.", note: "I could ask if they want company." })
    expect(reflection?.learnerId).toBe(avery.id)
    expect(humanity.recentHumanityReflections()).toHaveLength(1)

    store.setActiveLearner(rowan.id)
    expect(humanity.recentHumanityReflections()).toEqual([])
    expect(humanity.saveHumanityReflection({ kind: "repair", feeling: "", prompt: "A repair", note: "I will try." })).toBeNull()
  })
})
