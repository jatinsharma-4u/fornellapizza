import { ArrowRight, Check, Copy, Crown, Gift, Sparkle } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import { combos, offers } from '../data/site'
import { cn, money } from '../lib/format'
import { useStore } from '../store/StoreProvider'

const tones = {
  tomato: 'bg-tomato text-white',
  saffron: 'bg-saffron text-ink',
  cream: 'bg-white text-ink',
  basil: 'bg-basil text-white',
}

function Coupon({ offer, i }) {
  const { applyPromo } = useStore()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(offer.code)
    } catch {
      /* clipboard blocked — still apply below */
    }
    applyPromo(offer.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Reveal delay={i * 0.08}>
      <article className={cn('relative flex h-full min-h-[200px] overflow-hidden rounded-[20px]', tones[offer.tone])}>
        <div className="relative z-10 flex flex-1 flex-col p-6">
          <span className="w-fit rounded-full bg-black/10 px-3 py-1 text-xs font-bold tracking-wider uppercase">{offer.badge}</span>
          <h3 className="mt-2 max-w-[65%] text-[20px] leading-tight md:text-[24px]">{offer.title}</h3>
          <p className="mt-1 max-w-[65%] text-sm opacity-85">{offer.subtitle}</p>
          <div className="mt-auto flex items-center gap-3 pt-5">
            {offer.code ? (
              <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={copy} className="flex h-11 items-center gap-2 rounded-full border-2 border-dashed border-current px-4 font-bold tracking-wider">
                {copied ? <>Applied <Check weight="bold" /></> : <>{offer.code} <Copy weight="bold" /></>}
              </motion.button>
            ) : (
              <span className="flex h-11 items-center gap-2 rounded-full bg-black/10 px-4 font-semibold"><Sparkle weight="fill" /> Applied automatically</span>
            )}
          </div>
          <p className="mt-3 text-xs opacity-70">{offer.expires}</p>
        </div>
        {/* perforation */}
        <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-cream" aria-hidden />
        <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-cream" aria-hidden />
        <span className="pointer-events-none absolute top-1/2 right-4 aspect-square w-[34%] max-w-[180px] -translate-y-1/2" aria-hidden><img src={offer.image} alt="" loading="lazy" className="size-full object-contain drop-shadow-[0_14px_16px_rgba(0,0,0,0.22)]" /></span>
      </article>
    </Reveal>
  )
}

export default function Offers() {
  return (
    <>
      <PageHeader back={false} eyebrow="Deals & rewards" title="More pizza, less money" mobileTitle="Deals" subtitle="Tap a code to apply it instantly. New deals drop every Monday." crumbs={[{ label: 'Deals' }]} />

      <section className="container-x">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          {offers.map((o, i) => <Coupon key={o.id} offer={o} i={i} />)}
        </div>
      </section>

      <section className="container-x mt-14 md:mt-24">
        <SectionHeading eyebrow="Combos" title="Bundles that just make sense" />
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {combos.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <article className="group flex h-full flex-col rounded-[20px] border border-line bg-white p-3">
                <div className="relative grid h-48 place-items-center overflow-hidden rounded-[24px] bg-gradient-to-br from-saffron-50 to-cream-2">
                  <img src={c.image} alt="" loading="lazy" className="h-[85%] object-contain food-shadow transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />
                  <span className="absolute top-3 left-3 rounded-full bg-tomato px-3 py-1 text-xs font-bold text-white">Save {money(c.was - c.price)}</span>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="text-[17px]">{c.name}</h3>
                  <ul className="mt-2 space-y-1">
                    {c.items.map((it) => (
                      <li key={it} className="flex items-center gap-2 text-sm text-ink-2"><Check weight="bold" className="text-basil" /> {it}</li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <p>
                      <span className="text-[19px] tabular">{money(c.price)}</span>
                      <span className="ml-2 text-sm text-ink-3 line-through">{money(c.was)}</span>
                    </p>
                    <Button size="sm" to="/order">
                      Choose <ArrowRight weight="bold" />
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x mt-14 md:mt-24">
        <Reveal className="relative overflow-hidden rounded-[24px] bg-ink p-7 text-cream md:p-10">
          <img src="/img/pepperoni.webp" alt="" loading="lazy" className="pointer-events-none absolute -right-20 -bottom-24 w-[60%] max-w-[460px] opacity-90 md:-right-10" />
          <div className="relative max-w-xl">
            <p className="flex items-center gap-2 text-sm font-bold tracking-wider text-saffron uppercase"><Crown weight="fill" /> Fornella Club</p>
            <h2 className="mt-3 text-h2">Every 150 points = a free pizza</h2>
            <ul className="mt-6 space-y-3 text-cream/80">
              {['Earn 1 point for every $1 you spend', 'Double points every Wednesday', 'A free dessert on your birthday', 'Early access to new menu drops'].map((t) => (
                <li key={t} className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white/10"><Gift size={16} weight="fill" className="text-saffron" /></span>{t}</li>
              ))}
            </ul>
            <Button to="/signup" variant="saffron" size="lg" className="mt-8">Join free <ArrowRight weight="bold" /></Button>
          </div>
        </Reveal>
      </section>
    </>
  )
}
