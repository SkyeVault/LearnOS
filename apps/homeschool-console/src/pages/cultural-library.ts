import { escapeHtml } from "../app/html"
import { getApp, goBack, navigate } from "../nav"
import { renderEarlyLearningHub } from "./early-learning/hub"
import { getSourcePolicy, isAllowedSource } from "../app/parent-source-policy"
import { getPublicLibraryShortcut } from "../app/public-library-shortcut"
import { culturalLibrary, type CulturalShelf } from "../content/cultural-library"
import { explorationModuleSubjects, hobbyModuleSubjects, k12Grades, k12ModuleSubjects, moduleIdFor, unitBlueprintFor, type K12Grade } from "../content/k12-module-library"
import { artifactCareChecklist, getFamilyArtifacts, saveFamilyArtifact } from "../features/family-archive"
import { renderCurriculumRequirementsGuide, renderStateCurriculumLookup, saveStateCurriculumResource } from "../features/state-curriculum-resources"

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
  getApp().innerHTML = `<main class="cultural-page"><header class="cultural-header"><button class="back-btn" id="cultural-back">← Back</button><div><p class="os-kicker">DISCOVER • QUESTION • PRESERVE</p><h1>Living Library</h1><p>Not a feed. A beautifully organized place to encounter art, evidence, nature, stories, and family memory.</p></div><aside class="library-compass"><div class="library-compass-mark" aria-hidden="true">⌖</div><div><span>DISCOVER THE LIBRARY</span><strong>Find a path, shelf, book, or resource</strong></div><form id="library-site-search" role="search"><label class="sr-only" for="library-search-input">Search Living Library</label><input id="library-search-input" type="search" autocomplete="off" placeholder="Search the library"><div id="library-search-results" aria-live="polite"></div></form></aside></header>${renderReadingGateway()}<nav class="cultural-shelves" aria-label="Living Library shelves">${shelves.map(shelf => `<button data-shelf="${shelf.id}" aria-pressed="false"><span>${shelf.icon}</span><strong>${shelf.label}</strong><small>${shelf.note}</small></button>`).join("")}</nav>${renderModuleLibrary()}<section id="cultural-content" class="cultural-content"></section></main>`
  document.getElementById("cultural-back")!.addEventListener("click", goBack)
  wireModuleLibrary()
  wireLivingLibrarySearch()
  document.querySelector(".cultural-page")!.insertAdjacentHTML("beforeend", renderCurriculumRequirementsGuide())
  placeStateLookup()
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
  placeStateLookup()
}

function placeStateLookup() {
  const page = document.querySelector<HTMLElement>(".cultural-page")
  const lookup = page?.querySelector<HTMLElement>(".module-library-showcase .state-curriculum-lookup")
  if (!page || !lookup) return
  page.querySelector(":scope > .state-curriculum-lookup")?.remove()
  page.append(lookup)
}

function renderModuleLibrary(grade: K12Grade = 'kindergarten', selectedSubjectId = 'language-arts', state = '') {
  const selectedGrade = k12Grades.find(item => item.id === grade) ?? k12Grades[0]!
  const selected = k12ModuleSubjects.find(item => item.id === selectedSubjectId) ?? k12ModuleSubjects[0]!
  const stateLookup = renderStateCurriculumLookup(state, selectedGrade, selected)
  const sourceLink = selected.frameworkUrl && isAllowedSource(selected.frameworkUrl)
    ? `<a class="module-path-link" href="${selected.frameworkUrl}" target="_blank" rel="noreferrer">Open approved framework path ↗</a>`
    : `<span class="module-path-locked">${selected.frameworkUrl ? (getSourcePolicy().enabled ? 'Framework link needs parent approval.' : 'Framework links open in a parent-guided source session.') : 'This family-directed pathway has no external framework link.'}</span>`
  const categoryFor = (subjectId: string) => hobbyModuleSubjects.some(subject => subject.id === subjectId) ? "hobbies" : explorationModuleSubjects.some(subject => subject.id === subjectId) ? "world" : "core"
  const semester = (number: 1 | 2) => {
    const units = unitBlueprintFor(selectedGrade.id, selected, number)
    const roadmap = units.map(unit => "<li><strong>" + escapeHtml(unit.title) + "</strong><small>" + escapeHtml(unit.lessonFocus) + "</small></li>").join("")
    return "<article class=\"semester-path\"><span>SEMESTER " + number + "</span><h3>" + escapeHtml(selected.semesters[number - 1]) + "</h3><code>" + escapeHtml(moduleIdFor(selectedGrade.id, selected.id, number)) + "</code><p>Build-ready blueprint: 4 units · 12 lessons · evidence and teacher-review checkpoints.</p><details class=\"unit-blueprint\"><summary>Open unit roadmap</summary><ol>" + roadmap + "</ol></details></article>"
  }
  return `<section class="module-library-showcase" id="module-library" aria-label="K–12 module library"><header><div><p class="os-kicker">K–12 MODULE LIBRARY · BUILD WEEK RELEASES</p><h2>Find your next learning path</h2><p>Explore every grade, subject, and semester pathway. Modules are being authored and released through the end of OpenAI Build Week; a template becomes ready only after review.</p></div><aside class="module-library-actions"><button type="button" class="module-docs-button" id="open-library-module-instructions">Module instructions</button><button type="button" class="module-catalog-toggle" id="toggle-module-catalog" aria-expanded="false">Show all ${k12ModuleSubjects.length} pathways</button><strong>${k12Grades.length * k12ModuleSubjects.length * 2}</strong><span>semester pathways</span><small>Local index · no sign-in needed</small></aside></header><section class="library-module-instructions" id="library-module-instructions" hidden><div><p class="os-kicker">MODULE INSTRUCTIONS</p><h3>Build, install, or customize any module</h3><ol><li><strong>Build:</strong> add an ID, learner-facing description, goals, units, lessons, activities, evidence, and success criteria.</li><li><strong>Install:</strong> import a reviewed <code>module.json</code> or <code>manifest.json</code>; modules never run downloaded code.</li><li><strong>Customize:</strong> connect standards, approved materials, pacing, learner evidence, and teacher review.</li><li><strong>Assign:</strong> assign it to a learner in Module Creator. Unassigning changes a path without deleting a package.</li></ol></div></section>${stateLookup}<section class="pre-k-library-card"><div><p class="os-kicker">BUILT-IN EARLY LEARNING</p><h3>🌱 Pre-K Learning World</h3><p>The original play-based Early Learning software is always available. Return here whenever a learner needs Pre-K again.</p></div><button type="button" class="module-pre-k-button" id="open-pre-k-learning">Open Pre-K Learning World</button></section><nav class="module-category-tabs" aria-label="Module collections"><button type="button" data-module-category-filter="core" aria-pressed="true">Core learning</button><button type="button" data-module-category-filter="hobbies" aria-pressed="false">Hobbies &amp; making</button><button type="button" data-module-category-filter="world" aria-pressed="false">World &amp; society</button></nav><div class="module-grade-picker" role="group" aria-label="Choose a grade">${k12Grades.map(item => `<button type="button" data-module-grade="${item.id}" aria-pressed="${item.id === selectedGrade.id}"><span>${item.shortLabel}</span><small>${item.label}</small></button>`).join('')}</div><div class="module-library-body"><nav class="module-subject-grid" aria-label="Choose a subject" data-catalog-expanded="false" data-catalog-category="core">${k12ModuleSubjects.map(subject => `<button type="button" data-module-subject="${subject.id}" data-module-category="${categoryFor(subject.id)}" aria-pressed="${subject.id === selected.id}" style="--subject-color:${subject.color}"><span>${subject.icon}</span><strong>${escapeHtml(subject.name)}</strong><small>${escapeHtml(subject.framework)}</small></button>`).join('')}</nav><article class="module-detail-card" style="--subject-color:${selected.color}"><div class="module-detail-heading"><span>${selected.icon}</span><div><p class="os-kicker">${escapeHtml(selectedGrade.label)} · ${escapeHtml(selected.framework)}</p><h3>${escapeHtml(selected.name)}</h3></div></div><p>${escapeHtml(selected.summary)}</p><div class="semester-paths">${semester(1)}${semester(2)}</div><footer>${sourceLink}<span>For everyone: browse locally. For a parent-guided session: approve a source domain first.</span></footer></article></div></section>`
}

function wireModuleLibrary() {
  const root = document.getElementById('module-library')
  if (!root) return
  const refresh = (grade: K12Grade, subject: string, state = "") => {
    root.outerHTML = renderModuleLibrary(grade, subject, state)
    wireModuleLibrary()
  }
  root.querySelector<HTMLButtonElement>("#open-library-module-instructions")?.addEventListener("click", () => { const guide = root.querySelector<HTMLElement>("#library-module-instructions")!; guide.hidden = !guide.hidden })
  root.querySelector<HTMLButtonElement>("#toggle-module-catalog")?.addEventListener("click", () => { const grid = root.querySelector<HTMLElement>(".module-subject-grid")!; const button = root.querySelector<HTMLButtonElement>("#toggle-module-catalog")!; const expanded = grid.dataset.catalogExpanded !== "true"; grid.dataset.catalogExpanded = String(expanded); button.setAttribute("aria-expanded", String(expanded)); button.textContent = expanded ? "Show featured pathways" : `Show all ${k12ModuleSubjects.length} pathways` })
  root.querySelectorAll<HTMLButtonElement>("[data-module-category-filter]").forEach(button => button.addEventListener("click", () => { const category = button.dataset.moduleCategoryFilter!; const grid = root.querySelector<HTMLElement>(".module-subject-grid")!; grid.dataset.catalogCategory = category; grid.dataset.catalogExpanded = "true"; root.querySelectorAll<HTMLButtonElement>("[data-module-category-filter]").forEach(item => item.setAttribute("aria-pressed", String(item === button))); const toggle = root.querySelector<HTMLButtonElement>("#toggle-module-catalog")!; const label = category === "hobbies" ? "Hobbies & making" : category === "world" ? "World & society" : "core learning"; toggle.textContent = `Showing all ${label}`; toggle.setAttribute("aria-expanded", "true") }))
  root.querySelector<HTMLButtonElement>("#open-pre-k-learning")?.addEventListener("click", () => navigate(renderEarlyLearningHub))
  const currentGrade = (root.querySelector<HTMLButtonElement>('[data-module-grade][aria-pressed="true"]')?.dataset.moduleGrade ?? 'kindergarten') as K12Grade
  const currentSubject = root.querySelector<HTMLButtonElement>('[data-module-subject][aria-pressed="true"]')?.dataset.moduleSubject ?? 'language-arts'
  const currentState = root.querySelector<HTMLSelectElement>('#state-curriculum-select')?.value ?? ''
  root.querySelectorAll<HTMLButtonElement>('[data-module-grade]').forEach(button => button.addEventListener('click', () => refresh(button.dataset.moduleGrade as K12Grade, currentSubject, currentState)))
  root.querySelectorAll<HTMLButtonElement>("[data-module-subject]").forEach(button => button.addEventListener("click", () => refresh(currentGrade, button.dataset.moduleSubject!, currentState)))
  root.querySelector<HTMLSelectElement>("#state-curriculum-select")?.addEventListener("change", event => refresh(currentGrade, currentSubject, (event.target as HTMLSelectElement).value))
  root.querySelector<HTMLFormElement>("#state-curriculum-resource-form")?.addEventListener("submit", event => {
    event.preventDefault()
    const value = (id: string) => (root.querySelector(id) as HTMLInputElement).value
    const saved = saveStateCurriculumResource({ state: currentState, gradeId: currentGrade, subjectId: currentSubject, title: value("#state-curriculum-title"), url: value("#state-curriculum-url") })
    if (saved) refresh(currentGrade, currentSubject, currentState)
    else (root.querySelector("#state-curriculum-error") as HTMLElement).textContent = "Choose a state and enter a complete http:// or https:// URL."
  })
}

function wireLivingLibrarySearch() {
  const input = document.getElementById('library-search-input') as HTMLInputElement | null
  const results = document.getElementById('library-search-results')
  if (!input || !results) return
  const entries = [
    ...k12ModuleSubjects.map(subject => ({ kind: 'module' as const, id: subject.id, label: `${subject.name} module path`, note: subject.summary })),
    ...shelves.map(shelf => ({ kind: 'shelf' as const, id: shelf.id, label: shelf.label, note: shelf.note })),
    ...curatedReadingLists.map(([title, note]) => ({ kind: 'reading' as const, id: title, label: title, note })),
    ...culturalLibrary.map(resource => ({ kind: 'resource' as const, id: resource.shelf, label: resource.title, note: resource.description })),
  ]
  const show = () => {
    const query = input.value.trim().toLowerCase()
    if (query.length < 2) { results.innerHTML = ''; return }
    const matches = entries.filter(item => `${item.label} ${item.note}`.toLowerCase().includes(query)).slice(0, 7)
    results.innerHTML = matches.length
      ? `<div class="library-search-list">${matches.map(item => `<button type="button" data-library-result-kind="${item.kind}" data-library-result-id="${escapeHtml(item.id)}"><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.note)}</small></button>`).join('')}</div>`
      : '<p class="library-search-empty">No library match yet. Try a subject, topic, or book type.</p>'
  }
  input.addEventListener('input', show)
  results.addEventListener('click', event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-library-result-kind]')
    if (!button) return
    const kind = button.dataset.libraryResultKind, id = button.dataset.libraryResultId!
    if (kind === 'module') document.querySelector<HTMLButtonElement>(`[data-module-subject="${id}"]`)?.click()
    else if (kind === 'shelf' || kind === 'resource') document.querySelector<HTMLButtonElement>(`[data-shelf="${id}"]`)?.click()
    else document.querySelector('.library-gateway')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    input.value = ''; results.innerHTML = ''
  })
}
