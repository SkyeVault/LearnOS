import { escapeHtml } from "../app/html"
import { getApp, goBack } from "../nav"
import { getSourcePolicy, isAllowedSource } from "../app/parent-source-policy"
import { getPublicLibraryShortcut } from "../app/public-library-shortcut"
import { culturalLibrary, type CulturalShelf } from "../content/cultural-library"
import { artifactCareChecklist, getFamilyArtifacts, saveFamilyArtifact } from "../features/family-archive"

type ReadingWish = { id: string; title: string; author: string; note: string }
const wishKey = 'learning-world-os:reading-wishlist:v1'
const wishes = (): ReadingWish[] => { try { return JSON.parse(localStorage.getItem(wishKey) ?? '[]') as ReadingWish[] } catch { return [] } }
const saveWishes = (items: ReadingWish[]) => localStorage.setItem(wishKey, JSON.stringify(items))

const shelves: Array<{ id: CulturalShelf | "archive"; label: string; icon: string; note: string }> = [
  { id: "art", label: "Art Studio", icon: "🎨", note: "Look slowly, compare boldly." },
  { id: "history", label: "History Lab", icon: "🏛️", note: "Read the evidence, not just the story." },
  { id: "science", label: "Nature & Space", icon: "🔭", note: "Observe, model, ask what changes." },
  { id: "community", label: "Community Stories", icon: "🤝", note: "Notice people, place, and belonging." },
  { id: "archive", label: "Family Archive", icon: "📦", note: "Preserve the stories close to home." },
]

const curatedReadingLists = [
  ['Children’s Literature', 'Stories and classics for shared reading.', 'children literature'],
  ['Children’s Book Series', 'Series to keep a reader moving.', 'children book series'],
  ['Children’s Fiction', 'Imaginative stories and adventures.', 'children fiction'],
  ['Myths & Fairy Tales', 'Folklore, wonder tales, and legends.', 'children myths fairy tales'],
  ['Christmas', 'Seasonal family reading.', 'christmas'],
  ['Picture Books', 'Illustrated books for younger readers.', 'children picture books'],
  ['School Stories', 'Books about classrooms, friendships, and school life.', 'school stories'],
  ['Children’s Verse', 'Poems to read aloud and perform.', 'children verse'],
]

const readingSources = [
  { id: "gutenberg", icon: "📖", label: "Free eBooks", provider: "Project Gutenberg", title: "Children & young adult reading shelf", description: "Browse Project Gutenberg’s Children & Young Adult Reading bookshelf for public-domain family reading.", url: "https://www.gutenberg.org/ebooks/bookshelf/636", action: "Browse children’s books" },
  { id: "librivox", icon: "🎧", label: "Free audiobooks", provider: "LibriVox", title: "Stories read by volunteers", description: "Find public-domain audiobooks to listen to together, independently, or alongside the text.", url: "https://librivox.org/search/", action: "Find an audiobook" },
]

function renderReadingGateway() {
  const sourceAccessEnabled = getSourcePolicy().enabled
  const publicLibrary = getPublicLibraryShortcut()
  const cards = readingSources.map(source => {
    const ready = isAllowedSource(source.url)
    const action = ready
      ? `<a href="${source.url}" target="_blank" rel="noreferrer">${source.action} ↗</a>`
      : `<span class="library-source-locked">${sourceAccessEnabled ? "This domain needs parent approval." : "Available when a parent starts a source session."}</span>`
    return `<article class="library-source-card ${ready ? "is-ready" : "is-locked"}"><div class="library-source-icon">${source.icon}</div><div><span>${source.label} · ${source.provider}</span><h3>${source.title}</h3><p>${source.description}</p>${action}</div></article>`
  }).join("")
  const publicLibraryCard = publicLibrary ? `<article class="library-source-card library-public-card"><div class="library-source-icon">🏛️</div><div><span>MY PUBLIC LIBRARY · PARENT-SELECTED</span><h3>${escapeHtml(publicLibrary.name)}</h3><p>Open your family’s local library catalog, events, e-books, or audiobooks.</p><a href="${escapeHtml(publicLibrary.url)}" target="_blank" rel="noreferrer">Visit my library ↗</a></div></article>` : `<article class="library-source-card library-public-card is-locked"><div class="library-source-icon">🏛️</div><div><span>MY PUBLIC LIBRARY</span><h3>Your local library belongs here</h3><p>A parent can add your library’s official link in Admin Corner.</p></div></article>`
  const wishlist = wishes()
  const listCards = `<section class="curated-reading-lists"><div><p class="os-kicker">BROWSE BY SHELF</p><h2>Choose a reading path</h2></div><div>${curatedReadingLists.map(([title, note, query]) => `<article><h3>${title}</h3><p>${note}</p>${sourceAccessEnabled ? `<a href="https://www.gutenberg.org/ebooks/bookshelves/search/?query=${encodeURIComponent(query)}" target="_blank" rel="noreferrer">Open shelf ↗</a>` : '<span>Available when a parent starts a source session.</span>'}</article>`).join('')}</div></section>`
    const wishPanel = `<section class="reading-wishlist"><div><p class="os-kicker">OUR READING WISHLIST</p><h2>What should we read or hear next?</h2></div><form id="reading-wish-form"><input id="wish-title" required maxlength="120" placeholder="Book or audiobook title"><input id="wish-author" maxlength="100" placeholder="Author or narrator"><input id="wish-note" maxlength="180" placeholder="Why save this?"><button class="os-secondary">Save to wishlist</button></form><div class="wish-list">${wishlist.length ? wishlist.map(wish => `<article><strong>${escapeHtml(wish.title)}</strong><span>${escapeHtml(wish.author)}</span><p>${escapeHtml(wish.note)}</p><button class="text-button" data-remove-wish="${wish.id}">Remove</button></article>`).join('') : '<p>No saved titles yet. Add the next book you want to share.</p>'}</div></section>`
  return `<section class="library-gateway"><div class="library-gateway-copy"><p class="os-kicker">READ + LISTEN</p><h2>A free, parent-guided classics shelf</h2><p>Pair a book with an audiobook, pause for a question, then carry the idea into a project, sketch, debate, or family conversation.</p></div><div class="library-source-grid">${cards}${publicLibraryCard}</div></section>${listCards}${wishPanel}`
}

export function renderCulturalLibrary() {
  getApp().innerHTML = `<main class="cultural-page"><header class="cultural-header"><button class="back-btn" id="cultural-back">← Back</button><div><p class="os-kicker">DISCOVER • QUESTION • PRESERVE</p><h1>Living Library</h1><p>Not a feed. A beautifully organized place to encounter art, evidence, nature, stories, and family memory.</p></div><aside class="library-compass"><span>YOUR COMPASS</span><strong>Notice · Question · Connect</strong><small>Choose one source, then make something with it.</small></aside></header>${renderReadingGateway()}<nav class="cultural-shelves" aria-label="Living Library shelves">${shelves.map(shelf => `<button data-shelf="${shelf.id}" aria-pressed="false"><span>${shelf.icon}</span><strong>${shelf.label}</strong><small>${shelf.note}</small></button>`).join("")}</nav><section id="cultural-content" class="cultural-content"></section></main>`
  document.getElementById("cultural-back")!.addEventListener("click", goBack)
  document.querySelectorAll<HTMLButtonElement>("[data-shelf]").forEach(button => button.addEventListener("click", () => renderShelf(button.dataset.shelf as CulturalShelf | "archive")))
  document.getElementById('reading-wish-form')?.addEventListener('submit', event => { event.preventDefault(); const value = (id: string) => (document.getElementById(id) as HTMLInputElement).value.trim(); saveWishes([{ id: crypto.randomUUID(), title: value('wish-title'), author: value('wish-author'), note: value('wish-note') }, ...wishes()]); renderCulturalLibrary() })
  document.querySelectorAll<HTMLButtonElement>('[data-remove-wish]').forEach(button => button.addEventListener('click', () => { saveWishes(wishes().filter(wish => wish.id !== button.dataset.removeWish)); renderCulturalLibrary() }))
  renderShelf("art")
}

function renderShelf(shelf: CulturalShelf | "archive") {
  document.querySelectorAll<HTMLButtonElement>("[data-shelf]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.shelf === shelf)))
  const target = document.getElementById("cultural-content")!
  if (shelf === "archive") { renderArchive(target); return }
  const resources = culturalLibrary.filter(resource => resource.shelf === shelf)
  const shelfMeta = shelves.find(item => item.id === shelf)!
  target.innerHTML = `<div class="library-shelf-heading"><span>${shelfMeta.icon}</span><div><p class="os-kicker">${escapeHtml(shelfMeta.label)}</p><h2>${escapeHtml(shelfMeta.note)}</h2></div></div><div class="cultural-card-grid">${resources.map(resource => `<article class="cultural-card"><header><span>${escapeHtml(resource.provider)}</span><small>${escapeHtml(resource.grades)}</small></header><h2>${escapeHtml(resource.title)}</h2><p>${escapeHtml(resource.description)}</p><div class="library-moves"><strong>Try this:</strong><ul>${resource.learningMoves.map(move => `<li>${escapeHtml(move)}</li>`).join("")}</ul></div><footer><small>${escapeHtml(resource.reuse)}</small><small>Parent-guided source</small></footer></article>`).join("")}</div>`
}

function renderArchive(target: HTMLElement) {
  const artifacts = getFamilyArtifacts()
  target.innerHTML = `<section class="archive-intro"><p class="os-kicker">OUR LOCAL COLLECTION</p><h2>Family Archive</h2><p>A private catalog for the objects and stories your family chooses to preserve.</p><ul>${artifactCareChecklist.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section><form class="archive-form" id="artifact-form"><label>Object title<input id="artifact-title" required maxlength="80" placeholder="Grandma’s recipe card"></label><label>What is it?<input id="artifact-type" required maxlength="60" placeholder="Recipe, photo, letter, tool…"></label><label>Date or era<input id="artifact-date" maxlength="60" placeholder="Around 1975"></label><label>People and places<input id="artifact-people" maxlength="120" placeholder="Who is connected to this?"></label><label>Its story<textarea id="artifact-story" required maxlength="1200" placeholder="What do we know? What do we wonder?"></textarea></label><label>Source / provenance<input id="artifact-source" maxlength="240" placeholder="Family collection; passed down by…"></label><label>Rights<select id="artifact-rights"><option>Family-owned</option><option>Permission granted</option><option>Public domain</option><option>Unknown — do not share</option></select></label><label class="archive-consent"><input id="artifact-consent" type="checkbox"> We have permission to share this record.</label><button class="os-primary">Save local record</button></form><div class="artifact-list">${artifacts.length ? artifacts.map(artifact => `<article><h3>${escapeHtml(artifact.title)}</h3><p>${escapeHtml(artifact.objectType)} · ${escapeHtml(artifact.dateOrEra || "Date unknown")}</p><p>${escapeHtml(artifact.story)}</p><small>${escapeHtml(artifact.rights)}${artifact.consentToShare ? " · sharing permission recorded" : ""}</small></article>`).join("") : "<p>No artifacts yet. Begin with one object that tells a story.</p>"}</div>`
  document.getElementById("artifact-form")!.addEventListener("submit", event => {
    event.preventDefault()
    const value = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value
    saveFamilyArtifact({ title: value("artifact-title"), objectType: value("artifact-type"), dateOrEra: value("artifact-date"), peopleAndPlaces: value("artifact-people"), story: value("artifact-story"), source: value("artifact-source"), rights: value("artifact-rights") as "Family-owned" | "Permission granted" | "Public domain" | "Unknown — do not share", consentToShare: (document.getElementById("artifact-consent") as HTMLInputElement).checked })
    renderArchive(target)
  })
}
