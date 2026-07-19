import { escapeHtml } from "../app/html"
import { getApp, goBack } from "../nav"
import { farmFieldNotes, farmQuests } from "../content/homesteader-paradise"
import { gardenPlantProfiles, gardenPlantTypes, type GardenPlantType } from "../content/garden-catalog"
import "./homesteader-paradise.css"

interface GardenJournal {
  id: string
  plantName: string
  plantType: GardenPlantType
  variety: string
  location: string
  observation: string
  nextStep: string
  at: string
}

const journalKey = "learning-world-os:garden-journal:v2"

function journal(): GardenJournal[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(journalKey) ?? "[]")
    return Array.isArray(saved) ? saved.filter((item): item is GardenJournal => Boolean(item) && typeof item === "object" && typeof (item as GardenJournal).id === "string" && typeof (item as GardenJournal).plantName === "string" && typeof (item as GardenJournal).plantType === "string" && typeof (item as GardenJournal).observation === "string" && typeof (item as GardenJournal).at === "string") : []
  } catch { return [] }
}

export function renderHomesteaderParadise() {
  renderGarden("All", "all")
}

function renderGarden(type: GardenPlantType | "All", season: string) {
  const profiles = type === "All" ? gardenPlantProfiles : gardenPlantProfiles.filter(profile => profile.type === type)
  const available = season === "all" ? farmQuests : farmQuests.filter(quest => quest.season === season || quest.season === "Any season")
  const quest = available[Math.floor(Math.random() * available.length)]!
  const records = journal().slice(0, 6)
  const profileOptions = profiles.map(profile => '<option value="' + escapeHtml(profile.id) + '">' + escapeHtml(profile.type) + " · " + escapeHtml(profile.name) + "</option>").join("")
  const typeButtons = gardenPlantTypes.map(item => '<button data-garden-type="' + item + '"' + (item === type ? ' aria-pressed="true"' : "") + ">" + (item === "All" ? "All plants" : item + "s") + "</button>").join("")

  getApp().innerHTML = '<main class="homestead-page"><header class="farm-header"><button class="back-btn" id="farm-back">← Back</button><div><p class="os-kicker">GROW • OBSERVE • TEND • SHARE</p><h1>Gardening</h1><p>A local flower, vegetable, and herb journal for growing knowledge one observation at a time.</p></div></header><nav class="farm-tabs garden-type-tabs">' + typeButtons + '</nav><section class="farm-layout"><article class="farm-card"><span class="season-tag">' + escapeHtml(quest.season.toUpperCase()) + " · " + escapeHtml(quest.age) + '</span><h2>' + escapeHtml(quest.title) + '</h2><p class="farm-mission">' + escapeHtml(quest.mission) + '</p><div class="farm-learn"><strong>Learn:</strong> ' + escapeHtml(quest.learn) + '</div><div class="farm-safety"><strong>Safe growing:</strong> ' + escapeHtml(quest.safety) + '</div><button class="lab-action" id="farm-next">New local quest ✦</button></article><aside class="farm-notes"><h2>Garden know-how</h2>' + farmFieldNotes.map(([title, note]) => "<article><h3>" + escapeHtml(title) + "</h3><p>" + escapeHtml(note) + "</p></article>").join("") + '</aside></section><section class="garden-catalog farm-card"><div><p class="os-kicker">FLOWERS · VEGETABLES · HERBS</p><h2>Plant guide</h2><p>Use this as a starting point, then adapt to your local weather, seed packet, and growing space.</p></div><div class="garden-profile-grid">' + profiles.map(profile => '<article><span>' + escapeHtml(profile.type) + '</span><h3>' + escapeHtml(profile.name) + '</h3><dl><dt>Start</dt><dd>' + escapeHtml(profile.start) + '</dd><dt>Light</dt><dd>' + escapeHtml(profile.light) + '</dd><dt>Water</dt><dd>' + escapeHtml(profile.water) + '</dd><dt>Grow</dt><dd>' + escapeHtml(profile.grow) + '</dd><dt>Bloom / harvest</dt><dd>' + escapeHtml(profile.harvestOrBloom) + '</dd></dl><small>' + escapeHtml(profile.note) + '</small></article>').join("") + '</div></section><section class="farm-journal farm-card"><div><p class="os-kicker">YOUR LIVING GARDEN JOURNAL</p><h2>Collect what your plants teach you</h2><p>Keep plant details, observations, questions, and next steps on this device.</p></div><form id="garden-journal-form" class="garden-journal-form"><label>Plant<select id="garden-profile">' + profileOptions + '</select></label><label>Variety or seed source <small>optional</small><input id="garden-variety" maxlength="80" placeholder="For example: cherry tomato"></label><label>Growing location<input id="garden-location" required maxlength="120" placeholder="For example: sunny patio pot"></label><label>Observation<textarea id="garden-observation" required maxlength="900" placeholder="Leaves, soil, weather, blooms, pests, growth, or a question…"></textarea></label><label>Next care step<textarea id="garden-next-step" required maxlength="500" placeholder="For example: water tomorrow morning and check for new leaves"></textarea></label><button class="os-primary">Save garden entry</button><p class="parent-error" id="garden-journal-error"></p></form><div class="garden-journal-entries">' + (records.length ? records.map(record => '<article class="farm-journal-entry"><span>' + escapeHtml(record.plantType) + '</span><strong>' + escapeHtml(record.plantName) + (record.variety ? " · " + escapeHtml(record.variety) : "") + '</strong><small>' + escapeHtml(record.location) + " · " + new Date(record.at).toLocaleDateString() + '</small><p>' + escapeHtml(record.observation) + '</p>' + (record.nextStep ? "<em>Next: " + escapeHtml(record.nextStep) + "</em>" : "") + "</article>").join("") : '<p class="lab-note">Your first plant observation will appear here.</p>') + '</div></section></main>'

  document.getElementById("farm-back")!.addEventListener("click", goBack)
  document.querySelectorAll<HTMLButtonElement>("[data-garden-type]").forEach(button => button.addEventListener("click", () => renderGarden(button.dataset.gardenType as GardenPlantType | "All", season)))
  document.getElementById("farm-next")!.addEventListener("click", () => renderGarden(type, season === "all" ? "all" : season))
  document.getElementById("garden-journal-form")!.addEventListener("submit", event => {
    event.preventDefault()
    const selected = gardenPlantProfiles.find(profile => profile.id === (document.getElementById("garden-profile") as HTMLSelectElement).value)
    const location = (document.getElementById("garden-location") as HTMLInputElement).value.trim()
    const observation = (document.getElementById("garden-observation") as HTMLTextAreaElement).value.trim()
    if (!selected || !location || !observation) {
      document.getElementById("garden-journal-error")!.textContent = "Choose a plant, growing location, and observation."
      return
    }
    const entry: GardenJournal = { id: crypto.randomUUID(), plantName: selected.name, plantType: selected.type, variety: (document.getElementById("garden-variety") as HTMLInputElement).value.trim().slice(0, 80), location: location.slice(0, 120), observation: observation.slice(0, 900), nextStep: (document.getElementById("garden-next-step") as HTMLTextAreaElement).value.trim().slice(0, 500), at: new Date().toISOString() }
    localStorage.setItem(journalKey, JSON.stringify([entry, ...journal()]))
    renderGarden(type, season)
  })
}
