import { escapeHtml } from '../app/html'
import { getParentControls, subjectTabs } from '../app/parent-controls'
import { installedModules, modulesForLearner } from '../features/modules'
import { teachingRecords } from '../features/teaching-record'

export function renderLearnerModules(learnerId: string) {
  const assigned = new Set(modulesForLearner(learnerId).map(module => module.id))
  return `<section class="learner-team"><p class="os-kicker">LEARNING MODULES</p><h3>Modules for this learner</h3><p>Choose the installed learning worlds that appear in this learner’s home space.</p><form id="learner-module-access"><div class="adult-assignment-list">${installedModules().map(module => `<label><input type="checkbox" value="${escapeHtml(module.id)}" ${assigned.has(module.id) ? 'checked' : ''} ${module.core ? 'disabled' : ''}><span><strong>${escapeHtml(module.name)}</strong><small>${escapeHtml(module.subjectNames.join(' · '))}${module.core ? ' · Core' : ''}</small></span></label>`).join('')}</div><button class="os-secondary">Save modules</button></form></section>`
}

export function renderLearnerProgressMaterial(learnerId: string) {
  const allowed = new Set(getParentControls().allowedSubjectsByLearner[learnerId] ?? subjectTabs)
  const records = teachingRecords().filter(record => record.learnerId === learnerId)
  const evidence = records.slice(0, 3).map(record => `<div class="progress-material-row"><strong>${escapeHtml(record.lesson)}</strong><small>${escapeHtml(record.skill)} · ${escapeHtml(record.mastery)} · ${escapeHtml(record.date)}</small></div>`).join('') || '<p>No assessed material has been recorded yet.</p>'
  return `<section class="learner-team"><p class="os-kicker">PROGRESS MATERIAL</p><h3>Learning spaces & evidence</h3><p>${records.length} teaching record${records.length === 1 ? '' : 's'} saved. Control which learning spaces and materials appear for this learner.</p><form id="learner-material-access"><div class="class-student-list">${subjectTabs.map(subject => `<label><input type="checkbox" value="${escapeHtml(subject)}" ${allowed.has(subject) ? 'checked' : ''}> <span>${escapeHtml(subject)}</span></label>`).join('')}</div><button class="os-secondary">Save material access</button></form>${evidence}</section>`
}
