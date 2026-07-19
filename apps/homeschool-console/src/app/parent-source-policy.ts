export interface SourcePolicy {
  version: 1
  enabled: boolean
  allowedDomains: string[]
}

const key = 'learning-world-os:source-policy:v1'
const defaults = (): SourcePolicy => ({
  version: 1,
  enabled: false,
  allowedDomains: [
    'openstax.org', 'si.edu', 'metmuseum.org', 'artic.edu', 'loc.gov',
    'nasa.gov', 'ck12.org', 'code.org', 'open.umn.edu', 'wikibooks.org', 'gutenberg.org', 'librivox.org',
  ],
})

function read(): SourcePolicy {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? 'null') as SourcePolicy | null
    return parsed?.version === 1 ? { ...defaults(), ...parsed } : defaults()
  } catch { return defaults() }
}

function write(policy: SourcePolicy) { localStorage.setItem(key, JSON.stringify(policy)) }

export function getSourcePolicy() { return read() }
export function setSourceAccess(enabled: boolean) { const policy = read(); policy.enabled = enabled; write(policy) }

export function addAllowedDomain(value: string) {
  const domain = value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
  if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) return false
  const policy = read()
  if (!policy.allowedDomains.includes(domain)) { policy.allowedDomains.push(domain); write(policy) }
  return true
}

export function removeAllowedDomain(domain: string) {
  const policy = read()
  policy.allowedDomains = policy.allowedDomains.filter(item => item !== domain)
  write(policy)
}

export function isAllowedSource(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false
    const host = parsed.hostname.replace(/^www\./, "")
    const policy = read()
    return policy.enabled && policy.allowedDomains.some(domain => host === domain || host.endsWith(`.${domain}`))
  } catch { return false }
}
