import { ForkKnife, ShoppingCartSimple, House, Tag, User } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn, money } from '../../lib/format'
import { useStore } from '../../store/StoreProvider'
import { CountBadge, useLandedCount } from './CartIcon'

const items = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/order', label: 'Menu', icon: ForkKnife, match: ['/order', '/menu'] },
  { to: '/cart', label: 'Cart', icon: ShoppingCartSimple, center: true },
  { to: '/offers', label: 'Deals', icon: Tag },
  { to: '/profile', label: 'Account', icon: User, match: ['/profile', '/orders', '/favorites', '/notifications'] },
]

export default function BottomNav() {
  const { totals } = useStore()
  const count = useLandedCount()
  const { pathname } = useLocation()

  return (
    <nav aria-label="App" className="fixed inset-x-0 bottom-0 z-50 md:hidden" data-no-print>
      <AnimatePresence>
        {count > 0 && (
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 34 }} className="px-3 pb-2">
            <NavLink to="/cart" className="flex h-12 items-center justify-between rounded-2xl bg-ink px-4 text-cream shadow-lift">
              <span className="flex items-center gap-2.5 text-sm font-semibold">
                <span className="grid h-6 min-w-6 place-items-center rounded-md bg-saffron px-1 text-xs font-bold text-ink tabular">{count}</span>
                View cart
              </span>
              <span className="text-sm font-bold tabular">{money(totals.subtotal)}</span>
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="border-t border-line bg-white/95 backdrop-blur-lg pb-safe">
        <ul className="grid grid-cols-5">
          {items.map(({ to, label, icon: Icon, end, center, match }) => {
            const active = match ? match.some((m) => pathname.startsWith(m)) : end ? pathname === to : pathname.startsWith(to)
            return (
              <li key={to}>
                <NavLink to={to} className="relative flex h-14 flex-col items-center justify-center gap-0.5" aria-current={active ? 'page' : undefined} aria-label={center ? `Cart, ${count} items` : undefined}>
                  {active && <motion.span layoutId="tab-indicator" className="absolute top-0 h-0.5 w-7 rounded-full bg-tomato" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                  <motion.span whileTap={{ scale: 0.85 }} className="relative" data-cart-target={center ? '' : undefined}>
                    {center ? (
                      <span className="-mt-6 grid size-12 place-items-center rounded-full bg-gradient-to-b from-[#de4a2a] to-tomato-600 text-white shadow-tomato ring-4 ring-white">
                        <Icon size={22} weight="bold" />
                      </span>
                    ) : (
                      <Icon size={23} weight={active ? 'fill' : 'regular'} className={active ? 'text-tomato' : 'text-ink-3'} />
                    )}
                    {center && <CountBadge count={count} className="-top-6 -right-1 bg-saffron text-ink ring-2 ring-white" />}
                  </motion.span>
                  <span className={cn('text-[11px] font-semibold', active ? 'text-ink' : 'text-ink-3')}>{label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
