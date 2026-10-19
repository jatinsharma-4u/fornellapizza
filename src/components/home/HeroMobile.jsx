import { ArrowRight, Bell, CaretDown, MagnifyingGlass, MapPin, SlidersHorizontal } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/products'
import { cn, greeting } from '../../lib/format'
import { useStore } from '../../store/StoreProvider'
import HeroCarousel from './HeroCarousel'
import { HeroWave } from './HeroDesktop'

const promos = [
  { eyebrow: 'Every Tuesday', title: 'Second Medium pizza free', sub: 'Code TWOSDAY', to: '/offers', bg: 'bg-saffron text-ink', btn: 'bg-ink text-cream', img: '/img/pepperoni.webp' },
  { eyebrow: 'Lunch combo', title: 'Burger, fries & a drink', sub: '$13.90 · 11am–3pm', to: '/offers', bg: 'bg-basil text-white', btn: 'bg-white text-ink', img: '/img/burger-classic.webp' },
  { eyebrow: 'New here?', title: '20% off your first order', sub: 'Code HELLO20', to: '/offers', bg: 'bg-white text-ink border border-line', btn: 'bg-tomato text-white', img: '/img/supreme.webp' },
]

/** Banner slider; each image is boxed inside its own card so nothing bleeds into the next slide. */
export function PromoCarousel() {
  const [index, setIndex] = useState(0)
  return (
    <div className="container-x mt-6">
      <div
        onScroll={(e) => {
          const el = e.currentTarget
          setIndex(Math.round(el.scrollLeft / ((el.firstElementChild?.offsetWidth ?? 1) + 12)))
        }}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4"
      >
        {promos.map((p, i) => (
          <Link key={p.title} to={p.to} className={cn('relative flex h-[140px] w-[86%] shrink-0 snap-start overflow-hidden rounded-[20px] p-4', p.bg)}>
            <div className="relative z-10 flex w-[56%] flex-col">
              <span className="text-[10.5px] font-bold tracking-[0.12em] uppercase opacity-75">{p.eyebrow}</span>
              <h2 className="mt-1 text-[17px] leading-[1.18]">{p.title}</h2>
              <span className="mt-0.5 text-[12px] opacity-80">{p.sub}</span>
              <span className={cn('mt-auto inline-flex h-7 w-fit items-center gap-1 rounded-full px-3 text-[12px] font-semibold', p.btn)}>
                View deal <ArrowRight weight="bold" size={11} />
              </span>
            </div>
            <span className="absolute top-1/2 right-2 aspect-square h-[112px] -translate-y-1/2" aria-hidden>
              <img src={p.img} alt="" loading={i === 0 ? 'eager' : 'lazy'} className="size-full object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.22)]" />
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
        {promos.map((p, i) => (
          <span key={p.title} className={cn('h-1.5 rounded-full transition-all duration-300', i === index ? 'w-5 bg-ink' : 'w-1.5 bg-ink/15')} />
        ))}
      </div>
    </div>
  )
}

export function CategoryCircles() {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
      {categories.map((c, i) => (
        <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}>
          <Link to={`/order?cat=${c.id}`} className="flex w-[66px] flex-col items-center gap-1.5">
            <span className="grid size-[60px] place-items-center rounded-full border border-line bg-white">
              <img src={c.image} alt="" className="size-[44px] object-contain" />
            </span>
            <span className="text-[12px] font-semibold text-ink-2">{c.name}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

export default function HeroMobile() {
  const { user, notificationsRead } = useStore()
  return (
    <div className="md:hidden">
      <section className="relative overflow-hidden bg-tomato text-white">
        <div className="container-x relative pt-3 pb-12">
          <div className="flex items-center gap-2.5">
            <Link to="/profile?tab=addresses" className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-[11.5px] font-medium text-white/75">
                <MapPin weight="fill" /> Deliver to
              </p>
              <p className="flex items-center gap-1 truncate text-[14.5px] font-semibold">
                218 Mulberry Street <CaretDown weight="bold" size={12} />
              </p>
            </Link>
            <Link to="/notifications" aria-label="Notifications" className="relative grid size-10 place-items-center rounded-full bg-white/15">
              <Bell size={18} weight="bold" />
              {!notificationsRead && <span className="absolute top-2 right-2.5 size-2 rounded-full bg-white ring-2 ring-tomato" />}
            </Link>
            <Link to={user ? '/profile' : '/login'} aria-label="Account" className="grid size-10 place-items-center rounded-full bg-white text-sm font-bold text-tomato">
              {user ? user.name[0] : <span className="font-display">F</span>}
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[13px] font-medium text-white/75">{greeting()}{user ? `, ${user.name.split(' ')[0]}` : ''}</p>
            <h1 className="mx-auto mt-1 max-w-[300px] text-[27px] leading-[1.12] text-white">Hot, cheesy &amp; wood-fired.</h1>
          </div>

          <HeroCarousel className="-mx-4 mt-3" />

          <div className="mt-4 flex justify-center">
            <Link to="/order" className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-6 text-[14.5px] font-semibold text-tomato">
              Order now <ArrowRight weight="bold" size={15} />
            </Link>
          </div>
        </div>
        <HeroWave className="absolute inset-x-0 -bottom-px h-[30px] w-full" />
      </section>

      <div className="container-x mt-3 flex gap-2">
        <Link to="/order?focus=search" className="flex h-11 flex-1 items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 text-ink-3">
          <MagnifyingGlass size={18} weight="bold" className="text-ink" />
          <span className="text-[14px]">Search pizzas, burgers, drinks…</span>
        </Link>
        <Link to="/order?filters=1" aria-label="Filters" className="grid size-11 place-items-center rounded-xl bg-ink text-cream">
          <SlidersHorizontal size={18} weight="bold" />
        </Link>
      </div>

      <div className="container-x mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[18px]">Categories</h2>
          <Link to="/menu" className="text-[13px] font-semibold text-tomato">Full menu</Link>
        </div>
        <CategoryCircles />
      </div>

      <PromoCarousel />
    </div>
  )
}
