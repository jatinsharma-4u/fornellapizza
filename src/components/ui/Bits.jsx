import { Minus, Plus, Star } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { tagMeta } from '../../data/products'
import { cn } from '../../lib/format'

export function Tag({ tag, className }) {
  const meta = tagMeta[tag]
  if (!meta) return null
  return (
    <span className={cn('inline-flex h-[22px] items-center rounded-full px-2 text-[10.5px] font-bold tracking-wide uppercase', meta.className, className)}>
      {meta.label}
    </span>
  )
}

/** Standard veg / non-veg food mark: green square + dot, or red square + triangle. */
export function VegMark({ veg, className }) {
  return (
    <span
      role="img"
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
      className={cn('inline-grid size-[14px] shrink-0 place-items-center rounded-[3px] border-[1.5px] bg-white', veg ? 'border-basil' : 'border-tomato', className)}
    >
      {veg ? (
        <span className="size-[6px] rounded-full bg-basil" />
      ) : (
        <span className="size-0 border-x-[4px] border-b-[7px] border-x-transparent border-b-tomato" />
      )}
    </span>
  )
}

export function Rating({ value, count, className }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-[13px] text-ink-2', className)}>
      <Star weight="fill" className="text-saffron" aria-hidden />
      <span className="font-semibold text-ink">{value.toFixed(1)}</span>
      {count != null && <span className="text-ink-3">({count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count})</span>}
      <span className="sr-only">out of 5 stars</span>
    </span>
  )
}

export function Stepper({ value, onChange, min = 1, size = 'md', className, label = 'Quantity' }) {
  const s = size === 'xs' ? 'size-7' : size === 'sm' ? 'size-8' : 'size-9'
  return (
    <div className={cn('inline-flex shrink-0 items-center rounded-full bg-cream-2', size === 'xs' ? 'gap-0 p-0.5' : 'gap-1 p-1', className)} role="group" aria-label={label}>
      <motion.button
        whileTap={{ scale: 0.85 }}
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className={cn(s, 'grid place-items-center rounded-full bg-white text-ink shadow-soft disabled:opacity-40')}
      >
        <Minus weight="bold" size={size === 'xs' ? 12 : 14} />
      </motion.button>
      <span className={cn('relative overflow-hidden text-center font-semibold tabular', size === 'xs' ? 'w-6 text-[13px]' : 'w-7')} aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="inline-block"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.button
        whileTap={{ scale: 0.85 }}
        type="button"
        aria-label="Increase"
        onClick={() => onChange(value + 1)}
        className={cn(s, 'grid place-items-center rounded-full bg-tomato text-white')}
      >
        <Plus weight="bold" size={size === 'xs' ? 12 : 14} />
      </motion.button>
    </div>
  )
}

export function Chip({ active, children, className, ...props }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[13px] font-semibold transition-colors',
        active ? 'border-ink bg-ink text-cream' : 'border-line bg-white text-ink-2 hover:border-ink/30 hover:text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function Field({ label, error, hint, id, className, as = 'input', children, ...props }) {
  const Comp = as
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-[13px] font-semibold text-ink md:mb-1.5 md:text-sm">
        {label}
        {props.required && (
          <span className="text-tomato" aria-hidden>
            {' '}*
          </span>
        )}
      </label>
      <Comp
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-xl border bg-white px-4 text-[16px] text-ink transition-colors outline-none placeholder:text-ink-3/70 focus:border-ink focus:ring-4 focus:ring-ink/5',
          as === 'textarea' ? 'min-h-28 py-3' : 'h-11 md:h-12',
          error ? 'border-tomato' : 'border-line',
        )}
        {...props}
      >
        {children}
      </Comp>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-tomato-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function EmptyState({ image, title, body, action }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center py-14 text-center">
      <div className="relative mb-5 grid size-32 place-items-center rounded-full bg-cream-2">
        <motion.img
          src={image}
          alt=""
          className="w-24 food-shadow"
          animate={{ rotate: [0, 6, -4, 0], y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <h2 className="text-h3">{title}</h2>
      <p className="mt-1.5 text-sm text-ink-2">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function Logo({ className, compact }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 64 64" className="size-9 shrink-0" aria-hidden>
        <circle cx="32" cy="32" r="32" fill="#C8381C" />
        <circle cx="32" cy="32" r="21" fill="#F2B13A" />
        <circle cx="32" cy="32" r="21" fill="none" stroke="#FFFAF3" strokeWidth="3" strokeDasharray="4 5" />
        <circle cx="26" cy="27" r="4" fill="#A92E16" />
        <circle cx="38" cy="30" r="3.4" fill="#A92E16" />
        <circle cx="30" cy="39" r="3.6" fill="#A92E16" />
      </svg>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[21px] font-semibold tracking-tight text-ink" style={{ fontVariationSettings: '"SOFT" 100' }}>Fornella</span>
          <span className="mt-1 text-[9.5px] font-bold tracking-[0.3em] text-ink-3 uppercase">Pizza · Café</span>
        </span>
      )}
    </span>
  )
}
