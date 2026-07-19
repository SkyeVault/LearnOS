export type MasteryLevel = 'Beginning' | 'Developing' | 'Secure' | 'Extending'

export interface TeachingRecord {
  id: string
  classId: string
  learnerId: string
  date: string
  lesson: string
  skill: string
  mastery: MasteryLevel
  score: number | null
  note: string
  nextStep: string
  createdAt: string
}

export interface TeacherMessage {
  id: string
  classId: string
  learnerIds: string[]
  subject: string
  body: string
  createdAt: string
}

const recordsKey = 'learning-world-os:teaching-records:v1'
const messagesKey = 'learning-world-os:teacher-messages:v1'

function read<T>(key: string): T[] {
  try { const value = JSON.parse(localStorage.getItem(key) ?? '[]'); return Array.isArray(value) ? value as T[] : [] } catch { return [] }
}
function write<T>(key: string, items: T[]) { localStorage.setItem(key, JSON.stringify(items)) }

export const teachingRecords = () => read<TeachingRecord>(recordsKey)
export const recordsForClass = (classId: string) => teachingRecords().filter(record => record.classId === classId)
export const recordsForLearner = (learnerId: string) => teachingRecords().filter(record => record.learnerId === learnerId)
export function addTeachingRecord(input: Omit<TeachingRecord, 'id' | 'createdAt'>) {
  const record: TeachingRecord = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  write(recordsKey, [record, ...teachingRecords()])
  return record
}
export const teacherMessages = () => read<TeacherMessage>(messagesKey)
export const messagesForLearner = (learnerId: string) => teacherMessages().filter(message => message.learnerIds.includes(learnerId))
export function sendTeacherMessage(input: Omit<TeacherMessage, 'id' | 'createdAt'>) {
  const message: TeacherMessage = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  write(messagesKey, [message, ...teacherMessages()])
  return message
}
