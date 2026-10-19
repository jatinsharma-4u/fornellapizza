import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/format'

const variants = {
  primary: 'bg-tomato text-white hover:bg-tomato-600',
  dark: 'bg-ink text-cream hover:bg-ink-2',
  saffron: 'bg-saffron text-ink hover:brightness-95',
  outline: 'border border-ink/15 bg-transparent text-ink hover:border-ink/40 hover:bg-white',
  ghost: 'text-ink hover:bg-ink/5',
  white: 'bg-white text-ink shadow-soft hover:shadow-lift',
}
const sizes = {
  sm: 'h-9 px-4 text-[13px] gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
}

const MotionLink = motion.create(Link)
const tap = { whileTap: { scale: 0.96 }, transition: { type: 'spring', stiffness: 500, damping: 30 } }

export default function Button({ to, href, variant = 'primary', size = 'md', className, children, full, ...props }) {
  const classes = cn(
    'inline-flex select-none items-center justify-center rounded-full font-semibold whitespace-nowrap transition-[background-color,box-shadow,border-color,filter,color] duration-200 disabled:cursor-not-allowed disabled:opacity-45',
    variants[variant],
    sizes[size],
    full && 'w-full',
    className,
  )
  if (to) return <MotionLink to={to} className={classes} {...tap} {...props}>{children}</MotionLink>
  if (href) return <motion.a href={href} className={classes} {...tap} {...props}>{children}</motion.a>
  return <motion.button type="button" className={classes} {...tap} {...props}>{children}</motion.button>
}

export function IconButton({ label, className, children, badge, to, ...props }) {
  const classes = cn('relative grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink shadow-soft transition-shadow hover:shadow-lift', className)
  const content = (
    <>
      {children}
      {badge ? (
        <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-tomato px-1 text-[11px] font-bold text-white ring-2 ring-cream tabular">
          {badge}
        </span>
      ) : null}
    </>
  )
  if (to)
    return (
      <MotionLink to={to} aria-label={label} whileTap={{ scale: 0.9 }} className={classes} {...props}>
        {content}
      </MotionLink>
    )
  return (
    <motion.button type="button" aria-label={label} whileTap={{ scale: 0.9 }} className={classes} {...props}>
      {content}
    </motion.button>
  )
}
