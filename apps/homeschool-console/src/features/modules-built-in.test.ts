import { beforeEach, describe, expect, it } from 'vitest'
import { installedModules, preKLearningWorld, removeModule } from './modules'

class MemoryStorage { private values = new Map<string, string>(); getItem(key: string) { return this.values.get(key) ?? null }; setItem(key: string, value: string) { this.values.set(key, value) } }
beforeEach(() => Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: new MemoryStorage() }))

describe('built-in Pre-K module', () => {
  it('is present in every release and cannot be removed', () => {
    expect(installedModules().find(module => module.id === preKLearningWorld.id)).toMatchObject({ builtIn: true })
    expect(removeModule(preKLearningWorld.id)).toBe(false)
    expect(installedModules().some(module => module.id === preKLearningWorld.id)).toBe(true)
  })
})
