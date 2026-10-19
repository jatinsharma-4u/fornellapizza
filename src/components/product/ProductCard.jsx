import { Heart, Plus, Star } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { cn, defaultOptions, lineKey, money } from '../../lib/format'
import { useStore } from '../../store/StoreProvider'
import { Stepper, Tag, VegMark } from '../ui/Bits'

/** Finds the product image inside the nearest card so the fly animation starts from it. */
const flySource = (el) => el.closest('[data-fly-root]')?.querySelector('[data-fly-img]')

/** Quick-add button that morphs into a stepper once the default variant is in the cart. */
export function QuickAdd({ product, className, size = 'md' }) {
  const { cart, addToCart, setQty } = useStore()
  const opts = defaultOptions(product)
  const key = lineKey(product.id, opts)
  const line = cart.find((l) => l.key === key)

  return (
    <div className={cn('relative z-10', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {line ? (
          <motion.div key="stepper" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.18 }}>
            <Stepper size="xs" min={0} value={line.qty} onChange={(q) => setQty(key, q)} label={`${product.name} quantity`} />
          </motion.div>
        ) : (
          <motion.button
            key="add"
            type="button"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18 }}
            whileTap={{ scale: 0.88 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart(product.id, opts, 1, { from: flySource(e.currentTarget) })
            }}
            aria-label={`Add ${product.name} to cart`}
            className={cn('grid place-items-center rounded-full bg-tomato text-white transition-colors hover:bg-tomato-600', size === 'sm' ? 'size-8' : 'size-8 md:size-9')}
          >
            <Plus weight="bold" size={size === 'sm' ? 14 : 16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FavButton({ id, className }) {
  const { isFavorite, toggleFavorite } = useStore()
  const fav = isFavorite(id)
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.82 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(id)
      }}
      aria-label={fav ? 'Remove from favourites' : 'Save to favourites'}
      aria-pressed={fav}
      className={cn('relative z-10 grid size-7 place-items-center rounded-full bg-white/90 transition-colors', fav ? 'text-tomato' : 'text-ink-3 hover:text-ink', className)}
    >
      <motion.span key={String(fav)} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 16 }}>
        <Heart weight={fav ? 'fill' : 'bold'} size={14} />
      </motion.span>
    </motion.button>
  )
}

/** Image well: the cut-out sits inside a fixed inset box, so nothing can spill outside the card. */
export function DishImage({ product, className, priority, inset = 'inset-[9%]' }) {
  const tall = product.category === 'drinks' || product.category === 'desserts'
  return (
    <div className={cn('relative overflow-hidden bg-cream-2', className)}>
      <div className={cn('absolute plate-shadow', tall ? 'inset-[7%]' : inset)}>
        <img
          data-fly-img
          src={product.image}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={cn(
            'relative z-[1] size-full object-contain transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]',
            product.category === 'pizza' ? 'group-hover:rotate-[10deg] group-hover:scale-[1.04]' : 'group-hover:scale-[1.05]',
          )}
        />
      </div>
    </div>
  )
}

function ProductCard({ product, className, priority }) {
  const tag = product.tags.find((t) => t !== 'veg')
  return (
    <article data-fly-root className={cn('group relative flex flex-col overflow-hidden rounded-[18px] border border-line/80 bg-white transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lift', className)}>
      <Link to={`/product/${product.id}`} className="absolute inset-0 z-[2]" aria-label={`View ${product.name}`} />
      <div className="relative">
        <DishImage product={product} priority={priority} className="aspect-[6/5]" inset="inset-[5%]" />
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-2">
          {tag ? <Tag tag={tag} /> : <span />}
          <FavButton id={product.id} />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-2 pt-1.5 pb-2 md:px-3 md:pt-2 md:pb-3">
        <div className="flex items-center gap-1.5">
          <VegMark veg={product.veg} />
          <span className="flex items-center gap-0.5 text-[11.5px] font-semibold text-ink-3">
            <Star weight="fill" className="text-saffron" aria-hidden /> {product.rating.toFixed(1)}
            <span className="sr-only">out of 5</span>
          </span>
        </div>
        <h3 className="mt-1 line-clamp-1 font-display text-[15px] leading-snug font-semibold md:text-[16.5px]">{product.name}</h3>
        <p className="line-clamp-1 text-[12px] text-ink-3 md:text-[13px]">{product.short}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-1.5 gap-y-1.5 pt-2">
          <p className="text-[15px] font-bold tabular md:text-[16px]">{money(product.price)}</p>
          <QuickAdd product={product} />
        </div>
      </div>
    </article>
  )
}

export default memo(ProductCard)

/** Compact horizontal row — used for menu lists and pairings. */
export const ProductRow = memo(function ProductRow({ product, className }) {
  return (
    <article data-fly-root className={cn('group relative flex items-center gap-3.5 rounded-[18px] border border-line/70 bg-white p-2.5 transition-shadow hover:shadow-soft', className)}>
      <Link to={`/product/${product.id}`} className="absolute inset-0 z-[2] rounded-[18px]" aria-label={`View ${product.name}`} />
      <DishImage product={product} className="size-[76px] shrink-0 rounded-xl" inset="inset-[6%]" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate font-display text-[15.5px] font-semibold">{product.name}</h3>
          <VegMark veg={product.veg} className="order-first" />
        </div>
        <p className="mt-0.5 line-clamp-1 text-[13px] text-ink-3">{product.short}</p>
        <p className="mt-1 text-sm font-bold tabular">{money(product.price)}</p>
      </div>
      <QuickAdd product={product} size="sm" />
    </article>
  )
})
