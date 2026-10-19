import { ShoppingCartSimple, Heart, MagnifyingGlass, UserCircle } from '@phosphor-icons/react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { brand } from '../../data/site'
import { cn, money } from '../../lib/format'
import { useStore } from '../../store/StoreProvider'
import { Logo } from '../ui/Bits'
import { CountBadge, useLandedCount } from './CartIcon'

const navLinks = [
  { to: '/menu', label: 'Menu' },
  { to: '/order', label: 'Order online' },
  { to: '/build', label: 'Build a pizza' },
  { to: '/offers', label: 'Deals' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const { totals, setCartOpen, user, favorites } = useStore()
  const count = useLandedCount()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()
  useMotionValueEvent(scrollY, 'change', (v) => {
    const next = v > 24
    if (next !== scrolled) setScrolled(next)
  })

  return (
    <div className="hidden md:contents">
      <div className="bg-ink text-cream">
        <p className="container-x flex h-9 items-center justify-center gap-2 text-[13px]">
          Free delivery on orders over ${brand.freeDeliveryOver}
          <span className="text-cream/40">·</span>
          <span className="text-cream/80">New customers: <b className="font-semibold text-saffron">HELLO20</b> for 20% off</span>
        </p>
      </div>
      <header className={cn('sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300', scrolled ? 'border-line bg-cream/90 backdrop-blur-lg' : 'border-transparent bg-cream')}>
        <div className="container-x flex h-[72px] items-center gap-6">
          <Link to="/" aria-label="Fornella home" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="mx-auto hidden items-center gap-0.5 lg:flex">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className="group relative px-3.5 py-2 text-[14.5px] font-medium text-ink-2 transition-colors hover:text-ink">
                {({ isActive }) => (
                  <>
                    <span className={cn('relative', isActive && 'text-ink')}>{l.label}</span>
                    {isActive ? (
                      <motion.span layoutId="nav-underline" className="absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-tomato" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
                    ) : (
                      <span className="absolute inset-x-3.5 -bottom-px h-0.5 origin-left scale-x-0 rounded-full bg-ink/20 transition-transform duration-300 group-hover:scale-x-100" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <div className="relative">
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 240 }}
                    exit={{ opacity: 0, width: 0 }}
                    onSubmit={(e) => {
                      e.preventDefault()
                      navigate(`/order?q=${encodeURIComponent(query)}`)
                      setSearchOpen(false)
                    }}
                    className="absolute top-0 right-11 overflow-hidden"
                  >
                    <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onBlur={() => setSearchOpen(false)} placeholder="Search the menu…" aria-label="Search menu" className="h-10 w-full rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-ink" />
                  </motion.form>
                )}
              </AnimatePresence>
              <button type="button" onClick={() => setSearchOpen((s) => !s)} aria-label="Search" className="grid size-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-cream-2 hover:text-ink">
                <MagnifyingGlass size={19} weight="bold" />
              </button>
            </div>
            <Link to="/favorites" aria-label={`Favourites (${favorites.length})`} className="relative grid size-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-cream-2 hover:text-ink">
              <Heart size={19} weight="bold" />
              {favorites.length > 0 && <span className="absolute top-2 right-2 size-1.5 rounded-full bg-tomato" />}
            </Link>
            <Link to={user ? '/profile' : '/login'} aria-label={user ? 'Your account' : 'Sign in'} className="grid size-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-cream-2 hover:text-ink">
              {user ? <span className="grid size-7 place-items-center rounded-full bg-saffron text-[13px] font-bold text-ink">{user.name[0]}</span> : <UserCircle size={22} weight="bold" />}
            </Link>
            <motion.button
              type="button"
              onClick={() => setCartOpen(true)}
              whileTap={{ scale: 0.96 }}
              className="ml-2 flex h-10 items-center gap-2.5 rounded-full bg-ink pr-4 pl-1.5 text-cream transition-colors hover:bg-ink-2"
              aria-label={`Open cart, ${count} items`}
            >
              <span data-cart-target className="relative grid size-7 place-items-center rounded-full bg-tomato">
                <ShoppingCartSimple size={15} weight="fill" />
                <CountBadge count={count} className="-top-1.5 -right-1.5 bg-saffron text-ink ring-2 ring-ink" />
              </span>
              <span className="text-sm font-semibold tabular">{money(totals.subtotal)}</span>
            </motion.button>
          </div>
        </div>
      </header>
    </div>
  )
}
