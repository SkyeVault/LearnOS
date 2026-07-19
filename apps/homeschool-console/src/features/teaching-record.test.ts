import { beforeEach, describe, expect, it, vi } from 'vitest'

class MemoryStorage {
  private values = new Map<string, string>()
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, String(value)) }
}
import { addTeachingRecord, recordsForClass, sendTeacherMessage, teacherMessages } from './teaching-record'

describe('teaching record', () => {
  beforeEach(() => { Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: new MemoryStorage() }); vi.resetModules() })

  it('keeps evidence scoped to its class', () => {
    addTeachingRecord({ classId: 'science', learnerId: 'avery', date: '2026-07-18', lesson: 'Seeds', skill: 'SCI.2.4', mastery: 'Secure', score: 90, note: 'Clear explanation', nextStep: 'Apply it outdoors' })
    addTeachingRecord({ classId: 'art', learnerId: 'avery', date: '2026-07-18', lesson: 'Color', skill: 'ART.1.1', mastery: 'Developing', score: null, note: 'Careful mixing', nextStep: '' })
    expect(recordsForClass('science')).toHaveLength(1)
    expect(recordsForClass('science')[0]?.skill).toBe('SCI.2.4')
  })

  it('stores a class message with its intended audience', () => {
    sendTeacherMessage({ classId: 'science', learnerIds: ['avery', 'rowan'], subject: 'Tomorrow’s materials', body: 'Bring a leaf.' })
    expect(teacherMessages()).toHaveLength(1)
    expect(teacherMessages()[0]?.learnerIds).toEqual(['avery', 'rowan'])
  })
})
