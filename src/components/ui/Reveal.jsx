import { motion } from 'motion/react'

/** Fades + lifts children into view once. Reduced motion is handled globally by <MotionConfig reducedMotion="user">. */
export default function Reveal({ children, delay = 0, y = 28, className, as = 'div', amount = 0.2 }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  )
}

export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export const staggerChild = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}
