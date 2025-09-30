export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-sm text-gray-600">Last updated: September 30, 2025</p>
      <p>Use this application responsibly. Do not scrape or store data without permission. You are responsible for complying with third‑party website terms, robots.txt rules, and applicable laws.</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Scraping is <strong>disabled by default</strong>. It must be explicitly enabled by an administrator.</li>
        <li>Automated scraping respects <code>robots.txt</code>; if disallowed or unavailable, the job is skipped.</li>
        <li>No unlawful, harmful, or abusive use.</li>
        <li>We provide no warranty; use at your own risk.</li>
      </ul>
    </main>
  )
}
