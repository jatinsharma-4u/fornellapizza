import { CaretLeft, CaretRight, Check, Clock, Fire, Heart, LinkSimple, ShareNetwork, Star } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CartFab } from '../components/layout/CartIcon'
import ProductCard, { ProductRow } from '../components/product/ProductCard'
import { Stepper, Tag } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import { byCategory, categories, getProduct, optionsFor, products } from '../data/products'
import { cn, defaultOptions, money, unitPrice } from '../lib/format'
import { useStore } from '../store/StoreProvider'
import NotFound from './NotFound'

const sizeScale = { s: 0.84, m: 0.92, l: 1, single: 0.92, double: 1, reg: 0.9, lg: 1, share: 1 }

function OptionGroup({ title, hint, children }) {
  return (
    <fieldset className="mt-6">
      <legend className="mb-2.5 flex w-full items-baseline justify-between">
        <span className="text-[12px] font-bold tracking-[0.14em] text-ink-3 uppercase">{title}</span>
        {hint && <span className="text-[12.5px] text-ink-3">{hint}</span>}
      </legend>
      {children}
    </fieldset>
  )
}

export default function Product() {
  const { id } = useParams()
  const product = getProduct(id)
  if (!product) return <NotFound />
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }) {
  const navigate = useNavigate()
  const { addToCart, isFavorite, toggleFavorite } = useStore()
  const opts = optionsFor(product)
  const [options, setOptions] = useState(defaultOptions(product))
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [copied, setCopied] = useState(false)
  const imgRef = useRef(null)
  const price = unitPrice(product, options)
  const fav = isFavorite(product.id)
  const category = categories.find((c) => c.id === product.category)
  const pairings = ['classic-fries', 'pink-lemonade', 'buffalo-wings', 'choco-sundae', 'virgin-mojito', 'truffle-fries']
    .filter((x) => x !== product.id)
    .map(getProduct)
    .slice(0, 3)
  const similar = byCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4)
  const idx = products.findIndex((p) => p.id === product.id)
  const prev = products[(idx - 1 + products.length) % products.length]
  const next = products[(idx + 1) % products.length]

  const toggleExtra = (eid) => setOptions((o) => ({ ...o, extras: o.extras.includes(eid) ? o.extras.filter((x) => x !== eid) : [...o.extras, eid] }))

  const handleAdd = () => {
    addToCart(product.id, options, qty, { from: imgRef.current })
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const share = async () => {
    try {
      if (navigator.share) return await navigator.share({ title: product.name, url: window.location.href })
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* share sheet dismissed */
    }
  }

  const stats = [
    { icon: Fire, label: `${product.kcal} kcal`, tint: 'text-tomato' },
    { icon: Star, label: `${product.rating.toFixed(1)} (${product.reviews >= 1000 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews})`, tint: 'text-saffron' },
    { icon: Clock, label: `${product.time} min`, tint: 'text-basil' },
  ]

  return (
    <div className="pb-28 md:pb-0">
      {/* Mobile overlay controls */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-3 md:hidden">
        <motion.button whileTap={{ scale: 0.88 }} type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/order'))} aria-label="Go back" className="grid size-10 place-items-center rounded-full bg-white/95 shadow-soft backdrop-blur">
          <CaretLeft weight="bold" size={16} />
        </motion.button>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.88 }} type="button" onClick={share} aria-label={copied ? 'Link copied' : 'Share'} className="grid size-10 place-items-center rounded-full bg-white/95 shadow-soft backdrop-blur">
            {copied ? <Check weight="bold" size={16} className="text-basil" /> : <ShareNetwork weight="bold" size={16} />}
          </motion.button>
          <motion.button whileTap={{ scale: 0.8 }} type="button" onClick={() => toggleFavorite(product.id)} aria-pressed={fav} aria-label="Favourite" className={cn('grid size-10 place-items-center rounded-full bg-white/95 shadow-soft backdrop-blur', fav && 'text-tomato')}>
            <Heart weight={fav ? 'fill' : 'bold'} size={16} />
          </motion.button>
          <CartFab className="size-10" />
        </div>
      </div>

      <div className="md:container-x md:pt-6">
        <nav aria-label="Breadcrumb" className="mb-5 hidden items-center gap-1.5 text-[13px] text-ink-3 md:flex">
          <Link to="/" className="hover:text-ink">Home</Link>
          <CaretRight size={11} weight="bold" />
          <Link to={`/order?cat=${product.category}`} className="hover:text-ink">{category.plural}</Link>
          <CaretRight size={11} weight="bold" />
          <span className="text-ink" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 md:gap-10 lg:gap-16">
          {/* Stage */}
          <div className="md:sticky md:top-24 md:self-start">
            <div className={cn('relative bg-cream-2 pt-16 pb-12 md:rounded-[24px] md:pt-10 md:pb-10', product.soldOut && 'grayscale')}>
              <div className="relative mx-auto aspect-square w-[74%] max-w-[420px]">
                <div className="absolute inset-0 rounded-full border border-dashed border-ink/10" aria-hidden />
                <motion.img
                  ref={imgRef}
                  src={product.image}
                  alt={product.name}
                  initial={{ rotate: product.category === 'pizza' ? -60 : 0, scale: 0.7, opacity: 0 }}
                  animate={{ rotate: 0, scale: sizeScale[options.size] ?? 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  className={cn('absolute inset-0 m-auto object-contain drop-shadow-[0_22px_24px_rgba(70,35,10,0.26)]', product.category === 'pizza' ? 'size-[92%]' : 'size-[80%]')}
                />
              </div>
            </div>
            <div className="mt-3 hidden justify-between text-[13px] md:flex">
              <Link to={`/product/${prev.id}`} className="flex items-center gap-1.5 font-semibold text-ink-3 hover:text-ink"><CaretLeft weight="bold" /> {prev.name}</Link>
              <Link to={`/product/${next.id}`} className="flex items-center gap-1.5 font-semibold text-ink-3 hover:text-ink">{next.name} <CaretRight weight="bold" /></Link>
            </div>
          </div>

          {/* Details */}
          <div className="relative -mt-5 rounded-t-[24px] bg-cream px-4 pt-6 md:mt-0 md:rounded-none md:px-0 md:pt-0">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex flex-wrap items-center gap-2">
                {product.tags.map((t) => <Tag key={t} tag={t} />)}
                <span className="text-[13px] font-medium text-ink-3">{category.name}</span>
              </div>
              <div className="mt-2.5 flex items-start justify-between gap-4">
                <h1 className="text-h1">{product.name}</h1>
                <div className="hidden shrink-0 gap-2 md:flex">
                  <button type="button" onClick={share} aria-label={copied ? 'Link copied' : 'Copy link'} className="grid size-10 place-items-center rounded-full border border-line bg-white text-ink-2 hover:text-ink">
                    {copied ? <Check weight="bold" size={17} className="text-basil" /> : <LinkSimple weight="bold" size={17} />}
                  </button>
                  <button type="button" onClick={() => toggleFavorite(product.id)} aria-pressed={fav} aria-label="Favourite" className={cn('grid size-10 place-items-center rounded-full border border-line bg-white', fav ? 'text-tomato' : 'text-ink-2 hover:text-ink')}>
                    <Heart weight={fav ? 'fill' : 'bold'} size={17} />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-[15px] text-ink-2">{product.short}</p>
              {product.soldOut && (
                <p role="status" className="mt-3 rounded-xl border border-line bg-cream-2 px-3.5 py-2.5 text-[13.5px] text-ink-2">
                  <b className="text-ink">Sold out for today.</b> We make a fixed batch each morning — it’ll be back tomorrow. Try something from “Pairs well with” below.
                </p>
              )}

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="font-display text-[28px] font-semibold tabular">{money(price)}</p>
                <ul className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-[13px] text-ink-2">
                  {stats.map((s) => (
                    <li key={s.label} className="flex items-center gap-1">
                      <s.icon size={15} weight="fill" className={s.tint} aria-hidden />
                      {s.label}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 border-t border-line pt-4 text-[15px] leading-relaxed text-ink-2">{product.description}</p>

              <OptionGroup title="What’s inside">
                <ul className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing) => (
                    <li key={ing} className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium">{ing}</li>
                  ))}
                </ul>
              </OptionGroup>

              {opts.sizes && (
                <OptionGroup title="Size" hint="Required">
                  <div role="radiogroup" aria-label="Choose size" className={cn('grid gap-2', opts.sizes.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
                    {opts.sizes.map((s) => {
                      const active = options.size === s.id
                      return (
                        <button key={s.id} type="button" role="radio" aria-checked={active} onClick={() => setOptions((o) => ({ ...o, size: s.id }))}
                          className={cn('rounded-xl border px-3 py-2.5 text-left transition-colors', active ? 'border-ink bg-white ring-1 ring-ink' : 'border-line bg-white hover:border-ink/40')}>
                          <span className="block text-[14px] font-semibold">{s.name}</span>
                          <span className="text-[12.5px] text-ink-3">{s.detail}{s.delta ? ` · +${money(s.delta)}` : ''}</span>
                        </button>
                      )
                    })}
                  </div>
                </OptionGroup>
              )}

              {opts.crusts && (
                <OptionGroup title="Crust">
                  <div role="radiogroup" aria-label="Choose crust" className="flex flex-wrap gap-2">
                    {opts.crusts.map((c) => {
                      const active = options.crust === c.id
                      return (
                        <button key={c.id} type="button" role="radio" aria-checked={active} onClick={() => setOptions((o) => ({ ...o, crust: c.id }))}
                          className={cn('flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors', active ? 'border-ink bg-ink text-cream' : 'border-line bg-white hover:border-ink/40')}>
                          {c.name}
                          {c.delta > 0 && <span className={active ? 'text-cream/70' : 'text-ink-3'}>+{money(c.delta)}</span>}
                        </button>
                      )
                    })}
                  </div>
                </OptionGroup>
              )}

              {opts.extras && (
                <OptionGroup title="Extras" hint="Optional">
                  <div className="divide-y divide-line rounded-xl border border-line bg-white">
                    {opts.extras.map((e) => {
                      const on = options.extras.includes(e.id)
                      return (
                        <button key={e.id} type="button" role="checkbox" aria-checked={on} onClick={() => toggleExtra(e.id)} className="flex h-12 w-full items-center gap-3 px-3.5 text-left">
                          <span className={cn('grid size-5 shrink-0 place-items-center rounded-md border transition-colors', on ? 'border-tomato bg-tomato text-white' : 'border-ink/25')}>
                            {on && <Check size={12} weight="bold" />}
                          </span>
                          <span className="flex-1 text-[14px] font-medium">{e.name}</span>
                          <span className="text-[13px] text-ink-3 tabular">+{money(e.delta)}</span>
                        </button>
                      )
                    })}
                  </div>
                </OptionGroup>
              )}

              <div className="mt-7 hidden items-center gap-3 md:flex">
                {!product.soldOut && <Stepper value={qty} onChange={setQty} />}
                <AddButton added={added} onClick={handleAdd} total={price * qty} soldOut={product.soldOut} />
              </div>
              <p className="mt-3 hidden text-[13px] text-ink-3 md:block">Free delivery over $25 · Baked fresh to order</p>
            </motion.div>

            <section className="mt-10">
              <h2 className="mb-3 text-[18px]">Pairs well with</h2>
              <div className="space-y-2.5">
                {pairings.map((p) => <ProductRow key={p.id} product={p} />)}
              </div>
            </section>
          </div>
        </div>
      </div>

      <section className="container-x section-y">
        <SectionHeading title={`More ${category.plural.toLowerCase()}`} action={{ to: `/order?cat=${product.category}`, label: 'See all' }} />
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {similar.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}>
              <ProductCard product={p} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur-lg pb-safe md:hidden">
        <div className="flex items-center gap-3">
          {!product.soldOut && <Stepper value={qty} onChange={setQty} />}
          <AddButton added={added} onClick={handleAdd} total={price * qty} soldOut={product.soldOut} />
        </div>
      </div>
    </div>
  )
}

function AddButton({ added, onClick, total, soldOut }) {
  if (soldOut)
    return (
      <Button size="lg" full disabled variant="dark" className="flex-1">
        Sold out — back tomorrow
      </Button>
    )
  return (
    <Button onClick={onClick} size="lg" full className="flex-1 justify-between">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={added ? 'added' : 'add'} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.16 }} className="flex items-center gap-1.5">
          {added ? <><Check weight="bold" /> Added</> : 'Add to cart'}
        </motion.span>
      </AnimatePresence>
      <span className="tabular">{money(total)}</span>
    </Button>
  )
}
