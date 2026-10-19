import { ArrowRight, Fire, Heart, Leaf, Timer } from '@phosphor-icons/react'
import { animate, motion, useInView, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { Testimonials } from '../components/home/Sections'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import SectionHeading, { Eyebrow } from '../components/ui/SectionHeading'

function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref} className="tabular">{val.toLocaleString()}{suffix}</span>
}

const values = [
  { icon: Timer, title: '48-hour dough', body: 'Slow cold fermentation for a light, blistered, digestible crust.', tint: 'bg-saffron-50 text-[#a86b00]' },
  { icon: Fire, title: '450°C wood fire', body: 'Our oak-fired oven bakes a pizza in 90 seconds flat.', tint: 'bg-tomato-50 text-tomato' },
  { icon: Leaf, title: 'Local & seasonal', body: 'Produce from six farms within 100 miles. Tomatoes from Campania.', tint: 'bg-basil-50 text-basil' },
  { icon: Heart, title: 'Made for sharing', body: 'Big tables, loud music, generous portions. Always.', tint: 'bg-cream-3 text-ink' },
]
const timeline = [
  ['2014', 'A counter & one oven', 'Giulia and Sam open a 12-seat counter on Mulberry Street.'],
  ['2017', 'The smash burger era', 'A late-night staff meal becomes our second bestseller.'],
  ['2020', 'Delivery, done right', 'We build our own delivery fleet so pizzas arrive hot, not soggy.'],
  ['2024', 'Three neighbourhoods', 'Williamsburg and the Upper West Side join the family.'],
]
const team = [
  { name: 'Giulia Ferraro', role: 'Founder & head pizzaiola', tint: 'bg-tomato-100' },
  { name: 'Sam Okafor', role: 'Co-founder & burger boss', tint: 'bg-saffron-100' },
  { name: 'Lena Park', role: 'Pastry & gelato', tint: 'bg-basil-50' },
]

export default function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['-25%', '0%'])

  return (
    <>
      <PageHeader eyebrow="Our story" title="Twelve years of fire & flour" mobileTitle="Our story" subtitle="From a 12-seat counter to the city’s favourite pizza café — the recipe hasn’t changed a gram." crumbs={[{ label: 'Our story' }]} />

      <section className="container-x">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr] md:gap-5">
          <Reveal className="overflow-hidden rounded-[20px] md:row-span-2 md:rounded-[24px]">
            <img src="/img/photos/interior.webp" alt="The Fornella dining room with long wooden tables" className="aspect-[4/3] size-full object-cover md:aspect-auto" />
          </Reveal>
          <Reveal delay={0.1} className="overflow-hidden rounded-[20px]">
            <img src="/img/photos/oven.webp" alt="Pizza in the wood-fired oven" className="aspect-[16/10] size-full object-cover" />
          </Reveal>
          <Reveal delay={0.2} className="relative flex items-end overflow-hidden rounded-[20px] bg-tomato p-6 text-white">
            <span className="absolute top-4 right-4 aspect-[16/9] w-[55%]" aria-hidden><img src="/img/slice-olive.webp" alt="" className="size-full rotate-6 object-contain drop-shadow-[0_14px_16px_rgba(0,0,0,0.3)]" /></span>
            <p className="relative max-w-[70%] font-serif text-2xl leading-tight italic md:text-3xl">“Pizza this good shouldn’t need a reservation.”</p>
          </Reveal>
        </div>
      </section>

      <section className="container-x mt-12 md:mt-24">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {[[12, '', 'Years baking'], [1.2, 'M', 'Pizzas served'], [28, ' min', 'Avg. delivery'], [4.9, '★', 'Average rating']].map(([n, s, l], i) => (
            <Reveal key={l} delay={i * 0.08} className="rounded-[20px] border border-line bg-white p-5 md:p-7">
              <p className="font-display text-[30px] font-semibold text-tomato md:text-[40px]">
                {Number.isInteger(n) ? <Counter to={n} suffix={s} /> : <>{n}{s}</>}
              </p>
              <p className="mt-1 text-ink-2">{l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x mt-14 md:mt-28">
        <SectionHeading eyebrow="What we believe" title="Four things we never compromise" />
        <div className="grid gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="rounded-[20px] border border-line bg-white p-6">
              <span className={`grid size-14 place-items-center rounded-2xl ${v.tint}`}><v.icon size={28} weight="duotone" /></span>
              <h3 className="mt-5 text-[17px]">{v.title}</h3>
              <p className="mt-2 text-ink-2">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Scroll-driven marquee of food */}
      <section ref={ref} className="mt-14 space-y-3 overflow-hidden md:mt-28 md:space-y-5" aria-hidden>
        <motion.div style={{ x: x1 }} className="flex gap-3 md:gap-5">
          {['margherita', 'burger-classic', 'pepperoni', 'mojito', 'supreme', 'fries', 'caprese', 'sundae', 'diavola', 'wings'].map((n) => (
            <span key={n} className="relative size-28 shrink-0 rounded-[20px] border border-line bg-white md:size-40"><img src={`/img/${n}.webp`} alt="" loading="lazy" className="img-fit" /></span>
          ))}
        </motion.div>
        <motion.div style={{ x: x2 }} className="flex gap-3 md:gap-5">
          {['pink-lemonade', 'meat-feast', 'burger-tower', 'nachos', 'four-cheese', 'cake-slice', 'veggie', 'burger-bacon', 'cola', 'garden'].map((n) => (
            <span key={n} className="relative size-28 shrink-0 rounded-[20px] bg-cream-2 md:size-40"><img src={`/img/${n}.webp`} alt="" loading="lazy" className="img-fit" /></span>
          ))}
        </motion.div>
      </section>

      <section className="container-x mt-14 grid gap-10 md:mt-28 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <Reveal>
          <Eyebrow>Timeline</Eyebrow>
          <h2 className="text-h2">How a tiny counter <span className="text-tomato">grew up</span></h2>
          <img src="/img/photos/sharing.webp" alt="Friends sharing pizza" loading="lazy" className="mt-8 hidden aspect-[4/3] w-full rounded-[20px] object-cover md:block" />
        </Reveal>
        <ol className="relative border-l-2 border-dashed border-line pl-8">
          {timeline.map(([y, t, b], i) => (
            <Reveal as="li" key={y} delay={i * 0.1} className="relative pb-10 last:pb-0">
              <span className="absolute top-1 -left-[43px] grid size-6 place-items-center rounded-full bg-tomato ring-4 ring-cream"><span className="size-2 rounded-full bg-white" /></span>
              <p className="font-sans text-[12px] font-bold tracking-[0.14em] text-tomato">{y}</p>
              <h3 className="mt-1 text-[19px]">{t}</h3>
              <p className="mt-1 text-ink-2">{b}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="container-x mt-14 md:mt-28">
        <SectionHeading eyebrow="The people" title="Meet the crew" />
        <div className="grid gap-3 sm:grid-cols-3 md:gap-5">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08} className="flex items-center gap-4 rounded-[20px] border border-line bg-white p-5 md:flex-col md:items-start md:p-7">
              <span className={`grid size-16 place-items-center rounded-full font-display text-2xl font-semibold md:size-20 ${m.tint}`}>{m.name.split(' ').map((w) => w[0]).join('')}</span>
              <div>
                <h3 className="text-[16px] font-semibold md:text-xl">{m.name}</h3>
                <p className="text-ink-3">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Testimonials />

      <section className="container-x mt-14 md:mt-24">
        <Reveal className="flex flex-col items-start gap-5 rounded-[24px] bg-saffron p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <h2 className="max-w-xl text-h2">Hungry yet? The oven’s already hot.</h2>
          <Button to="/order" size="lg" variant="dark">Order now <ArrowRight weight="bold" /></Button>
        </Reveal>
      </section>
    </>
  )
}
