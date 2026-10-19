import { CheckCircle } from '@phosphor-icons/react'
import { KitchenScreen } from '../components/layout/KitchenStatus'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import { cn } from '../lib/format'
import { useStore } from '../store/StoreProvider'

const states = [
  { id: 'open', label: 'Open' },
  { id: 'busy', label: 'Busy' },
  { id: 'closed', label: 'Closed' },
]

/** Live kitchen status, plus demo controls to preview the busy / closed experience. */
export default function KitchenStatusPage() {
  const { kitchen, setKitchen } = useStore()
  return (
    <>
      <PageHeader title="Kitchen status" crumbs={[{ to: '/help', label: 'Help' }, { label: 'Kitchen status' }]} />
      <div className="container-x pt-1 md:pt-0">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-2 rounded-2xl border border-dashed border-ink/20 bg-white p-3 text-center">
          <p className="text-[12.5px] text-ink-3">Demo controls — simulate how the site behaves when the kitchen is overloaded or closed.</p>
          <div role="radiogroup" aria-label="Simulated kitchen status" className="inline-flex rounded-full bg-cream-2 p-1">
            {states.map((s) => (
              <button key={s.id} type="button" role="radio" aria-checked={kitchen === s.id} onClick={() => setKitchen(s.id)} className={cn('h-8 rounded-full px-4 text-[13px] font-semibold transition-colors', kitchen === s.id ? 'bg-ink text-cream' : 'text-ink-2 hover:text-ink')}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {kitchen === 'open' ? (
          <div className="mx-auto max-w-lg py-12 text-center">
            <CheckCircle size={64} weight="fill" className="mx-auto text-basil" />
            <h1 className="mt-4 text-h2">We’re open and cooking</h1>
            <p className="mt-2 text-ink-2">Delivery is running normally at around 25–35 minutes. Pickup is ready in about 15.</p>
            <Button to="/order" size="lg" className="mt-6">Start an order</Button>
          </div>
        ) : (
          <KitchenScreen compact />
        )}
      </div>
    </>
  )
}
