import { ArrowUpRight, Code } from '@phosphor-icons/react'

const SITE = 'https://www.jatinsharma4u.in'

/** Small vertical "developed by" tab pinned to the right edge (desktop only). */
export function DevSideTag() {
  return (
    <a
      href={SITE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Developed by Jatin Sharma — opens jatinsharma4u.in in a new tab"
      className="group fixed top-1/2 right-0 z-[60] hidden -translate-y-1/2 translate-x-[calc(100%-36px)] items-center gap-2 rounded-l-xl bg-ink py-2.5 pr-3 pl-2.5 text-cream shadow-lift transition-transform duration-300 ease-out hover:translate-x-0 focus-visible:translate-x-0 md:flex"
      data-no-print
    >
      <Code size={17} weight="bold" className="shrink-0 text-saffron" />
      <span className="text-[12.5px] font-semibold whitespace-nowrap">
        Developed by Jatin Sharma
      </span>
      <ArrowUpRight size={13} weight="bold" className="shrink-0 text-cream/60" />
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
