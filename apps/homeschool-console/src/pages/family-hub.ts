import { getApp, goBack, navigate } from "../nav"
import { escapeHtml } from "../app/html"
import { getSignedInUser } from "../app/session"
import { renderCreatorStudio } from "./creator-studio-v2"
import { addCalendarEntry, calendarForCurrentUser, personalCalendarForCurrentUser, type CalendarEntry } from "../features/calendar-store"

type CalendarView = "system" | "personal"
type Range = "month" | "week" | "agenda"
const day = (value: Date | string) => { const date = new Date(value); const pad = (number: number) => String(number).padStart(2, "0"); return [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join("-") }

function eventCard(entry: CalendarEntry) {
  const scope = entry.scope === "class" ? "Class" : entry.scope === "personal" ? "Personal" : "Hub"
  return `<article class="calendar-entry"><time>${new Date(entry.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</time><div><span>${scope}</span><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.detail || "No additional details.")}</p></div></article>`
}

function monthGrid(entries: CalendarEntry[], month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = new Date(first); start.setDate(1 - first.getDay())
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start); date.setDate(start.getDate() + index)
    const items = entries.filter(entry => day(entry.date) === day(date))
    return `<article class="calendar-day ${date.getMonth() === month.getMonth() ? "" : "outside"} ${day(date) === day(new Date()) ? "today" : ""}"><strong>${date.getDate()}</strong>${items.map(item => `<button type="button" title="${escapeHtml(item.detail)}">${escapeHtml(item.title)}</button>`).join("")}</article>`
  }).join("")
  return `<section class="calendar-grid"><div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>${cells}</section>`
}

export function renderFamilyHub(view: CalendarView = "system", range: Range = "month", month = new Date()) {
  const user = getSignedInUser()
  const entries = view === "personal" ? personalCalendarForCurrentUser() : calendarForCurrentUser()
  const now = new Date(); const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7)
  const visible = range === "week" ? entries.filter(entry => new Date(entry.date) >= now && new Date(entry.date) < weekEnd) : range === "agenda" ? entries : entries.filter(entry => new Date(entry.date).getMonth() === month.getMonth() && new Date(entry.date).getFullYear() === month.getFullYear())
  const canCreateHub = user?.role === "Admin" || user?.role === "Teacher" || user?.role === "Parent" || user?.role === "Guardian"
  getApp().innerHTML = `<main class="parent-dashboard family-hub"><header><button class="back-btn" id="hub-back">← Back</button><div><p class="os-kicker">CALENDAR HUB</p><h1>${view === "system" ? "Shared calendar" : "My personal calendar"}</h1><p>Class lessons, shared dates, and your own planning time in one local calendar.</p></div><div class="parent-actions"><button class="os-primary" id="open-design-center">Design Center</button></div></header><nav class="calendar-toolbar"><button data-calendar-view="system" ${view === "system" ? "aria-current=\"page\"" : ""}>System hub</button><button data-calendar-view="personal" ${view === "personal" ? "aria-current=\"page\"" : ""}>My calendar</button><span></span><button data-calendar-range="month">Month</button><button data-calendar-range="week">Next 7 days</button><button data-calendar-range="agenda">Agenda</button>${range === "month" ? `<button id="previous-month">←</button><strong>${month.toLocaleString(undefined, { month: "long", year: "numeric" })}</strong><button id="next-month">→</button>` : ""}</nav><section class="parent-grid"><article class="parent-panel parent-learning-plan">${range === "month" ? monthGrid(entries, month) : `<div class="calendar-list">${visible.length ? visible.map(eventCard).join("") : "<p>No calendar items in this view.</p>"}</div>`}</article>${canCreateHub ? `<article class="parent-panel"><p class="os-kicker">ADD A DATE</p><h2>Create a calendar entry</h2><form id="calendar-form"><label>Calendar<select id="calendar-scope"><option value="personal">My personal calendar</option><option value="system">Shared system hub</option></select></label><label>Date & time<input id="calendar-date" type="datetime-local" required></label><label>Title<input id="calendar-title" required maxlength="90" placeholder="Library visit"></label><label>Details<textarea id="calendar-detail" maxlength="800" placeholder="What should people know?"></textarea></label><button class="os-primary">Save event</button><p class="parent-error" id="calendar-error"></p></form><p><small>Teacher lesson plans automatically appear as class events in the system hub.</small></p></article>` : ""}</section></main>`
  document.getElementById("hub-back")!.addEventListener("click", goBack)
  document.getElementById("open-design-center")!.addEventListener("click", () => navigate(renderCreatorStudio))
  document.querySelectorAll<HTMLButtonElement>("[data-calendar-view]").forEach(button => button.addEventListener("click", () => renderFamilyHub(button.dataset.calendarView as CalendarView, range, month)))
  document.querySelectorAll<HTMLButtonElement>("[data-calendar-range]").forEach(button => button.addEventListener("click", () => renderFamilyHub(view, button.dataset.calendarRange as Range, month)))
  document.getElementById("previous-month")?.addEventListener("click", () => renderFamilyHub(view, "month", new Date(month.getFullYear(), month.getMonth() - 1)))
  document.getElementById("next-month")?.addEventListener("click", () => renderFamilyHub(view, "month", new Date(month.getFullYear(), month.getMonth() + 1)))
  document.getElementById("calendar-form")?.addEventListener("submit", event => { event.preventDefault(); const value = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value.trim(); const saved = addCalendarEntry({ scope: value("calendar-scope") as "system" | "personal", date: value("calendar-date"), title: value("calendar-title"), detail: value("calendar-detail") }); if (saved) renderFamilyHub(view, range, month); else document.getElementById("calendar-error")!.textContent = "Add a title and date before saving." })
}
