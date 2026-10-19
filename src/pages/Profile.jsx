import {
  Bell,
  CalendarCheck,
  CaretRight,
  Check,
  CreditCard,
  Crown,
  Gear,
  Heart,
  Lifebuoy,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  SignOut,
  Trash,
  UserCircle,
} from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { MobileBar } from '../components/layout/PageHeader'
import { Field } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import { cn, formatDate } from '../lib/format'
import { useStore } from '../store/StoreProvider'

const tabs = [
  { id: 'overview', label: 'Overview', icon: Crown },
  { id: 'details', label: 'Account details', icon: UserCircle },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'payments', label: 'Payment methods', icon: CreditCard },
  { id: 'settings', label: 'Settings & privacy', icon: Gear },
]

const Card = ({ className, children }) => <div className={cn('rounded-[20px] border border-line bg-white', className)}>{children}</div>

function Toggle({ label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center gap-4 py-3.5">
      <div className="flex-1">
        <p className="text-[14.5px] font-semibold">{label}</p>
        <p className="text-[13px] text-ink-3">{desc}</p>
      </div>
      <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => setOn(!on)} className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', on ? 'bg-basil' : 'bg-cream-3')}>
        <motion.span layout transition={{ type: 'spring', stiffness: 600, damping: 34 }} className={cn('absolute top-1 size-5 rounded-full bg-white shadow', on ? 'right-1' : 'left-1')} />
      </button>
    </div>
  )
}

function Overview({ user, orders, favorites }) {
  const points = user.points ?? 0
  const pct = Math.min(100, ((points % 150) / 150) * 100)
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[20px] bg-tomato p-5 text-white md:p-6">
        <span className="absolute top-1/2 right-[-24px] aspect-square w-36 -translate-y-1/2 md:w-44" aria-hidden>
          <img src="/img/slice-pepperoni.webp" alt="" className="size-full rotate-[20deg] object-contain" />
        </span>
        <p className="flex items-center gap-1.5 text-[11.5px] font-bold tracking-[0.14em] uppercase"><Crown weight="fill" className="text-saffron" /> Fornella Club</p>
        <p className="mt-2 font-display text-[34px] leading-none font-semibold tabular">{points}<span className="ml-1 font-sans text-[15px] font-medium text-white/70">/ 150 pts</span></p>
        <p className="mt-1.5 max-w-[60%] text-[13.5px] text-white/85">{150 - (points % 150)} points until your next free Medium pizza</p>
        <div className="mt-4 h-2 max-w-[60%] overflow-hidden rounded-full bg-white/25">
          <motion.div className="h-full rounded-full bg-saffron" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {[
          [orders.length, 'Orders', '/orders'],
          [favorites.length, 'Favourites', '/favorites'],
          [orders.filter((o) => o.status === 'active').length, 'Active', '/orders'],
        ].map(([n, l, to]) => (
          <Link key={l} to={to} className="rounded-2xl border border-line bg-white p-3.5 text-center transition-shadow hover:shadow-soft">
            <p className="font-display text-[24px] font-semibold">{n}</p>
            <p className="text-[12.5px] text-ink-3">{l}</p>
          </Link>
        ))}
      </div>
      <Card className="p-4">
        <p className="text-[14.5px] font-semibold">Member since {formatDate(user.joined ?? new Date().toISOString())}</p>
        <p className="mt-1 text-[13.5px] text-ink-2">Reorder your usual in one tap from your order history.</p>
        <Button to="/orders" size="sm" variant="dark" className="mt-3">View orders</Button>
      </Card>
    </div>
  )
}

function Details({ user, updateProfile }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone ?? '' })
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle')
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
    setState('idle')
  }
  const save = (e) => {
    e.preventDefault()
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Please enter your name.'
    if (!/\S+@\S+\.\S+/.test(form.email)) er.email = 'Enter a valid email address.'
    if (form.phone && !/^[\d\s()+-]{7,}$/.test(form.phone)) er.phone = 'Enter a valid phone number.'
    setErrors(er)
    if (Object.keys(er).length) return
    setState('saving')
    setTimeout(() => {
      updateProfile({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() })
      setState('saved')
    }, 600)
  }
  return (
    <Card className="p-4 md:p-6">
      <form noValidate onSubmit={save} className="grid gap-4 sm:grid-cols-2">
        <Field id="pf-name" label="Full name" required autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
        <Field id="pf-phone" label="Phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} error={errors.phone} hint="Used by riders to reach you." />
        <Field id="pf-email" className="sm:col-span-2" label="Email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <div className="flex items-center gap-3 sm:col-span-2">
          <Button type="submit" disabled={state === 'saving'}>{state === 'saving' ? 'Saving…' : 'Save changes'}</Button>
          <AnimatePresence>
            {state === 'saved' && (
              <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} role="status" className="flex items-center gap-1.5 text-[13.5px] font-semibold text-basil">
                <Check weight="bold" /> Saved
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </form>
    </Card>
  )
}

function Addresses() {
  const [list, setList] = useState([
    { id: 1, label: 'Home', line: '218 Mulberry Street, Apt 4B', city: 'New York, NY 10012', primary: true },
    { id: 2, label: 'Work', line: '55 Water Street, Floor 12', city: 'New York, NY 10041', primary: false },
  ])
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ label: '', line: '', city: '' })
  const [error, setError] = useState('')
  const add = (e) => {
    e.preventDefault()
    if (draft.line.trim().length < 4) return setError('Please enter a street address.')
    setList((l) => [...l, { id: Date.now(), label: draft.label.trim() || 'Other', line: draft.line.trim(), city: draft.city.trim(), primary: false }])
    setDraft({ label: '', line: '', city: '' })
    setAdding(false)
  }
  return (
    <div className="space-y-2.5">
      {list.map((a) => (
        <Card key={a.id} className="flex items-start gap-3.5 p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tomato-50 text-tomato"><MapPin weight="fill" size={19} /></span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-[14.5px] font-semibold">{a.label} {a.primary && <span className="rounded-full bg-basil-50 px-2 py-0.5 text-[11px] text-basil">Default</span>}</p>
            <p className="text-[13.5px] text-ink-2">{a.line}</p>
            {a.city && <p className="text-[13px] text-ink-3">{a.city}</p>}
            {!a.primary && (
              <button type="button" onClick={() => setList((l) => l.map((x) => ({ ...x, primary: x.id === a.id })))} className="mt-1.5 text-[12.5px] font-semibold text-tomato">Set as default</button>
            )}
          </div>
          <button type="button" onClick={() => setList((l) => l.filter((x) => x.id !== a.id))} aria-label={`Remove ${a.label} address`} className="grid size-9 place-items-center rounded-full text-ink-3 hover:bg-tomato-50 hover:text-tomato"><Trash size={17} /></button>
        </Card>
      ))}
      <AnimatePresence initial={false} mode="wait">
        {adding ? (
          <motion.form key="form" noValidate onSubmit={add} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-3 rounded-[20px] border border-line bg-white p-4 sm:grid-cols-2">
            <Field id="ad-label" label="Label" placeholder="Home, Work…" value={draft.label} onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))} />
            <Field id="ad-city" label="City & ZIP" value={draft.city} onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))} />
            <Field id="ad-line" className="sm:col-span-2" label="Street address" required value={draft.line} onChange={(e) => { setDraft((d) => ({ ...d, line: e.target.value })); setError('') }} error={error} />
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" size="sm">Save address</Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </motion.form>
        ) : (
          <motion.button key="btn" type="button" onClick={() => setAdding(true)} className="flex w-full items-center justify-center gap-2 rounded-[20px] border border-dashed border-ink/20 py-4 text-[14px] font-semibold text-ink-2 hover:border-ink/40 hover:text-ink">
            <Plus weight="bold" /> Add address
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function Payments() {
  return (
    <div className="space-y-2.5">
      <div className="relative h-44 overflow-hidden rounded-[20px] bg-gradient-to-br from-ink to-[#4a2a1a] p-5 text-cream md:max-w-sm">
        <div className="absolute -top-10 -right-10 size-36 rounded-full bg-tomato/40 blur-2xl" />
        <p className="relative text-[13px] text-cream/60">Visa · Default</p>
        <p className="relative mt-9 font-display text-xl tracking-[0.2em] tabular">•••• 4242</p>
        <p className="relative mt-2 text-[13px] text-cream/70">Expires 09/28 · demo card</p>
      </div>
      {['Apple Pay / Google Pay', 'Cash on delivery'].map((m) => (
        <Card key={m} className="flex items-center gap-3.5 p-4">
          <span className="grid size-10 place-items-center rounded-xl bg-cream-2"><CreditCard size={19} weight="fill" /></span>
          <span className="flex-1 text-[14.5px] font-semibold">{m}</span>
          <span className="text-[13px] text-basil">Enabled</span>
        </Card>
      ))}
      <p className="flex items-center gap-2 text-[13px] text-ink-3"><ShieldCheck weight="fill" className="text-basil" /> Demo only — no real card details are stored.</p>
    </div>
  )
}

function Settings({ deleteAccount }) {
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '' })
  const [pwState, setPwState] = useState({})
  const changePw = (e) => {
    e.preventDefault()
    if (!pw.current) return setPwState({ error: 'Enter your current password.' })
    if (pw.next.length < 6) return setPwState({ error: 'New password needs at least 6 characters.' })
    setPwState({ ok: true })
    setPw({ current: '', next: '' })
  }
  return (
    <div className="space-y-4">
      <Card className="divide-y divide-line px-4 md:px-5">
        <Toggle label="Order updates" desc="Notifications as your order moves" defaultOn />
        <Toggle label="Deals & new dishes" desc="One email a week, no spam" defaultOn />
        <Toggle label="SMS from rider" desc="Text when your rider is nearby" />
        <Toggle label="Contactless delivery" desc="Leave orders at the door by default" defaultOn />
      </Card>
      <Card className="p-4 md:p-5">
        <h3 className="text-[16px]">Change password</h3>
        <form noValidate onSubmit={changePw} className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field id="pw-current" label="Current password" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => { setPw((p) => ({ ...p, current: e.target.value })); setPwState({}) }} />
          <Field id="pw-next" label="New password" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => { setPw((p) => ({ ...p, next: e.target.value })); setPwState({}) }} error={pwState.error} />
          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" size="sm" variant="dark">Update password</Button>
            {pwState.ok && <span role="status" className="flex items-center gap-1.5 text-[13px] font-semibold text-basil"><Check weight="bold" /> Password updated</span>}
          </div>
        </form>
      </Card>
      <Card className="p-4 md:p-5">
        <h3 className="text-[16px]">Delete account</h3>
        <p className="mt-1 text-[13.5px] text-ink-2">Removes your profile, saved addresses and points from this device. This can’t be undone.</p>
        {confirm ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[13.5px] font-semibold">Are you sure?</span>
            <Button size="sm" className="bg-tomato-600" onClick={() => { deleteAccount(); navigate('/') }}>Yes, delete</Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirm(false)}>Keep my account</Button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirm(true)} className="mt-3 text-[13.5px] font-semibold text-tomato-600 hover:underline">Delete my account</button>
        )}
      </Card>
    </div>
  )
}

const menu = [
  { to: '/orders', icon: Package, label: 'My orders' },
  { to: '/favorites', icon: Heart, label: 'Favourites' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/reservations', icon: CalendarCheck, label: 'Book a table' },
  { to: '/help', icon: Lifebuoy, label: 'Help centre' },
  { to: '/privacy', icon: ShieldCheck, label: 'Privacy & policies' },
]

export default function Profile() {
  const store = useStore()
  const { user, orders, favorites, logout } = store
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const tab = params.get('tab') ?? 'overview'
  const panels = { overview: Overview, details: Details, addresses: Addresses, payments: Payments, settings: Settings }
  const Panel = panels[tab] ?? Overview
  const panelProps = { user, orders, favorites, updateProfile: store.updateProfile, deleteAccount: store.deleteAccount }
  const signOut = () => {
    logout()
    navigate('/')
  }

  if (!user)
    return (
      <>
        <MobileBar title="Account" back={false} />
        <div className="container-x max-w-xl pt-6 md:pt-16">
          <Card className="overflow-hidden">
            <div className="relative h-36 bg-tomato">
              <span className="absolute top-1/2 left-1/2 aspect-square h-[120%] -translate-x-1/2 -translate-y-1/2" aria-hidden>
                <img src="/img/margherita.webp" alt="" className="size-full object-contain" />
              </span>
            </div>
            <div className="p-5 text-center md:p-7">
              <h1 className="text-h2">Your Fornella account</h1>
              <p className="mx-auto mt-2 max-w-sm text-ink-2">Sign in to track orders, save addresses and earn a free pizza every 150 points.</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Button to="/login">Sign in</Button>
                <Button to="/signup" variant="outline">Create account</Button>
              </div>
            </div>
          </Card>
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-white">
            {menu.map((m) => (
              <li key={m.label}>
                <Link to={m.to} className="flex h-13 items-center gap-3.5 px-4 text-[14.5px] font-medium active:bg-cream-2">
                  <m.icon size={20} className="text-ink-3" />
                  <span className="flex-1">{m.label}</span>
                  <CaretRight size={14} weight="bold" className="text-ink-3" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    )

  const Hero = (
    <div className="flex items-center gap-3.5">
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-saffron font-display text-2xl font-semibold md:size-16">{user.name[0]}</span>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[22px] md:text-h1">{user.name}</h1>
        <p className="truncate text-[13.5px] text-ink-3">{user.email}</p>
      </div>
    </div>
  )

  return (
    <>
      <MobileBar title="Account" back={false} action={<Link to="/profile?tab=settings" aria-label="Settings" className="grid size-10 place-items-center rounded-full border border-line bg-white"><Gear size={18} weight="bold" /></Link>} />

      {/* Mobile: app-style account screen */}
      <div className="container-x space-y-4 pt-2 md:hidden">
        {Hero}
        {tab !== 'overview' && (
          <button type="button" onClick={() => setParams({})} className="text-[13px] font-semibold text-tomato">← Back to account</button>
        )}
        {tab !== 'overview' && <h2 className="text-[18px]">{tabs.find((t) => t.id === tab)?.label}</h2>}
        <Panel {...panelProps} />
        {tab === 'overview' && (
          <>
            <ul className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-white">
              {[...tabs.slice(1).map((t) => ({ to: `/profile?tab=${t.id}`, icon: t.icon, label: t.label })), ...menu].map((m) => (
                <li key={m.label}>
                  <Link to={m.to} className="flex h-13 items-center gap-3.5 px-4 text-[14.5px] font-medium active:bg-cream-2">
                    <m.icon size={20} className="text-ink-3" />
                    <span className="flex-1">{m.label}</span>
                    <CaretRight size={14} weight="bold" className="text-ink-3" />
                  </Link>
                </li>
              ))}
            </ul>
            <button type="button" onClick={signOut} className="flex h-12 w-full items-center justify-center gap-2 rounded-[20px] border border-tomato-100 bg-tomato-50 text-[14.5px] font-semibold text-tomato-600">
              <SignOut size={18} weight="bold" /> Log out
            </button>
          </>
        )}
      </div>

      {/* Desktop: sidebar + panel */}
      <div className="container-x hidden pt-10 md:block">
        {Hero}
        <div className="mt-8 grid grid-cols-[240px_1fr] gap-10">
          <nav aria-label="Account" className="space-y-0.5">
            {tabs.map((t) => (
              <button key={t.id} type="button" onClick={() => setParams(t.id === 'overview' ? {} : { tab: t.id })} aria-current={tab === t.id ? 'page' : undefined} className={cn('relative flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-[14.5px] font-medium transition-colors', tab === t.id ? 'text-cream' : 'text-ink-2 hover:bg-white')}>
                {tab === t.id && <motion.span layoutId="acct-tab" className="absolute inset-0 rounded-xl bg-ink" transition={{ type: 'spring', stiffness: 450, damping: 36 }} />}
                <t.icon size={18} weight={tab === t.id ? 'fill' : 'regular'} className="relative" />
                <span className="relative">{t.label}</span>
              </button>
            ))}
            <div className="my-3 border-t border-line" />
            {menu.map((m) => (
              <Link key={m.label} to={m.to} className="flex h-11 items-center gap-3 rounded-xl px-3.5 text-[14.5px] font-medium text-ink-2 hover:bg-white"><m.icon size={18} /> {m.label}</Link>
            ))}
            <button type="button" onClick={signOut} className="mt-3 flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-[14.5px] font-medium text-tomato-600 hover:bg-tomato-50"><SignOut size={18} /> Log out</button>
          </nav>
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-3xl">
            <h2 className="mb-4 text-[22px]">{tabs.find((t) => t.id === tab)?.label}</h2>
            <Panel {...panelProps} />
          </motion.div>
        </div>
      </div>
    </>
  )
}
