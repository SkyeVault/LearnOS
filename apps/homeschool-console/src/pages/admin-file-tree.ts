import { getApp, goBack } from "../nav"
import { escapeHtml } from "../app/html"

type TreeItem = { id: string; parentId: string; kind: "folder" | "file"; name: string; note: string }
const key = "learning-world-os:admin-file-tree:v1"
const read = (): TreeItem[] => { try { return JSON.parse(localStorage.getItem(key) ?? "[]") as TreeItem[] } catch { return [] } }
const write = (items: TreeItem[]) => localStorage.setItem(key, JSON.stringify(items))
function branch(items: TreeItem[], parentId = "") : string {
  const children = items.filter(item => item.parentId === parentId)
  return children.length ? `<ul>${children.map(item => `<li><span>${item.kind === "folder" ? "📁" : "📄"}</span><div><strong>${escapeHtml(item.name)}</strong>${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}</div><button class="text-button" data-remove-tree="${item.id}">Remove</button>${item.kind === "folder" ? branch(items, item.id) : ""}</li>`).join("")}</ul>` : ""
}
export function renderAdminFileTree() {
  const items = read()
  const folders = items.filter(item => item.kind === "folder")
  getApp().innerHTML = `<main class="parent-dashboard admin-file-tree"><header><button class="back-btn" id="tree-back">← Admin Corner</button><div><p class="os-kicker">PROGRAM FILE TREE</p><h1>Organize classes and materials</h1><p>Create a shared local map for class folders, lesson plans, links, handouts, and resource notes. This organizes metadata; files remain on the device or in their original source.</p></div></header><section class="parent-grid"><article class="parent-panel"><p class="os-kicker">ADD TO THE TREE</p><h2>Folder or material</h2><form id="tree-form"><label>Type<select id="tree-kind"><option value="folder">Folder</option><option value="file">Material / file reference</option></select></label><label>Inside<select id="tree-parent"><option value="">Program root</option>${folders.map(folder => `<option value="${folder.id}">${escapeHtml(folder.name)}</option>`).join("")}</select></label><label>Name<input id="tree-name" required maxlength="100" placeholder="Grade 3 · Spring science"></label><label>Note or location <small>optional</small><input id="tree-note" maxlength="300" placeholder="Lesson 1, shared drive path, or reminder"></label><button class="os-primary">Add to file tree</button></form></article><article class="parent-panel"><p class="os-kicker">YOUR PROGRAM MAP</p><h2>Shared file tree</h2><div class="file-tree">${branch(items) || "<p>No folders yet. Start with a class, term, or subject folder.</p>"}</div></article></section></main>`
  document.getElementById("tree-back")!.addEventListener("click", goBack)
  document.getElementById("tree-form")!.addEventListener("submit", event => { event.preventDefault(); const val = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLSelectElement).value.trim(); const name = val("tree-name"); if (!name) return; write([...items, { id: crypto.randomUUID(), parentId: val("tree-parent"), kind: val("tree-kind") as "folder" | "file", name, note: val("tree-note") }]); renderAdminFileTree() })
  document.querySelectorAll<HTMLButtonElement>("[data-remove-tree]").forEach(button => button.addEventListener("click", () => { const removeId = button.dataset.removeTree!; const descendants = new Set<string>([removeId]); let changed = true; while (changed) { changed = false; items.filter(item => descendants.has(item.parentId)).forEach(item => { if (!descendants.has(item.id)) { descendants.add(item.id); changed = true } }) } write(items.filter(item => !descendants.has(item.id))); renderAdminFileTree() }))
}
