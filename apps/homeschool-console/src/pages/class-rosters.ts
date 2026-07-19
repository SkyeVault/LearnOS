import { escapeHtml } from '../app/html'
import { getLearners } from '../app/store'
import { getParentControls, getClasses, createClassGroup, removeClassGroup, updateClassGroup } from '../app/parent-controls'
import { getApp, navigate } from '../nav'
import { renderParentDashboard } from './parent-controls'
import './class-rosters.css'

export function renderClassRosters(editingId = '') {
  const controls = getParentControls()
  const teachers = controls.adults.filter(adult => adult.role === 'Teacher')
  const learners = getLearners()
  const classes = getClasses()
  const editing = classes.find(group => group.id === editingId)
  const chosen = new Set(editing?.learnerIds ?? [])
  const teacherOptions = teachers.map(teacher => `<option value="${escapeHtml(teacher.id)}" ${teacher.id === editing?.teacherId ? 'selected' : ''}>${escapeHtml(teacher.name)}</option>`).join('')
  const learnerOptions = learners.map(learner => `<label><input type="checkbox" name="roster-learner" value="${escapeHtml(learner.id)}" ${chosen.has(learner.id) ? 'checked' : ''}><span>${escapeHtml(learner.name)}<small>${escapeHtml(learner.ageBand)}</small></span></label>`).join('') || '<p>Add learner profiles before creating a roster.</p>'
  const classCards = classes.map(group => {
    const teacher = teachers.find(item => item.id === group.teacherId)?.name ?? 'Unassigned teacher'
    const names = group.learnerIds.map(id => learners.find(learner => learner.id === id)?.name).filter(Boolean)
    return `<article><div><p class="os-kicker">${escapeHtml(group.stage)}</p><h2>${escapeHtml(group.name)}</h2><p><strong>${escapeHtml(teacher)}</strong> · ${group.learnerIds.length} learner${group.learnerIds.length === 1 ? '' : 's'}</p><div class="roster-name-chips">${names.map(name => `<span>${escapeHtml(name!)}</span>`).join('') || '<span>No learners enrolled</span>'}</div></div><footer><button class="os-secondary" data-edit-roster="${escapeHtml(group.id)}">Edit roster</button><button class="text-button" data-delete-roster="${escapeHtml(group.id)}">Remove</button></footer></article>`
  }).join('') || '<p class="roster-empty">No classes yet. Use the form to make the first shared learning space.</p>'
  getApp().innerHTML = `<main class="parent-dashboard class-rosters"><header><button class="back-btn" id="rosters-back">← Admin Corner</button><div><p class="os-kicker">PROGRAM PLANNING · 01</p><h1>Classes & rosters</h1><p>Create a class, assign its teacher, and enroll the learners who share that learning time.</p></div><div class="roster-header-count"><strong>${classes.length}</strong><span>active classes</span></div></header><section class="roster-workspace"><section class="roster-builder"><div><p class="os-kicker">${editing ? 'EDIT CLASS' : 'NEW CLASS'}</p><h2>${editing ? `Update ${escapeHtml(editing.name)}` : 'Build a class roster'}</h2><p>Each class has one lead teacher and one or more enrolled learners.</p></div>${teachers.length && learners.length ? `<form id="class-roster-form"><label>Class name<input id="roster-name" required maxlength="70" value="${escapeHtml(editing?.name ?? '')}" placeholder="For example: Grade 4 Science"></label><label>Grade / stage<input id="roster-stage" maxlength="60" value="${escapeHtml(editing?.stage ?? '')}" placeholder="For example: Grade 4 · Semester 1"></label><label>Lead teacher<select id="roster-teacher" required><option value="">Choose a teacher…</option>${teacherOptions}</select></label><fieldset><legend>Enroll learners</legend><div class="roster-learner-picker">${learnerOptions}</div></fieldset><div class="roster-form-actions"><button class="os-primary">${editing ? 'Save class changes' : 'Create class roster'}</button>${editing ? '<button type="button" class="os-secondary" id="cancel-roster-edit">Cancel</button>' : ''}</div><p class="parent-error" id="roster-error"></p></form>` : `<div class="roster-prerequisite"><strong>Start with people.</strong><p>${teachers.length ? 'Add at least one learner profile before creating a class.' : learners.length ? 'Add at least one teacher profile before creating a class.' : 'Add a teacher and a learner profile before creating a class.'}</p><button class="os-secondary" id="open-people-from-rosters">Open People & relationships</button></div>`}</section><section class="roster-directory"><div><p class="os-kicker">ACTIVE ROSTERS</p><h2>Your classes</h2><p>Open a class to adjust enrollment as your program changes.</p></div><div class="roster-class-cards">${classCards}</div></section></section></main>`
  document.getElementById('rosters-back')!.addEventListener('click', () => navigate(renderParentDashboard))
  document.getElementById('cancel-roster-edit')?.addEventListener('click', () => renderClassRosters())
  document.getElementById('open-people-from-rosters')?.addEventListener('click', () => import('./profiles').then(({ renderProfileSettings }) => navigate(renderProfileSettings)))
  document.querySelectorAll<HTMLButtonElement>('[data-edit-roster]').forEach(button => button.addEventListener('click', () => renderClassRosters(button.dataset.editRoster)))
  document.querySelectorAll<HTMLButtonElement>('[data-delete-roster]').forEach(button => button.addEventListener('click', () => { if (removeClassGroup(button.dataset.deleteRoster!)) renderClassRosters() }))
  document.getElementById('class-roster-form')?.addEventListener('submit', event => {
    event.preventDefault()
    const value = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLSelectElement).value.trim()
    const learnerIds = [...document.querySelectorAll<HTMLInputElement>('input[name="roster-learner"]:checked')].map(input => input.value)
    const input = { name: value('roster-name'), stage: value('roster-stage'), teacherId: value('roster-teacher'), learnerIds }
    const saved = editing ? updateClassGroup(editing.id, input) : createClassGroup(input)
    if (saved) renderClassRosters()
    else document.getElementById('roster-error')!.textContent = 'Add a class name, teacher, and at least one learner.'
  })
}
