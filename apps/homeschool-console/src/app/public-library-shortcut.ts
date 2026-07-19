export interface PublicLibraryShortcut {
  name: string
  url: string
}

const key = "learning-world-os:public-library-shortcut:v1"

export function getPublicLibraryShortcut(): PublicLibraryShortcut | null {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(key) ?? "null")
    if (!saved || typeof saved !== "object") return null
    const shortcut = saved as Partial<PublicLibraryShortcut>
    return typeof shortcut.name === "string" && shortcut.name.trim() && typeof shortcut.url === "string" && /^https?:\/\//i.test(shortcut.url) ? { name: shortcut.name, url: shortcut.url } : null
  } catch { return null }
}

export function savePublicLibraryShortcut(input: PublicLibraryShortcut) {
  const name = input.name.trim().slice(0, 100)
  const url = input.url.trim().slice(0, 500)
  if (!name || !/^https?:\/\//i.test(url)) return null
  const shortcut = { name, url }
  localStorage.setItem(key, JSON.stringify(shortcut))
  return shortcut
}

export function removePublicLibraryShortcut() {
  localStorage.removeItem(key)
}
