export const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia',
] as const

export type StateCurriculumResource = {
  state: string
  gradeId: string
  subjectId: string
  url: string
  title: string
  updatedAt: string
}

const storageKey = 'learning-world-os:state-curriculum-resources:v1'
const read = (): StateCurriculumResource[] => { try { const value = JSON.parse(localStorage.getItem(storageKey) ?? '[]'); return Array.isArray(value) ? value as StateCurriculumResource[] : [] } catch { return [] } }
const write = (items: StateCurriculumResource[]) => localStorage.setItem(storageKey, JSON.stringify(items))
const validUrl = (value: string) => /^https?:\/\//i.test(value.trim())

export function stateCurriculumResourceFor(state: string, gradeId: string, subjectId: string) {
  return read().find(item => item.state === state && item.gradeId === gradeId && item.subjectId === subjectId)
}

export function saveStateCurriculumResource(input: Omit<StateCurriculumResource, 'updatedAt'>) {
  const state = input.state.trim(), gradeId = input.gradeId.trim(), subjectId = input.subjectId.trim(), url = input.url.trim(), title = input.title.trim()
  if (!state || !gradeId || !subjectId || !validUrl(url)) return false
  const record: StateCurriculumResource = { state, gradeId, subjectId, url, title: title || 'Official curriculum outline', updatedAt: new Date().toISOString() }
  write([record, ...read().filter(item => !(item.state === state && item.gradeId === gradeId && item.subjectId === subjectId))])
  return true
}

type LookupGrade = { id: string; label: string }
type LookupSubject = { id: string; name: string }

export function renderStateCurriculumLookup(state: string, grade: LookupGrade, subject: LookupSubject) {
  const saved = state ? stateCurriculumResourceFor(state, grade.id, subject.id) : undefined
  const options = [`<option value="">Choose a state or D.C.</option>`, ...usStates.map(item => `<option value="${item}"${item === state ? ' selected' : ''}>${item}</option>`)].join('')
  const destination = saved
    ? `<a class="state-curriculum-link" href="${saved.url}" target="_blank" rel="noreferrer">Open ${saved.title} ↗</a>`
    : `<p class="state-curriculum-empty">No saved official link for this state, grade, and subject yet.</p>`
  return `<section class="state-curriculum-lookup"><div><p class="os-kicker">OPTIONAL STATE RESOURCE LOOKUP</p><h3>Find an official curriculum outline</h3><p>Select a state to connect its official resource to <strong>${grade.label} · ${subject.name}</strong>. This is a shareable reference shelf, not a required alignment layer.</p></div><label>State / D.C.<select id="state-curriculum-select">${options}</select></label>${destination}<details><summary>Add or update this official link</summary><form id="state-curriculum-resource-form"><label>Resource title<input id="state-curriculum-title" maxlength="120" value="${saved?.title ?? ''}" placeholder="Official Grade curriculum outline"></label><label>Official URL<input id="state-curriculum-url" type="url" required value="${saved?.url ?? ''}" placeholder="https://..."></label><button class="os-secondary">Save official resource</button><p id="state-curriculum-error" class="parent-error"></p></form></details></section>`
}

export function renderCurriculumRequirementsGuide() {
  return `<article class="curriculum-requirements-guide"><p class="os-kicker">PARENT + TEACHER GUIDE</p><h2>How curriculum requirements work in the United States</h2><p>There is no federal national registry of required K–12 curriculum. National organizations publish standards frameworks, while states and local education authorities set their own requirements. For home education, requirements are also determined at the state or local level.</p><h3>A practical research path</h3><ol><li>Begin with your state department or board of education for official standards, graduation requirements, assessments, and guidance.</li><li>For home education, confirm the current state law and any notice, record, assessment, or subject requirements.</li><li>Use LearnOS national-framework references to shape a coherent learning path; use this state lookup to save official grade-and-subject outline links.</li><li>Record the source URL and review date. Requirements and links can change.</li></ol><h3>Major starting resources</h3><ul><li><a href="https://www.ed.gov/about/contact-us/faqs/Elementary%20and%20Secondary%20Education" target="_blank" rel="noreferrer">U.S. Department of Education: curriculum and standards FAQ ↗</a></li><li><a href="https://www.ecs.org/50-state-comparison-k-12-governance-2026/" target="_blank" rel="noreferrer">Education Commission of the States: 50-state K–12 governance comparison ↗</a></li><li><a href="https://hslda.org/legal/state" target="_blank" rel="noreferrer">HSLDA: homeschool laws by state ↗</a></li><li><strong>Your state department of education / state board of education:</strong> use the official site for the controlling standards and current notices.</li></ul><p class="guide-disclaimer">This guide is educational, not legal advice. Verify current requirements with the relevant official authority.</p></article>`
}
