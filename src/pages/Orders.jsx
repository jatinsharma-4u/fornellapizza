import { ArrowClockwise, CaretRight, Check, MapTrifold } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import { EmptyState } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import { cn, defaultOptions, formatDate, formatTime, money } from '../lib/format'
import { resolveLine, useStore } from '../store/StoreProvider'

const statusMeta = {
  active: { label: 'In progress', className: 'bg-saffron-100 text-[#7a4f00]' },
  delivered: { label: 'Delivered', className: 'bg-basil-50 text-basil' },
  cancelled: { label: 'Cancelled', className: 'bg-cream-3 text-ink-2' },
}
const filters = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'delivered', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

export default function Orders() {
  const { orders, addToCart } = useStore()
  const [filter, setFilter] = useState('all')
  const [reordered, setReordered] = useState(null)
  const list = orders.filter((o) => filter === 'all' || o.status === filter)

  const reorder = (o, el) => {
    o.items.forEach((it, i) => {
      const p = resolveLine(it)
      if (!p) return
      addToCart(it.id, it.meta ? {} : it.options ?? defaultOptions(p), it.qty, { meta: it.meta, from: i === 0 ? el : null })
    })
    setReordered(o.id)
    setTimeout(() => setReordered(null), 1600)
  }

  return (
    <>
      <PageHeader title="Order history" mobileTitle="My orders" subtitle="Track active orders, view receipts and reorder favourites." crumbs={[{ to: '/profile', label: 'Account' }, { label: 'Orders' }]} />
      <div className="container-x max-w-3xl pt-1 md:pt-0">
        <div role="tablist" aria-label="Filter orders" className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {filters.map((f) => (
            <button key={f.id} role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)} className={cn('relative h-9 shrink-0 rounded-full px-4 text-[13px] font-semibold', filter === f.id ? 'text-cream' : 'border border-line bg-white text-ink-2')}>
              {filter === f.id && <motion.span layoutId="orders-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 450, damping: 36 }} />}
              <span className="relative">{f.label} <span className="opacity-60">{f.id === 'all' ? orders.length : orders.filter((o) => o.status === f.id).length}</span></span>
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState
            image="/img/fries.webp"
            title={filter === 'all' ? 'No orders yet' : `No ${filters.find((f) => f.id === filter).label.toLowerCase()} orders`}
            body="When you place an order it will appear here, ready to track or reorder."
            action={<Button to="/order">Order something</Button>}
          />
        ) : (
          <ul className="space-y-3">
            <AnimatePresence mode="popLayout">
              {list.map((o, i) => {
                const items = o.items.map((it) => ({ ...it, p: resolveLine(it) })).filter((x) => x.p)
                const s = statusMeta[o.status]
                return (
                  <motion.li key={o.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }} exit={{ opacity: 0 }} className="rounded-[20px] border border-line bg-white p-4 md:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/track/${o.id}`} className="text-[15px] font-semibold hover:text-tomato">{o.id}</Link>
                        <p className="text-[12.5px] text-ink-3">{formatDate(o.date)} · {formatTime(o.date)} · {o.mode === 'pickup' ? 'Pickup' : 'Delivery'}</p>
                      </div>
                      <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold', s.className)}>{s.label}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3" data-reorder-img>
                      <div className="flex -space-x-2.5">
                        {items.slice(0, 4).map((it, k) => (
                          <span key={k} className="grid size-11 place-items-center rounded-xl bg-cream-2 ring-[3px] ring-white">
                            <img src={it.p.image} alt="" className="size-9 object-contain" />
                          </span>
                        ))}
                      </div>
                      <p className="min-w-0 flex-1 truncate text-[13px] text-ink-2">{items.map((it) => `${it.qty}× ${it.p.name}`).join(', ')}</p>
                    </div>
                    <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-line pt-3.5">
                      <span className="text-[16px] font-bold tabular">{money(o.total)}</span>
                      <div className="flex gap-2">
                        {o.status === 'active' ? (
                          <Button to={`/track/${o.id}`} size="sm"><MapTrifold weight="bold" /> Track order</Button>
                        ) : (
                          <>
                            <Button to={`/track/${o.id}`} size="sm" variant="outline">Receipt <CaretRight weight="bold" /></Button>
                            <Button size="sm" variant="dark" onClick={(e) => reorder(o, e.currentTarget.closest('li').querySelector('[data-reorder-img] img'))}>
                              {reordered === o.id ? <><Check weight="bold" /> Added</> : <><ArrowClockwise weight="bold" /> Reorder</>}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
        )}
        <p className="mt-8 text-center text-[13px] text-ink-3">
          Problem with an order? <Link to="/help" className="font-semibold text-tomato">Visit the help centre</Link>
        </p>
      </div>
    </>
  )
}
