import { X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { lockScroll } from '../../lib/smoothScroll'

/** Mobile bottom sheet with drag-to-dismiss, a close button and Escape support. */
export default function BottomSheet({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const unlock = lockScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      unlock()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85]">
          <motion.div className="absolute inset-0 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose()}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%', transition: { duration: 0.22 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[32px] bg-cream"
          >
            <div className="flex justify-center pt-3" aria-hidden>
              <span className="h-1.5 w-12 rounded-full bg-ink/15" />
            </div>
            <div className="flex items-center justify-between px-5 pt-2 pb-3">
              <h2 className="text-lg">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-full bg-white shadow-soft">
                <X weight="bold" />
              </button>
            </div>
            <div data-lenis-prevent className="flex-1 overflow-y-auto px-5 pb-4" onPointerDownCapture={(e) => e.stopPropagation()}>
              {children}
            </div>
            {footer && <div className="border-t border-line bg-white px-5 pt-3 pb-safe">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
