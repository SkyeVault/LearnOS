export type SignedInRole = 'Admin' | 'Parent' | 'Guardian' | 'Teacher' | 'Learner'
export interface SignedInUser { role: SignedInRole; name: string; accountKey: string }
const key = 'learnos:active-session:v1'
const workspaceKey = 'learnos:active-workspace:v1'
export function getSignedInUser(): SignedInUser | null { try { const value = JSON.parse(sessionStorage.getItem(key) ?? 'null') as SignedInUser | null; return value?.role && value?.name && value?.accountKey ? value : null } catch { return null } }
export function setSignedInUser(user: SignedInUser) { sessionStorage.setItem(key, JSON.stringify(user)) }
export function getActiveWorkspace() { return sessionStorage.getItem(workspaceKey) }
export function setActiveWorkspace(workspace: 'teacher' | 'parent' | 'learner') { sessionStorage.setItem(workspaceKey, workspace) }
export function clearSignedInUser() { sessionStorage.removeItem(key); sessionStorage.removeItem(workspaceKey) }
export function isAdministrator() { return getSignedInUser()?.role === 'Admin' }
