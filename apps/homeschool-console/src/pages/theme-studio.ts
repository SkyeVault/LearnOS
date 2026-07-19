import { getApp, goBack } from '../nav'
import { getTheme, getHomeStyle, setHomeStyle, setTheme } from '../app/themes'
import { getActiveLearner } from '../app/store'
import { renderHome } from './home'

const parentThemes: [string, string, string][] = [['classic', 'Light Desk', 'A clear, paper-like planning workspace.'], ['dark', 'Dark Desk', 'A calm, low-light adult workspace.']]
export function renderThemeStudio() {
  getApp().innerHTML = `<main class="parent-dashboard"><header><button class="back-btn" id="theme-back">← Admin Corner</button><div><p class="os-kicker">PARENT APPEARANCE</p><h1>Choose your desk</h1><p>Learners choose their own themes in their personal settings. This changes only the adult workspace.</p></div></header><section class="parent-grid"><article class="parent-panel parent-learning-plan"><div class="theme-packs">${parentThemes.map(([id, name, detail]) => `<button class="theme-pack ${getTheme('parent') === id ? 'selected' : ''}" data-theme="${id}"><strong>${name}</strong><small>${detail}</small></button>`).join('')}</div></article></section></main>`
  document.getElementById('theme-back')!.addEventListener('click', goBack)
  document.querySelectorAll<HTMLButtonElement>('[data-theme]').forEach(button => button.addEventListener('click', () => { setTheme('parent', button.dataset.theme as any); renderThemeStudio() }))
}

const learnerThemes: [string, string, string][] = [['classic', 'Classic', 'The familiar learning board.'], ['sports', 'Sports', 'A bold red and white workspace.'], ['unicorn', 'Unicorn Sky', 'A soft, imaginative color palette.'], ['rose', 'Pink Studio', 'A warm, bright personal space.']]
const preview = (id: string) => `<span class="theme-preview preview-${id}"><i></i><i></i><i></i></span>`

export function renderLearnerHomeSettings() {
  const learner = getActiveLearner()
  if (!learner) { renderHome(); return }
  const theme = getTheme(learner.id)
  const style = getHomeStyle(learner.id)
  getApp().innerHTML = `<main class="learner-settings"><header><button class="back-btn" id="learner-settings-back">← Learning home</button><div><p class="os-kicker">${learner.name.toUpperCase()}’S SPACE</p><h1>Theme & home screen</h1><p>Choose a space that feels comfortable to return to. Changes apply immediately and stay with your profile.</p></div></header><section class="learner-settings-hero"><div><span class="settings-avatar">${learner.avatar}</span><div><strong>${learner.name}’s learning space</strong><small>Theme: ${learnerThemes.find(item => item[0] === theme)?.[1] ?? 'Classic'} · Home: ${style === 'classic' ? 'Classic' : 'Quiet'}</small></div></div><button class="os-primary" id="settings-done">Done</button></section><section class="learner-settings-grid"><article class="theme-library"><div class="settings-section-heading"><div><p class="os-kicker">APPEARANCE</p><h2>Choose a theme</h2></div><span>Tap to apply</span></div><div class="learner-theme-grid">${learnerThemes.map(([id, name, detail]) => `<button class="learner-theme-card ${theme === id ? 'selected' : ''}" data-learner-theme="${id}" aria-pressed="${theme === id}">${preview(id)}<span class="theme-card-copy"><strong>${name}</strong><small>${detail}</small></span><span class="theme-check">${theme === id ? 'Selected' : 'Apply'}</span></button>`).join('')}</div></article><article class="home-style-card"><div class="settings-section-heading"><div><p class="os-kicker">LAYOUT</p><h2>Home screen style</h2></div></div><p>Choose how much movement you want around your learning spaces.</p><div class="home-style-options"><button class="${style === 'classic' ? 'selected' : ''}" data-home-style="classic"><span class="home-style-preview classic-preview"><i></i><i></i><i></i></span><span><strong>Classic</strong><small>Color, characters, and gentle movement.</small></span><b>${style === 'classic' ? 'Selected' : 'Choose'}</b></button><button class="${style === 'quiet' ? 'selected' : ''}" data-home-style="quiet"><span class="home-style-preview quiet-preview"><i></i><i></i><i></i></span><span><strong>Quiet</strong><small>The same spaces with fewer moving details.</small></span><b>${style === 'quiet' ? 'Selected' : 'Choose'}</b></button></div></article></section></main>`
  document.getElementById('learner-settings-back')!.addEventListener('click', renderHome)
  document.getElementById('settings-done')!.addEventListener('click', renderHome)
  document.querySelectorAll<HTMLButtonElement>('[data-learner-theme]').forEach(button => button.addEventListener('click', () => { setTheme(learner.id, button.dataset.learnerTheme as any); renderLearnerHomeSettings() }))
  document.querySelectorAll<HTMLButtonElement>('[data-home-style]').forEach(button => button.addEventListener('click', () => { setHomeStyle(learner.id, button.dataset.homeStyle as 'classic' | 'quiet'); renderLearnerHomeSettings() }))
}
