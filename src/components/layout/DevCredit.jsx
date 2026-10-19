import { ArrowUpRight, Code } from '@phosphor-icons/react'

const SITE = 'https://www.jatinsharma4u.in'

/** Vertical "developed by" tab pinned to the right edge (tablet & desktop). */
export function DevSideTag() {
  return (
    <a
      href={SITE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Developed by Jatin Sharma — opens jatinsharma4u.in in a new tab"
      className="fixed top-1/2 right-0 z-[60] hidden items-center gap-2 rounded-r-xl bg-ink px-2 py-3.5 text-cream shadow-lift transition-[padding,background-color] duration-300 hover:bg-tomato hover:pr-3 focus-visible:bg-tomato md:flex"
      style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
      data-no-print
    >
      <Code size={15} weight="bold" className="shrink-0 rotate-90 text-saffron" />
      <span className="text-[12px] font-semibold tracking-[0.06em] whitespace-nowrap">
        Developed by <span className="text-saffron">Jatin Sharma</span>
      </span>
    </a>
  )
}

/** Inline credit for the footer (visible on all screen sizes). */
export function DevCreditLine() {
  return (
    <a href={SITE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ink">
      Designed &amp; developed by <span className="font-semibold text-ink-2 underline-offset-2 hover:underline">Jatin Sharma</span>
      <ArrowUpRight size={12} weight="bold" />
    </a>
  )
}
