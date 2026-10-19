import { ArrowRight, Moped, X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { brand } from '../../data/site'
import { lockScroll } from '../../lib/smoothScroll'
import { money } from '../../lib/format'
import { useStore } from '../../store/StoreProvider'
import CartLine, { Summary } from '../product/CartLine'
import PromoInput from '../product/PromoInput'
import { EmptyState } from '../ui/Bits'
import Button from '../ui/Button'

export function FreeDeliveryMeter({ subtotal }) {
  const left = Math.max(0, brand.freeDeliveryOver - subtotal)
  const pct = Math.min(100, (subtotal / brand.freeDeliveryOver) * 100)
  return (
    <div className="rounded-2xl bg-cream-2 px-4 py-3">
      <p className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
        <Moped size={17} weight="fill" className="shrink-0 text-tomato" />
        {left > 0 ? (
          <span>
            Add <b className="text-ink tabular">{money(left)}</b> for free delivery
          </span>
        ) : (
          <span className="text-basil">Free delivery unlocked</span>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
        <motion.div className="h-full rounded-full bg-tomato" initial={false} animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 140, damping: 22 }} />
      </div>
    </div>
  )
}

export default function CartDrawer() {
  const { cart, totals, cartOpen, setCartOpen } = useStore()

  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false)
    document.addEventListener('keydown', onKey)
    const unlock = lockScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      unlock()
    }
  }, [cartOpen, setCartOpen])

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.div className="absolute inset-0 bg-ink/35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your order"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%', transition: { duration: 0.22, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="absolute top-0 right-0 bottom-0 flex w-full max-w-[420px] flex-col bg-cream shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <h2 className="text-xl">Your order</h2>
                <p className="text-[13px] text-ink-3">{totals.count} {totals.count === 1 ? 'item' : 'items'} · Delivery in ~30 min</p>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart" className="grid size-9 place-items-center rounded-full transition-colors hover:bg-cream-2">
                <X size={18} weight="bold" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 px-6">
                <EmptyState image="/img/slice-pepperoni.webp" title="Your cart is empty" body="The oven’s hot — pick something delicious." action={<Button to="/order" onClick={() => setCartOpen(false)}>Browse the menu</Button>} />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 pt-4" data-lenis-prevent>
                  <FreeDeliveryMeter subtotal={totals.subtotal} />
                  <ul className="mt-2 divide-y divide-line">
                    <AnimatePresence initial={false}>
                      {cart.map((l) => <CartLine key={l.key} line={l} />)}
                    </AnimatePresence>
                  </ul>
                  <div className="pb-5"><PromoInput /></div>
                </div>
                <div className="border-t border-line bg-white px-6 pt-4 pb-6">
                  <Summary totals={totals} />
                  <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
                    <Button variant="outline" to="/cart" onClick={() => setCartOpen(false)}>View cart</Button>
                    <Button to="/checkout" onClick={() => setCartOpen(false)} className="justify-between">
                      Checkout <span className="flex items-center gap-1.5 tabular">{money(totals.total)} <ArrowRight weight="bold" /></span>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
