import { escapeHtml } from "../app/html"
import { getActiveLearner } from "../app/store"
import { getApp, goBack } from "../nav"
import { isAllowedSource } from "../app/parent-source-policy"
import { getSpiritContent, getSpiritReflection, saveSpiritReflection, spiritReflectionCount, type SpiritContent } from "../features/spirit-content"

function renderItem(item: SpiritContent) {
  const tradition = item.tradition ? `<span class="spirit-tradition">${escapeHtml(item.tradition)}</span>` : ""
  const question = item.guidingQuestion ? `<div class="spirit-question"><span>GUIDING QUESTION</span><p>${escapeHtml(item.guidingQuestion)}</p></div>` : ""
  const source = item.sourceUrl && isAllowedSource(item.sourceUrl)
    ? `<a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noreferrer">Open parent-approved source ↗</a>`
    : item.sourceUrl
      ? "<small>This source is available only during a parent-guided research session.</small>"
      : ""
  const savedReflection = getSpiritReflection(item.id)

  return `<article class="spirit-card">${tradition}<h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.description)}</p>${question}${source}<details class="spirit-reflection" ${savedReflection ? "open" : ""}><summary>My local reflection</summary><p>What do you notice, wonder, or want to ask a trusted adult?</p><textarea data-spirit-reflection="${escapeHtml(item.id)}" maxlength="1200" placeholder="Write or dictate your thinking…">${savedReflection ? escapeHtml(savedReflection.note) : ""}</textarea><button class="os-secondary" type="button" data-save-spirit-reflection="${escapeHtml(item.id)}">Save reflection</button><small data-spirit-reflection-status="${escapeHtml(item.id)}">${savedReflection ? "Saved on this device." : "Only this learner can see this reflection."}</small></details></article>`
}

export function renderSpirit() {
  const learner = getActiveLearner()
  const familyContent = getSpiritContent("family", learner?.id)
  const researchContent = getSpiritContent("research", learner?.id)
  const reflectionCount = spiritReflectionCount()

  getApp().innerHTML = `<main class="spirit-page"><header class="spirit-header"><button class="back-btn" id="spirit-back">← Back</button><div><p class="os-kicker">REFLECT • WONDER • RESPECT</p><h1>Spirit</h1><p>A parent-guided learning studio for family beliefs, spiritual practices, and respectful inquiry into the world’s religions.</p></div><aside class="spirit-progress"><strong>${reflectionCount}</strong><span>local reflection${reflectionCount === 1 ? "" : "s"}</span></aside></header><section class="spirit-note"><strong>Learn with care:</strong> every tradition contains diverse beliefs and lived experiences. Ask thoughtful questions, avoid stereotypes, and bring questions to a trusted adult.</section><section class="spirit-learning-path"><span>YOUR LEARNING PATH</span><ol><li>Read or explore a parent-selected topic.</li><li>Follow the guiding question.</li><li>Save a reflection in your own words.</li></ol></section><section class="spirit-section"><div><p class="os-kicker">FAMILY SHELF</p><h2>Our spiritual learning</h2><p>Only content your parent assigned to you appears here.</p></div><div class="spirit-grid">${familyContent.length ? familyContent.map(renderItem).join("") : "<p class=\"spirit-empty\">Your parent has not assigned family content to you yet. Ask what they would like to share here.</p>"}</div></section><section class="spirit-section spirit-research"><div><p class="os-kicker">PARENT-GUIDED RESEARCH</p><h2>World religions research studio</h2><p>Build understanding from the questions and sources your parent or guardian selected for you.</p></div><div class="spirit-grid">${researchContent.length ? researchContent.map(renderItem).join("") : "<p class=\"spirit-empty\">Research topics will appear here when a parent assigns them in Admin Corner.</p>"}</div></section></main>`
  document.getElementById("spirit-back")!.addEventListener("click", goBack)
  document.querySelectorAll<HTMLButtonElement>("[data-save-spirit-reflection]").forEach(button => button.addEventListener("click", () => {
    const contentId = button.dataset.saveSpiritReflection!
    const input = Array.from(document.querySelectorAll<HTMLTextAreaElement>("[data-spirit-reflection]")).find(textarea => textarea.dataset.spiritReflection === contentId)
    const status = Array.from(document.querySelectorAll<HTMLElement>("[data-spirit-reflection-status]")).find(element => element.dataset.spiritReflectionStatus === contentId)
    if (input && saveSpiritReflection(contentId, input.value)) {
      if (status) status.textContent = "Saved on this device."
    } else if (status) {
      status.textContent = "Write a reflection before saving."
    }
  }))
}
