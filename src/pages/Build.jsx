import { ArrowCounterClockwise, Check, ShuffleSimple } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { CartFab } from '../components/layout/CartIcon'
import PageHeader from '../components/layout/PageHeader'
import { Stepper } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import { cn, money } from '../lib/format'
import { useStore } from '../store/StoreProvider'

const sizes = [
  { id: 's', label: 'S', name: 'Small', detail: '10"', price: 10, scale: 0.82 },
  { id: 'm', label: 'M', name: 'Medium', detail: '12"', price: 13, scale: 0.91 },
  { id: 'l', label: 'L', name: 'Large', detail: '14"', price: 16, scale: 1 },
]
const crusts = [
  { id: 'classic', name: 'Classic', price: 0 },
  { id: 'thin', name: 'Thin & crispy', price: 0 },
  { id: 'stuffed', name: 'Cheese-stuffed', price: 2.5 },
]
const sauces = [
  { id: 'tomato', name: 'San Marzano', color: null },
  { id: 'pesto', name: 'Basil pesto', color: '#5d8a2f' },
  { id: 'bbq', name: 'Smoky BBQ', color: '#6b2a12' },
  { id: 'white', name: 'Garlic cream', color: '#fff3d6' },
]
const cheeses = [
  { id: 'mozz', name: 'Mozzarella', price: 0 },
  { id: 'extra', name: 'Extra cheese', price: 1.5 },
  { id: 'vegan', name: 'Vegan mozz', price: 1.5 },
]

// Each topping renders as small SVG pieces (or a real cut-out image for basil & tomato).
const toppings = [
  { id: 'pepperoni', name: 'Pepperoni', price: 1.5, swatch: '#b8321c' },
  { id: 'mushroom', name: 'Mushrooms', price: 1.25, swatch: '#d9c3a1' },
  { id: 'olive', name: 'Black olives', price: 1.25, swatch: '#2a2420' },
  { id: 'pepper', name: 'Green peppers', price: 1.25, swatch: '#3f8a3a' },
  { id: 'onion', name: 'Red onion', price: 1, swatch: '#8e3a73' },
  { id: 'jalapeno', name: 'Jalapeños', price: 1, swatch: '#5aa04a' },
  { id: 'corn', name: 'Sweetcorn', price: 1, swatch: '#f2c230' },
  { id: 'ham', name: 'Smoked ham', price: 2, swatch: '#e79a8f' },
  { id: 'chicken', name: 'Grilled chicken', price: 2, swatch: '#c99b62' },
  { id: 'tomato', name: 'Vine tomato', price: 1.25, image: '/img/tomato-slice.webp', swatch: '#e2412c' },
  { id: 'basil', name: 'Fresh basil', price: 0.75, image: '/img/basil-leaf.webp', swatch: '#2f7d32' },
]
const MAX = 8

function Piece({ id }) {
  switch (id) {
    case 'pepperoni':
      return (
        <svg viewBox="0 0 40 40" className="size-full"><circle cx="20" cy="20" r="18" fill="#b8321c" /><circle cx="20" cy="20" r="18" fill="url(#pg)" /><circle cx="14" cy="15" r="2.4" fill="#8f2213" /><circle cx="25" cy="24" r="2" fill="#8f2213" /><circle cx="22" cy="12" r="1.6" fill="#e0715a" /><defs><radialGradient id="pg"><stop offset="0.6" stopColor="transparent" /><stop offset="1" stopColor="#7a1a0c" stopOpacity=".7" /></radialGradient></defs></svg>
      )
    case 'mushroom':
      return <svg viewBox="0 0 40 40" className="size-full"><path d="M6 20a14 12 0 0 1 28 0Z" fill="#d9c3a1" /><path d="M16 20h8v12a4 4 0 0 1-8 0Z" fill="#eadcc4" /><path d="M8 19a12 9 0 0 1 24 0" fill="none" stroke="#a88b63" strokeWidth="1.4" /></svg>
    case 'olive':
      return <svg viewBox="0 0 40 40" className="size-full"><circle cx="20" cy="20" r="13" fill="none" stroke="#2a2420" strokeWidth="8" /><circle cx="16" cy="15" r="2" fill="#5a4f48" /></svg>
    case 'pepper':
      return <svg viewBox="0 0 40 40" className="size-full"><path d="M6 26 Q20 4 34 22" fill="none" stroke="#3f8a3a" strokeWidth="6" strokeLinecap="round" /></svg>
    case 'onion':
      return <svg viewBox="0 0 40 40" className="size-full"><path d="M5 28 Q20 2 35 26" fill="none" stroke="#8e3a73" strokeWidth="4" strokeLinecap="round" /><path d="M10 28 Q20 10 30 26" fill="none" stroke="#c78ab3" strokeWidth="2" strokeLinecap="round" /></svg>
    case 'jalapeno':
      return <svg viewBox="0 0 40 40" className="size-full"><circle cx="20" cy="20" r="12" fill="#cfe5a0" stroke="#5aa04a" strokeWidth="5" /><circle cx="17" cy="18" r="1.6" fill="#f3f0d0" /><circle cx="23" cy="21" r="1.6" fill="#f3f0d0" /></svg>
    case 'corn':
      return <svg viewBox="0 0 40 40" className="size-full"><circle cx="12" cy="14" r="5" fill="#f2c230" /><circle cx="26" cy="12" r="5" fill="#f5cf4a" /><circle cx="20" cy="26" r="5" fill="#eab823" /></svg>
    case 'ham':
      return <svg viewBox="0 0 40 40" className="size-full"><rect x="7" y="9" width="26" height="22" rx="5" fill="#e79a8f" transform="rotate(12 20 20)" /><rect x="10" y="13" width="18" height="4" rx="2" fill="#f5c3bb" transform="rotate(12 20 20)" /></svg>
    case 'chicken':
      return <svg viewBox="0 0 40 40" className="size-full"><path d="M8 14 Q14 6 28 9 Q36 18 30 29 Q18 35 9 27 Z" fill="#c99b62" /><path d="M12 16 L26 26 M16 12 L30 20" stroke="#8e6232" strokeWidth="2" strokeLinecap="round" /></svg>
    default:
      return null
  }
}

// Deterministic scatter so pieces don't jump on re-render
function scatter(seed, n) {
  const pts = []
  let s = seed * 9301 + 49297
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2
    const r = 0.1 + Math.sqrt(rnd()) * 0.27
    pts.push({ x: 50 + Math.cos(a) * r * 100, y: 50 + Math.sin(a) * r * 100, rot: rnd() * 360 })
  }
  return pts
}

function PizzaCanvas({ size, sauce, chosen }) {
  const s = sizes.find((x) => x.id === size)
  const sauceColor = sauces.find((x) => x.id === sauce).color
  const layouts = useMemo(() => Object.fromEntries(toppings.map((t, i) => [t.id, scatter(i + 3, t.image ? 6 : 9)])), [])
  return (
    <motion.div animate={{ scale: s.scale }} transition={{ type: 'spring', stiffness: 160, damping: 18 }} className="relative aspect-square w-full">
      <img src="/img/four-cheese.webp" alt="Your custom pizza" className="absolute inset-0 size-full object-contain drop-shadow-[0_30px_30px_rgba(90,40,10,0.3)]" />
      <AnimatePresence>
        {sauceColor && (
          <motion.span key={sauce} initial={{ opacity: 0 }} animate={{ opacity: 0.38 }} exit={{ opacity: 0 }} className="absolute inset-[9%] rounded-full mix-blend-multiply" style={{ background: sauceColor }} />
        )}
      </AnimatePresence>
      {chosen.map((tid) => {
        const t = toppings.find((x) => x.id === tid)
        return layouts[tid].map((pt, i) => (
          <motion.span
            key={`${tid}-${i}`}
            className={cn('absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_3px_2px_rgba(60,20,0,0.35)]', t.image ? 'w-[15%]' : 'w-[9%]')}
            style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            initial={{ opacity: 0, scale: 2.2, rotate: pt.rot - 90, y: -60 }}
            animate={{ opacity: 1, scale: 1, rotate: pt.rot, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: i * 0.04 }}
          >
            {t.image ? <img src={t.image} alt="" className="w-full" /> : <Piece id={tid} />}
          </motion.span>
        ))
      })}
    </motion.div>
  )
}

function Group({ step, title, hint, children }) {
  return (
    <section className="rounded-[20px] border border-line bg-white p-4 md:p-5">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="flex items-center gap-2.5 text-[17px]">
          <span className="grid size-6 place-items-center rounded-full bg-ink font-sans text-[11px] font-bold text-cream">{step}</span>
          {title}
        </h2>
        {hint && <span className="text-sm text-ink-3">{hint}</span>}
      </header>
      {children}
    </section>
  )
}

function Pill({ active, onClick, children, role = 'radio' }) {
  return (
    <motion.button type="button" role={role} aria-checked={active} whileTap={{ scale: 0.95 }} onClick={onClick}
      className={cn('flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[13px] font-semibold transition-colors', active ? 'border-ink bg-ink text-cream' : 'border-line bg-white hover:border-ink/30')}>
      {children}
    </motion.button>
  )
}

export default function Build() {
  const { addToCart } = useStore()
  const [size, setSize] = useState('m')
  const [crust, setCrust] = useState('classic')
  const [sauce, setSauce] = useState('tomato')
  const [cheese, setCheese] = useState('mozz')
  const [chosen, setChosen] = useState(['pepperoni', 'basil'])
  const [qty, setQty] = useState(1)
  const canvasRef = useRef(null)

  const price =
    sizes.find((x) => x.id === size).price +
    crusts.find((x) => x.id === crust).price +
    cheeses.find((x) => x.id === cheese).price +
    chosen.reduce((sum, id) => sum + toppings.find((t) => t.id === id).price, 0)

  const toggle = (id) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= MAX ? c : [...c, id]))
  const surprise = () => {
    const pool = [...toppings].sort(() => Math.random() - 0.5).slice(0, 4).map((t) => t.id)
    setChosen(pool)
    setSauce(sauces[Math.floor(Math.random() * sauces.length)].id)
  }
  const reset = () => {
    setSize('m'); setCrust('classic'); setSauce('tomato'); setCheese('mozz'); setChosen([]); setQty(1)
  }

  const add = () => {
    const sz = sizes.find((x) => x.id === size)
    const names = chosen.map((id) => toppings.find((t) => t.id === id).name)
    const short = [`${sz.name} ${sz.detail}`, crusts.find((x) => x.id === crust).name, sauces.find((x) => x.id === sauce).name, names.length ? names.join(', ') : 'Cheese only'].join(' · ')
    addToCart('custom-pizza', {}, qty, {
      from: canvasRef.current,
      meta: {
      name: 'Your Custom Pizza',
      image: '/img/four-cheese.webp',
      short,
      price,
      signature: [size, crust, sauce, cheese, [...chosen].sort().join('+')].join('/'),
      },
    })
  }

  return (
    <>
      <PageHeader eyebrow="Build your own" title="Make it yours" mobileTitle="Build a pizza" action={<CartFab className="size-10 border border-line shadow-none" />} subtitle="Pick a size, crust, sauce and up to 8 toppings. Watch it come together, then we’ll fire it at 450°C." crumbs={[{ label: 'Build a pizza' }]} />
      <div className="container-x grid gap-5 pt-2 pb-28 md:grid-cols-[1fr_1fr] md:gap-10 md:pt-0 md:pb-0">
        <div className="md:sticky md:top-28 md:self-start">
          <div className="relative overflow-hidden rounded-[24px] bg-saffron-50 p-6 pt-14 md:p-10">
            <div ref={canvasRef} className="relative mx-auto max-w-[400px]">
              <PizzaCanvas size={size} sauce={sauce} chosen={chosen} />
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button type="button" onClick={surprise} className="flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-semibold shadow-soft"><ShuffleSimple weight="bold" /> Surprise me</button>
              <button type="button" onClick={reset} aria-label="Reset pizza" className="grid size-9 place-items-center rounded-full bg-white shadow-soft"><ArrowCounterClockwise weight="bold" /></button>
            </div>
          </div>
          <div className="mt-5 hidden items-center gap-3 md:flex">
            <Stepper value={qty} onChange={setQty} />
            <Button size="lg" full onClick={add} className="flex-1 justify-between">
              <span>Add to order</span>
              <span className="tabular">{money(price * qty)}</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Group step={1} title="Size">
            <div role="radiogroup" aria-label="Size" className="grid grid-cols-3 gap-2">
              {sizes.map((s) => (
                <Pill key={s.id} active={size === s.id} onClick={() => setSize(s.id)}>
                  <span className="flex flex-col items-center leading-tight">
                    <span className="font-display text-lg">{s.label}</span>
                    <span className="text-xs opacity-70">{s.detail} · {money(s.price)}</span>
                  </span>
                </Pill>
              ))}
            </div>
          </Group>
          <Group step={2} title="Crust">
            <div role="radiogroup" aria-label="Crust" className="grid grid-cols-3 gap-2">
              {crusts.map((c) => (
                <Pill key={c.id} active={crust === c.id} onClick={() => setCrust(c.id)}>
                  <span className="text-center leading-tight">{c.name}{c.price > 0 && <span className="block text-xs opacity-70">+{money(c.price)}</span>}</span>
                </Pill>
              ))}
            </div>
          </Group>
          <Group step={3} title="Sauce">
            <div role="radiogroup" aria-label="Sauce" className="grid grid-cols-2 gap-2">
              {sauces.map((s) => (
                <Pill key={s.id} active={sauce === s.id} onClick={() => setSauce(s.id)}>
                  <span className="size-4 rounded-full ring-2 ring-white" style={{ background: s.color ?? '#d23b1f' }} />
                  {s.name}
                </Pill>
              ))}
            </div>
          </Group>
          <Group step={4} title="Cheese">
            <div role="radiogroup" aria-label="Cheese" className="grid grid-cols-3 gap-2">
              {cheeses.map((c) => (
                <Pill key={c.id} active={cheese === c.id} onClick={() => setCheese(c.id)}>
                  <span className="text-center leading-tight">{c.name}{c.price > 0 && <span className="block text-xs opacity-70">+{money(c.price)}</span>}</span>
                </Pill>
              ))}
            </div>
          </Group>
          <Group step={5} title="Toppings" hint={`${chosen.length}/${MAX} selected`}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {toppings.map((t) => {
                const on = chosen.includes(t.id)
                const full = !on && chosen.length >= MAX
                return (
                  <motion.button key={t.id} type="button" role="checkbox" aria-checked={on} disabled={full} whileTap={{ scale: 0.95 }} onClick={() => toggle(t.id)}
                    className={cn('relative flex h-14 items-center gap-2.5 rounded-xl border px-2.5 text-left transition-colors disabled:opacity-40', on ? 'border-tomato bg-tomato-50 ring-1 ring-tomato' : 'border-line bg-white hover:border-ink/30')}>
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cream-2">
                      {t.image ? <img src={t.image} alt="" className="size-7 object-contain" /> : <span className="size-6"><Piece id={t.id} /></span>}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold">{t.name}</span>
                      <span className="text-xs text-ink-3 tabular">+{money(t.price)}</span>
                    </span>
                    <AnimatePresence>
                      {on && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-1.5 -right-1.5 grid size-6 place-items-center rounded-full bg-tomato text-white">
                          <Check size={12} weight="bold" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </div>
          </Group>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur-lg pb-safe md:hidden">
        <div className="flex items-center gap-3">
          <Stepper value={qty} onChange={setQty} />
          <Button size="lg" full onClick={add} className="flex-1 justify-between">
            <span>Add to cart</span>
            <span className="tabular">{money(price * qty)}</span>
          </Button>
        </div>
      </div>
    </>
  )
}
