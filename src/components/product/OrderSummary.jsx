import { CreditCard, MapPin, Money, Storefront, Wallet } from '@phosphor-icons/react'
import { describeOptions, money } from '../../lib/format'
import { resolveLine } from '../../store/StoreProvider'

export const paymentLabel = (o) =>
  o.payment === 'card' ? `Card${o.cardLast4 ? ` •••• ${o.cardLast4}` : ''}` : o.payment === 'apple' ? 'Apple Pay / Google Pay' : 'Cash on delivery'

/** Items, delivery details, payment method and totals for a placed order. */
export default function OrderSummary({ order, className }) {
  const PayIcon = order.payment === 'card' ? CreditCard : order.payment === 'apple' ? Wallet : Money
  const rows = [
    ['Subtotal', order.subtotal ?? order.total],
    order.discount > 0 && ['Discount', -order.discount],
    order.delivery != null && ['Delivery', order.delivery],
    order.tax != null && ['Tax', order.tax],
  ].filter(Boolean)
  return (
    <section className={className} aria-label={`Order ${order.id} summary`}>
      <ul className="divide-y divide-line">
        {order.items.map((it, i) => {
          const p = resolveLine(it)
          if (!p) return null
          const detail = it.meta ? it.meta.short : describeOptions(p, it.options)
          return (
            <li key={i} className="flex items-center gap-3 py-3 first:pt-0">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-cream-2">
                <img src={p.image} alt="" className="size-10 object-contain" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-semibold"><span className="tabular text-ink-3">{it.qty}×</span> {p.name}</p>
                {detail && <p className="truncate text-[12.5px] text-ink-3">{detail}</p>}
              </div>
              {it.price != null && <span className="text-[14px] font-semibold tabular">{money(it.price * it.qty)}</span>}
            </li>
          )
        })}
      </ul>

      <div className="mt-3 grid gap-3 border-t border-line pt-4 text-[13.5px] sm:grid-cols-2">
        <p className="flex items-start gap-2.5">
          {order.mode === 'pickup' ? <Storefront size={18} className="mt-0.5 shrink-0 text-ink-3" /> : <MapPin size={18} className="mt-0.5 shrink-0 text-ink-3" />}
          <span>
            <span className="block font-semibold">{order.mode === 'pickup' ? 'Pickup' : 'Delivery'} · {order.when ?? 'ASAP'}</span>
            <span className="text-ink-2">{order.address}</span>
          </span>
        </p>
        <p className="flex items-start gap-2.5">
          <PayIcon size={18} className="mt-0.5 shrink-0 text-ink-3" />
          <span>
            <span className="block font-semibold">Payment</span>
            <span className="text-ink-2">{paymentLabel(order)}</span>
          </span>
        </p>
      </div>

      <dl className="mt-4 border-t border-line pt-3 text-[14px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-0.5">
            <dt className="text-ink-2">{k}</dt>
            <dd className="tabular">{v === 0 && k === 'Delivery' ? 'Free' : v < 0 ? `−${money(-v)}` : money(v)}</dd>
          </div>
        ))}
        <div className="mt-2 flex items-baseline justify-between border-t border-line pt-2">
          <dt className="font-semibold">Total</dt>
          <dd className="text-lg font-bold tabular">{money(order.total)}</dd>
        </div>
      </dl>
    </section>
  )
}
