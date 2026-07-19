import { navigate, getApp, resetNavigation } from '../nav'
import { renderEarlyLearningHub } from './early-learning/hub'
import { renderBeginnerCoding } from './beginner-coding'
import { renderMusicHub } from './music/hub'
import { renderMath } from './math'
import { renderReading } from './reading'
import { renderGeography } from './geography'
import { renderScience } from './science'
import { renderHistory } from './history'
import { renderLanguageArts } from './language-arts'
import { renderArt } from './art'
import { renderPhysicalEducation } from './physical-education'
import { renderEngineering } from './engineering'
import { renderCulturalLibrary } from './cultural-library'
import { renderHomesteadLab } from './homestead-lab'
import { renderLearningCommons } from './learning-commons'
import { renderLearningRecord } from './learning-record'
import { renderHomesteaderParadise } from './homesteader-paradise'
import { renderAssignments } from './assignments'
import { renderMindfulMovement } from './mindful-movement'
import { renderSpirit } from './spirit'
import { renderProfilePicker } from './profiles'
import { getActiveLearner } from '../app/store'
import { learnerCanAccess } from '../app/parent-controls'
import { modulesForLearner } from '../features/modules'
import { applyTheme, getHomeStyle } from '../app/themes'
import { clearSignedInUser } from '../app/session'
import { renderLearnerHomeSettings } from './theme-studio'
import { renderCreatorStudio } from './creator-studio-v2'

interface Subject { name: string; emoji: string; color: string; bg: string; handler?: () => void }

const subjects: Subject[] = [
  { name: 'Early Learning', emoji: '⭐', color: '#F59F00', bg: '#FFF3BF', handler: () => navigate(renderEarlyLearningHub) },
  { name: 'Music', emoji: '🎵', color: '#7950F2', bg: '#F3F0FF', handler: () => navigate(renderMusicHub) },
  { name: 'Beginner Coding', emoji: '🐢', color: '#0CA678', bg: '#DCFCE7', handler: () => navigate(renderBeginnerCoding) },
  { name: 'Mathematics', emoji: '🔢', color: '#4C6EF5', bg: '#EDF2FF', handler: () => navigate(renderMath) },
  { name: 'Reading', emoji: '📚', color: '#E03131', bg: '#FFF5F5', handler: () => navigate(renderReading) },
  { name: 'Science', emoji: '🔬', color: '#1C7ED6', bg: '#E7F5FF', handler: () => navigate(renderScience) },
  { name: 'History', emoji: '🏺', color: '#C2410C', bg: '#FEF3C7', handler: () => navigate(renderHistory) },
  { name: 'Geography', emoji: '🌍', color: '#2F9E44', bg: '#EBFBEE', handler: () => navigate(renderGeography) },
  { name: 'Language Arts', emoji: '📝', color: '#E64980', bg: '#FFF0F6', handler: () => navigate(renderLanguageArts) },
  { name: 'Art & Creativity', emoji: '🎨', color: '#9C36B5', bg: '#F8F0FC', handler: () => navigate(renderArt) },
  { name: 'Physical Education', emoji: '⚽', color: '#1971C2', bg: '#DBEAFE', handler: () => navigate(renderPhysicalEducation) },
  { name: 'Engineering', emoji: '🔧', color: '#E67700', bg: '#FFF4E6', handler: () => navigate(renderEngineering) },
  { name: 'Living Library', emoji: '⌂', color: '#7048E8', bg: '#F3F0FF', handler: () => navigate(renderCulturalLibrary) },
  { name: 'Homestead Lab', emoji: '⌁', color: '#0CA678', bg: '#E6FCF5', handler: () => navigate(renderHomesteadLab) },
  { name: 'Learning Commons', emoji: '◈', color: '#1971C2', bg: '#E7F5FF', handler: () => navigate(renderLearningCommons) },
  { name: 'My Learning Record', emoji: '▤', color: '#5F3DC4', bg: '#F3F0FF', handler: () => navigate(renderLearningRecord) },
  { name: 'Gardening', emoji: '✽', color: '#2F9E44', bg: '#EBFBEE', handler: () => navigate(renderHomesteaderParadise) },
  { name: 'Assignments', emoji: '◇', color: '#D9480F', bg: '#FFF4E6', handler: () => navigate(renderAssignments) },
  { name: 'Mindful Movement', emoji: '◌', color: '#7048E8', bg: '#F3F0FF', handler: () => navigate(renderMindfulMovement) },
  { name: 'Spirit', emoji: '✦', color: '#7B2CBF', bg: '#F3E8FF', handler: () => navigate(renderSpirit) },
]

const shapeColors = ['#FF6B6B', '#FFD43B', '#51CF66', '#74C0FC', '#DA77F2', '#F783AC', '#FF922B', '#63E6BE']
const icons = ['✦', '•', '✧', '✽', '◇', '◌', '✦', '•']

export function renderHome() {
  const learner = getActiveLearner()
  applyTheme(learner?.id ?? 'parent')
  const titleLetters = 'LearnOS'.split('').map((char, index) => `<span style="color:#4c61d3;--letter-delay:${(index * .12).toFixed(2)}s">${char}</span>`).join('')
  const floatingShapes = Array.from({ length: 15 }, (_, index) => {
    const x = (Math.random() * 92).toFixed(1), y = (Math.random() * 92).toFixed(1), color = shapeColors[index % shapeColors.length]
    if (Math.random() > .38) return `<div class="shape circle" style="width:30px;height:30px;left:${x}%;top:${y}%;background:${color};--duration:6s;--delay:0s;"></div>`
    return `<div class="shape star" style="left:${x}%;top:${y}%;color:${color};--size:22px;--duration:6s;--delay:0s;">${icons[index % icons.length]}</div>`
  }).join('')
  const enabledSubjects = new Set([...modulesForLearner(learner?.id).flatMap(module => module.subjectNames), 'Assignments', 'My Learning Record'])
  const cardHtml = subjects.filter(subject => enabledSubjects.has(subject.name) && learnerCanAccess(learner?.id, subject.name)).map((subject, index) => `
    <div class="subject-card" style="--card-color:${subject.color};--card-bg:${subject.bg};--card-delay:${(index * .055).toFixed(3)}s" data-subject="${subject.name}">
      <span class="subject-emoji">${subject.emoji}</span><span class="subject-name">${subject.name}</span>
    </div>`).join('')

  const homeStyle = getHomeStyle(learner?.id ?? 'default')
  getApp().innerHTML = `<div class="page classic-learning-home" data-home-style="${homeStyle}"><div class="bg-shapes">${floatingShapes}</div><header class="header"><div class="home-tools"><button class="back-btn" id="switch-learner">Exit</button></div><div class="home-settings-tools"><button class="back-btn" id="open-living-library">Living Library</button><button class="back-btn" id="open-design-center">Design Center</button><button class="back-btn" id="open-learner-settings">Theme & home</button></div><div class="title-name">${titleLetters}</div><div class="title-sub">0.26</div><div class="subtitle">What do you want to learn today?</div></header><div class="subjects-grid">${cardHtml}</div></div>`
  document.getElementById('switch-learner')!.addEventListener('click', () => { clearSignedInUser(); resetNavigation(renderProfilePicker) })
  document.getElementById('open-living-library')!.addEventListener('click', () => navigate(renderCulturalLibrary))
  document.getElementById('open-design-center')!.addEventListener('click', () => navigate(renderCreatorStudio))
  document.getElementById('open-learner-settings')!.addEventListener('click', () => navigate(renderLearnerHomeSettings))
  document.querySelectorAll<HTMLDivElement>('.subject-card').forEach(card => card.addEventListener('click', () => subjects.find(subject => subject.name === card.dataset.subject)?.handler?.()))
}
