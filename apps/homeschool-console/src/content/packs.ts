export interface ContentQuestion {
  id: string
  prompt: string
  choices: string[]
  answer: string
  explanation: string
}

export interface ContentPack {
  id: string
  title: string
  subject: 'Science' | 'History'
  ageBand: string
  version: 1
  questions: ContentQuestion[]
}

// These records are shipped with the app. New Codex-assisted drafts must be
// reviewed and validated before they are added here.
export const contentPacks: ContentPack[] = [
  {
    id: 'science-solar-system-1', title: 'Our Solar System', subject: 'Science', ageBand: 'Ages 6–9', version: 1,
    questions: [
      { id: 'sun', prompt: 'What is at the center of our solar system?', choices: ['The Moon', 'The Sun', 'Earth'], answer: 'The Sun', explanation: 'The Sun is the star at the center of our solar system.' },
      { id: 'planet', prompt: 'Which planet do we live on?', choices: ['Mars', 'Earth', 'Jupiter'], answer: 'Earth', explanation: 'Earth is our home planet.' },
    ],
  },
  {
    id: 'history-communities-1', title: 'Communities Through Time', subject: 'History', ageBand: 'Ages 6–9', version: 1,
    questions: [
      { id: 'artifact', prompt: 'What can an old object tell us?', choices: ['Only its color', 'How people lived', 'Nothing at all'], answer: 'How people lived', explanation: 'Objects from the past can teach us about people and their lives.' },
    ],
  },
]
