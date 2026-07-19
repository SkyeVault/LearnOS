import { getApp, goBack } from '../nav'
import { getActiveLearner } from '../app/store'
import { activeAssignments, assignmentStats, completeAssignment } from '../features/assignments-store'
import './assignments.css'

export function renderAssignments() {
  const learner = getActiveLearner()
  if (!learner) { goBack(); return }
  const stats = assignmentStats(learner.id)
  const assignments = activeAssignments()
  getApp().innerHTML = `<main class="assignments-page"><header class="assign-header"><button class="back-btn" id="assign-back">← Back</button><div><p class="os-kicker">MY GOALS • MY EFFORT • MY REWARDS</p><h1>${learner.avatar} ${learner.name}’s Assignments</h1><p>Complete a mission with care, then mark it done and collect its points.</p></div></header><section class="reward-board"><article><strong>${stats.points}</strong><span>reward points earned</span></article><article><strong>${stats.completed} / ${stats.total}</strong><span>missions completed</span></article><article><strong>${stats.available}</strong><span>points still waiting</span></article></section>${assignments.length ? `<section class="assignment-list">${assignments.map(assignment => `<article class="assignment-card ${assignment.completedAt ? 'done' : ''}"><span class="point-badge">✦ ${assignment.points} points</span><h2>${assignment.title}</h2><p>${assignment.description}</p>${assignment.completedAt ? '<strong>✅ Mission complete</strong>' : `<button class="lab-action" data-complete="${assignment.id}">I completed this ✦</button>`}</article>`).join('')}</section>` : '<section class="assign-empty"><h2>Your mission board is clear.</h2><p>A parent, guardian, or teacher can add a goal from Admin Corner. Meanwhile, choose something meaningful from Homestead Lab or Learning Commons.</p></section>'}</main>`
  document.getElementById('assign-back')!.addEventListener('click', goBack)
  document.querySelectorAll<HTMLButtonElement>('[data-complete]').forEach(button => button.addEventListener('click', () => { completeAssignment(button.dataset.complete!); renderAssignments() }))
}
