import { ArrowRight, Plus, ShieldCheck } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { FreeDeliveryMeter } from '../components/layout/CartDrawer'
import PageHeader from '../components/layout/PageHeader'
import CartLine, { Summary } from '../components/product/CartLine'
import PromoInput from '../components/product/PromoInput'
import { EmptyState } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import { getProduct } from '../data/products'
import { defaultOptions, money } from '../lib/format'
import { useStore } from '../store/StoreProvider'

const upsellIds = ['classic-fries', 'pink-lemonade', 'iced-cola', 'choco-sundae', 'buffalo-wings', 'fudge-brownie']

function Upsell() {
  const { cart, addToCart } = useStore()
  const items = upsellIds.filter((id) => !cart.some((l) => l.id === id)).map(getProduct)
  if (!items.length) return null
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-[17px]">Complete your meal</h2>
      <ul className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0">
        {items.map((p) => (
          <li key={p.id} data-fly-root className="flex w-[132px] shrink-0 flex-col rounded-2xl border border-line bg-white p-2">
            <div className="grid h-[84px] place-items-center overflow-hidden rounded-xl bg-cream-2">
              <img data-fly-img src={p.image} alt="" loading="lazy" className="h-[72px] w-[90%] object-contain" />
            </div>
            <p className="mt-2 truncate px-0.5 text-[13px] font-semibold">{p.name}</p>
            <div className="mt-1 flex items-center justify-between px-0.5">
              <span className="text-[13px] text-ink-2 tabular">{money(p.price)}</span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={(e) => addToCart(p.id, defaultOptions(p), 1, { from: e.currentTarget.closest('[data-fly-root]').querySelector('[data-fly-img]') })}
                aria-label={`Add ${p.name}`}
                className="grid size-7 place-items-center rounded-full bg-tomato text-white"
              >
                <Plus weight="bold" size={13} />
              </motion.button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Cart() {
  const { cart, totals, clearCart } = useStore()

  return (
    <>
      <PageHeader
        title="Your cart"
        crumbs={[{ label: 'Cart' }]}
        action={cart.length > 0 && <button type="button" onClick={clearCart} className="px-1 text-[13px] font-semibold text-tomato">Clear</button>}
      />
      <div className="container-x pb-36 md:pb-0">
        {cart.length === 0 ? (
          <EmptyState image="/img/slice-pepperoni.webp" title="Your cart is empty" body="Good news: the oven is hot and the menu is long." action={<Button to="/order">Start an order</Button>} />
        ) : (
          <div className="grid gap-5 pt-2 md:grid-cols-[1fr_380px] md:gap-10 md:pt-0">
            <div>
              <FreeDeliveryMeter subtotal={totals.subtotal} />
              <div className="mt-3 rounded-[20px] border border-line bg-white px-4 md:px-5">
                <ul className="divide-y divide-line">
                  <AnimatePresence initial={false}>
                    {cart.map((l) => <CartLine key={l.key} line={l} />)}
                  </AnimatePresence>
                </ul>
              </div>
              <Upsell />
            </div>
            <aside className="md:sticky md:top-24 md:self-start">
              <div className="rounded-[20px] border border-line bg-white p-4 md:p-6">
                <h2 className="mb-4 hidden text-[18px] md:block">Order summary</h2>
                <PromoInput />
                <Summary totals={totals} className="mt-4" />
                <Button to="/checkout" size="lg" full className="mt-5 hidden justify-between md:flex">
                  Go to checkout <span className="flex items-center gap-1.5 tabular">{money(totals.total)} <ArrowRight weight="bold" /></span>
                </Button>
              </div>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] text-ink-3">
                <ShieldCheck size={15} weight="fill" className="text-basil" /> Secure checkout · Free cancellation within 2 min
              </p>
            </aside>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur-lg pb-safe md:hidden">
          <Button to="/checkout" size="lg" full className="justify-between">
            <span>Checkout · {totals.count} {totals.count === 1 ? 'item' : 'items'}</span>
            <span className="flex items-center gap-1.5 tabular">{money(totals.total)} <ArrowRight weight="bold" /></span>
          </Button>
        </div>
      )}
    </>
  )
}
