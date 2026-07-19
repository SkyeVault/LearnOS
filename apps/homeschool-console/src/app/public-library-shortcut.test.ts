import { beforeEach, describe, expect, it, vi } from "vitest"

class MemoryStorage {
  private values = new Map<string, string>()
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, String(value)) }
  removeItem(key: string) { this.values.delete(key) }
}

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: new MemoryStorage() })
  vi.resetModules()
})

describe("public library shortcut", () => {
  it("keeps a parent-selected HTTPS or HTTP library shortcut and rejects unsafe URLs", async () => {
    const shortcut = await import("./public-library-shortcut")
    expect(shortcut.getPublicLibraryShortcut()).toBeNull()
    expect(shortcut.savePublicLibraryShortcut({ name: "River Library", url: "https://library.example.org/catalog" })).toEqual({ name: "River Library", url: "https://library.example.org/catalog" })
    expect(shortcut.getPublicLibraryShortcut()?.name).toBe("River Library")
    expect(shortcut.savePublicLibraryShortcut({ name: "Unsafe", url: "javascript:alert(1)" })).toBeNull()
    shortcut.removePublicLibraryShortcut()
    expect(shortcut.getPublicLibraryShortcut()).toBeNull()
  })
})
