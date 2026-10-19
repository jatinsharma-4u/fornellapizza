import { ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/format'
import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, accent, subtitle, action, align = 'left', className }) {
  const center = align === 'center'
  return (
    <Reveal
      className={cn(
        'mb-6 flex flex-col gap-3 md:mb-9',
        center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', center && 'mx-auto')}>
        {eyebrow && <Eyebrow className={center ? 'justify-center' : ''}>{eyebrow}</Eyebrow>}
        <h2 className="text-h2">
          {title} {accent && <span className="text-tomato">{accent}</span>}
        </h2>
        {subtitle && <p className="mt-2.5 max-w-xl text-[15px] text-ink-2 md:text-base">{subtitle}</p>}
      </div>
      {action && (
        <Link to={action.to} className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:text-tomato">
          {action.label}
          <ArrowRight weight="bold" className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  )
}

export function Eyebrow({ children, className }) {
  return (
    <p className={cn('eyebrow mb-2.5', className)}>{children}</p>
  )
}
