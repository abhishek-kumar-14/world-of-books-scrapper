import fs from 'fs'
import path from 'path'
export const dynamic = 'force-static'
function getReadme(): string {
  try {
    const file = path.join(process.cwd(), '..', 'README.md')
    return fs.readFileSync(file, 'utf8')
  } catch {
    return '# README\nProject README not found.'
  }
}
export default function ReadmePage() {
  const md = getReadme()
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">README</h1>
      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded border">{md}</pre>
    </main>
  )
}
