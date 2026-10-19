import { ArrowRight, Check, Receipt } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useParams } from 'react-router-dom'
import { MobileBar } from '../components/layout/PageHeader'
import OrderSummary from '../components/product/OrderSummary'
import { EmptyState } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import { formatDate, formatTime } from '../lib/format'
import { useStore } from '../store/StoreProvider'

export default function Confirmation() {
  const { id } = useParams()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === id)

  if (!order)
    return (
      <>
        <MobileBar title="Order" />
        <EmptyState image="/img/slice-olive.webp" title="Order not found" body="Check your order history for the right number." action={<Button to="/orders">My orders</Button>} />
      </>
    )

  const eta = new Date(new Date(order.date).getTime() + (order.mode === 'pickup' ? 15 : 30) * 60000).toISOString()

  return (
    <>
      <MobileBar title="Order confirmed" back={false} />
      <div className="container-x max-w-2xl pt-4 pb-12 md:pt-14">
        <div className="text-center">
          <motion.span
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="mx-auto grid size-16 place-items-center rounded-full bg-basil text-white"
          >
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
              <Check size={30} weight="bold" />
            </motion.span>
          </motion.span>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <p className="eyebrow mt-5">Order {order.id}</p>
            <h1 className="mt-2 text-h1">Thank you, {order.customer?.split(' ')[0] || 'friend'}!</h1>
            <p className="mx-auto mt-2 max-w-md text-ink-2">
              Your order is confirmed and heading to the oven. {order.mode === 'pickup' ? 'Ready for pickup' : 'Estimated arrival'} around <b className="text-ink">{formatTime(eta)}</b>.
            </p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }} className="mt-8 rounded-[20px] border border-line bg-white p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[17px]"><Receipt size={18} weight="bold" /> Receipt</h2>
            <span className="text-[13px] text-ink-3">{formatDate(order.date)} · {formatTime(order.date)}</span>
          </div>
          <OrderSummary order={order} />
        </motion.div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button to={`/track/${order.id}`} size="lg" className="justify-between">
            Track your order <ArrowRight weight="bold" />
          </Button>
          <Button to="/orders" size="lg" variant="outline">View order history</Button>
        </div>
        <p className="mt-5 text-center text-[12.5px] text-ink-3">This is a frontend demo — no real payment was taken and no order was sent to a kitchen.</p>
      </div>
    </>
  )
}
