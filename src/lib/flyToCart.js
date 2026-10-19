// Fly-to-cart: clones the product image, arcs it into whichever cart icon is
// currently visible, then "lands" — which lets cart badges reveal the new count.
import { useSyncExternalStore } from 'react'

let inFlight = 0
const listeners = new Set()
const emit = () => listeners.forEach((l) => l())

const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** Number of items currently mid-air — badges subtract this so the count ticks up on landing. */
export const useInFlight = () => useSyncExternalStore(subscribe, () => inFlight, () => 0)

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function visibleTarget() {
  const targets = [...document.querySelectorAll('[data-cart-target]')]
  return targets.find((el) => {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight && getComputedStyle(el).visibility !== 'hidden'
  })
}

function bump(target) {
  target?.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(0.94)' }, { transform: 'scale(1)' }],
    { duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)' },
  )
}

/**
 * @param {Element|null} source  element to fly from (an <img> or a container holding one)
 * @param {string} src           image URL to render in the clone
 * @param {number} qty
 */
export function flyToCart(source, src, qty = 1) {
  const target = visibleTarget()
  const img = source?.tagName === 'IMG' ? source : source?.querySelector?.('img')
  const from = img?.getBoundingClientRect()

  if (!target || !from || from.width === 0 || reducedMotion()) {
    bump(target)
    return
  }

  inFlight += qty
  emit()

  const to = target.getBoundingClientRect()
  const size = Math.min(Math.max(from.width, 72), 180)
  const startX = from.left + from.width / 2 - size / 2
  const startY = from.top + from.height / 2 - size / 2
  const dx = to.left + to.width / 2 - (startX + size / 2)
  const dy = to.top + to.height / 2 - (startY + size / 2)
  const lift = Math.min(160, Math.abs(dx) * 0.25 + 60) // arc height

  // Outer node moves horizontally, inner node vertically, so the two easings create a natural arc.
  const outer = document.createElement('div')
  outer.className = 'fly-item'
  outer.style.cssText = `left:${startX}px;top:${startY}px;width:${size}px;height:${size}px;`
  const inner = document.createElement('div')
  inner.style.cssText = 'width:100%;height:100%;will-change:transform;'
  const clone = document.createElement('img')
  clone.src = src
  clone.alt = ''
  clone.style.cssText = 'width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 12px 14px rgba(60,30,10,.28));will-change:transform,opacity;'
  inner.appendChild(clone)
  outer.appendChild(inner)
  document.body.appendChild(outer)

  const duration = 760
  outer.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], { duration, easing: 'cubic-bezier(.45,.05,.55,.95)', fill: 'forwards' })
  inner.animate(
    [
      { transform: 'translateY(0)' },
      { transform: `translateY(${Math.min(dy, 0) - lift}px)`, offset: 0.35 },
      { transform: `translateY(${dy}px)` },
    ],
    { duration, easing: 'cubic-bezier(.33,0,.4,1)', fill: 'forwards' },
  )
  const shrink = clone.animate(
    [
      { transform: 'scale(1) rotate(0deg)', opacity: 1 },
      { transform: 'scale(.9) rotate(-8deg)', opacity: 1, offset: 0.3 },
      { transform: `scale(${Math.max(0.16, 28 / size)}) rotate(12deg)`, opacity: 0.9, offset: 0.9 },
      { transform: `scale(${Math.max(0.1, 18 / size)}) rotate(14deg)`, opacity: 0 },
    ],
    { duration, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' },
  )

  let landed = false
  const land = () => {
    if (landed) return
    landed = true
    outer.remove()
    inFlight = Math.max(0, inFlight - qty)
    emit()
    bump(visibleTarget() ?? target)
  }
  shrink.onfinish = land
  shrink.oncancel = land
  // Safety net: animations are paused in background tabs, so never leave the count hanging
  setTimeout(land, duration + 200)
}
