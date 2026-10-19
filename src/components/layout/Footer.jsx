import { ArrowRight, Clock, EnvelopeSimple, FacebookLogo, InstagramLogo, MapPin, Moped, Phone, ShieldCheck, Storefront, TiktokLogo } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, getProduct } from '../../data/products'
import { brand } from '../../data/site'
import { cn } from '../../lib/format'
import { Logo } from '../ui/Bits'

const quick = [
  ['Full menu', '/menu'],
  ['Order online', '/order'],
  ['Build a pizza', '/build'],
  ['Deals & rewards', '/offers'],
  ['Book a table', '/reservations'],
  ['About us', '/about'],
]
const help = [
  ['Help centre', '/help'],
  ['Track an order', '/orders'],
  ['Contact us', '/contact'],
  ['Delivery policy', '/delivery-policy'],
  ['Refunds & cancellations', '/refund-policy'],
]
const popular = ['margherita', 'pepperoni', 'classic-smash', 'buffalo-wings'].map(getProduct)
const socials = [
  { icon: InstagramLogo, label: 'Instagram', href: 'https://www.instagram.com/' },
  { icon: FacebookLogo, label: 'Facebook', href: 'https://www.facebook.com/' },
  { icon: TiktokLogo, label: 'TikTok', href: 'https://www.tiktok.com/' },
]

function Col({ title, children }) {
  return (
    <div>
      <h3 className="mb-4 font-sans text-[12px] font-bold tracking-[0.14em] text-ink-3 uppercase">{title}</h3>
      {children}
    </div>
  )
}

function Links({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map(([label, to]) => (
        <li key={to + label}>
          <Link to={to} className="text-[14.5px] text-ink-2 transition-colors hover:text-tomato">{label}</Link>
        </li>
      ))}
    </ul>
  )
}

export default function Footer({ padForTabs }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle')
  return (
    <footer className={cn('section-y border-t border-line bg-cream-2', padForTabs ? 'pb-36 md:pb-0' : 'hidden md:block')} data-no-print>
      {/* Delivery & ordering info strip */}
      <div className="border-b border-line">
        <div className="container-x grid gap-4 py-6 sm:grid-cols-3 md:py-7">
          {[
            [Moped, 'Delivery in ~30 minutes', `Free over $${brand.freeDeliveryOver} · otherwise $${brand.deliveryFee}`],
            [Storefront, 'Pickup in 15 minutes', 'Order ahead, skip the queue'],
            [ShieldCheck, 'Secure ordering', 'Card, wallet or cash on delivery'],
          ].map(([Icon, t, b]) => (
            <div key={t} className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-tomato"><Icon size={20} weight="fill" /></span>
              <div>
                <p className="text-[14.5px] font-semibold">{t}</p>
                <p className="text-[13px] text-ink-3">{b}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-x grid gap-10 py-12 md:grid-cols-12 md:gap-8 md:py-16">
        <div className="md:col-span-4">
          <Link to="/" aria-label="Fornella home"><Logo /></Link>
          <p className="mt-4 max-w-xs text-[14.5px] text-ink-2">Neapolitan-style pizza, smash burgers and cold drinks from our wood-fired kitchen in SoHo — since 2014.</p>
          {state === 'done' ? (
            <p className="mt-6 text-sm font-semibold text-basil" role="status">Thanks — you’re on the list.</p>
          ) : (
            <form
              noValidate
              className="mt-6 max-w-sm"
              onSubmit={(e) => {
                e.preventDefault()
                setState(/\S+@\S+\.\S+/.test(email) ? 'done' : 'error')
              }}
            >
              <label htmlFor="news-email" className="text-[13px] font-semibold">Deals & new dishes, once a week</label>
              <div className="mt-2 flex gap-1.5 rounded-full border border-line bg-white p-1 focus-within:border-ink">
                <input id="news-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setState('idle') }} placeholder="you@email.com" aria-invalid={state === 'error'} className="h-9 min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none" />
                <button type="submit" aria-label="Subscribe" className="grid size-9 shrink-0 place-items-center rounded-full bg-tomato text-white transition-colors hover:bg-tomato-600"><ArrowRight weight="bold" size={16} /></button>
              </div>
              {state === 'error' && <p role="alert" className="mt-1.5 text-[13px] text-tomato-600">Please enter a valid email.</p>}
            </form>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-5">
          <Col title="Explore"><Links items={quick} /></Col>
          <Col title="Help"><Links items={help} /></Col>
          <Col title="Menu">
            <Links items={[...categories.map((c) => [c.plural, `/order?cat=${c.id}`]), ...popular.slice(0, 2).map((p) => [p.name, `/product/${p.id}`])]} />
          </Col>

        </div>

        <div className="md:col-span-3">
          <Col title="Visit & contact">
            <ul className="space-y-2.5 text-[14.5px] text-ink-2">
              <li className="flex gap-2.5"><MapPin size={18} className="mt-0.5 shrink-0 text-ink-3" />{brand.address}</li>
              <li><a href={`tel:${brand.phone.replace(/[^\d+]/g, '')}`} className="flex gap-2.5 hover:text-tomato"><Phone size={18} className="mt-0.5 shrink-0 text-ink-3" />{brand.phone}</a></li>
              <li><a href={`mailto:${brand.email}`} className="flex gap-2.5 hover:text-tomato"><EnvelopeSimple size={18} className="mt-0.5 shrink-0 text-ink-3" />{brand.email}</a></li>
              <li className="flex gap-2.5">
                <Clock size={18} className="mt-0.5 shrink-0 text-ink-3" />
                <span>{brand.hours.map((h) => <span key={h.days} className="block">{h.days} <span className="text-ink-3 tabular">{h.time}</span></span>)}</span>
              </li>
            </ul>
          </Col>
          <div className="mt-5 flex gap-2">
            {socials.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-9 place-items-center rounded-full border border-line bg-white text-ink-2 transition-colors hover:border-ink hover:text-ink">
                <Icon size={17} weight="fill" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-3 py-6 text-[13px] text-ink-3 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Fornella Pizza Café. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-1">
            <Link to="/privacy" className="hover:text-ink">Privacy</Link>
            <Link to="/terms" className="hover:text-ink">Terms</Link>
            <Link to="/refund-policy" className="hover:text-ink">Refunds</Link>
            <Link to="/delivery-policy" className="hover:text-ink">Delivery</Link>
            <Link to="/help" className="hover:text-ink">Help</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
