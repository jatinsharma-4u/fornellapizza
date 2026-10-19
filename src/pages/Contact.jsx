import { CheckCircle, Clock, EnvelopeSimple, MapPin, NavigationArrow, Phone } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import { Field } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import { brand, locations } from '../data/site'
import { cn } from '../lib/format'

function StoreMap({ active }) {
  const pins = { soho: [180, 250], brooklyn: [380, 230], uws: [150, 80] }
  return (
    <svg viewBox="0 0 500 340" className="size-full" role="img" aria-label="Map of Fornella locations">
      <rect width="500" height="340" fill="#F5E9DA" />
      <path d="M260 0 C 300 120, 250 220, 320 340" stroke="#C9E0EE" strokeWidth="46" fill="none" />
      {['M0 60 H500', 'M0 170 H500', 'M0 290 H500', 'M90 0 V340', 'M200 0 V340', 'M420 0 V340'].map((d) => <path key={d} d={d} stroke="#fff" strokeWidth="10" />)}
      <rect x="110" y="90" width="70" height="60" rx="14" fill="#CFE6D6" />
      {Object.entries(pins).map(([id, [x, y]]) => (
        <g key={id} transform={`translate(${x} ${y})`}>
          {active === id && <circle r="22" fill="#D63A1C" opacity="0.2"><animate attributeName="r" values="14;30;14" dur="2s" repeatCount="indefinite" /></circle>}
          <path d="M0 0 C -14 -16, -14 -34, 0 -36 C 14 -34, 14 -16, 0 0Z" fill={active === id ? '#D63A1C' : '#24140C'} />
          <circle cy="-24" r="5" fill="#fff" />
        </g>
      ))}
    </svg>
  )
}

export default function Contact() {
  const [active, setActive] = useState('soho')
  const [form, setForm] = useState({ name: '', email: '', topic: 'General', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }
  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Please enter your name.'
    if (!/\S+@\S+\.\S+/.test(form.email)) er.email = 'Enter a valid email so we can reply.'
    if (form.message.trim().length < 10) er.message = 'Tell us a little more (10+ characters).'
    setErrors(er)
    const first = Object.keys(er)[0]
    if (first) return document.getElementById(`ct-${first}`)?.focus()
    setSent(true)
  }

  const cards = [
    { icon: Phone, title: 'Call us', body: brand.phone, href: `tel:${brand.phone.replace(/[^\d+]/g, '')}`, tint: 'bg-tomato-50 text-tomato' },
    { icon: EnvelopeSimple, title: 'Email', body: brand.email, href: `mailto:${brand.email}`, tint: 'bg-saffron-50 text-[#a86b00]' },
    { icon: MapPin, title: 'Flagship', body: brand.address, href: '#locations', tint: 'bg-basil-50 text-basil' },
  ]

  return (
    <>
      <PageHeader eyebrow="Contact" title="Say ciao" mobileTitle="Contact us" subtitle="Questions, catering, feedback or a love letter to our Margherita — we read everything." crumbs={[{ label: 'Contact' }]} />

      <section className="container-x">
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <a href={c.href} className="flex items-center gap-4 rounded-[20px] border border-line bg-white p-5 transition-shadow hover:shadow-lift md:flex-col md:items-start md:p-7">
                <span className={cn('grid size-12 shrink-0 place-items-center rounded-2xl', c.tint)}><c.icon size={24} weight="fill" /></span>
                <span>
                  <span className="block text-sm text-ink-3">{c.title}</span>
                  <span className="block font-bold md:text-lg">{c.body}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x mt-10 grid gap-6 md:mt-16 md:grid-cols-[1.1fr_1fr] md:gap-12">
        <Reveal className="rounded-[20px] border border-line bg-white p-5 md:p-9">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-14 text-center" role="status">
                <CheckCircle size={64} weight="fill" className="text-basil" />
                <h2 className="mt-4 text-[19px]">Message sent!</h2>
                <p className="mt-2 max-w-sm text-ink-2">Thanks, {form.name.split(' ')[0]}. We usually reply within a few hours.</p>
                <Button variant="outline" className="mt-6" onClick={() => { setSent(false); setForm({ name: '', email: '', topic: 'General', message: '' }) }}>Send another</Button>
              </motion.div>
            ) : (
              <motion.form key="form" noValidate onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <h2 className="text-[19px] sm:col-span-2">Send us a message</h2>
                <Field id="ct-name" label="Name" required autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
                <Field id="ct-email" label="Email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
                <fieldset className="sm:col-span-2">
                  <legend className="mb-1.5 text-sm font-semibold">Topic</legend>
                  <div className="flex flex-wrap gap-2">
                    {['General', 'An order', 'Catering', 'Careers', 'Feedback'].map((t) => (
                      <button key={t} type="button" aria-pressed={form.topic === t} onClick={() => setForm((f) => ({ ...f, topic: t }))} className={cn('h-10 rounded-full border px-4 text-sm font-semibold transition-colors', form.topic === t ? 'border-ink bg-ink text-cream' : 'border-line hover:border-ink/30')}>{t}</button>
                    ))}
                  </div>
                </fieldset>
                <Field id="ct-message" as="textarea" className="sm:col-span-2" label="Message" required value={form.message} onChange={set('message')} error={errors.message} />
                <Button type="submit" size="lg" className="sm:col-span-2 sm:w-fit">Send message</Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>

        <div id="locations" className="scroll-mt-28">
          <Reveal className="overflow-hidden rounded-[20px] border border-line">
            <div className="aspect-[500/340]"><StoreMap active={active} /></div>
          </Reveal>
          <ul className="mt-4 space-y-3">
            {locations.map((l) => (
              <li key={l.id}>
                <button type="button" onClick={() => setActive(l.id)} aria-pressed={active === l.id} className={cn('flex w-full items-start gap-4 rounded-[24px] border-2 bg-white p-4 text-left transition-colors', active === l.id ? 'border-tomato' : 'border-transparent shadow-soft')}>
                  <span className={cn('grid size-11 shrink-0 place-items-center rounded-2xl', active === l.id ? 'bg-tomato text-white' : 'bg-cream-2')}><NavigationArrow weight="fill" size={20} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 font-bold">{l.name}<span className={cn('rounded-full px-2 py-0.5 text-xs', l.open ? 'bg-basil-50 text-basil' : 'bg-cream-3 text-ink-3')}>{l.open ? 'Open now' : 'Closed'}</span></span>
                    <span className="block text-sm text-ink-2">{l.address}</span>
                    <span className="block text-sm text-ink-3">{l.phone}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-[24px] bg-ink p-5 text-cream">
            <p className="mb-3 flex items-center gap-2 font-bold"><Clock weight="fill" className="text-saffron" /> Opening hours</p>
            <dl className="space-y-1.5">
              {brand.hours.map((h) => (
                <div key={h.days} className="flex justify-between text-sm"><dt className="text-cream/70">{h.days}</dt><dd className="font-semibold tabular">{h.time}</dd></div>
              ))}
            </dl>
          </div>
          <p className="mt-4 text-center text-sm text-ink-3">Looking for quick answers? <Link to="/help" className="font-semibold text-tomato">Read the FAQ</Link></p>
        </div>
      </section>
    </>
  )
}
