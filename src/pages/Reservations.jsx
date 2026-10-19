import { CalendarCheck, CheckCircle, Users } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { Field, Stepper } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import { locations } from '../data/site'
import { cn } from '../lib/format'

const times = ['12:00', '12:30', '13:00', '13:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']
const full = new Set(['19:30', '20:00'])

export default function Reservations() {
  const dates = useMemo(() => Array.from({ length: 10 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d }), [])
  const [date, setDate] = useState(0)
  const [time, setTime] = useState('19:00')
  const [guests, setGuests] = useState(2)
  const [store, setStore] = useState('soho')
  const [form, setForm] = useState({ name: '', phone: '', note: '' })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Who should we expect?'
    if (!/^[\d\s()+-]{7,}$/.test(form.phone)) er.phone = 'Enter a phone number in case we need to reach you.'
    setErrors(er)
    const first = Object.keys(er)[0]
    if (first) return document.getElementById(`rs-${first}`)?.focus()
    setDone(true)
  }

  const d = dates[date]

  return (
    <>
      <PageHeader eyebrow="Dine in" title="Book a table" mobileTitle="Book a table" subtitle="Long tables, loud music and pizza straight from the oven. Walk-ins welcome, bookings recommended on weekends." crumbs={[{ label: 'Reservations' }]} />
      <div className="container-x grid gap-6 md:grid-cols-[1fr_400px] md:gap-12">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center rounded-[20px] bg-white p-10 text-center shadow-soft" role="status">
              <CheckCircle size={72} weight="fill" className="text-basil" />
              <h2 className="mt-4 text-3xl font-semibold">You’re booked, {form.name.split(' ')[0]}!</h2>
              <p className="mt-2 max-w-md text-ink-2">
                Table for {guests} at {locations.find((l) => l.id === store).name}, {d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {time}. We’ll text a reminder the day before.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>Make another booking</Button>
            </motion.div>
          ) : (
            <motion.form key="form" noValidate onSubmit={submit} className="space-y-4">
              <section className="rounded-[20px] border border-line bg-white p-5 md:p-7">
                <h2 className="mb-4 text-[16px] font-semibold">Where</h2>
                <div className="grid gap-2 sm:grid-cols-3">
                  {locations.map((l) => (
                    <button key={l.id} type="button" aria-pressed={store === l.id} onClick={() => setStore(l.id)} className={cn('rounded-2xl border-2 p-3 text-left transition-colors', store === l.id ? 'border-ink bg-ink text-cream' : 'border-line hover:border-ink/30')}>
                      <span className="block font-bold">{l.name}</span>
                      <span className={cn('text-xs', store === l.id ? 'text-cream/70' : 'text-ink-3')}>{l.address.split(',')[0]}</span>
                    </button>
                  ))}
                </div>
              </section>
              <section className="rounded-[20px] border border-line bg-white p-5 md:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[16px] font-semibold">When</h2>
                  <span className="text-sm text-ink-3">{d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-5 md:-mx-7 md:px-7">
                  {dates.map((dt, i) => (
                    <button key={i} type="button" aria-pressed={date === i} onClick={() => setDate(i)} className={cn('flex w-16 shrink-0 flex-col items-center rounded-2xl py-3 transition-colors', date === i ? 'bg-tomato text-white shadow-tomato' : 'bg-cream-2 hover:bg-cream-3')}>
                      <span className={cn('text-xs font-semibold uppercase', date === i ? 'text-white/80' : 'text-ink-3')}>{dt.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="font-display text-[19px]">{dt.getDate()}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {times.map((t) => {
                    const isFull = full.has(t)
                    return (
                      <button key={t} type="button" disabled={isFull} aria-pressed={time === t} onClick={() => setTime(t)} className={cn('h-11 rounded-xl border-2 text-sm font-semibold tabular transition-colors disabled:cursor-not-allowed disabled:line-through disabled:opacity-40', time === t ? 'border-ink bg-ink text-cream' : 'border-line hover:border-ink/30')}>
                        {t}
                      </button>
                    )
                  })}
                </div>
                <p className="mt-3 text-xs text-ink-3">Struck-through times are fully booked.</p>
              </section>
              <section className="rounded-[20px] border border-line bg-white p-5 md:p-7">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-[16px] font-semibold"><Users weight="fill" className="text-tomato" /> Guests</h2>
                  <Stepper value={guests} onChange={(g) => setGuests(Math.min(12, g))} label="Number of guests" />
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field id="rs-name" label="Name" required autoComplete="name" value={form.name} onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((x) => ({ ...x, name: undefined })) }} error={errors.name} />
                  <Field id="rs-phone" label="Phone" type="tel" required autoComplete="tel" value={form.phone} onChange={(e) => { setForm((f) => ({ ...f, phone: e.target.value })); setErrors((x) => ({ ...x, phone: undefined })) }} error={errors.phone} />
                  <Field id="rs-note" as="textarea" className="sm:col-span-2" label="Special requests" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Birthday, high chair, allergies…" />
                </div>
              </section>
              <Button type="submit" size="lg" full className="md:w-fit"><CalendarCheck weight="bold" /> Confirm booking</Button>
            </motion.form>
          )}
        </AnimatePresence>

        <aside className="space-y-4 md:sticky md:top-28 md:self-start">
          <Reveal className="overflow-hidden rounded-[20px]">
            <img src="/img/photos/friends.webp" alt="Friends dining at Fornella" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </Reveal>
          <div className="rounded-[20px] bg-saffron-50 p-5">
            <p className="font-bold">Booking for 10+?</p>
            <p className="mt-1 text-sm text-ink-2">We have a private room for up to 24 guests with a set sharing menu. Call us and we’ll make it special.</p>
          </div>
        </aside>
      </div>
    </>
  )
}
