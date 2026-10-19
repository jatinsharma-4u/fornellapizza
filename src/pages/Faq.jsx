import { ArrowUpRight, ChatCircleText, MagnifyingGlass, Phone, Plus } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import { helpTopics } from '../data/legal'
import { brand, faqs } from '../data/site'
import { cn } from '../lib/format'

/** Help Centre: topic shortcuts, searchable FAQ and contact options. */
export default function Faq() {
  const [open, setOpen] = useState(0)
  const [q, setQ] = useState('')
  const list = faqs.filter((f) => !q.trim() || `${f.q} ${f.a}`.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <>
      <PageHeader title="Help centre" subtitle="Answers about orders, delivery, payments, refunds and your account." crumbs={[{ label: 'Help' }]} />
      <div className="container-x pt-1 md:pt-0">
        <label className="flex h-12 max-w-xl items-center gap-2.5 rounded-xl border border-line bg-white px-4 focus-within:border-ink">
          <MagnifyingGlass size={18} weight="bold" aria-hidden />
          <span className="sr-only">Search help articles</span>
          <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setOpen(0) }} placeholder="Search help, e.g. “refund”" className="h-full min-w-0 flex-1 bg-transparent text-[16px] outline-none" />
        </label>

        <section className="mt-8">
          <h2 className="mb-3 text-[19px]">Browse topics</h2>
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {helpTopics.map((t, i) => (
              <Reveal as="li" key={t.id} delay={i * 0.04} y={10}>
                <Link to={t.to} className="group flex h-full items-start gap-3 rounded-2xl border border-line bg-white p-4 transition-shadow hover:shadow-soft">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold">{t.title}</span>
                    <span className="mt-0.5 block text-[13.5px] text-ink-2">{t.body}</span>
                  </span>
                  <ArrowUpRight size={16} weight="bold" className="mt-1 shrink-0 text-ink-3 transition-colors group-hover:text-tomato" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="mb-3 text-[19px]">Frequently asked questions</h2>
          {list.length === 0 ? (
            <p className="rounded-2xl border border-line bg-white p-5 text-[14.5px] text-ink-2">No answers match “{q}”. Try another word or contact us below.</p>
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-white">
              {list.map((f, i) => {
                const isOpen = open === i
                return (
                  <li key={f.q}>
                    <h3 className="font-sans">
                      <button type="button" aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center gap-4 px-4 py-4 text-left text-[15px] font-semibold md:px-5">
                        <span className="flex-1">{f.q}</span>
                        <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={cn('grid size-7 shrink-0 place-items-center rounded-full transition-colors', isOpen ? 'bg-tomato text-white' : 'bg-cream-2')}>
                          <Plus weight="bold" size={13} />
                        </motion.span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                          <p className="px-4 pb-4 text-[14.5px] leading-relaxed text-ink-2 md:px-5">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="mt-10 grid gap-3 rounded-[20px] bg-ink p-5 text-cream md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <h2 className="text-[20px] text-cream">Still need help?</h2>
            <p className="mt-1 text-[14px] text-cream/70">Our team replies within a few hours, 7 days a week.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button to="/contact" variant="saffron"><ChatCircleText weight="bold" /> Message us</Button>
            <Button href={`tel:${brand.phone.replace(/[^\d+]/g, '')}`} className="border border-white/25 bg-transparent text-cream hover:bg-white/10"><Phone weight="bold" /> Call</Button>
          </div>
        </section>
      </div>
    </>
  )
}
