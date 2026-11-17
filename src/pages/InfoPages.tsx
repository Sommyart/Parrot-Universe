import { ArrowLeft, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import DemoNotice from '../components/DemoNotice'
import WikiImage from '../components/WikiImage'
import { articles } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import NotFound from './NotFound'
import PageHeader from './PageHeader'

export function About() {
  useReveal()
  return (
    <>
      <PageHeader eyebrow="About us" title="A love letter to the world's most colourful birds." text="Parrot Universe is a fictional store created to demonstrate an immersive, interactive e-commerce experience." />
      <section className="container-x grid gap-12 py-20 lg:grid-cols-2">
        <WikiImage title="Scarlet_macaw" alt="Scarlet macaw" className="reveal aspect-[4/5] rounded-[2rem] shadow-xl" credit width={900} />
        <div className="reveal space-y-5 text-lg leading-relaxed text-charcoal/75">
          <p className="eyebrow">Our story</p>
          <h2 className="text-4xl font-bold text-forest">Colour, curiosity and care.</h2>
          <p>Our imaginary shop sits on Rainbow Feather Avenue in Parrot Bay, California. Its mission: help people understand parrots before they ever consider living with one.</p>
          <p>Every species page leads with honest information about lifespan, noise, space and diet. Our accessories are chosen around natural parrot behaviour: chewing, foraging, climbing and bathing.</p>
          <p>And then there is Ruby, our Scarlet Macaw mascot, who flies in to greet every visitor on the home page.</p>
          <DemoNotice text="Parrot Universe is not a real or licensed business. Address, inventory and contact details are demonstration data." />
        </div>
      </section>
    </>
  )
}

export function Contact() {
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (!String(f.get('name')).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(f.get('email'))) || String(f.get('msg')).trim().length < 10) {
      setErr('Please add your name, a valid email and a message of at least 10 characters.')
      return
    }
    setErr('')
    setSent(true)
  }
  const field = 'w-full rounded-2xl border border-forest/15 bg-white px-4 py-3 outline-none focus:border-tropic'
  return (
    <>
      <PageHeader eyebrow="Contact" title="Say hello to the flock." text="All contact details below are fictional demonstration data." />
      <section className="container-x grid gap-10 py-20 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {[
            { icon: MapPin, label: 'Address (fictional)', value: '123 Rainbow Feather Avenue, Parrot Bay, California 90210, USA' },
            { icon: Mail, label: 'Email (fictional)', value: 'hello@parrotuniverse.example' },
            { icon: Phone, label: 'Phone (fictional)', value: '+1 (555) 010-2026' },
            { icon: Clock, label: 'Hours (sample)', value: 'Tue to Sun, 10am to 6pm' },
          ].map((c) => (
            <div key={c.label} className="card flex gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest text-gold"><c.icon className="h-5 w-5" /></span>
              <div><p className="text-xs font-bold uppercase tracking-widest text-charcoal/45">{c.label}</p><p className="mt-1 font-semibold text-forest">{c.value}</p></div>
            </div>
          ))}
        </div>
        <div className="card p-7">
          {sent ? (
            <div role="status" className="py-10 text-center">
              <h2 className="text-3xl font-bold text-forest">Message received (demo)</h2>
              <p className="mt-3 text-charcoal/70">Thanks! In this demonstration no message is actually sent.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-4">
              <h2 className="text-2xl font-bold text-forest">Send a message</h2>
              <input name="name" className={field} placeholder="Your name" aria-label="Your name" />
              <input name="email" type="email" className={field} placeholder="Email address" aria-label="Email address" />
              <textarea name="msg" rows={5} className={field} placeholder="How can we help?" aria-label="Message" />
              {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
              <button className="btn-green">Send message</button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

export function Article() {
  const { slug } = useParams()
  const a = articles.find((x) => x.slug === slug)
  if (!a) return <NotFound />
  return (
    <article className="pb-24 pt-28">
      <div className="container-x max-w-3xl">
        <Link to="/#learn" className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-tropic"><ArrowLeft className="h-4 w-4" /> All guides</Link>
        <p className="eyebrow mt-8">Parrot academy · {a.minutes} min read</p>
        <h1 className="mt-3 text-5xl font-extrabold text-forest">{a.title}</h1>
        <p className="mt-4 text-xl text-charcoal/70">{a.summary}</p>
        <WikiImage title={a.wikiTitle} alt="" className="my-10 aspect-[16/9] rounded-[2rem]" credit width={1200} />
        <div className="space-y-6 text-lg leading-relaxed text-charcoal/80">{a.body.map((p, i) => <p key={i}>{p}</p>)}</div>
        <DemoNotice className="mt-10" text="General educational information for a demonstration website, not veterinary advice. Consult a qualified avian veterinarian for your bird." />
      </div>
    </article>
  )
}

export function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const privacy = kind === 'privacy'
  return (
    <>
      <PageHeader eyebrow="Legal" title={privacy ? 'Privacy Policy' : 'Terms & Conditions'} text="Placeholder text for a demonstration website." />
      <section className="container-x max-w-3xl space-y-5 py-16 text-charcoal/80">
        {privacy ? (
          <>
            <p>This demonstration site does not collect personal data on a server. Your demo cart and the animated-parrot setting are saved only in your own browser's local storage, and you can clear them at any time.</p>
            <p>Newsletter and contact forms are validated in your browser and are not transmitted anywhere. Fonts are loaded from Google Fonts; those services may receive standard request data such as your IP address.</p>
          </>
        ) : (
          <>
            <p>Parrot Universe is a fictional demonstration project. No animals, products or services are offered for sale, and no orders or payments are processed.</p>
            <p>Prices, inventory, business address and contact details are sample data. Educational content is general information and not veterinary advice.</p>
          </>
        )}
      </section>
    </>
  )
}
