import { X } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { describeOptions, money } from '../../lib/format'
import { resolveLine, useStore } from '../../store/StoreProvider'
import { Stepper } from '../ui/Bits'

export default function CartLine({ line }) {
  const { setQty, removeLine } = useStore()
  const product = resolveLine(line)
  if (!product) return null
  const detail = line.meta ? line.meta.short : describeOptions(product, line.options)

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, transition: { duration: 0.22 } }}
      className="flex gap-3.5 overflow-hidden py-4 first:pt-1"
    >
      <Link to={line.meta ? '/build' : `/product/${line.id}`} className="relative size-[72px] shrink-0 rounded-2xl bg-cream-2">
        <img src={product.image} alt="" className="img-fit" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-[15.5px] font-semibold">{product.name}</h3>
            {detail && <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-ink-3">{detail}</p>}
          </div>
          <span className="shrink-0 text-[15px] font-bold tabular">{money(line.price * line.qty)}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <button type="button" onClick={() => removeLine(line.key)} className="-ml-1 flex items-center gap-1 rounded-full px-1 py-1 text-[12.5px] font-semibold text-ink-3 transition-colors hover:text-tomato">
            <X size={12} weight="bold" /> Remove
          </button>
          <Stepper size="sm" min={1} value={line.qty} onChange={(q) => setQty(line.key, q)} label={`${product.name} quantity`} />
        </div>
      </div>
    </motion.li>
  )
}

export function Summary({ totals, className }) {
  const rows = [
    ['Subtotal', money(totals.subtotal)],
    totals.discount > 0 && [`Discount · ${totals.promo.label}`, `−${money(totals.discount)}`, 'text-basil'],
    ['Delivery', totals.delivery === 0 ? 'Free' : money(totals.delivery), totals.delivery === 0 && 'text-basil'],
    ['Tax (8%)', money(totals.tax)],
  ].filter(Boolean)
  return (
    <dl className={className}>
      {rows.map(([k, v, c]) => (
        <div key={k} className="flex justify-between py-1 text-sm">
          <dt className="text-ink-2">{k}</dt>
          <dd className={`font-semibold tabular ${c || ''}`}>{v}</dd>
        </div>
      ))}
      <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3">
        <dt className="font-semibold">Total</dt>
        <dd className="text-xl font-bold tabular">{money(totals.total)}</dd>
      </div>
    </dl>
  )
}
