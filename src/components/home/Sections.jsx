import { ArrowRight, ArrowUpRight, CalendarCheck, ChefHat, Fire, InstagramLogo, Leaf, MapPinLine, Moped, Package, Star, Storefront } from '@phosphor-icons/react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { byCategory, categories, products } from '../../data/products'
import { gallery, testimonials } from '../../data/site'
import { cn } from '../../lib/format'
import ProductCard from '../product/ProductCard'
import Button from '../ui/Button'
import Reveal, { staggerChild, staggerParent } from '../ui/Reveal'
import SectionHeading, { Eyebrow } from '../ui/SectionHeading'

/* ───────── Category tiles (tablet & desktop) ───────── */
export function CategoryShowcase() {
  return (
    <section className="container-x hidden pt-4 md:block">
      <motion.ul variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="grid grid-cols-5 gap-3 lg:gap-4">
        {categories.map((c) => (
          <motion.li key={c.id} variants={staggerChild}>
            <Link to={`/order?cat=${c.id}`} className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-2.5 pr-3 transition-[box-shadow,border-color] duration-300 hover:border-transparent hover:shadow-lift">
              <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-cream-2 lg:size-16">
                <img src={c.image} alt="" loading="lazy" className="size-11 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 lg:size-12" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[16px] font-semibold">{c.name}</span>
                <span className="text-[12.5px] text-ink-3">{byCategory(c.id).length} items</span>
              </span>
              <ArrowUpRight size={16} weight="bold" className="hidden shrink-0 text-ink-3 transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-tomato lg:block" />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}

/* ───────── Popular with category tabs ───────── */
export function PopularSection() {
  const tabs = [{ id: 'all', name: 'Popular' }, ...categories]
  const [tab, setTab] = useState('all')
  const list = (tab === 'all' ? products.filter((p) => p.tags.includes('bestseller')) : byCategory(tab)).slice(0, 8)

  return (
    <section className="container-x mt-10 md:section-y">
      <SectionHeading eyebrow="Fresh out the oven" title="Popular right now" action={{ to: '/order', label: 'View all' }} className="mb-4 md:mb-6" />
      <div role="tablist" aria-label="Filter popular dishes" className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:mb-8 md:px-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn('relative h-9 shrink-0 rounded-full px-4 text-[13.5px] font-semibold transition-colors', tab === t.id ? 'text-cream' : 'border border-line bg-white text-ink-2 hover:text-ink')}
          >
            {tab === t.id && <motion.span layoutId="popular-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 450, damping: 36 }} />}
            <span className="relative">{t.name}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.ul
          key={tab}
          variants={staggerParent}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4"
        >
          {list.map((p) => (
            // Fixed, independent slide width: cards never overlap and each one clips its own image
            <motion.li key={p.id} variants={staggerChild} className="w-[calc((100%-12px)/1.6)] max-w-[240px] shrink-0 snap-start md:w-auto md:max-w-none">
              <ProductCard product={p} className="h-full" />
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </section>
  )
}

/* ───────── Deals ───────── */
export function DealsBento() {
  return (
    <section className="container-x section-y">
      <SectionHeading eyebrow="This week" title="Deals worth sharing" action={{ to: '/offers', label: 'All deals' }} />
      <div className="grid gap-3 md:grid-cols-[1.35fr_1fr] md:grid-rows-2 md:gap-4">
        <Reveal className="md:row-span-2">
          <Link to="/offers" className="group relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-[24px] bg-tomato p-6 text-white md:min-h-[440px] md:p-9">
            <div className="relative z-10 max-w-[58%] md:max-w-[52%]">
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase opacity-80">Family feast</span>
              <h3 className="mt-2 text-[22px] leading-[1.12] md:text-[32px]">2 Large pizzas, wings & 4 drinks</h3>
              <p className="mt-2 text-[14px] text-white/85 md:text-[15px]">Feeds four. Any pizzas, any drinks.</p>
            </div>
            <div className="relative z-10 mt-auto flex items-end gap-3 pt-6">
              <p className="font-display text-[34px] leading-none font-semibold md:text-[44px]">$49.90</p>
              <p className="pb-1 text-[14px] text-white/70 line-through">$64.30</p>
            </div>
            <span className="absolute top-1/2 right-[-8%] aspect-square w-[52%] max-w-[380px] -translate-y-1/2 md:right-[-4%] md:w-[50%]" aria-hidden>
              <img src="/img/supreme.webp" alt="" loading="lazy" className="size-full object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.3)] transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:rotate-[24deg]" />
            </span>
          </Link>
        </Reveal>
        {[
          { eyebrow: 'Every Tuesday', title: 'Buy one Medium, get one free', sub: 'Code TWOSDAY', img: '/img/pepperoni.webp', cls: 'bg-saffron text-ink' },
          { eyebrow: 'Lunch combo', title: 'Burger, fries & a drink', sub: '$13.90 · 11am–3pm', img: '/img/burger-double.webp', cls: 'border border-line bg-white text-ink' },
        ].map((d, i) => (
          <Reveal key={d.title} delay={0.08 * (i + 1)}>
            <Link to="/offers" className={cn('group relative flex h-full min-h-[160px] items-center overflow-hidden rounded-[24px] p-6 md:p-7', d.cls)}>
              <div className="relative z-10 max-w-[58%]">
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase opacity-75">{d.eyebrow}</span>
                <h3 className="mt-1.5 text-[19px] leading-[1.15] md:text-[22px]">{d.title}</h3>
                <p className="mt-1.5 text-[13px] font-semibold opacity-80">{d.sub}</p>
              </div>
              <span className="absolute top-1/2 right-3 aspect-square w-[38%] max-w-[170px] -translate-y-1/2" aria-hidden>
                <img src={d.img} alt="" loading="lazy" className="size-full object-contain food-shadow transition-transform duration-700 group-hover:scale-105 group-hover:rotate-6" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ───────── Build-your-own teaser with scroll-assembled toppings ───────── */
export function BuildTeaser() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })
  const baseRotate = useTransform(p, [0, 1], [-60, 0])
  const pieces = [
    { src: '/img/tomato-slice.webp', from: [-160, -150], to: [-48, -34], w: 'w-[17%]', r: 120 },
    { src: '/img/basil-leaf.webp', from: [170, -170], to: [40, -56], w: 'w-[20%]', r: -90 },
    { src: '/img/tomato-slice.webp', from: [180, 110], to: [56, 34], w: 'w-[15%]', r: 200 },
    { src: '/img/basil.webp', from: [-180, 120], to: [-40, 50], w: 'w-[22%]', r: -140 },
  ]
  return (
    <section ref={ref} className="container-x section-y">
      <div className="grid items-center gap-8 overflow-hidden rounded-[28px] bg-saffron-50 p-6 md:grid-cols-2 md:p-12 lg:p-14">
        <Reveal>
          <Eyebrow>Build your own</Eyebrow>
          <h2 className="text-h2">Your pizza, your rules</h2>
          <p className="mt-3 max-w-md text-ink-2">Choose a size, crust, sauce and up to eight toppings. Watch it come together, then we fire it at 450°C.</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {['3 sizes', '3 crusts', '4 sauces', '11 toppings'].map((t) => (
              <li key={t} className="rounded-full border border-saffron-100 bg-white px-3 py-1.5 text-[13px] font-semibold">{t}</li>
            ))}
          </ul>
          <Button to="/build" className="mt-7">
            Start building <ArrowRight weight="bold" />
          </Button>
        </Reveal>
        <div className="relative mx-auto aspect-square w-full max-w-[380px]">
          <div className="absolute inset-[4%] rounded-full border border-dashed border-saffron" aria-hidden />
          <motion.img style={{ rotate: baseRotate }} src="/img/four-cheese.webp" alt="A cheese pizza base being topped" loading="lazy" className="absolute inset-[10%] size-[80%] object-contain food-shadow" />
          {pieces.map((pc, i) => (
            <Piece key={i} pc={pc} p={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Piece({ pc, p }) {
  const x = useTransform(p, [0, 1], [pc.from[0], pc.to[0]])
  const y = useTransform(p, [0, 1], [pc.from[1], pc.to[1]])
  const rotate = useTransform(p, [0, 1], [pc.r, 0])
  const opacity = useTransform(p, [0, 0.35], [0, 1])
  return <motion.img src={pc.src} alt="" aria-hidden loading="lazy" style={{ x, y, rotate, opacity }} className={cn('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', pc.w)} />
}

/* ───────── How it works ───────── */
export function HowItWorks() {
  const steps = [
    { icon: Storefront, title: 'Pick your favourites', body: 'Browse 45+ dishes or build a pizza from scratch.' },
    { icon: Fire, title: 'We fire it up', body: 'Hand-stretched and baked at 450°C the moment you order.' },
    { icon: Moped, title: 'Hot at your door', body: 'Follow your order live. Average delivery: 28 minutes.' },
  ]
  return (
    <section className="container-x section-y">
      <SectionHeading eyebrow="How it works" title="From our oven to your door" />
      <ol className="grid gap-3 md:grid-cols-3 md:gap-5">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 0.1} className="flex gap-4 rounded-[20px] border border-line bg-white p-5 md:flex-col md:p-7">
            <span className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-tomato-50 text-tomato">
                <s.icon size={22} weight="duotone" />
              </span>
              <span className="hidden font-display text-[13px] font-semibold text-ink-3 md:block">Step {i + 1}</span>
            </span>
            <div>
              <h3 className="text-h3">{s.title}</h3>
              <p className="mt-1 text-[14.5px] text-ink-2">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

/* ───────── Story ───────── */
export function StorySection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30])
  const stats = [
    ['12', 'years baking'],
    ['48h', 'slow-proved dough'],
    ['450°', 'wood-fired oven'],
  ]
  return (
    <section ref={ref} className="container-x section-y">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14 lg:gap-20">
        <Reveal className="relative overflow-hidden rounded-[24px]">
          <motion.img style={{ y, scale: 1.1 }} src="/img/photos/oven.webp" alt="A pizza coming out of the wood-fired oven" loading="lazy" className="aspect-[4/3] w-full object-cover md:aspect-[5/6]" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2.5 rounded-xl bg-white/95 px-3 py-2.5 backdrop-blur">
            <Leaf size={18} weight="fill" className="text-basil" />
            <p className="text-[13px] font-semibold">Produce from 6 local farms</p>
          </div>
        </Reveal>
        <Reveal>
          <Eyebrow>Our story</Eyebrow>
          <h2 className="text-h2">Made with patience, delivered with care</h2>
          <p className="mt-4 text-ink-2">
            Fornella started as a tiny counter with one oven and a stubborn idea: pizza this good shouldn’t need a reservation. Twelve years later the oven is bigger and the menu has burgers — but the dough recipe hasn’t changed a gram.
          </p>
          <dl className="mt-7 grid grid-cols-3 divide-x divide-line border-y border-line py-4">
            {stats.map(([n, l]) => (
              <div key={l} className="px-3 first:pl-0">
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-[26px] leading-none font-semibold text-tomato md:text-[30px]">{n}</dd>
                <dd className="mt-1.5 text-[12.5px] leading-tight text-ink-3">{l}</dd>
              </div>
            ))}
          </dl>
          <Button to="/about" variant="outline" className="mt-7">
            Read our story <ArrowRight weight="bold" />
          </Button>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────── Reviews: full-width, continuously scrolling ───────── */
function ReviewCard({ t }) {
  return (
    <figure className="flex h-full w-[290px] flex-col rounded-[20px] border border-line bg-white p-5 md:w-[340px] md:p-6">
      <div className="flex items-center justify-between">
        <span className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, s) => (
            <Star key={s} size={14} weight="fill" className={s < t.rating ? 'text-saffron' : 'text-line'} />
          ))}
        </span>
        <span className="text-[12px] text-ink-3">{t.dish}</span>
      </div>
      <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-2">“{t.text}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
        <span className="grid size-9 place-items-center rounded-full bg-cream-2 font-display text-[15px] font-semibold">{t.name[0]}</span>
        <span className="leading-tight">
          <span className="block text-[14px] font-semibold">{t.name}</span>
          <span className="text-[12.5px] text-ink-3">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  )
}

function MarqueeRow({ items, reverse, duration }) {
  // Content is rendered twice and translated by exactly -50%; per-item right padding (not flex gap)
  // keeps both halves identical so the loop is seamless.
  return (
    <div className="group flex overflow-hidden motion-reduce:overflow-x-auto">
      <div
        className="flex w-max shrink-0 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ '--marquee-duration': `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {[...items, ...items].map((t, i) => (
          <div key={i} className="pr-4" aria-hidden={i >= items.length || undefined}>
            <ReviewCard t={t} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function Testimonials() {
  const half = Math.ceil(testimonials.length / 2)
  return (
    <section className="section-y overflow-hidden bg-cream-2 py-14 md:py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow="Reviews"
          title="Loved by 12,000+ locals"
          subtitle="4.9 average across 3,200+ reviews on Google and delivery apps."
          action={{ to: '/order', label: 'Taste for yourself' }}
        />
      </div>
      <div className="relative space-y-4 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
        <MarqueeRow items={testimonials.slice(0, half)} duration={55} />
        <MarqueeRow items={testimonials.slice(half)} duration={65} reverse />
      </div>
    </section>
  )
}

/* ───────── Instagram gallery ───────── */
export function Gallery() {
  return (
    <section className="container-x section-y">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <Eyebrow>@fornella.cafe</Eyebrow>
          <h2 className="text-h2">From our kitchen</h2>
        </div>
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="flex shrink-0 items-center gap-2 text-sm font-semibold text-ink hover:text-tomato">
          <InstagramLogo size={18} weight="bold" /> Follow us
        </a>
      </div>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:px-0">
        {gallery.slice(0, 6).map((src, i) => (
          <Reveal key={src} delay={i * 0.05} className="w-36 shrink-0 overflow-hidden rounded-2xl md:w-auto">
            <img src={src} alt="" loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ───────── Mobile quick links (app-style tiles) ───────── */
export function QuickLinks() {
  const links = [
    { to: '/reservations', icon: CalendarCheck, label: 'Book a table' },
    { to: '/orders', icon: Package, label: 'My orders' },
    { to: '/build', icon: ChefHat, label: 'Build a pizza' },
    { to: '/contact', icon: MapPinLine, label: 'Find us' },
  ]
  return (
    <section className="container-x mt-8 md:hidden">
      <div className="grid grid-cols-4 gap-2">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-white px-1 py-3 text-center active:bg-cream-2">
            <l.icon size={22} weight="duotone" className="text-tomato" />
            <span className="text-[11.5px] leading-tight font-semibold">{l.label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
