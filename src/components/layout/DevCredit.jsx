import { ArrowUpRight, Code } from '@phosphor-icons/react'

const SITE = 'https://www.jatinsharma4u.in'

/** Small vertical "developed by" tab pinned to the right edge on every screen size. */
export function DevSideTag() {
  return (
    <a
      href={SITE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Developed by Jatin Sharma — opens jatinsharma4u.in in a new tab"
      className="fixed top-1/2 right-0 z-[60] flex items-center gap-1 leading-none md:gap-1.5 rounded-r-md bg-ink/85 md:rounded-r-lg md:bg-ink/90 pt-2 pr-1 pb-2 pl-1 text-cream shadow-soft backdrop-blur transition-colors duration-300 hover:bg-tomato focus-visible:bg-tomato md:pt-3 md:pr-2 md:pb-3 md:pl-2"
      style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
      data-no-print
    >
      <Code size={11} weight="bold" className="hidden shrink-0 rotate-90 text-saffron md:block" />
      <span className="text-[8px] font-semibold tracking-[0.04em] whitespace-nowrap md:text-[10.5px]">
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
