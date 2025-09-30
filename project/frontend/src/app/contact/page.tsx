export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p>Questions or feedback? Email us at <a className="text-blue-600 underline" href="mailto:support@example.com">support@example.com</a>.</p>
      <form className="space-y-3" action="mailto:support@example.com" method="post" encType="text/plain">
        <input className="w-full border rounded p-2" name="name" placeholder="Your name" required />
        <input className="w-full border rounded p-2" type="email" name="email" placeholder="Your email" required />
        <textarea className="w-full border rounded p-2" name="message" placeholder="Your message" rows={6} required />
        <button className="px-4 py-2 rounded bg-black text-white">Send</button>
      </form>
    </main>
  )
}
