export interface HomesteadRecipe {
  id: string
  title: string
  category: string
  ingredients: string[]
  steps: string[]
  notes: string
  createdAt: string
}

export interface HomesteadTutorial {
  id: string
  title: string
  category: string
  materials: string[]
  steps: string[]
  notes: string
  createdAt: string
}

export const recipeCategorySuggestions = ["Food", "Baking", "Skincare", "Crafts", "Household", "Garden", "Other"]

const recipesKey = "learning-world-os:recipe-box:v1"
const tutorialsKey = "learning-world-os:how-to-shelf:v1"

function isRecipe(item: unknown): item is HomesteadRecipe {
  if (!item || typeof item !== "object") return false
  const recipe = item as Partial<HomesteadRecipe>
  return typeof recipe.id === "string" && typeof recipe.title === "string" && typeof recipe.category === "string" && Array.isArray(recipe.ingredients) && Array.isArray(recipe.steps) && typeof recipe.notes === "string" && typeof recipe.createdAt === "string"
}

function isTutorial(item: unknown): item is HomesteadTutorial {
  if (!item || typeof item !== "object") return false
  const tutorial = item as Partial<HomesteadTutorial>
  return typeof tutorial.id === "string" && typeof tutorial.title === "string" && typeof tutorial.category === "string" && Array.isArray(tutorial.materials) && Array.isArray(tutorial.steps) && typeof tutorial.notes === "string" && typeof tutorial.createdAt === "string"
}

function read<T>(key: string, isValid: (item: unknown) => item is T): T[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(key) ?? "[]")
    return Array.isArray(saved) ? saved.filter(isValid) : []
  } catch { return [] }
}

function cleanList(items: string[], max: number) {
  return items.map(item => item.trim()).filter(Boolean).slice(0, max)
}

export function getHomesteadRecipes() { return read(recipesKey, isRecipe) }
export function getHomesteadTutorials() { return read(tutorialsKey, isTutorial) }

export function addHomesteadRecipe(input: Omit<HomesteadRecipe, "id" | "createdAt">) {
  const title = input.title.trim().slice(0, 100)
  const category = input.category.trim().slice(0, 60)
  const steps = cleanList(input.steps, 20)
  if (!title || !category || !steps.length) return null
  const recipe: HomesteadRecipe = { id: crypto.randomUUID(), title, category, ingredients: cleanList(input.ingredients, 40), steps, notes: input.notes.trim().slice(0, 1200), createdAt: new Date().toISOString() }
  localStorage.setItem(recipesKey, JSON.stringify([recipe, ...getHomesteadRecipes()]))
  return recipe
}

export function addHomesteadTutorial(input: Omit<HomesteadTutorial, "id" | "createdAt">) {
  const title = input.title.trim().slice(0, 100)
  const category = input.category.trim().slice(0, 60)
  const steps = cleanList(input.steps, 24)
  if (!title || !category || !steps.length) return null
  const tutorial: HomesteadTutorial = { id: crypto.randomUUID(), title, category, materials: cleanList(input.materials, 40), steps, notes: input.notes.trim().slice(0, 1200), createdAt: new Date().toISOString() }
  localStorage.setItem(tutorialsKey, JSON.stringify([tutorial, ...getHomesteadTutorials()]))
  return tutorial
}

export function removeHomesteadRecipe(id: string) {
  localStorage.setItem(recipesKey, JSON.stringify(getHomesteadRecipes().filter(recipe => recipe.id !== id)))
}

export function removeHomesteadTutorial(id: string) {
  localStorage.setItem(tutorialsKey, JSON.stringify(getHomesteadTutorials().filter(tutorial => tutorial.id !== id)))
}
