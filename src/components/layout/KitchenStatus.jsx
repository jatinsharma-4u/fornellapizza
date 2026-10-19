import { CalendarBlank, Clock, Moped, Storefront, Timer, Warning } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { brand } from '../../data/site'
import { cn } from '../../lib/format'
import { useStore } from '../../store/StoreProvider'
import Button from '../ui/Button'

// eslint-disable-next-line react-refresh/only-export-components
export const kitchenCopy = {
  busy: {
    title: 'We’re really busy right now',
    body: 'Our ovens are at full capacity, so new delivery orders are taking about 60–75 minutes. Pickup is faster, or you can schedule for later.',
    banner: 'Kitchen is very busy — delivery currently 60–75 min',
    wait: '60–75 min',
  },
  closed: {
    title: 'We’re closed at the moment',
    body: 'The kitchen is closed right now, but you can browse the menu and schedule an order for when we reopen.',
    banner: 'We’re closed right now — schedule an order for later',
    wait: null,
  },
}

/** Thin status strip shown site-wide while the kitchen is busy or closed. */
export function KitchenBanner({ className }) {
  const { kitchen } = useStore()
  if (kitchen === 'open') return null
  const busy = kitchen === 'busy'
  return (
    <Link
      to="/kitchen-status"
      className={cn('flex items-center justify-center gap-2 px-4 py-2 text-center text-[12.5px] font-semibold', busy ? 'bg-saffron-100 text-[#6b4500]' : 'bg-ink text-cream', className)}
    >
      {busy ? <Timer size={15} weight="fill" /> : <Clock size={15} weight="fill" />}
      {kitchenCopy[kitchen].banner}
      <span className="underline underline-offset-2">Details</span>
    </Link>
  )
}

/**
 * Full-screen state used when the kitchen can't take orders normally.
 * `onContinue(choice)` lets checkout continue with the chosen fallback.
 */
export function KitchenScreen({ onContinue, compact }) {
  const { kitchen } = useStore()
  const busy = kitchen === 'busy'
  const c = kitchenCopy[kitchen] ?? kitchenCopy.busy

  return (
    <div className={cn('mx-auto max-w-lg text-center', compact ? 'py-6' : 'py-10 md:py-16')}>
      <div className="relative mx-auto grid size-40 place-items-center">
        <motion.span
          className={cn('absolute inset-0 rounded-full', busy ? 'bg-saffron-100' : 'bg-cream-3')}
          animate={busy ? { scale: [1, 1.06, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        />
        <img src="/img/pepperoni.webp" alt="" className="relative size-28 object-contain opacity-90 grayscale-[35%]" />
        <span className={cn('absolute -right-1 bottom-3 grid size-12 place-items-center rounded-full text-white ring-4 ring-cream', busy ? 'bg-[#b7791f]' : 'bg-ink')}>
          {busy ? <Warning size={22} weight="fill" /> : <Clock size={22} weight="fill" />}
        </span>
      </div>
      <h1 className="mt-6 text-h2">{c.title}</h1>
      <p className="mx-auto mt-2 max-w-md text-ink-2">{c.body}</p>

      {busy ? (
        <ul className="mx-auto mt-5 grid max-w-sm gap-2 text-left text-[14px]">
          <li className="flex items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5"><Moped size={18} className="text-tomato" /> Delivery: <b className="ml-auto">{c.wait}</b></li>
          <li className="flex items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5"><Storefront size={18} className="text-basil" /> Pickup: <b className="ml-auto">~25 min</b></li>
        </ul>
      ) : (
        <dl className="mx-auto mt-5 max-w-xs space-y-1 rounded-xl border border-line bg-white px-4 py-3 text-left text-[14px]">
          {brand.hours.map((h) => (
            <div key={h.days} className="flex justify-between"><dt className="text-ink-2">{h.days}</dt><dd className="font-semibold tabular">{h.time}</dd></div>
          ))}
        </dl>
      )}

      <div className="mx-auto mt-6 grid max-w-sm gap-2">
        {onContinue ? (
          <>
            <Button size="lg" onClick={() => onContinue('schedule')}><CalendarBlank weight="bold" /> Schedule for later</Button>
            {busy && <Button size="lg" variant="outline" onClick={() => onContinue('pickup')}><Storefront weight="bold" /> Switch to pickup</Button>}
            {busy && <button type="button" onClick={() => onContinue('anyway')} className="mt-1 text-[13.5px] font-semibold text-ink-2 underline underline-offset-4 hover:text-ink">Order delivery anyway ({c.wait})</button>}
          </>
        ) : (
          <Button to="/order" size="lg">Browse the menu</Button>
        )}
        <Link to="/cart" className="mt-1 text-[13px] font-semibold text-ink-3 hover:text-ink">Back to cart</Link>
      </div>
    </div>
  )
}
