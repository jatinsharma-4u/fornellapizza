import { MagnifyingGlass, SlidersHorizontal, X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import ProductCard from '../components/product/ProductCard'
import BottomSheet from '../components/ui/BottomSheet'
import { Chip, EmptyState, VegMark } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import { categories, products, tagMeta } from '../data/products'
import { cn } from '../lib/format'
import { scrollToTop } from '../lib/smoothScroll'

const sorts = [
  { id: 'popular', label: 'Most popular' },
  { id: 'rating', label: 'Top rated' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
]
const dietTags = ['spicy', 'new', 'bestseller']
const diets = [
  { id: 'all', label: 'All' },
  { id: 'veg', label: 'Veg' },
  { id: 'nonveg', label: 'Non-veg' },
]

function DietToggle({ diet, setDiet, className }) {
  return (
    <div role="radiogroup" aria-label="Diet" className={cn('inline-flex rounded-full border border-line bg-white p-0.5', className)}>
      {diets.map((d) => (
        <button key={d.id} type="button" role="radio" aria-checked={diet === d.id} onClick={() => setDiet(d.id)} className="relative flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold">
          {diet === d.id && <motion.span layoutId={`diet-${className ?? ''}`} className="absolute inset-0 rounded-full bg-cream-2 ring-1 ring-line" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
          {d.id !== 'all' && <VegMark veg={d.id === 'veg'} className="relative" />}
          <span className="relative">{d.label}</span>
        </button>
      ))}
    </div>
  )
}

function Filters({ cat, setCat, tags, toggleTag, sort, setSort, maxPrice, setMaxPrice }) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-2.5 text-[12px] font-bold tracking-[0.14em] text-ink-3 uppercase">Category</legend>
        <div className="space-y-1">
          {[{ id: 'all', name: 'Everything' }, ...categories].map((c) => {
            const count = c.id === 'all' ? products.length : products.filter((p) => p.category === c.id).length
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                aria-pressed={cat === c.id}
                className={cn('flex h-11 w-full items-center gap-3 rounded-xl px-2.5 text-left text-[14.5px] font-medium transition-colors', cat === c.id ? 'bg-ink text-cream' : 'hover:bg-white')}
              >
                {c.image ? <img src={c.image} alt="" className="size-7 object-contain" /> : <span className="size-7" />}
                <span className="flex-1">{c.name}</span>
                <span className={cn('text-sm tabular', cat === c.id ? 'text-cream/60' : 'text-ink-3')}>{count}</span>
              </button>
            )
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2.5 text-[12px] font-bold tracking-[0.14em] text-ink-3 uppercase">Dietary & more</legend>
        <div className="flex flex-wrap gap-2">
          {dietTags.map((t) => (
            <Chip key={t} active={tags.includes(t)} onClick={() => toggleTag(t)}>
              {tagMeta[t].label}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2.5 flex w-full justify-between text-[12px] font-bold tracking-[0.14em] text-ink-3 uppercase">
          Max price <span className="tracking-normal text-ink tabular">${maxPrice}</span>
        </legend>
        <input type="range" min={3} max={20} step={1} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} aria-label="Maximum price" className="w-full accent-tomato" />
        <div className="mt-1 flex justify-between text-xs text-ink-3"><span>$3</span><span>$20</span></div>
      </fieldset>
      <fieldset>
        <legend className="mb-2.5 text-[12px] font-bold tracking-[0.14em] text-ink-3 uppercase">Sort by</legend>
        <div className="flex flex-wrap gap-2">
          {sorts.map((s) => (
            <Chip key={s.id} active={sort === s.id} onClick={() => setSort(s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

export default function Order() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [tags, setTags] = useState([])
  const [sort, setSort] = useState('popular')
  const [maxPrice, setMaxPrice] = useState(20)
  const [diet, setDiet] = useState('all')
  const [sheet, setSheet] = useState(params.get('filters') === '1')
  const searchRef = useRef(null)
  const cat = params.get('cat') ?? 'all'

  useEffect(() => {
    if (params.get('focus') === 'search') searchRef.current?.focus()
  }, [params])

  // Any filter change restarts the list from the top of the page
  const filterKey = `${cat}|${tags.join(',')}|${sort}|${maxPrice}|${diet}`
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    scrollToTop()
  }, [filterKey])

  const setCat = (c) => {
    const next = new URLSearchParams(params)
    if (c === 'all') next.delete('cat')
    else next.set('cat', c)
    setParams(next, { replace: true })
  }
  const toggleTag = (t) => setTags((all) => (all.includes(t) ? all.filter((x) => x !== t) : [...all, t]))
  const reset = () => {
    setTags([])
    setSort('popular')
    setMaxPrice(20)
    setDiet('all')
    setQuery('')
    setCat('all')
  }

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    let out = products.filter(
      (p) =>
        (cat === 'all' || p.category === cat) &&
        tags.every((t) => p.tags.includes(t)) &&
        (diet === 'all' || (diet === 'veg' ? p.veg : !p.veg)) &&
        p.price <= maxPrice &&
        (!q || `${p.name} ${p.short} ${p.ingredients.join(' ')}`.toLowerCase().includes(q)),
    )
    const sorters = {
      popular: (a, b) => b.reviews - a.reviews,
      rating: (a, b) => b.rating - a.rating,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
    }
    return [...out].sort(sorters[sort])
  }, [cat, tags, maxPrice, query, sort, diet])

  const activeCount = tags.length + (sort !== 'popular') + (maxPrice < 20) + (diet !== 'all')
  const filterProps = { cat, setCat, tags, toggleTag, sort, setSort, maxPrice, setMaxPrice }
  const current = categories.find((c) => c.id === cat)

  return (
    <>
      <PageHeader
        eyebrow="Order online"
        title={current ? current.plural : 'The whole'}
        accent={current ? null : 'menu'}
        mobileTitle="Menu"
        subtitle={current ? current.blurb : 'Pizzas, burgers, sides, cold drinks and desserts — all made to order.'}
        crumbs={[{ label: 'Order online' }]}
        back={false}
      />

      {/* Mobile: sticky search + category chips */}
      <div className="sticky top-14 z-30 bg-cream/95 px-4 pt-1 pb-3 backdrop-blur-lg md:hidden">
        <div className="flex gap-2">
          <label className="flex h-11 flex-1 items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 focus-within:border-ink">
            <MagnifyingGlass size={18} weight="bold" aria-hidden />
            <span className="sr-only">Search the menu</span>
            <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Search dishes…" className="h-full min-w-0 flex-1 bg-transparent text-[16px] outline-none" />
          </label>
          <button type="button" onClick={() => setSheet(true)} aria-label="Filters" className="relative grid size-11 place-items-center rounded-xl bg-ink text-cream">
            <SlidersHorizontal size={20} weight="bold" />
            {activeCount > 0 && <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-tomato text-[11px] font-bold">{activeCount}</span>}
          </button>
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
          {[{ id: 'all', name: 'All' }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              aria-pressed={cat === c.id}
              className={cn('relative flex h-9 shrink-0 items-center gap-1.5 rounded-full pr-3.5 pl-1 text-[13px] font-semibold', cat === c.id ? 'text-cream' : 'border border-line bg-white text-ink-2', !c.image && 'pl-3.5')}
            >
              {cat === c.id && <motion.span layoutId="cat-chip" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 450, damping: 34 }} />}
              {c.image && <img src={c.image} alt="" className="relative size-7 rounded-full bg-cream-2 object-contain p-0.5" />}
              <span className="relative">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="container-x grid gap-10 md:grid-cols-[230px_1fr] lg:grid-cols-[250px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-28 space-y-6">
            <label className="flex h-11 items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 focus-within:border-ink">
              <MagnifyingGlass size={18} weight="bold" aria-hidden />
              <span className="sr-only">Search the menu</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Search dishes…" className="h-full min-w-0 flex-1 bg-transparent outline-none" />
            </label>
            <Filters {...filterProps} />
            {activeCount > 0 && (
              <button type="button" onClick={reset} className="text-sm font-semibold text-tomato underline-offset-4 hover:underline">
                Reset all filters
              </button>
            )}
          </div>
        </aside>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <DietToggle diet={diet} setDiet={setDiet} />
            <p className="text-[13px] text-ink-3" aria-live="polite">
              <b className="text-ink">{list.length}</b> {list.length === 1 ? 'dish' : 'dishes'}
            </p>
          </div>
          {(tags.length > 0 || query) && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {query && (
                <button type="button" onClick={() => setQuery('')} className="flex h-7 items-center gap-1 rounded-full border border-line bg-white px-2.5 text-[12.5px] font-semibold">
                  “{query}” <X size={11} weight="bold" />
                </button>
              )}
              {tags.map((t) => (
                <button key={t} type="button" onClick={() => toggleTag(t)} className="flex h-7 items-center gap-1 rounded-full border border-line bg-white px-2.5 text-[12.5px] font-semibold">
                  {tagMeta[t].label} <X size={11} weight="bold" />
                </button>
              ))}
            </div>
          )}
          {list.length === 0 ? (
            <EmptyState image="/img/slice-olive.webp" title="Nothing matches… yet" body="Try removing a filter or searching for something else." action={<Button onClick={reset} variant="dark">Clear filters</Button>} />
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 lg:gap-5">
              <AnimatePresence mode="popLayout">
                {list.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.035 } }}
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
                  >
                    <ProductCard product={p} className="h-full" priority={i < 4} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <BottomSheet
        open={sheet}
        onClose={() => setSheet(false)}
        title="Filters"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>Reset</Button>
            <Button full onClick={() => setSheet(false)}>Show {list.length} dishes</Button>
          </div>
        }
      >
        <Filters {...filterProps} />
      </BottomSheet>
    </>
  )
}
