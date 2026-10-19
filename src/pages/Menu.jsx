import { Printer } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import { ProductRow, QuickAdd } from '../components/product/ProductCard'
import { VegMark } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import { byCategory, categories } from '../data/products'
import { cn, money } from '../lib/format'
import { scrollToEl } from '../lib/smoothScroll'

/** Tracks which section sits under the sticky bar. Uses a thin detection band so it fires rarely. */
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-30% 0px -65% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [ids])
  return [active, setActive]
}

/** Desktop "printed menu" line: name ····· price, quick-add at the end. */
function MenuLine({ product }) {
  return (
    <li data-fly-root className="group relative grid grid-cols-[60px_1fr_auto] items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-white">
      <Link to={`/product/${product.id}`} className="absolute inset-0 z-[2] rounded-2xl" aria-label={product.name} />
      <span className={cn('relative size-[60px] rounded-xl bg-cream-2', product.soldOut && 'opacity-60 grayscale')}>
        <img data-fly-img src={product.image} alt="" loading="lazy" className="img-fit transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
      </span>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <VegMark veg={product.veg} className="self-center" />
          <h3 className="shrink-0 font-display text-[16.5px] font-semibold">{product.name}</h3>
          {product.tags.includes('spicy') && <span className="self-center rounded-full bg-tomato-50 px-1.5 text-[10.5px] font-bold text-tomato uppercase">Spicy</span>}
          <span className="mx-1 h-0 min-w-6 flex-1 -translate-y-1 border-b border-dotted border-ink/25" aria-hidden />
          <span className="shrink-0 text-[15px] font-bold tabular">{money(product.price)}</span>
        </div>
        <p className="mt-0.5 truncate text-[13.5px] text-ink-3">{product.short}</p>
      </div>
      <QuickAdd product={product} size="sm" />
    </li>
  )
}

export default function Menu() {
  const ids = categories.map((c) => c.id)
  const [active, setActive] = useScrollSpy(ids)
  const barRef = useRef(null)

  // Keep the active chip visible by scrolling the bar horizontally only (never the page)
  useEffect(() => {
    const bar = barRef.current
    const chip = bar?.querySelector(`[data-id="${active}"]`)
    if (!bar || !chip) return
    const left = chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2
    bar.scrollTo({ left, behavior: 'smooth' })
  }, [active])

  const jump = (e, id) => {
    e.preventDefault()
    setActive(id)
    const offset = -((barRef.current?.getBoundingClientRect().bottom ?? 120) + 8)
    scrollToEl(document.getElementById(id), offset)
  }

  return (
    <>
      <PageHeader
        eyebrow="Made to order"
        title="Our menu"
        subtitle="Dough proved for 48 hours, burgers smashed on the griddle, lemonade squeezed by hand."
        crumbs={[{ label: 'Menu' }]}
        back={false}
      >
        <div className="mt-5 flex flex-wrap items-center gap-5 text-[13px] text-ink-2">
          <span className="flex items-center gap-1.5"><VegMark veg /> Vegetarian</span>
          <span className="flex items-center gap-1.5"><VegMark veg={false} /> Non-veg</span>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer weight="bold" /> Print menu
          </Button>
        </div>
      </PageHeader>

      {/* Solid sticky bar directly under the app bar (mobile) / site header (desktop) */}
      <div className="sticky top-14 z-30 border-b border-line bg-cream md:top-[72px]" data-no-print>
        <div ref={barRef} className="no-scrollbar container-x flex gap-2 overflow-x-auto py-2.5 md:justify-center md:py-3">
          {categories.map((c) => (
            <a
              key={c.id}
              data-id={c.id}
              href={`#${c.id}`}
              onClick={(e) => jump(e, c.id)}
              aria-current={active === c.id ? 'true' : undefined}
              className={cn('relative flex h-9 shrink-0 items-center gap-1.5 rounded-full pr-3.5 pl-1 text-[13px] font-semibold transition-colors', active === c.id ? 'text-white' : 'border border-line bg-white text-ink-2 hover:text-ink')}
            >
              {active === c.id && <motion.span layoutId="menu-spy" className="absolute inset-0 rounded-full bg-tomato" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
              <img src={c.image} alt="" className="relative size-7 rounded-full bg-cream-2 object-contain p-0.5" />
              <span className="relative">{c.plural}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="container-x space-y-12 pt-6 md:space-y-16 md:pt-10">
        {categories.map((c, ci) => {
          const items = byCategory(c.id)
          return (
            <section key={c.id} id={c.id} aria-labelledby={`${c.id}-title`}>
              <header className={cn('relative mb-4 flex min-h-[112px] items-center overflow-hidden rounded-[20px] px-5 py-5 md:mb-6 md:min-h-[150px] md:px-8', ci % 2 ? 'bg-saffron-50' : 'bg-tomato-50')}>
                <div className="relative z-10 max-w-[62%]">
                  <p className="eyebrow">{String(ci + 1).padStart(2, '0')} · {items.length} items</p>
                  <h2 id={`${c.id}-title`} className="mt-1 text-h2">{c.plural}</h2>
                  <p className="mt-1 text-[13.5px] text-ink-2 md:text-[15px]">{c.blurb}</p>
                </div>
                <span className="absolute top-1/2 right-3 aspect-square h-[88%] -translate-y-1/2 md:right-8" aria-hidden>
                  <img src={c.image} alt="" loading="lazy" className="size-full object-contain food-shadow" />
                </span>
              </header>
              <div className="space-y-2.5 md:hidden">
                {items.map((p) => <ProductRow key={p.id} product={p} />)}
              </div>
              <ul className="hidden gap-x-10 gap-y-1 md:grid md:grid-cols-2">
                {items.map((p) => <MenuLine key={p.id} product={p} />)}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
