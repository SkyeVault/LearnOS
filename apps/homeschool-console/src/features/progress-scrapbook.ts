export interface ScrapbookEntry {
  id: string
  learnerId: string
  subject: string
  title: string
  reflection: string
  imageDataUrl?: string
  createdAt: string
}

const key = 'learning-world-os:progress-scrapbook:v1'
function read(): ScrapbookEntry[] { try { return JSON.parse(localStorage.getItem(key) ?? '[]') as ScrapbookEntry[] } catch { return [] } }
function write(entries: ScrapbookEntry[]) { localStorage.setItem(key, JSON.stringify(entries)) }
export function scrapbookFor(learnerId: string) { return read().filter(entry => entry.learnerId === learnerId) }
export function saveScrapbookEntry(entry: Omit<ScrapbookEntry, 'id' | 'createdAt'>) { write([{ ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...read()]) }
export function removeScrapbookEntry(id: string, learnerId: string) { write(read().filter(entry => entry.id !== id || entry.learnerId !== learnerId)) }
export function readImageFile(file?: File) { return new Promise<string | undefined>((resolve, reject) => { if (!file) return resolve(undefined); if (!file.type.startsWith('image/')) return reject(new Error('Choose an image file.')); if (file.size > 1_500_000) return reject(new Error('Choose an image smaller than 1.5 MB.')); const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('The image could not be read.')); reader.readAsDataURL(file) }) }
