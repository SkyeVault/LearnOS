import { beforeEach, describe, expect, it } from 'vitest'
import { moduleProgressSummary, raiseModuleHand, reviewModuleLesson, setLessonState, submitModuleEvidence, teacherModuleAttentionQueue } from './module-learning'

class MemoryStorage { private values = new Map<string, string>(); getItem(key: string) { return this.values.get(key) ?? null }; setItem(key: string, value: string) { this.values.set(key, value) } }
beforeEach(() => Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: new MemoryStorage() }))

describe('module learning scaffold', () => {
  it('separates evidence submission, review, mastery, and completion', () => {
    setLessonState('learner-1', 'grade-01-language-arts-semester-01', 'u01-l01', 'in-progress')
    submitModuleEvidence('learner-1', 'grade-01-language-arts-semester-01', 'u01-l01', { kind: 'written-response', note: 'My evidence' })
    expect(moduleProgressSummary('learner-1', 'grade-01-language-arts-semester-01', ['u01-l01'])).toMatchObject({ readyForReview: 1, complete: 0 })
    reviewModuleLesson('learner-1', 'grade-01-language-arts-semester-01', 'u01-l01', { state: 'complete', mastery: 'secure', feedback: 'Clear work.' })
    expect(moduleProgressSummary('learner-1', 'grade-01-language-arts-semester-01', ['u01-l01'])).toMatchObject({ complete: 1, percentComplete: 100 })
  })
  it('puts raised hands and submitted work in the teacher attention queue', () => {
    raiseModuleHand('learner-1', 'grade-01-language-arts-semester-01', 'u01-l02', 'understanding', 'I need an example.')
    submitModuleEvidence('learner-2', 'grade-01-language-arts-semester-01', 'u01-l01', { kind: 'photo', note: 'My page' })
    expect(teacherModuleAttentionQueue().map(item => item.kind).sort()).toEqual(['help-request', 'review'])
  })
})
