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

describe("family recipe box and how-to shelf", () => {
  it("saves, filters, and removes local recipes and tutorials", async () => {
    const library = await import("./homestead-library")
    const recipe = library.addHomesteadRecipe({ title: "Cinnamon toast", category: "Baking", ingredients: ["Bread", "Cinnamon"], steps: ["Toast", "Sprinkle"], notes: "Family favorite" })
    const tutorial = library.addHomesteadTutorial({ title: "Start basil", category: "Garden", materials: ["Pot", "Soil"], steps: ["Fill pot", "Plant seeds"], notes: "" })

    expect(recipe?.category).toBe("Baking")
    expect(library.getHomesteadRecipes()).toHaveLength(1)
    expect(library.getHomesteadTutorials()).toHaveLength(1)
    expect(library.addHomesteadRecipe({ title: "", category: "Food", ingredients: [], steps: [], notes: "" })).toBeNull()

    library.removeHomesteadRecipe(recipe!.id)
    library.removeHomesteadTutorial(tutorial!.id)
    expect(library.getHomesteadRecipes()).toEqual([])
    expect(library.getHomesteadTutorials()).toEqual([])
  })
})
