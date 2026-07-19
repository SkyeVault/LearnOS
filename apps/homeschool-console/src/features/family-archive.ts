export interface FamilyArtifact {
  id: string
  title: string
  objectType: string
  dateOrEra: string
  peopleAndPlaces: string
  story: string
  source: string
  rights: 'Family-owned' | 'Permission granted' | 'Public domain' | 'Unknown — do not share'
  consentToShare: boolean
  createdAt: string
}

const key = 'learning-world-os:family-archive:v1'

export function getFamilyArtifacts(): FamilyArtifact[] {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') as FamilyArtifact[] } catch { return [] }
}

export function saveFamilyArtifact(artifact: Omit<FamilyArtifact, 'id' | 'createdAt'>) {
  const record: FamilyArtifact = { ...artifact, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  localStorage.setItem(key, JSON.stringify([record, ...getFamilyArtifacts()]))
  return record
}

export const artifactCareChecklist = [
  'Ask an adult before moving, opening, cleaning, or photographing an object.',
  'Use clean, dry hands; do not use tape, glue, or markers on an artifact.',
  'Record what is known and label guesses as guesses.',
  'Get consent before recording another person’s story, face, or private information.',
  'Keep originals safe: the digital record is a companion, not a replacement.',
]
