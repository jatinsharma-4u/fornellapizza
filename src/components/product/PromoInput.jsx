import { CheckCircle, Ticket, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { useStore } from '../../store/StoreProvider'

export default function PromoInput() {
  const { promo, totals, applyPromo, removePromo } = useStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  if (promo)
    return (
      <div className="flex items-center justify-between rounded-xl border border-basil/30 bg-basil-50 px-4 py-2.5">
        <p className="flex items-center gap-2 text-sm font-semibold text-basil">
          <CheckCircle size={20} weight="fill" />
          <span>
            <span className="tracking-wider uppercase">{promo}</span> · {totals.promo.label}
          </span>
        </p>
        <button type="button" onClick={removePromo} aria-label="Remove promo code" className="grid size-9 place-items-center rounded-full text-basil hover:bg-white">
          <X weight="bold" />
        </button>
      </div>
    )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!code.trim()) return setError('Enter a code first.')
        if (!applyPromo(code)) setError('That code isn’t valid. Try HELLO20 or FORNO10.')
        else setError('')
      }}
    >
      <label htmlFor="promo" className="sr-only">Promo code</label>
      <div className="flex items-center gap-2 rounded-xl border border-line bg-white p-1 pl-3.5 focus-within:border-ink">
        <Ticket size={18} className="shrink-0 text-tomato" aria-hidden />
        <input
          id="promo"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError('')
          }}
          placeholder="Promo code"
          aria-invalid={!!error}
          aria-describedby={error ? 'promo-error' : undefined}
          className="h-9 min-w-0 flex-1 bg-transparent text-[16px] uppercase outline-none placeholder:normal-case"
        />
        <button type="submit" className="h-9 rounded-lg bg-ink px-4 text-[13px] font-semibold text-cream">Apply</button>
      </div>
      {error && <p id="promo-error" role="alert" className="mt-1.5 text-sm font-medium text-tomato-600">{error}</p>}
    </form>
  )
}
