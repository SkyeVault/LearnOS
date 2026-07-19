import { navigate, goBack, getApp } from "../../nav"
import { getSettings } from "../../app/store"
import { renderProfilePicker } from "../profiles"
import { renderTyping } from "./typing"
import { renderABC } from "./abc"
import { renderAnimals } from "./animals"
import { renderWords } from "./words"
import { renderBubbles } from "./bubbles"
import { renderShapes } from "./shapes"
import { renderCounting } from "./counting"
import { renderNumberHunt } from "./number-hunt"
import { renderDoodle } from "./doodle"
import { renderMusic } from "./music"

interface Activity { emoji: string; label: string; color: string; bg: string; handler: () => void }

const activities: Activity[] = [
  { emoji: "⌨️", label: "Typing Play", color: "#E03131", bg: "#FFF5F5", handler: () => navigate(renderTyping) },
  { emoji: "🔤", label: "ABC Explorer", color: "#9C36B5", bg: "#F8F0FC", handler: () => navigate(renderABC) },
  { emoji: "🐾", label: "Animals", color: "#2F9E44", bg: "#EBFBEE", handler: () => navigate(renderAnimals) },
  { emoji: "🔡", label: "Word Builder", color: "#5C7CFA", bg: "#EDF2FF", handler: () => navigate(renderWords) },
  { emoji: "🫧", label: "Bubble Pop", color: "#1C7ED6", bg: "#E7F5FF", handler: () => navigate(renderBubbles) },
  { emoji: "⭐", label: "Shape Game", color: "#F59F00", bg: "#FFF3BF", handler: () => navigate(renderShapes) },
  { emoji: "🔢", label: "Count Along", color: "#4C6EF5", bg: "#EDF2FF", handler: () => navigate(renderCounting) },
  { emoji: "🎯", label: "Number Hunt", color: "#E67700", bg: "#FFF4E6", handler: () => navigate(renderNumberHunt) },
  { emoji: "✏️", label: "Doodle Pad", color: "#20C997", bg: "#E6FCF5", handler: () => navigate(renderDoodle) },
  { emoji: "🎵", label: "Music Buttons", color: "#E64980", bg: "#FFF0F6", handler: () => navigate(renderMusic) },
]

export function renderEarlyLearningHub() {
  const toddlerLockEnabled = getSettings()?.toddlerLockEnabled ?? false
  const cards = activities.map((activity, index) => `<button class="el-activity-card" style="--ac:${activity.color};--abg:${activity.bg};--ad:${(index * .07).toFixed(3)}s" data-idx="${index}"><span class="el-activity-emoji">${activity.emoji}</span><span class="el-activity-label">${activity.label}</span></button>`).join("")
  getApp().innerHTML = `<div class="page el-hub-page"><header class="el-hub-header"><button class="back-btn" id="el-back">${toddlerLockEnabled ? "🔒 Grown-ups" : "← Back"}</button><div class="el-hub-title">⭐ Early Learning ⭐</div><div class="el-hub-sub">Ages 1 – 3 · Pick an activity!</div>${toddlerLockEnabled ? "<span class=\"toddler-lock-badge\">Toddler Lock on</span>" : ""}</header><div class="el-activities-grid">${cards}</div></div>`
  document.getElementById("el-back")!.addEventListener("click", () => toddlerLockEnabled ? renderToddlerExitGate() : goBack())
  document.querySelectorAll<HTMLButtonElement>(".el-activity-card").forEach(button => button.addEventListener("click", () => activities[Number(button.dataset.idx)]!.handler()))
}

function renderToddlerExitGate() {
  getApp().innerHTML = `<main class="toddler-gate"><section class="toddler-gate-card"><span class="toddler-gate-icon">🔒</span><p class="os-kicker">TODDLER LOCK IS ON</p><h1>Grown-ups only</h1><p>Early Learning stays open for play. A parent or guardian signs in with their own account to leave this area.</p><button class="os-primary" id="toddler-switch-user">Switch user</button><button class="text-button" id="toddler-keep-playing">← Keep playing</button></section></main>`
  document.getElementById("toddler-keep-playing")!.addEventListener("click", renderEarlyLearningHub)
  document.getElementById("toddler-switch-user")!.addEventListener("click", renderProfilePicker)
}
