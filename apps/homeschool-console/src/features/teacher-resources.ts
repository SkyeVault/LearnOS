export interface TeacherResourceFolder {
  id: string
  teacherId: string
  name: string
  classId: string
  createdAt: string
}

export interface TeacherResource {
  id: string
  teacherId: string
  folderId: string
  classId: string
  name: string
  type: string
  size: number
  dataUrl: string
  createdAt: string
}

const foldersKey = 'learning-world-os:teacher-resource-folders:v1'
const resourcesKey = 'learning-world-os:teacher-resources:v1'

function read<T>(key: string): T[] {
  try { const value = JSON.parse(localStorage.getItem(key) ?? '[]'); return Array.isArray(value) ? value as T[] : [] } catch { return [] }
}
function write<T>(key: string, value: T[]) { localStorage.setItem(key, JSON.stringify(value)) }

export const foldersForTeacher = (teacherId: string, classIds: string[] = []) => read<TeacherResourceFolder>(foldersKey).filter(folder => folder.teacherId === teacherId || (folder.teacherId === "admin" && (!folder.classId || classIds.includes(folder.classId))))
export const resourcesForTeacher = (teacherId: string, classIds: string[] = []) => read<TeacherResource>(resourcesKey).filter(resource => resource.teacherId === teacherId || (resource.teacherId === "admin" && (!resource.classId || classIds.includes(resource.classId))))
export const allResourceFolders = () => read<TeacherResourceFolder>(foldersKey)
export const allResources = () => read<TeacherResource>(resourcesKey)

export function createResourceFolder(input: Omit<TeacherResourceFolder, 'id' | 'createdAt'>) {
  const name = input.name.trim()
  if (!input.teacherId || !name) return null
  const folder: TeacherResourceFolder = { ...input, name, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  write(foldersKey, [...read<TeacherResourceFolder>(foldersKey), folder])
  return folder
}

export function saveLinkedResource(input: Omit<TeacherResource, "id" | "createdAt" | "dataUrl" | "type" | "size"> & { url: string }) {
  const url = input.url.trim()
  if (!input.teacherId || !input.name.trim() || !/^https?:\/\//i.test(url)) return null
  const resource: TeacherResource = { id: crypto.randomUUID(), teacherId: input.teacherId, folderId: input.folderId, classId: input.classId, name: input.name.trim(), type: "text/uri-list", size: 0, dataUrl: url, createdAt: new Date().toISOString() }
  write(resourcesKey, [...read<TeacherResource>(resourcesKey), resource])
  return resource
}

export function removeTeacherResource(resourceId: string, teacherId: string) {
  const resources = read<TeacherResource>(resourcesKey)
  const next = resources.filter(resource => resource.id !== resourceId || resource.teacherId !== teacherId)
  if (next.length === resources.length) return false
  write(resourcesKey, next)
  return true
}

export async function saveTeacherResource(input: Omit<TeacherResource, 'id' | 'createdAt' | 'dataUrl' | 'name' | 'type' | 'size'>, file: File) {
  if (!input.teacherId || !file || file.size > 4_000_000) return null
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Unreadable file'))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
  const resource: TeacherResource = { ...input, id: crypto.randomUUID(), name: file.name, type: file.type || 'application/octet-stream', size: file.size, dataUrl, createdAt: new Date().toISOString() }
  write(resourcesKey, [...read<TeacherResource>(resourcesKey), resource])
  return resource
}
