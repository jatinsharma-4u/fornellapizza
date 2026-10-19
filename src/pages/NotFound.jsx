import { motion } from 'motion/react'
import { MobileBar } from '../components/layout/PageHeader'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <>
      <MobileBar title="Not found" />
      <div className="container-x flex flex-col items-center py-16 text-center md:py-28">
        <div className="relative">
          <p className="font-display text-[120px] leading-none font-semibold text-cream-3 md:text-[200px]">4<span className="invisible">0</span>4</p>
          <motion.img
            src="/img/pepperoni.webp"
            alt=""
            className="absolute top-1/2 left-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2 food-shadow"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
          />
        </div>
        <h1 className="mt-4 text-h1">
          This slice has been <span className="text-tomato">eaten</span>
        </h1>
        <p className="mt-3 max-w-md text-ink-2">The page you’re after doesn’t exist — but the menu definitely does.</p>
        <div className="mt-8 flex gap-3">
          <Button to="/">Back home</Button>
          <Button to="/order" variant="outline">See the menu</Button>
        </div>
      </div>
    </>
  )
}
