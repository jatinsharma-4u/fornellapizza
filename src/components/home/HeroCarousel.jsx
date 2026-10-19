import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProduct } from '../../data/products'
import { hero } from '../../data/site'
import { cn, money } from '../../lib/format'

// Dishes shown in the hero rotation. The first slide uses the swappable hero artwork.
const slides = [
  { ...getProduct('margherita'), image: hero.image },
  getProduct('classic-smash'),
  getProduct('pepperoni'),
  getProduct('double-stack'),
  getProduct('supreme'),
  getProduct('bacon-jam'),
]

const INTERVAL = 3200

/**
 * Cover-flow style carousel: the active dish sits large in the centre, its neighbours peek in
 * smaller on each side. Auto-advances, pauses on hover/touch, supports swipe and arrow keys.
 */
export default function HeroCarousel({ className, size = 'md' }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const n = slides.length

  useEffect(() => {
    if (paused || reduce) return
    const t = setInterval(() => setIndex((i) => (i + 1) % n), INTERVAL)
    return () => clearInterval(t)
  }, [paused, reduce, n])

  const go = (d) => setIndex((i) => (i + d + n) % n)
  const active = slides[index]
  const lg = size === 'lg'

  return (
    <div
      className={cn('relative select-none', className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured dishes"
    >
      <motion.div
        className="relative aspect-[100/63] w-full touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.x < -40) go(1)
          else if (info.offset.x > 40) go(-1)
        }}
      >
        {slides.map((s, i) => {
          let off = i - index
          if (off > n / 2) off -= n
          if (off < -n / 2) off += n
          const visible = Math.abs(off) <= 1
          return (
            <motion.button
              key={s.id}
              type="button"
              tabIndex={off === 0 ? 0 : -1}
              aria-hidden={off !== 0}
              aria-label={off === 0 ? s.name : `Show ${s.name}`}
              onClick={() => off !== 0 && go(off)}
              initial={false}
              animate={{
                x: `${off * (lg ? 74 : 70)}%`,
                scale: off === 0 ? 1 : 0.5,
                opacity: visible ? (off === 0 ? 1 : 0.55) : 0,
                zIndex: off === 0 ? 2 : 1,
              }}
              transition={{ type: 'spring', stiffness: 170, damping: 24 }}
              className="absolute inset-y-0 left-1/2 -ml-[31%] aspect-square w-[62%]"
              style={{ pointerEvents: visible ? 'auto' : 'none' }}
            >
              <motion.img
                src={s.image}
                alt=""
                draggable={false}
                animate={{ rotate: off === 0 && s.category === 'pizza' ? 0 : off * 25 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className="size-full object-contain drop-shadow-[0_20px_26px_rgba(60,10,0,0.42)]"
              />
            </motion.button>
          )
        })}
      </motion.div>

      <div className="mt-2 text-center" aria-live="polite">
        <motion.p key={active.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-[14px] font-semibold text-white">
          <Link to={`/product/${active.id}`} className="hover:underline">{active.name}</Link>
          <span className="ml-2 font-normal text-white/75 tabular">{money(active.price)}</span>
        </motion.p>
        <div className="mt-2.5 flex justify-center gap-1.5">
          {slides.map((s, i) => (
            <button key={s.id} type="button" onClick={() => setIndex(i)} aria-label={`Show ${s.name}`} aria-current={i === index} className="grid h-4 place-items-center">
              <span className={cn('block h-1.5 rounded-full transition-all duration-300', i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40')} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
