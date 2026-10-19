import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/format'
import { Eyebrow } from '../ui/SectionHeading'

/** App-style sticky bar for mobile: back button, centred title, optional trailing action. */
export function MobileBar({ title, back = true, action, className, transparent }) {
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const border = useTransform(scrollY, [0, 40], ['rgba(239,223,204,0)', 'rgba(239,223,204,1)'])
  return (
    <motion.div
      style={{ borderColor: border }}
      className={cn(
        'sticky top-0 z-40 flex h-14 items-center gap-2 border-b px-4 md:hidden',
        transparent ? 'bg-transparent' : 'bg-cream/85 backdrop-blur-xl',
        className,
      )}
    >
      {back ? (
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          aria-label="Go back"
          className="grid size-10 place-items-center rounded-full border border-line bg-white"
        >
          <CaretLeft weight="bold" size={16} />
        </motion.button>
      ) : (
        <span className="size-10" />
      )}
      <h1 className="flex-1 truncate text-center font-sans text-[16px] font-semibold tracking-normal">{title}</h1>
      <div className="flex min-w-10 justify-end">{action}</div>
    </motion.div>
  )
}

/**
 * Responsive page header: app bar on mobile, editorial heading with breadcrumb on desktop.
 * `children` render beneath the heading on desktop only (e.g. extra copy).
 */
export default function PageHeader({ title, accent, eyebrow, subtitle, crumbs = [], mobileTitle, action, back = true, children }) {
  return (
    <>
      <MobileBar title={mobileTitle ?? (accent ? `${title} ${accent}` : title)} action={action} back={back} />
      <header className="relative hidden overflow-hidden md:block">
        <div className="container-x pt-8 pb-8 lg:pt-10">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-[13px] text-ink-3">
            <Link to="/" className="hover:text-ink">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <CaretRight size={12} weight="bold" aria-hidden />
                {c.to ? <Link to={c.to} className="hover:text-ink">{c.label}</Link> : <span className="text-ink" aria-current="page">{c.label}</span>}
              </span>
            ))}
          </nav>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-h1"
          >
            {title} {accent && <span className="text-tomato">{accent}</span>}
          </motion.h1>
          {subtitle && <p className="mt-3 max-w-xl text-ink-2">{subtitle}</p>}
          {children}
        </div>
      </header>
    </>
  )
}
