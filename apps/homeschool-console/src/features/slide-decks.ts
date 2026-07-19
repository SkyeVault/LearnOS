export type SlideTheme = 'midnight' | 'sunrise' | 'garden' | 'paper'
export interface LessonSlide { id: string; eyebrow: string; title: string; body: string; prompt: string }
export interface SlideDeck { id: string; title: string; audience: string; objective: string; theme: SlideTheme; palette?: { background: string; accent: string; text: string }; layout?: "focus" | "split" | "statement"; slides: LessonSlide[]; createdAt: string; updatedAt: string }

const key = 'learning-world-os:slide-decks:v1'
function read(): SlideDeck[] { try { const data = JSON.parse(localStorage.getItem(key) ?? '[]'); return Array.isArray(data) ? data as SlideDeck[] : [] } catch { return [] } }
function write(decks: SlideDeck[]) { localStorage.setItem(key, JSON.stringify(decks)) }
export function slideDecks() { return read() }
export function saveSlideDeck(input: Omit<SlideDeck, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) {
  const now = new Date().toISOString(); const decks = read(); const existing = input.id ? decks.find(deck => deck.id === input.id) : undefined
  const deck: SlideDeck = { ...input, id: existing?.id ?? crypto.randomUUID(), createdAt: existing?.createdAt ?? now, updatedAt: now }
  write([deck, ...decks.filter(item => item.id !== deck.id)])
  return deck
}
export function newSlide(): LessonSlide { return { id: crypto.randomUUID(), eyebrow: 'LOOK CLOSER', title: 'A new idea', body: 'Add a short explanation, story, image description, or evidence here.', prompt: 'What do you notice?' } }
