import { ChatCircleDots, Check, CookingPot, House, Info, Moped, Phone, Receipt, SealCheck, Star, X } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import OrderSummary from '../components/product/OrderSummary'
import { EmptyState } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import { cn, formatTime } from '../lib/format'
import { useStore } from '../store/StoreProvider'

const stages = [
  { id: 'placed', label: 'Order placed', body: 'We’ve received your order.', icon: Receipt },
  { id: 'confirmed', label: 'Confirmed', body: 'The kitchen accepted your ticket.', icon: SealCheck },
  { id: 'preparing', label: 'Preparing', body: 'Hand-stretched and in the 450°C oven.', icon: CookingPot },
  { id: 'out', label: 'Out for delivery', body: 'Marco is on his way to you.', icon: Moped },
  { id: 'delivered', label: 'Delivered', body: 'Enjoy every slice!', icon: House },
]
// Simulated pacing so the whole journey can be watched in about a minute.
const STAGE_MS = 12000
const CANCEL_WINDOW_MS = 2 * 60000
const ROUTE = 'M70 330 C 130 330, 140 250, 210 240 S 300 180, 330 150 S 420 90, 470 70'

function MapIllustration({ progress }) {
  const pathRef = useRef(null)
  const [pt, setPt] = useState({ x: 70, y: 330 })
  useLayoutEffect(() => {
    const p = pathRef.current
    if (!p) return
    const point = p.getPointAtLength(p.getTotalLength() * progress)
    setPt({ x: point.x, y: point.y })
  }, [progress])

  return (
    <svg viewBox="0 0 540 400" className="size-full" role="img" aria-label={`Simulated delivery route, ${Math.round(progress * 100)}% complete`}>
      <rect width="540" height="400" fill="#F4E8D8" />
      {[[20, 20, 140, 90], [180, 20, 120, 60], [330, 110, 90, 40], [20, 150, 100, 120], [150, 280, 160, 100], [360, 200, 160, 80], [440, 20, 80, 30], [340, 300, 180, 80]].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="12" fill="#EAD9C3" />
      ))}
      <rect x="170" y="110" width="130" height="90" rx="18" fill="#D3E6D8" />
      <path d="M0 230 Q 270 210 540 300" stroke="#CFE2EE" strokeWidth="24" fill="none" />
      {['M0 120 H540', 'M0 280 H540', 'M150 0 V400', 'M320 0 V400', 'M440 0 V400'].map((d) => <path key={d} d={d} stroke="#fff" strokeWidth="12" fill="none" />)}
      <path d={ROUTE} stroke="#2A1A10" strokeOpacity="0.12" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path ref={pathRef} d={ROUTE} fill="none" />
      <motion.path d={ROUTE} stroke="#C8381C" strokeWidth="5" fill="none" strokeLinecap="round" initial={false} animate={{ pathLength: progress }} transition={{ duration: 1, ease: 'easeInOut' }} />
      <g transform="translate(70 330)"><circle r="17" fill="#2A1A10" /><path d="M-6 -1h12v8h-12z M-8 -3 L0 -9 L8 -3" fill="#FFFAF3" /></g>
      <g transform="translate(470 70)">
        <circle r="24" fill="#C8381C" opacity="0.18"><animate attributeName="r" values="16;30;16" dur="2.4s" repeatCount="indefinite" /></circle>
        <circle r="16" fill="#C8381C" /><path d="M-6 1 L0 -6 L6 1 V7 H-6Z" fill="#fff" />
      </g>
      <motion.g initial={false} animate={{ x: pt.x, y: pt.y }} transition={{ duration: 1, ease: 'easeInOut' }}>
        <circle r="19" fill="#F2B13A" stroke="#fff" strokeWidth="4" />
        <path d="M-8 4 a3.5 3.5 0 1 0 0.1 0 M8 4 a3.5 3.5 0 1 0 0.1 0 M-8 4 L-2 -4 H5 L8 4 M-2 -4 L-4 -8" stroke="#2A1A10" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </svg>
  )
}

export default function Track() {
  const { id } = useParams()
  const { orders, cancelOrder } = useStore()
  const order = orders.find((o) => o.id === id)
  const [now, setNow] = useState(() => Date.now())
  const live = order?.status === 'active'

  useEffect(() => {
    if (!live) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [live])

  if (!order)
    return (
      <>
        <PageHeader title="Track order" crumbs={[{ label: 'Track' }]} />
        <EmptyState image="/img/slice-olive.webp" title="We can’t find that order" body="Check your order history for the right number." action={<Button to="/orders">My orders</Button>} />
      </>
    )

  const start = new Date(order.date).getTime()
  const elapsed = now - start
  const cancelled = order.status === 'cancelled'
  const last = stages.length - 1
  const stageIndex = cancelled ? 0 : live ? Math.min(last, Math.floor(elapsed / STAGE_MS)) : last
  const delivered = !cancelled && stageIndex === last
  const pickup = order.mode === 'pickup'
  const progress = stageIndex < 3 ? 0 : delivered ? 1 : Math.min(0.95, (elapsed - 3 * STAGE_MS) / STAGE_MS)
  const eta = new Date(start + (pickup ? 15 : 30) * 60000).toISOString()
  const canCancel = live && elapsed < CANCEL_WINDOW_MS && stageIndex < 2

  const title = cancelled ? 'Order cancelled' : delivered ? 'Delivered — enjoy!' : stages[stageIndex].label

  return (
    <>
      <PageHeader title={title} mobileTitle={`Order ${order.id}`} crumbs={[{ to: '/orders', label: 'Orders' }, { label: order.id }]} />
      <div className="container-x grid gap-5 pt-2 pb-12 md:grid-cols-[1.15fr_1fr] md:gap-8 md:pt-0">
        <div>
          <div className="overflow-hidden rounded-[20px] border border-line md:sticky md:top-24">
            <div className="aspect-[540/400]"><MapIllustration progress={cancelled ? 0 : progress} /></div>
            <div className="flex items-center gap-3.5 bg-ink p-4 text-cream">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-saffron text-ink">
                {cancelled ? <X size={22} weight="bold" /> : delivered ? <Check size={22} weight="bold" /> : <Moped size={22} weight="fill" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] text-cream/60">{cancelled ? 'Status' : delivered ? 'Delivered' : pickup ? 'Ready for pickup around' : 'Estimated arrival'}</p>
                <p className="truncate text-[17px] font-semibold">{cancelled ? 'Cancelled — no charge' : delivered ? 'Hope it’s delicious!' : formatTime(eta)}</p>
              </div>
              {!cancelled && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase">{stages[stageIndex].label}</span>}
            </div>
          </div>
          <p className="mt-3 flex items-start gap-2 text-[12.5px] text-ink-3">
            <Info size={15} className="mt-0.5 shrink-0" /> Simulated tracking for demonstration — statuses advance automatically every few seconds.
          </p>
        </div>

        <div className="space-y-4">
          <section className="rounded-[20px] border border-line bg-white p-4 md:p-6" aria-label="Order status">
            <ol>
              {stages.map((s, i) => {
                const done = !cancelled && (i < stageIndex || delivered)
                const current = !cancelled && i === stageIndex && !delivered
                return (
                  <li key={s.id} className="relative flex gap-3.5 pb-5 last:pb-0">
                    {i < last && (
                      <span className="absolute top-10 bottom-0.5 left-[17px] w-0.5 overflow-hidden rounded-full bg-cream-3" aria-hidden>
                        <motion.span className="block w-full bg-basil" initial={false} animate={{ height: done ? '100%' : '0%' }} transition={{ duration: 0.6 }} />
                      </span>
                    )}
                    <span className={cn('relative grid size-9 shrink-0 place-items-center rounded-full transition-colors', done ? 'bg-basil text-white' : current ? 'bg-tomato text-white' : 'bg-cream-2 text-ink-3')}>
                      {current && <span className="absolute inset-0 animate-ping rounded-full bg-tomato/30" />}
                      {done ? <Check weight="bold" size={16} /> : <s.icon weight="fill" size={16} className="relative" />}
                    </span>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className={cn('text-[14.5px] font-semibold', !done && !current && 'text-ink-3')}>{pickup && s.id === 'out' ? 'Ready for pickup' : s.label}</p>
                      <p className="text-[13px] text-ink-3">{pickup && s.id === 'out' ? 'Collect at the counter.' : s.body}</p>
                    </div>
                    {(done || current) && <span className="pt-1 text-[12.5px] text-ink-3 tabular">{formatTime(new Date(start + i * 6 * 60000).toISOString())}</span>}
                  </li>
                )
              })}
            </ol>
            {cancelled && <p className="mt-4 rounded-xl bg-cream-2 px-3.5 py-2.5 text-[13px] text-ink-2">This order was cancelled. Any payment would be refunded in full — see our <Link to="/refund-policy" className="font-semibold text-tomato">refund policy</Link>.</p>}
            {canCancel && (
              <button type="button" onClick={() => cancelOrder(order.id)} className="mt-4 text-[13px] font-semibold text-tomato-600 underline-offset-4 hover:underline">
                Cancel order (free within 2 minutes)
              </button>
            )}
          </section>

          {!cancelled && !pickup && (
            <section className="flex items-center gap-3.5 rounded-[20px] border border-line bg-white p-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-saffron-100 font-display text-lg font-semibold">M</span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold">Marco R.</p>
                <p className="flex items-center gap-1 text-[12.5px] text-ink-3"><Star weight="fill" className="text-saffron" /> 4.9 · Your rider</p>
              </div>
              <a href="tel:+10000000000" aria-label="Call rider" className="grid size-10 place-items-center rounded-full bg-basil-50 text-basil"><Phone weight="fill" size={18} /></a>
              <a href="sms:+10000000000" aria-label="Message rider" className="grid size-10 place-items-center rounded-full bg-tomato-50 text-tomato"><ChatCircleDots weight="fill" size={18} /></a>
            </section>
          )}

          <section className="rounded-[20px] border border-line bg-white p-4 md:p-6">
            <h2 className="mb-4 text-[17px]">Order {order.id}</h2>
            <OrderSummary order={order} />
          </section>
          <div className="grid grid-cols-2 gap-2">
            <Button to="/orders" variant="outline">All orders</Button>
            <Button to="/help" variant="dark">Get help</Button>
          </div>
        </div>
      </div>
    </>
  )
}
