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

describe("parent source policy", () => {
  it("requires enabled access, an approved domain, and an HTTP(S) source", async () => {
    const policy = await import("./parent-source-policy")
    expect(policy.isAllowedSource("https://nasa.gov/learn")).toBe(false)

    policy.setSourceAccess(true)
    expect(policy.isAllowedSource("https://science.nasa.gov/learn")).toBe(true)
    expect(policy.isAllowedSource("https://nasa.gov.attacker.example/learn")).toBe(false)
    expect(policy.isAllowedSource("https://www.gutenberg.org/ebooks")).toBe(true)
    expect(policy.isAllowedSource("https://librivox.org/search/")).toBe(true)
    expect(policy.isAllowedSource("ftp://nasa.gov/learn")).toBe(false)
    expect(policy.isAllowedSource("javascript:alert(1)")).toBe(false)
  })
})
