import { AnimatePresence, motion } from 'motion/react'
import { Suspense, useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import CartDrawer from './CartDrawer'
import Footer from './Footer'
import Header from './Header'
import { initSmoothScroll, scrollToTop } from '../../lib/smoothScroll'

// Routes that own a sticky bottom action bar on mobile, so the tab bar steps aside.
const immersive = ['/product/', '/checkout', '/cart', '/build', '/login', '/signup', '/forgot-password', '/track/', '/confirmation/']
const bare = ['/login', '/signup', '/forgot-password']

function PageSkeleton() {
  return (
    <div className="container-x animate-pulse pt-6 md:pt-12" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-2/3 rounded-2xl bg-cream-3 md:h-16 md:w-1/2" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[4/5] rounded-[28px] bg-cream-2" />
        ))}
      </div>
    </div>
  )
}

export default function Layout() {
  const location = useLocation()
  const outlet = useOutlet()
  const { pathname } = location
  const hideTabs = immersive.some((p) => pathname.startsWith(p))
  const isBare = bare.some((p) => pathname.startsWith(p))

  useEffect(() => {
    initSmoothScroll()
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    scrollToTop()
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="min-h-dvh">
      <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      {!isBare && <Header />}
      <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
        <motion.main
          id="main"
          tabIndex={-1}
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="outline-none"
        >
          <Suspense fallback={<PageSkeleton />}>{outlet}</Suspense>
        </motion.main>
      </AnimatePresence>
      {!isBare && <Footer padForTabs={!hideTabs} />}
      {!hideTabs && <BottomNav />}
      <CartDrawer />
    </div>
  )
}
