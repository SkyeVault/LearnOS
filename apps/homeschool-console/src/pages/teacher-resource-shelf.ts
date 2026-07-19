import { escapeHtml } from '../app/html'
import type { ClassGroup } from '../app/parent-controls'
import { createResourceFolder, foldersForTeacher, removeTeacherResource, resourcesForTeacher, saveTeacherResource } from '../features/teacher-resources'

const fileSize = (bytes: number) => bytes < 1_000_000 ? `${Math.max(1, Math.round(bytes / 1000))} KB` : `${(bytes / 1_000_000).toFixed(1)} MB`

export function renderTeacherResourceShelf(teacherId: string, classes: ClassGroup[]) {
  const folders = foldersForTeacher(teacherId, classes.map(group => group.id))
  const resources = resourcesForTeacher(teacherId, classes.map(group => group.id)).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const classOptions = classes.map(group => `<option value="${escapeHtml(group.id)}">${escapeHtml(group.name)}</option>`).join('') || '<option value="">Unsorted / teacher shelf</option>'
  const folderOptions = `<option value="">No folder</option>${folders.map(folder => `<option value="${escapeHtml(folder.id)}">${escapeHtml(folder.name)}</option>`).join('')}`
  const folderName = (id: string) => folders.find(folder => folder.id === id)?.name || 'Teacher shelf'
  const className = (id: string) => classes.find(group => group.id === id)?.name || 'Unsorted'
  return `<section class="teacher-resource-shelf" id="teacher-create-upload"><div class="teacher-resource-heading"><div><p class="os-kicker">CREATE &amp; UPLOAD</p><h2>Build your teaching shelf</h2><p>Only you can see and organize this shelf. Files stay on this device and are grouped by your folders and classes.</p></div><span>${resources.length} file${resources.length === 1 ? '' : 's'}</span></div><div class="teacher-resource-grid"><form class="teacher-resource-form" id="teacher-folder-form"><h3>Create a folder</h3><label>Folder name<input id="teacher-folder-name" maxlength="70" required placeholder="e.g. Seed unit"></label><label>Class<select id="teacher-folder-class">${classOptions}</select></label><button class="os-secondary">Create folder</button><p class="parent-error" id="teacher-folder-error"></p></form><form class="teacher-resource-form" id="teacher-resource-form"><h3>Upload a resource</h3><label>File <small>PDF, image, document, slides · up to 4 MB</small><input id="teacher-resource-file" type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.csv,.xlsx,.png,.jpg,.jpeg,.webp,image/*,application/pdf,text/plain,text/csv"></label><label>Folder<select id="teacher-resource-folder">${folderOptions}</select></label><label>Class<select id="teacher-resource-class">${classOptions}</select></label><button class="os-primary">Add to my shelf</button><p class="parent-error" id="teacher-resource-error"></p></form></div><div class="teacher-folder-strip">${folders.length ? folders.map(folder => `<span><strong>📁 ${escapeHtml(folder.name)}</strong><small>${escapeHtml(className(folder.classId))}</small></span>`).join('') : '<p>Create folders for units, classes, or source collections.</p>'}</div><div class="teacher-resource-list">${resources.length ? resources.map(resource => `<article><span class="teacher-resource-icon">${resource.type === 'application/pdf' ? 'PDF' : 'FILE'}</span><div><strong>${escapeHtml(resource.name)}</strong><small>${escapeHtml(folderName(resource.folderId))} · ${escapeHtml(className(resource.classId))} · ${fileSize(resource.size)}</small></div><a class="text-button" href="${resource.dataUrl}" download="${escapeHtml(resource.name)}">Open</a><button class="text-button" data-remove-resource="${escapeHtml(resource.id)}">Remove</button></article>`).join('') : '<p class="teacher-empty">Your private shelf is ready for its first resource.</p>'}</div></section>`
}

export function wireTeacherResourceShelf(teacherId: string, rerender: () => void) {
  document.getElementById('teacher-folder-form')?.addEventListener('submit', event => {
    event.preventDefault()
    const created = createResourceFolder({ teacherId, name: (document.getElementById('teacher-folder-name') as HTMLInputElement).value, classId: (document.getElementById('teacher-folder-class') as HTMLSelectElement).value })
    if (!created) { document.getElementById('teacher-folder-error')!.textContent = "Give the folder a name before creating it."; return }
    rerender()
  })
  document.getElementById('teacher-resource-form')?.addEventListener('submit', async event => {
    event.preventDefault()
    const file = (document.getElementById('teacher-resource-file') as HTMLInputElement).files?.[0]
    const error = document.getElementById('teacher-resource-error')!
    if (!file) return
    try {
      const saved = await saveTeacherResource({ teacherId, folderId: (document.getElementById('teacher-resource-folder') as HTMLSelectElement).value, classId: (document.getElementById('teacher-resource-class') as HTMLSelectElement).value }, file)
      if (!saved) { error.textContent = 'Choose a file smaller than 4 MB.'; return }
      rerender()
    } catch { error.textContent = 'This file could not be saved locally. Try a smaller file.' }
  })
  document.querySelectorAll<HTMLButtonElement>('[data-remove-resource]').forEach(button => button.addEventListener('click', () => { removeTeacherResource(button.dataset.removeResource!, teacherId); rerender() }))
}
