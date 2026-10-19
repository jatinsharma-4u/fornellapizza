import { ArrowRight, Clock, Moped, Star } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { brand } from '../../data/site'
import Button from '../ui/Button'
import HeroCarousel from './HeroCarousel'

const ease = [0.16, 1, 0.3, 1]
const rise = (delay) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } })

/** Wavy edge that melts the red hero into the cream page. */
export function HeroWave({ className }) {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className={className} aria-hidden>
      <path d="M0 52 C 180 8, 330 8, 520 40 S 860 92, 1060 58 S 1330 4, 1440 30 V90 H0Z" fill="var(--color-cream)" />
    </svg>
  )
}

export default function HeroDesktop() {

  const facts = [
    { icon: Star, strong: '4.9 rating', text: '3,200+ reviews' },
    { icon: Clock, strong: '~30 min', text: 'average delivery' },
    { icon: Moped, strong: 'Free delivery', text: `on orders over $${brand.freeDeliveryOver}` },
  ]

  return (
    <section className="relative hidden overflow-hidden bg-tomato text-white md:block">
      <div className="container-x relative grid grid-cols-12 items-center gap-6 pt-10 pb-20 lg:pt-12 lg:pb-24" style={{ minHeight: 'min(640px, calc(100dvh - 108px))' }}>
        <div className="relative z-10 col-span-6">
          <motion.h1 {...rise(0)} className="text-display text-white">
            Hot, cheesy &amp; wood-fired.
            <span className="block text-white/90">Delivered to your door.</span>
          </motion.h1>
          <motion.p {...rise(0.1)} className="mt-5 max-w-[440px] text-[17px] leading-relaxed text-white/85">
            Dough proved for 48 hours and baked at 450°C — plus smash burgers, crispy sides and ice-cold drinks in about half an hour.
          </motion.p>
          <motion.div {...rise(0.18)} className="mt-8 flex flex-wrap gap-3">
            <Button to="/order" size="lg" variant="white" className="text-tomato shadow-none hover:bg-cream">
              Order now <ArrowRight weight="bold" />
            </Button>
            <Button to="/menu" size="lg" className="border border-white/40 bg-transparent text-white hover:bg-white/10">
              See the menu
            </Button>
          </motion.div>
          <motion.ul {...rise(0.26)} className="mt-10 grid max-w-[520px] grid-cols-3 gap-4 border-t border-white/20 pt-5">
            {facts.map((f) => (
              <li key={f.text}>
                <p className="flex items-center gap-1.5 text-[15px] font-semibold">
                  <f.icon size={15} weight="fill" aria-hidden /> {f.strong}
                </p>
                <p className="mt-0.5 text-[13px] text-white/70">{f.text}</p>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Rotating dish carousel: active dish centred, neighbours peeking either side */}
        <div className="relative z-10 col-span-6">
          <HeroCarousel size="lg" className="mx-auto w-full max-w-[640px]" />
        </div>
      </div>
      <HeroWave className="absolute inset-x-0 -bottom-px h-[56px] w-full lg:h-[72px]" />
    </section>
  )
}
