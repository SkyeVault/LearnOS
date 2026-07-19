import { escapeHtml } from "../app/html"
import { getApp, goBack } from "../nav"
import { commonsMissions, type CommonsMission, type CommonsPillar } from "../content/learning-commons"
import { getLearningEvidence, saveLearningEvidence } from "../features/learning-journal"
import { recentHumanityReflections, saveHumanityReflection, type HumanityPracticeKind } from "../features/humanity-growth"
import "./learning-commons.css"

const pillars: Array<{ id: CommonsPillar; icon: string; promise: string }> = [
  { id: "Think", icon: "💡", promise: "Question, compare, and make a reasoned choice." },
  { id: "Make", icon: "🛠️", promise: "Build, repair, design, and revise." },
  { id: "Move", icon: "🌿", promise: "Notice what bodies and places need." },
  { id: "Care", icon: "🫶", promise: "Practice responsibility and compassion." },
  { id: "Belong", icon: "🏡", promise: "Connect family stories to community." },
]

export function renderLearningCommons() {
  const evidence = getLearningEvidence()
  const explored = new Set(evidence.map(item => item.pillar)).size
  getApp().innerHTML = `<main class="learning-commons"><header class="commons-header"><button class="back-btn" id="commons-back">← Back</button><div><p class="os-kicker">REAL LIFE · REAL WORK · REAL REFLECTION</p><h1>Learning Commons</h1><p>Choose a meaningful mission, do it in the real world, and build evidence of the person you are becoming.</p></div><aside class="commons-progress"><strong>${evidence.length}</strong><span>evidence cards</span><small>${explored}/5 pillars explored</small></aside></header><section class="commons-purpose"><div><p class="os-kicker">YOUR PRACTICE LOOP</p><h2>Notice a need. Take action. Reflect. Try again.</h2></div><ol><li><strong>Choose</strong> a mission that matters today.</li><li><strong>Do</strong> it with care and adult support when needed.</li><li><strong>Capture</strong> one piece of evidence in your own words.</li></ol></section><section class="pillar-map">${pillars.map(pillar => { const count = evidence.filter(item => item.pillar === pillar.id).length; return `<button data-pillar="${pillar.id}"><span>${pillar.icon}</span><strong>${pillar.id}</strong><small>${pillar.promise}</small><b>${count} saved</b></button>` }).join("")}</section><section class="commons-layout" id="commons-content"></section><section class="humanity-growth" id="humanity-growth"></section></main>`
  document.getElementById("commons-back")!.addEventListener("click", goBack)
  document.querySelectorAll<HTMLButtonElement>("[data-pillar]").forEach(button => button.addEventListener("click", () => renderMission(button.dataset.pillar as CommonsPillar)))
  renderMission("Think")
  renderHumanityStudio()
}

function renderMission(pillar: CommonsPillar) {
  const choices = commonsMissions.filter(mission => mission.pillar === pillar)
  const mission = choices[Math.floor(Math.random() * choices.length)]!
  document.querySelectorAll<HTMLButtonElement>("[data-pillar]").forEach(button => button.classList.toggle("is-active", button.dataset.pillar === pillar))
  renderMissionCard(mission)
}

function renderMissionCard(mission: CommonsMission) {
  const target = document.getElementById("commons-content")!
  const evidence = getLearningEvidence().slice(0, 5)
  const nextMoves = ["Set up: gather what you need and name a safe boundary.", mission.mission, "Pause: ask what changed, surprised you, or still needs work.", mission.evidence]
  target.innerHTML = `<article class="mission-card"><span class="pillar">${mission.pillar.toUpperCase()} · ${mission.ages}</span><h2>${mission.title}</h2><p class="mission-copy">${mission.mission}</p><div class="mission-why"><strong>Why this matters:</strong> ${mission.why}</div><section class="mission-arc"><p class="os-kicker">MISSION ARC</p><ol>${nextMoves.map((move, index) => `<li><span>${index + 1}</span>${move}</li>`).join("")}</ol></section><button class="lab-action" id="new-mission">Another ${mission.pillar} mission ✦</button></article><aside class="evidence-card"><div><p class="os-kicker">LEARNING EVIDENCE</p><h3>What changed because of your effort?</h3><p>Record a choice, a question, a revision, an observation, or a kind action. This is not a score.</p></div><textarea id="evidence-note" maxlength="900" placeholder="I noticed… I tried… I changed… I would…"></textarea><button class="os-primary" id="save-evidence">Save evidence card</button><p id="evidence-status" class="commons-status"></p><div class="evidence-list">${evidence.length ? evidence.map(item => `<article><span>${escapeHtml(item.pillar)}</span><strong>${escapeHtml(item.missionTitle)}</strong><p>${escapeHtml(item.note)}</p><small>${new Date(item.createdAt).toLocaleDateString()}</small></article>`).join("") : "<p class=\"lab-note\">Your learning evidence will appear here. Start small; honest noticing counts.</p>"}</div></aside>`
  document.getElementById("new-mission")!.addEventListener("click", () => renderMission(mission.pillar))
  document.getElementById("save-evidence")!.addEventListener("click", () => {
    const note = (document.getElementById("evidence-note") as HTMLTextAreaElement).value.trim()
    if (!note) { document.getElementById("evidence-status")!.textContent = "Write one thought before saving."; return }
    saveLearningEvidence({ missionId: mission.id, missionTitle: mission.title, pillar: mission.pillar, note })
    renderMissionCard(mission)
  })
}

const emotionChoices = [
  { id: "calm", icon: "🌤️", label: "Calm" },
  { id: "energized", icon: "⚡", label: "Energized" },
  { id: "proud", icon: "🌱", label: "Proud" },
  { id: "sad", icon: "🌧️", label: "Sad" },
  { id: "worried", icon: "🌫️", label: "Worried" },
  { id: "frustrated", icon: "🌋", label: "Frustrated" },
  { id: "mixed", icon: "🌀", label: "Mixed up" },
]

const empathyScenarios = [
  "Someone new is standing alone while others already have a game going.",
  "A friend made a mistake in front of other people and looks embarrassed.",
  "Someone says no to an activity you hoped they would do with you.",
  "A family member seems quiet after a hard day.",
  "Two people need the same shared space at the same time.",
]

const regulationChoices = [
  "Take a slow breath and notice five things around you.",
  "Ask for water, a snack, rest, movement, or a quieter space.",
  "Name the feeling without calling yourself bad for having it.",
  "Tell a trusted adult that you need help with a big feeling.",
]

function renderHumanityStudio() {
  const target = document.getElementById("humanity-growth")
  if (!target) return
  const reflections = recentHumanityReflections()
  const scenario = empathyScenarios[Math.floor(Math.random() * empathyScenarios.length)]!
  const reflectionsHtml = reflections.length
    ? reflections.map(reflection => "<article><span>" + escapeHtml(reflection.kind) + " · " + escapeHtml(reflection.feeling) + "</span><strong>" + escapeHtml(reflection.prompt) + "</strong><p>" + escapeHtml(reflection.note) + "</p><small>" + new Date(reflection.createdAt).toLocaleDateString() + "</small></article>").join("")
    : "<p class=\"humanity-empty\">Your reflections stay on this device. Start with one honest sentence; there is no score.</p>"

  target.innerHTML = "<div class=\"humanity-heading\"><div><p class=\"os-kicker\">HUMANITY GROWTH STUDIO</p><h2>Feel it. Understand it. Choose what helps.</h2><p>Emotional intelligence is practice, not performance. Notice your own experience, make room for someone else’s, and take a kind next step.</p></div><aside><strong>Local and unscored</strong><span>Feelings are information, not grades.</span></aside></div><div class=\"humanity-grid\"><article class=\"emotion-card\"><p class=\"os-kicker\">1 · NAME YOUR WEATHER</p><h3>What is here right now?</h3><p>You can have more than one feeling. Pick the closest word; you can change it later.</p><div class=\"emotion-choice-grid\">" + emotionChoices.map(choice => "<button type=\"button\" data-feeling=\"" + choice.id + "\"><span>" + choice.icon + "</span>" + choice.label + "</button>").join("") + "</div><div class=\"regulation-card\"><strong>If a feeling is big, try one gentle reset:</strong><ul>" + regulationChoices.map(choice => "<li>" + choice + "</li>").join("") + "</ul></div></article><article class=\"empathy-card\"><p class=\"os-kicker\">2 · PRACTICE PERSPECTIVE</p><h3>Empathy is not mind-reading.</h3><p>We observe, imagine carefully, ask when we can, and respect the answer.</p><div class=\"empathy-scenario\"><span>TRY THIS</span><strong>" + scenario + "</strong></div><ol class=\"empathy-steps\"><li><b>Notice</b> What facts do you actually see or hear?</li><li><b>Wonder</b> What might this be like for them? What do you not know?</li><li><b>Offer</b> What kind action or respectful question could help?</li></ol><div class=\"humanity-skill-row\"><span>Listen without fixing</span><span>Ask before helping</span><span>Respect boundaries</span></div></article><article class=\"repair-card\"><p class=\"os-kicker\">3 · REPAIR & BELONGING</p><h3>Humanity grows in the next choice.</h3><p>Try a clear repair: name what happened, take responsibility for your part, ask what could help, and follow through.</p><blockquote>“I see that this affected you. I am sorry for my part. What would help now?”</blockquote><small>Safety comes first. For a feeling that seems too big, unsafe, or hard to carry alone, tell a trusted adult.</small></article></div><form class=\"humanity-reflection-form\" id=\"humanity-reflection-form\"><div><p class=\"os-kicker\">SAVE A PRACTICE</p><h3>What did you notice or choose?</h3><p>Use your own words. Keep private details out if you plan to share this device.</p></div><div class=\"humanity-kind-picker\"><button type=\"button\" data-humanity-kind=\"check-in\" aria-pressed=\"true\">Check in</button><button type=\"button\" data-humanity-kind=\"empathy\">Practice empathy</button><button type=\"button\" data-humanity-kind=\"repair\">Practice repair</button></div><textarea id=\"humanity-note\" maxlength=\"900\" placeholder=\"I noticed… I wonder… A kind next step could be…\"></textarea><button class=\"os-primary\">Save local reflection</button><p class=\"commons-status\" id=\"humanity-status\"></p></form><section class=\"humanity-reflection-list\"><div><p class=\"os-kicker\">YOUR RECENT PRACTICE</p><h3>Small honest reflections count</h3></div><div>" + reflectionsHtml + "</div></section>"

  let feeling = ""
  let kind: HumanityPracticeKind = "check-in"
  document.querySelectorAll<HTMLButtonElement>("[data-feeling]").forEach(button => button.addEventListener("click", () => {
    feeling = button.dataset.feeling ?? ""
    document.querySelectorAll<HTMLButtonElement>("[data-feeling]").forEach(choice => choice.classList.toggle("is-selected", choice === button))
  }))
  document.querySelectorAll<HTMLButtonElement>("[data-humanity-kind]").forEach(button => button.addEventListener("click", () => {
    kind = button.dataset.humanityKind as HumanityPracticeKind
    document.querySelectorAll<HTMLButtonElement>("[data-humanity-kind]").forEach(choice => choice.setAttribute("aria-pressed", String(choice === button)))
  }))
  document.getElementById("humanity-reflection-form")!.addEventListener("submit", event => {
    event.preventDefault()
    const prompts: Record<HumanityPracticeKind, string> = {
      "check-in": "Name it without judging it.",
      empathy: scenario,
      repair: "What is one kind, clear next step?",
    }
    const note = (document.getElementById("humanity-note") as HTMLTextAreaElement).value
    const saved = saveHumanityReflection({ kind, feeling, prompt: prompts[kind], note })
    if (saved) renderHumanityStudio()
    else document.getElementById("humanity-status")!.textContent = "Choose an emotional weather word and write one thought before saving."
  })
}
