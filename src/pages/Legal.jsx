import { Info } from '@phosphor-icons/react'
import { NavLink } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import { policies, policyMeta } from '../data/legal'
import { cn } from '../lib/format'

const nav = [
  ['privacy', '/privacy', 'Privacy'],
  ['terms', '/terms', 'Terms'],
  ['refund', '/refund-policy', 'Refunds'],
  ['delivery', '/delivery-policy', 'Delivery'],
]

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/** Shared layout for all policy pages; `doc` is a key of `policies`. */
export default function Legal({ doc = 'privacy' }) {
  const p = policies[doc]
  return (
    <>
      <PageHeader title={p.title} crumbs={[{ to: '/help', label: 'Help' }, { label: p.title }]} subtitle={`Last updated: ${policyMeta.updated}`} />
      <div className="container-x pt-1 md:pt-0">
        <nav aria-label="Policies" className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:mb-8 md:px-0">
          {nav.map(([key, to, label]) => (
            <NavLink key={key} to={to} className={({ isActive }) => cn('flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-semibold transition-colors', isActive ? 'bg-ink text-cream' : 'border border-line bg-white text-ink-2 hover:text-ink')}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-28 space-y-1 border-l border-line">
              {p.sections.map(([h]) => (
                <a key={h} href={`#${slug(h)}`} className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-[13.5px] text-ink-3 hover:border-tomato hover:text-ink">{h}</a>
              ))}
            </nav>
          </aside>

          <article className="max-w-3xl">
            <p className="flex items-start gap-2.5 rounded-xl border border-saffron-100 bg-saffron-50 px-4 py-3 text-[13px] text-ink-2">
              <Info size={17} className="mt-0.5 shrink-0 text-[#8a5a00]" />
              Template policy for this demo site. Text in [SQUARE BRACKETS] is a placeholder to be replaced with the business’s real details and reviewed by a legal professional.
            </p>
            <p className="mt-6 text-[15.5px] leading-relaxed text-ink-2">{p.intro}</p>
            {p.sections.map(([h, items], i) => (
              <section key={h} id={slug(h)} className="mt-8 scroll-mt-28">
                <h2 className="text-[19px] md:text-[21px]"><span className="mr-2 font-sans text-[13px] font-bold text-tomato tabular">{String(i + 1).padStart(2, '0')}</span>{h}</h2>
                <ul className="mt-3 space-y-2.5">
                  {items.map((t) => (
                    <li key={t} className="relative pl-4 text-[15px] leading-relaxed text-ink-2 before:absolute before:top-[0.7em] before:left-0 before:size-1.5 before:rounded-full before:bg-ink/25">{t}</li>
                  ))}
                </ul>
              </section>
            ))}
            <p className="mt-10 border-t border-line pt-5 text-[13.5px] text-ink-3">
              Questions about this policy? Contact {policyMeta.business} at {policyMeta.email} or {policyMeta.phone}.
            </p>
          </article>
        </div>
      </div>
    </>
  )
}
