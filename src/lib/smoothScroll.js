import Lenis from 'lenis'

let lenis = null
let locks = 0

/** Wheel/trackpad smoothing on pointer devices; touch keeps native momentum scrolling. */
export function initSmoothScroll() {
  if (lenis || typeof window === 'undefined') return lenis
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true, anchors: { offset: -96 } })
  const raf = (time) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  return lenis
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}

export function scrollToEl(el, offset = -96) {
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
}

/** Freeze page scroll behind modals and drawers. Returns an unlock function. */
export function lockScroll() {
  locks += 1
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
  return () => {
    locks = Math.max(0, locks - 1)
    if (locks === 0) {
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
  }
}
