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

describe("Spirit content", () => {
  it("keeps the parent shelf curated and rejects unsafe source URLs", async () => {
    const spirit = await import("./spirit-content")
    const familyItem = spirit.addSpiritContent({ kind: "family", title: "Gratitude", description: "A family reflection", tradition: "Family practice", guidingQuestion: "What makes this meaningful?", targetLearnerIds: [], sourceUrl: "" })
    const researchItem = spirit.addSpiritContent({ kind: "research", title: "Buddhism", description: "Compare diverse lived traditions", tradition: "Buddhism", guidingQuestion: "What do diverse Buddhists practice?", targetLearnerIds: [], sourceUrl: "https://example.org" })

    expect(familyItem).not.toBeNull()
    expect(researchItem).not.toBeNull()
    expect(spirit.addSpiritContent({ kind: "research", title: "Unsafe", description: "No", tradition: "", guidingQuestion: "", targetLearnerIds: [], sourceUrl: "javascript:alert(1)" })).toBeNull()
    expect(spirit.addSpiritContent({ kind: "unsupported" as never, title: "Unknown", description: "No", tradition: "", guidingQuestion: "", targetLearnerIds: [], sourceUrl: "" })).toBeNull()
    expect(spirit.getSpiritContent("family")).toHaveLength(1)
    expect(spirit.getSpiritContent("research")).toHaveLength(1)

    spirit.removeSpiritContent(familyItem!.id)
    expect(spirit.getSpiritContent("family")).toEqual([])
    localStorage.setItem("learning-world-os:spirit-content:v1", JSON.stringify([null, { kind: "unknown" }]))
    expect(spirit.getSpiritContent()).toEqual([])
  })

  it("assigns a path to the intended learner and keeps reflections private", async () => {
    const store = await import("../app/store")
    await store.createHousehold("Home", "1234", "Avery")
    const avery = store.getActiveLearner()!
    const rowan = store.addLearner("Rowan", "🌟", "Learner")
    const spirit = await import("./spirit-content")
    const path = spirit.addSpiritContent({ kind: "research", title: "Reading a tradition with care", description: "Notice diversity within a tradition.", tradition: "Research skills", guidingQuestion: "Whose voices are represented?", targetLearnerIds: [avery.id], sourceUrl: "" })!

    expect(spirit.getSpiritContent("research", avery.id)).toHaveLength(1)
    expect(spirit.getSpiritContent("research", rowan.id)).toHaveLength(0)
    expect(spirit.saveSpiritReflection(path.id, "I want to learn from more than one voice.")?.note).toContain("more than one voice")
    expect(spirit.getSpiritReflection(path.id)?.note).toContain("more than one voice")

    store.setActiveLearner(rowan.id)
    expect(spirit.getSpiritReflection(path.id)).toBeNull()
    expect(spirit.saveSpiritReflection(path.id, "This should not be saved.")).toBeNull()
  })
})
