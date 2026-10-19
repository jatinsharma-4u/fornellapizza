import { Heart, MagnifyingGlass, ShoppingCartSimple, UserCircle, X } from '@phosphor-icons/react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // Search stays open only on the page where it was opened, so navigating closes it
  const [searchAt, setSearchAt] = useState(null)
  const searchOpen = searchAt === pathname
  const setSearchOpen = (open) => setSearchAt(open ? pathname : null)
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

          {/* Search takes the nav's place in the layout instead of floating over it */}
          <div className="relative mx-auto hidden min-w-0 flex-1 justify-center lg:flex">
            {searchOpen ? (
                <motion.form
                  role="search"
                  initial={{ opacity: 0, scaleX: 0.92 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  onSubmit={(e) => {
                    e.preventDefault()
                    navigate(`/order?q=${encodeURIComponent(query.trim())}`)
                    setSearchOpen(false)
                  }}
                  className="flex w-full max-w-[520px] items-center gap-2 rounded-full border border-line bg-white py-1 pr-1 pl-4 focus-within:border-ink"
                >
                  <MagnifyingGlass size={17} weight="bold" className="shrink-0 text-ink-3" aria-hidden />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                    placeholder="Search pizzas, burgers, drinks…"
                    aria-label="Search the menu"
                    className="h-8 min-w-0 flex-1 bg-transparent text-[14.5px] outline-none"
                  />
                  <button type="submit" className="h-8 shrink-0 rounded-full bg-ink px-4 text-[13px] font-semibold text-cream">Search</button>
                  <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" className="grid size-8 shrink-0 place-items-center rounded-full text-ink-3 hover:bg-cream-2 hover:text-ink">
                    <X size={15} weight="bold" />
                  </button>
                </motion.form>
              ) : (
                <nav aria-label="Primary" className="flex items-center gap-0.5">
                  {navLinks.map((l) => (
                    <NavLink key={l.to} to={l.to} className="group relative px-3.5 py-2 text-[14.5px] font-medium whitespace-nowrap text-ink-2 transition-colors hover:text-ink">
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
              )}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-0">
            <button
              type="button"
              onClick={() => (window.innerWidth < 1024 ? navigate('/order?focus=search') : setSearchOpen(!searchOpen))}
              aria-label="Search"
              aria-expanded={searchOpen}
              className={cn('grid size-10 place-items-center rounded-full transition-colors hover:bg-cream-2 hover:text-ink', searchOpen ? 'bg-cream-2 text-ink' : 'text-ink-2')}
            >
              <MagnifyingGlass size={19} weight="bold" />
            </button>
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
