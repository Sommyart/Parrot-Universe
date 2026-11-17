import { CheckCircle2, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'

export default function Newsletter() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [done, setDone] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (name.trim().length < 2) errs.name = 'Please enter your first name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errs.email = 'Please enter a valid email address.'
    setErrors(errs)
    if (Object.keys(errs).length === 0) setDone(true)
  }

  return (
    <section id="newsletter" className="container-x py-24">
      <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-tropic px-6 py-14 text-cream sm:px-14">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-forest/60 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow !text-gold">Newsletter</p>
            <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Join the Parrot Universe.</h2>
            <p className="mt-4 max-w-md text-cream/80">Monthly care tips, species spotlights and accessory news. Demo form: nothing is actually sent or stored.</p>
          </div>
          {done ? (
            <div role="status" className="flex items-start gap-4 rounded-3xl bg-white/10 p-6 backdrop-blur">
              <CheckCircle2 className="h-8 w-8 shrink-0 text-gold" />
              <div>
                <p className="text-xl font-bold">Welcome to the flock, {name.trim()}!</p>
                <p className="mt-1 text-cream/75">You're subscribed with {email.trim()} (demonstration only, no emails will be sent).</p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-[1fr_1.3fr_auto]">
              <div>
                <label htmlFor="nl-name" className="sr-only">First name</label>
                <input id="nl-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="First name" aria-invalid={!!errors.name} className="w-full rounded-full bg-white px-5 py-3.5 text-charcoal outline-none ring-gold focus:ring-2" />
                {errors.name && <p className="mt-1.5 pl-4 text-sm font-semibold text-gold">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="nl-email" className="sr-only">Email address</label>
                <input id="nl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" aria-invalid={!!errors.email} className="w-full rounded-full bg-white px-5 py-3.5 text-charcoal outline-none ring-gold focus:ring-2" />
                {errors.email && <p className="mt-1.5 pl-4 text-sm font-semibold text-gold">{errors.email}</p>}
              </div>
              <button type="submit" className="btn-gold h-[52px]">Subscribe <Send className="h-4 w-4" /></button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
