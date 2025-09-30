import axios from 'axios'
/** Minimal robots.txt checker (User-agent: * only). */
export async function isPathAllowed(siteBaseUrl: string, path: string, userAgent = '*'): Promise<boolean> {
  try {
    const robotsUrl = new URL('/robots.txt', siteBaseUrl).toString()
    const res = await axios.get(robotsUrl, { timeout: 5000 })
    const lines = String(res.data).split(/\r?\n/)
    let inGlobal = false
    const allows: string[] = []
    const disallows: string[] = []
    for (const raw of lines) {
      const line = raw.trim()
      if (!line || line.startsWith('#')) continue
      const idx = line.indexOf(':')
      if (idx === -1) continue
      const key = line.slice(0, idx).trim().toLowerCase()
      const value = line.slice(idx + 1).trim()
      if (key === 'user-agent') inGlobal = (value === '*' || value === userAgent)
      if (!inGlobal) continue
      if (key === 'allow') allows.push(value)
      if (key === 'disallow') disallows.push(value)
    }
    const matchLength = (rules: string[]) => rules.reduce((m, r) => (r && path.startsWith(r) && r.length > m ? r.length : m), 0)
    return matchLength(allows) >= matchLength(disallows)
  } catch { return false }
}
