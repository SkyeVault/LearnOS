import { getApp, goBack } from '../nav'
import { movementCards, type MovementPractice } from '../content/mindful-movement'
import './mindful-movement.css'

export function renderMindfulMovement() {
  getApp().innerHTML = `<main class="movement-page"><header class="movement-header"><button class="back-btn" id="movement-back">← Back</button><div><p class="os-kicker">GENTLE • AWARE • ADAPTABLE</p><h1>Mindful Movement</h1><p>Explore foundational yoga, tai chi, and qigong through gentle, adaptable movement—not performance or perfection.</p></div></header><section class="movement-safety"><strong>Pause and choose care:</strong> move only in a comfortable range; stop for pain, dizziness, or feeling unwell; use a trusted adult and qualified instructor for new or challenging movement. This is general education, not medical advice.</section><nav class="movement-tabs"><button data-practice="all">All movement</button><button data-practice="Yoga">Yoga</button><button data-practice="Tai Chi">Tai Chi</button><button data-practice="Qigong">Qigong</button></nav><p class="movement-count" id="movement-count"></p><section class="movement-grid" id="movement-grid"></section></main>`
  document.getElementById('movement-back')!.addEventListener('click', goBack)
  document.querySelectorAll<HTMLButtonElement>('[data-practice]').forEach(button => button.addEventListener('click', () => renderCards(button.dataset.practice as MovementPractice | 'all')))
  renderCards('all')
}

function renderCards(practice: MovementPractice | 'all') {
  const cards = practice === 'all' ? movementCards : movementCards.filter(card => card.practice === practice)
  document.getElementById('movement-count')!.textContent = `${cards.length} local movement cards · choose what feels safe and accessible today`
  document.getElementById('movement-grid')!.innerHTML = cards.map(card => `<article class="movement-card"><span class="level">${card.practice} · ${card.level}</span><h2>${card.name}</h2><p>${card.cue}</p><div class="adapt"><strong>Adapt it:</strong> ${card.adaptation}</div></article>`).join('')
}
