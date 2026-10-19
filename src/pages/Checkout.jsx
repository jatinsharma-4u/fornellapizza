import { AppleLogo, ArrowRight, Bicycle, Check, CreditCard, Lightning, Lock, Money, Storefront } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KitchenScreen } from '../components/layout/KitchenStatus'
import PageHeader from '../components/layout/PageHeader'
import { Summary } from '../components/product/CartLine'
import { EmptyState, Field } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import { locations } from '../data/site'
import { cn, money } from '../lib/format'
import { resolveLine, useStore } from '../store/StoreProvider'

const steps = ['Details', 'Time', 'Payment']

function Segmented({ value, onChange, options, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-1 rounded-2xl bg-cream-2 p-1">
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} onClick={() => onChange(o.id)} className="relative flex h-11 items-center justify-center gap-2 rounded-xl text-[14px] font-semibold">
          {value === o.id && <motion.span layoutId={`seg-${label}`} className="absolute inset-0 rounded-xl bg-white shadow-soft" transition={{ type: 'spring', stiffness: 450, damping: 34 }} />}
          <o.icon size={20} weight={value === o.id ? 'fill' : 'regular'} className="relative" />
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  )
}

function RadioCard({ checked, onClick, icon: Icon, title, body, right }) {
  return (
    <button type="button" role="radio" aria-checked={checked} onClick={onClick} className={cn('flex w-full items-center gap-3.5 rounded-2xl border bg-white p-3.5 text-left transition-colors', checked ? 'border-ink ring-1 ring-ink' : 'border-line hover:border-ink/40')}>
      <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', checked ? 'bg-ink text-cream' : 'bg-cream-2')}>
        <Icon size={19} weight="fill" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-semibold">{title}</span>
        {body && <span className="block text-[13px] text-ink-3">{body}</span>}
      </span>
      {right}
      <span className={cn('grid size-6 shrink-0 place-items-center rounded-full border-2', checked ? 'border-ink bg-ink text-cream' : 'border-line')}>
        {checked && <Check size={12} weight="bold" />}
      </span>
    </button>
  )
}

const days = (() => {
  const out = []
  for (let i = 0; i < 4; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    out.push({ id: i, label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }), date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) })
  }
  return out
})()
const slots = ['12:00', '12:30', '13:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']

export default function Checkout() {
  const { cart, totals, user, placeOrder, kitchen } = useStore()
  const [kitchenAck, setKitchenAck] = useState(false)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState('delivery')
  const [form, setForm] = useState({ name: user?.name ?? '', phone: '', street: '', apt: '', notes: '', store: 'soho' })
  const [errors, setErrors] = useState({})
  const [when, setWhen] = useState('asap')
  const [day, setDay] = useState(0)
  const [slot, setSlot] = useState('19:00')
  const [pay, setPay] = useState('card')
  const [card, setCard] = useState({ number: '', exp: '', cvc: '' })
  const [placing, setPlacing] = useState(false)

  if (cart.length === 0 && !placing)
    return (
      <>
        <PageHeader title="Checkout" crumbs={[{ label: 'Checkout' }]} />
        <EmptyState image="/img/slice-olive.webp" title="Nothing to check out" body="Add a few favourites to your cart first." action={<Button to="/order">Browse the menu</Button>} />
      </>
    )

  // Kitchen overloaded or closed: explain first and offer schedule / pickup instead of failing silently
  if (kitchen !== 'open' && !kitchenAck && !placing)
    return (
      <>
        <PageHeader title="Checkout" crumbs={[{ to: '/cart', label: 'Cart' }, { label: 'Checkout' }]} />
        <div className="container-x">
          <KitchenScreen
            onContinue={(choice) => {
              if (choice === 'schedule') {
                setWhen('later')
                setDay(kitchen === 'closed' ? 1 : 0)
              }
              if (choice === 'pickup') setMode('pickup')
              setKitchenAck(true)
            }}
          />
        </div>
      </>
    )

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (step === 0) {
      if (form.name.trim().length < 2) er.name = 'Please enter your name.'
      if (!/^[\d\s()+-]{7,}$/.test(form.phone)) er.phone = 'Enter a valid phone number so your rider can call.'
      if (mode === 'delivery' && form.street.trim().length < 4) er.street = 'We need a street address to deliver to.'
    }
    if (step === 2 && pay === 'card') {
      if (card.number.replace(/\s/g, '').length < 15) er.number = 'Card number looks too short.'
      if (!/^\d{2}\s?\/\s?\d{2}$/.test(card.exp)) er.exp = 'Use MM / YY.'
      if (!/^\d{3,4}$/.test(card.cvc)) er.cvc = '3 or 4 digits.'
    }
    setErrors(er)
    const first = Object.keys(er)[0]
    if (first) document.getElementById(`co-${first}`)?.focus()
    return !first
  }

  const next = () => {
    if (!validate()) return
    if (step < 2) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setPlacing(true)
    setTimeout(() => {
      const order = placeOrder({
        mode,
        address: mode === 'delivery' ? `${form.street}${form.apt ? `, ${form.apt}` : ''}` : locations.find((l) => l.id === form.store).address,
        when: when === 'asap' ? 'ASAP' : `${days[day].label} ${slot}`,
        payment: pay,
        cardLast4: pay === 'card' ? card.number.replace(/\s/g, '').slice(-4) : null,
        customer: form.name,
        phone: form.phone,
        notes: form.notes,
      })
      navigate(`/confirmation/${order.id}`, { replace: true })
    }, 1400)
  }

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
  const formatExp = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d
  }

  return (
    <>
      <PageHeader title="Checkout" mobileTitle="Checkout" crumbs={[{ to: '/cart', label: 'Cart' }, { label: 'Checkout' }]} />

      <div className="container-x pb-32 md:pb-0">
        {/* Progress */}
        <ol className="mb-5 flex items-center gap-2 pt-2 md:mb-8 md:max-w-xl md:pt-0" aria-label="Checkout progress">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <button type="button" onClick={() => i < step && setStep(i)} disabled={i > step} aria-current={i === step ? 'step' : undefined} className="flex items-center gap-2 disabled:cursor-default">
                <span className={cn('grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-bold transition-colors', i < step ? 'bg-basil text-white' : i === step ? 'bg-ink text-cream' : 'bg-cream-3 text-ink-3')}>
                  {i < step ? <Check weight="bold" /> : i + 1}
                </span>
                <span className={cn('text-[13px] font-semibold', i === step ? 'text-ink' : 'text-ink-3')}>{s}</span>
              </button>
              {i < steps.length - 1 && (
                <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-cream-3">
                  <motion.span className="absolute inset-y-0 left-0 rounded-full bg-basil" animate={{ width: i < step ? '100%' : '0%' }} />
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="grid gap-6 md:grid-cols-[1fr_380px] md:gap-10">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              next()
            }}
            id="checkout-form"
          >
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="space-y-5">
                {step === 0 && (
                  <>
                    <Segmented label="mode" value={mode} onChange={setMode} options={[{ id: 'delivery', label: 'Delivery', icon: Bicycle }, { id: 'pickup', label: 'Pickup', icon: Storefront }]} />
                    <div className="grid gap-4 rounded-[20px] border border-line bg-white p-4 sm:grid-cols-2 md:p-6">
                      <h2 className="text-[18px] sm:col-span-2">Contact</h2>
                      <Field id="co-name" label="Full name" required autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
                      <Field id="co-phone" label="Phone" type="tel" inputMode="tel" required autoComplete="tel" value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="(555) 123-4567" />
                    </div>
                    {mode === 'delivery' ? (
                      <div className="grid gap-4 rounded-[20px] border border-line bg-white p-4 md:p-6">
                        <h2 className="text-[18px]">Delivery address</h2>
                        <Field id="co-street" label="Street address" required autoComplete="street-address" value={form.street} onChange={set('street')} error={errors.street} placeholder="218 Mulberry Street" />
                        <Field id="co-apt" label="Apt, floor, buzzer" autoComplete="address-line2" value={form.apt} onChange={set('apt')} hint="Optional — helps your rider find you fast." />
                        <Field id="co-notes" as="textarea" label="Notes for the kitchen or rider" value={form.notes} onChange={set('notes')} placeholder="E.g. extra napkins, ring twice…" />
                      </div>
                    ) : (
                      <div className="space-y-3" role="radiogroup" aria-label="Pickup location">
                        <h2 className="text-[18px]">Pick up from</h2>
                        {locations.map((l) => (
                          <RadioCard key={l.id} checked={form.store === l.id} onClick={() => setForm((f) => ({ ...f, store: l.id }))} icon={Storefront} title={l.name} body={l.address} right={<span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', l.open ? 'bg-basil-50 text-basil' : 'bg-cream-3 text-ink-3')}>{l.open ? 'Open' : 'Closed'}</span>} />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="space-y-3" role="radiogroup" aria-label="When">
                      <h2 className="text-[18px]">When do you want it?</h2>
                      {kitchen !== 'closed' && (
                        <RadioCard checked={when === 'asap'} onClick={() => setWhen('asap')} icon={Lightning} title="As soon as possible" body={kitchen === 'busy' ? (mode === 'delivery' ? 'Busy right now — about 60–75 min' : 'Busy right now — about 25 min') : mode === 'delivery' ? 'Arrives in about 25–35 min' : 'Ready in about 15 min'} />
                      )}
                      <RadioCard checked={when === 'later'} onClick={() => setWhen('later')} icon={Storefront} title="Schedule for later" body="Pick a day and 30-minute slot" />
                    </div>
                    <AnimatePresence>
                      {when === 'later' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="rounded-[20px] border border-line bg-white p-4 md:p-6">
                            <h3 className="mb-2.5 font-sans text-[14px] font-semibold">Day</h3>
                            <div className="no-scrollbar flex gap-2 overflow-x-auto">
                              {days.map((d) => (
                                <button key={d.id} type="button" onClick={() => setDay(d.id)} aria-pressed={day === d.id} className={cn('flex w-20 shrink-0 flex-col items-center rounded-xl border py-2.5 text-[13px] transition-colors', day === d.id ? 'border-ink bg-ink text-cream' : 'border-line')}>
                                  <span className="font-bold">{d.label}</span>
                                  <span className={cn('text-sm', day === d.id ? 'text-cream/70' : 'text-ink-3')}>{d.date}</span>
                                </button>
                              ))}
                            </div>
                            <h3 className="mt-5 mb-2.5 font-sans text-[14px] font-semibold">Time</h3>
                            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                              {slots.map((s) => (
                                <button key={s} type="button" onClick={() => setSlot(s)} aria-pressed={slot === s} className={cn('h-10 rounded-lg border text-[13px] font-semibold tabular transition-colors', slot === s ? 'border-tomato bg-tomato text-white' : 'border-line hover:border-ink/30')}>
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-3" role="radiogroup" aria-label="Payment method">
                      <h2 className="text-[18px]">Payment</h2>
                      <RadioCard checked={pay === 'card'} onClick={() => setPay('card')} icon={CreditCard} title="Credit or debit card" body="Visa, Mastercard, Amex" />
                      <RadioCard checked={pay === 'apple'} onClick={() => setPay('apple')} icon={AppleLogo} title="Apple Pay / Google Pay" body="Fast, one-tap checkout" />
                      <RadioCard checked={pay === 'cash'} onClick={() => setPay('cash')} icon={Money} title="Cash on delivery" body="Please have exact change if you can" />
                    </div>
                    <AnimatePresence>
                      {pay === 'card' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="grid grid-cols-2 gap-4 rounded-[20px] border border-line bg-white p-4 md:p-6">
                            <Field id="co-number" className="col-span-2" label="Card number" inputMode="numeric" autoComplete="cc-number" value={card.number} onChange={(e) => setCard((c) => ({ ...c, number: formatCard(e.target.value) }))} error={errors.number} placeholder="1234 5678 9012 3456" />
                            <Field id="co-exp" label="Expiry" inputMode="numeric" autoComplete="cc-exp" value={card.exp} onChange={(e) => setCard((c) => ({ ...c, exp: formatExp(e.target.value) }))} error={errors.exp} placeholder="MM / YY" />
                            <Field id="co-cvc" label="CVC" inputMode="numeric" autoComplete="cc-csc" value={card.cvc} onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))} error={errors.cvc} placeholder="123" />
                            <p className="col-span-2 flex items-center gap-2 text-sm text-ink-3"><Lock size={16} weight="fill" /> Demo checkout — no payment is processed.</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 hidden gap-3 md:flex">
              {step > 0 && <Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>Back</Button>}
              <SubmitButton step={step} placing={placing} total={totals.total} />
            </div>
          </form>

          <aside className="md:sticky md:top-28 md:self-start">
            <div className="rounded-[20px] border border-line bg-white p-4 md:p-6">
              <h2 className="mb-4 text-[18px]">Your order</h2>
              <ul className="mb-5 space-y-3">
                {cart.map((l) => {
                  const p = resolveLine(l)
                  return (
                    <li key={l.key} className="flex items-center gap-3">
                      <span className="relative grid size-12 shrink-0 place-items-center rounded-xl bg-cream-2">
                        <img src={p.image} alt="" className="size-10 object-contain" />
                        <span className="absolute -top-1.5 -right-1.5 grid size-6 place-items-center rounded-full bg-ink text-xs font-bold text-cream">{l.qty}</span>
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">{p.name}</span>
                      <span className="font-semibold tabular">{money(l.price * l.qty)}</span>
                    </li>
                  )
                })}
              </ul>
              <Summary totals={totals} className="border-t border-dashed border-line pt-3" />
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur-lg pb-safe md:hidden">
        <SubmitButton step={step} placing={placing} total={totals.total} form="checkout-form" />
      </div>
    </>
  )
}

function SubmitButton({ step, placing, total, form }) {
  return (
    <Button type="submit" form={form} size="lg" full disabled={placing} className="flex-1 justify-between">
      {placing ? (
        <span className="mx-auto flex items-center gap-3">
          <motion.span className="size-5 rounded-full border-[3px] border-white/40 border-t-white" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />
          Placing your order…
        </span>
      ) : (
        <>
          <span>{step < 2 ? 'Continue' : 'Place order'}</span>
          <span className="flex items-center gap-2 tabular">{step === 2 && money(total)} <ArrowRight weight="bold" /></span>
        </>
      )}
    </Button>
  )
}
