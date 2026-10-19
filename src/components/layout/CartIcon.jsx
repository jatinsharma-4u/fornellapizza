import { ShoppingCartSimple } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useInFlight } from '../../lib/flyToCart'
import { cn } from '../../lib/format'
import { useStore } from '../../store/StoreProvider'

/** Cart count that only increases once the flying item has landed. */
// eslint-disable-next-line react-refresh/only-export-components
export function useLandedCount() {
  const { totals } = useStore()
  const inFlight = useInFlight()
  return Math.max(0, totals.count - inFlight)
}

export function CountBadge({ count, className }) {
  return (
    <AnimatePresence initial={false}>
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className={cn('absolute grid h-[18px] min-w-[18px] place-items-center overflow-hidden rounded-full px-1 text-[11px] leading-none font-bold tabular', className)}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={count} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
              {count}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      )}
    </AnimatePresence>
  )
}

/** Round cart button used on immersive mobile screens (product, build) where the tab bar is hidden. */
export function CartFab({ className }) {
  const count = useLandedCount()
  return (
    <Link to="/cart" aria-label={`Cart, ${count} items`} className={cn('relative grid size-11 place-items-center rounded-full bg-white/95 shadow-soft backdrop-blur', className)}>
      <span data-cart-target className="grid place-items-center">
        <ShoppingCartSimple size={20} weight="bold" />
      </span>
      <CountBadge count={count} className="-top-1 -right-1 bg-tomato text-white ring-2 ring-cream" />
    </Link>
  )
}
